// FakeForge Blog Pipeline — MVP local
// Uso: KEYWORD="..." INTENT=tutorial npm run gen:blog
//
// O script:
// 1. Pede outline ao Claude Sonnet
// 2. Pede draft ao Claude Sonnet
// 3. Pede FAQs ao Claude Haiku
// 4. Roda quality gate (banned words, word count, etc)
// 5. Compila TSX e salva em src/app/blog/{slug}/page.tsx
// 6. Cria branch + PR no GitHub via gh CLI

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { outlinePrompt, draftPrompt, faqPrompt, type Intent } from "./prompts.js";
import { runQualityGate } from "./quality.js";
import { generatePageTsx, type PostData } from "./template.js";
import type { Category } from "./config.js";

const KEYWORD = process.env.KEYWORD?.trim();
const INTENT = (process.env.INTENT?.trim() || "tutorial") as Intent;
const SKIP_PR = process.env.SKIP_PR === "true";
const PROJECT_ROOT = process.cwd();

if (!KEYWORD) {
  console.error("KEYWORD env var is required. Ex: KEYWORD=\"gerador placa mercosul\" INTENT=tutorial npm run gen:blog");
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("ANTHROPIC_API_KEY missing. Add it to .env.local");
  process.exit(1);
}

const claude = new Anthropic({ apiKey });

interface ClaudeCall {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

const MODEL_PRICING = {
  "claude-sonnet-4-5": { in: 3 / 1_000_000, out: 15 / 1_000_000 },
  "claude-haiku-4-5": { in: 0.8 / 1_000_000, out: 4 / 1_000_000 },
};

async function callClaude(model: keyof typeof MODEL_PRICING, prompt: string, maxTokens = 4000): Promise<ClaudeCall> {
  const res = await claude.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  const first = res.content[0];
  const text = first.type === "text" ? first.text : "";
  const inputTokens = res.usage.input_tokens;
  const outputTokens = res.usage.output_tokens;
  const pricing = MODEL_PRICING[model];
  const cost = inputTokens * pricing.in + outputTokens * pricing.out;
  return { text, inputTokens, outputTokens, cost };
}

interface OutlineParsed {
  title: string;
  slug: string;
  meta: string;
  category: Category;
  readTime: string;
  outline: string;
}

function parseOutline(text: string): OutlineParsed {
  const titleMatch = text.match(/^#\s*Title:\s*(.+)$/m);
  const slugMatch = text.match(/^#\s*Slug:\s*(.+)$/m);
  const metaMatch = text.match(/^#\s*Meta:\s*(.+)$/m);
  const catMatch = text.match(/^#\s*Category:\s*(.+)$/m);
  const rtMatch = text.match(/^#\s*ReadTime:\s*(.+)$/m);

  if (!titleMatch || !slugMatch || !metaMatch || !catMatch) {
    throw new Error("Outline parse failed. Got:\n" + text.slice(0, 500));
  }

  return {
    title: titleMatch[1].trim(),
    slug: slugMatch[1].trim(),
    meta: metaMatch[1].trim(),
    category: (catMatch[1].trim() as Category) || "Tutoriais",
    readTime: (rtMatch?.[1].trim() || "6 min").replace(/\s*de leitura\s*$/i, ""),
    outline: text,
  };
}

interface FaqResult {
  faqs: { q: string; a: string }[];
}

function parseFaqs(text: string): FaqResult {
  // remove markdown fences se houver
  const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("FAQ parse failed. Got:\n" + cleaned.slice(0, 500));
  }
}

async function main() {
  console.log(`\n🚀 FakeForge Blog Pipeline`);
  console.log(`Keyword: ${KEYWORD}`);
  console.log(`Intent: ${INTENT}\n`);

  let totalCost = 0;
  const startedAt = Date.now();

  // STEP 1: Outline
  console.log("⏳ Step 1/4: outline (Sonnet)...");
  const t1 = Date.now();
  const outlineRes = await callClaude("claude-sonnet-4-5", outlinePrompt(KEYWORD!, INTENT), 2500);
  totalCost += outlineRes.cost;
  console.log(`✓ outline ${((Date.now() - t1) / 1000).toFixed(1)}s | $${outlineRes.cost.toFixed(4)}`);
  const parsed = parseOutline(outlineRes.text);
  console.log(`  → "${parsed.title}" (${parsed.slug})`);

  // Verifica se já existe
  const targetDir = join(PROJECT_ROOT, "src", "app", "blog", parsed.slug);
  if (existsSync(targetDir)) {
    console.error(`✗ Slug "${parsed.slug}" já existe em src/app/blog/. Aborte ou remova primeiro.`);
    process.exit(1);
  }

  // STEP 2: Draft
  console.log("\n⏳ Step 2/4: draft (Sonnet)...");
  const t2 = Date.now();
  const draftRes = await callClaude("claude-sonnet-4-5", draftPrompt(KEYWORD!, INTENT, outlineRes.text), 8000);
  totalCost += draftRes.cost;
  console.log(`✓ draft ${((Date.now() - t2) / 1000).toFixed(1)}s | $${draftRes.cost.toFixed(4)}`);

  // STEP 3: FAQs
  console.log("\n⏳ Step 3/4: FAQs (Haiku)...");
  const t3 = Date.now();
  const faqRes = await callClaude("claude-haiku-4-5", faqPrompt(parsed.title, draftRes.text), 2000);
  totalCost += faqRes.cost;
  console.log(`✓ FAQs ${((Date.now() - t3) / 1000).toFixed(1)}s | $${faqRes.cost.toFixed(4)}`);
  const faqResult = parseFaqs(faqRes.text);

  // STEP 4: Quality Gate
  console.log("\n⏳ Step 4/4: quality gate...");
  const allowFew = INTENT === "comparison" || INTENT === "informational";
  const quality = runQualityGate(draftRes.text, faqResult.faqs.length, { allowFewCodeBlocks: allowFew });
  console.log(`  metrics: ${quality.metrics.wordCount} palavras, ${quality.metrics.h2Count} H2s, ${quality.metrics.codeBlocks} code blocks, ${quality.metrics.faqCount} FAQs`);

  if (quality.warnings.length) console.log(`  ⚠ warnings: ${quality.warnings.join(", ")}`);
  if (!quality.pass) {
    console.error(`\n✗ Quality gate FAILED:`);
    quality.failures.forEach(f => console.error(`  - ${f}`));
    console.error(`\nDraft em: /tmp/blog-draft-${parsed.slug}.md (salvando para review manual)`);
    await writeFile(`/tmp/blog-draft-${parsed.slug}.md`, draftRes.text);
    process.exit(1);
  }
  console.log(`✓ quality OK`);

  // Compile TSX
  const today = new Date().toISOString().slice(0, 10);
  const post: PostData = {
    title: parsed.title,
    slug: parsed.slug,
    metaDescription: parsed.meta,
    category: parsed.category,
    readTime: parsed.readTime,
    date: today,
    body: draftRes.text,
    faqs: faqResult.faqs,
  };
  const tsx = generatePageTsx(post);

  await mkdir(targetDir, { recursive: true });
  const filePath = join(targetDir, "page.tsx");
  await writeFile(filePath, tsx);
  console.log(`\n✓ TSX written: src/app/blog/${parsed.slug}/page.tsx`);

  // Cost summary
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\n💰 Total: $${totalCost.toFixed(4)} USD | ⏱ ${elapsed}s\n`);

  if (SKIP_PR) {
    console.log("→ SKIP_PR=true, finalizando sem PR. Commit manualmente.");
    return;
  }

  // PR
  const branch = `blog/auto-${parsed.slug}`;
  console.log(`📦 Criando branch ${branch}...`);
  try {
    execSync(`git checkout -b ${branch}`, { stdio: "inherit" });
    execSync(`git add ${filePath.replace(/\\/g, "/")}`, { stdio: "inherit" });
    execSync(
      `git commit -m "blog: ${parsed.title.replace(/"/g, '\\"')}\n\nAuto-gerado pelo blog pipeline. Custo: $${totalCost.toFixed(4)}.\nKeyword: ${KEYWORD}\nIntent: ${INTENT}"`,
      { stdio: "inherit" }
    );
    execSync(`git push origin ${branch}`, { stdio: "inherit" });
    const prBody = `Post auto-gerado pelo blog pipeline.\n\n**Custo:** $${totalCost.toFixed(4)}\n**Keyword:** ${KEYWORD}\n**Intent:** ${INTENT}\n**Métricas:** ${quality.metrics.wordCount} palavras, ${quality.metrics.h2Count} H2s, ${quality.metrics.faqCount} FAQs\n\nReview manual antes de merge.`;
    execSync(`gh pr create --title "[BLOG-AUTO] ${parsed.title.replace(/"/g, '\\"')}" --body ${JSON.stringify(prBody)}`, { stdio: "inherit" });
    console.log("\n✅ PR criado. Review e merge no GitHub.");
  } catch (err) {
    console.error("✗ Falha no PR:", err);
    console.log(`Arquivo já está em ${filePath}. Commite manualmente quando quiser.`);
  }
}

main().catch(err => {
  console.error("\n✗ Pipeline error:", err);
  process.exit(1);
});
