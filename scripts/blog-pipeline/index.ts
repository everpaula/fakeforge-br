// FakeForge Blog Pipeline — MVP local usando Claude Code CLI
// Uso: KEYWORD="..." INTENT=tutorial npm run gen:blog
//
// Auth: usa a sessão já logada do Claude Code.
// Não precisa de ANTHROPIC_API_KEY separada — usa sua assinatura
// Pro/Max/Teams via CLI.
//
// Etapas:
// 1. Outline (Sonnet) — title, slug, meta, categoria, estrutura
// 2. Draft (Sonnet) — artigo completo seguindo o outline
// 3. FAQs (Haiku) — 5 perguntas em JSON
// 4. Quality gate — banned words, word count, H2s, code blocks
// 5. Compile TSX e salva em src/app/blog/{slug}/page.tsx
// 6. Cria branch + commit + PR via gh CLI

import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { outlinePrompt, draftPrompt, faqPrompt, type Intent } from "./prompts.js";
import { runQualityGate } from "./quality.js";
import { generatePageTsx, type PostData } from "./template.js";
import type { Category } from "./config.js";

const KEYWORD = process.env.KEYWORD?.trim();
const INTENT = (process.env.INTENT?.trim() || "tutorial") as Intent;
const SKIP_PR = process.env.SKIP_PR === "true";
const RESUME_FROM_DRAFT = process.env.RESUME_FROM_DRAFT?.trim();
const PROJECT_ROOT = process.cwd();

if (!KEYWORD) {
  console.error("KEYWORD env var is required.");
  console.error("Ex: KEYWORD=\"gerador placa mercosul\" INTENT=tutorial npm run gen:blog");
  process.exit(1);
}

interface ClaudeResult {
  text: string;
  costUsd?: number;
  durationMs?: number;
}

const IS_WIN = process.platform === "win32";

/**
 * Chama o Claude CLI via stdin com prompt completo.
 * Retorna o texto (campo `result` do JSON output).
 *
 * No Windows, Node não consegue spawn .cmd files diretamente,
 * então invocamos via cmd.exe /c.
 */
async function callClaude(model: "sonnet" | "haiku", prompt: string): Promise<ClaudeResult> {
  const baseArgs = ["-p", "--model", model, "--output-format", "json"];
  const cmd = IS_WIN ? "cmd" : "claude";
  const args = IS_WIN ? ["/c", "claude", ...baseArgs] : baseArgs;

  const stdout = execFileSync(cmd, args, {
    input: prompt,
    encoding: "utf-8",
    maxBuffer: 20 * 1024 * 1024,
    env: process.env,
    windowsHide: true,
  });

  const parsed = JSON.parse(stdout);
  return {
    text: parsed.result || "",
    costUsd: parsed.total_cost_usd,
    durationMs: parsed.duration_ms,
  };
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
    throw new Error("Outline parse failed. Got first 800 chars:\n" + text.slice(0, 800));
  }

  return {
    title: titleMatch[1].trim(),
    slug: slugMatch[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
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
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  // Pega o JSON principal mesmo com texto antes/depois
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("FAQ parse failed. Got first 800 chars:\n" + cleaned.slice(0, 800));
  }
}

async function readFileText(path: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  return readFile(path, "utf-8");
}

async function main() {
  console.log(`\n🚀 FakeForge Blog Pipeline (Claude Code CLI)`);
  console.log(`Keyword: ${KEYWORD}`);
  console.log(`Intent: ${INTENT}`);
  if (RESUME_FROM_DRAFT) console.log(`Resume from draft: ${RESUME_FROM_DRAFT}`);
  console.log("");

  let totalCost = 0;
  const startedAt = Date.now();
  let parsed: OutlineParsed;
  let draftText: string;
  let faqResult: FaqResult;

  if (RESUME_FROM_DRAFT) {
    // Modo retry: lê draft de arquivo, deriva metadata mínima, ainda chama FAQ se não tiver
    console.log(`⏳ Lendo draft de ${RESUME_FROM_DRAFT}...`);
    draftText = await readFileText(RESUME_FROM_DRAFT);

    // Espera frontmatter manual: title, slug, meta, category, readTime
    const fmTitle = draftText.match(/^Title:\s*(.+)$/m);
    const fmSlug = draftText.match(/^Slug:\s*(.+)$/m);
    const fmMeta = draftText.match(/^Meta:\s*(.+)$/m);
    const fmCat = draftText.match(/^Category:\s*(.+)$/m);
    const fmRT = draftText.match(/^ReadTime:\s*(.+)$/m);
    if (!fmTitle || !fmSlug || !fmMeta || !fmCat) {
      console.error("✗ Draft precisa começar com frontmatter:");
      console.error("Title: ...");
      console.error("Slug: ...");
      console.error("Meta: ...");
      console.error("Category: Tutoriais|LGPD|Conceitos|Comparativos|News");
      console.error("ReadTime: 7 min");
      console.error("");
      console.error("Em seguida o corpo do artigo (sem H1).");
      process.exit(1);
    }
    parsed = {
      title: fmTitle[1].trim(),
      slug: fmSlug[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      meta: fmMeta[1].trim(),
      category: (fmCat[1].trim() as Category) || "Tutoriais",
      readTime: (fmRT?.[1].trim() || "6 min").replace(/\s*de leitura\s*$/i, ""),
      outline: "",
    };
    // Remove o frontmatter do corpo
    draftText = draftText.replace(/^(Title|Slug|Meta|Category|ReadTime):.+$/gm, "").trim();

    console.log(`  → "${parsed.title}"`);
    console.log(`  → /blog/${parsed.slug}`);

    const targetDir = join(PROJECT_ROOT, "src", "app", "blog", parsed.slug);
    if (existsSync(targetDir)) {
      console.error(`\n✗ Slug "${parsed.slug}" já existe. Remova primeiro.`);
      process.exit(1);
    }

    console.log("\n⏳ Gerando FAQs (Haiku)...");
    const t = Date.now();
    const faqRes = await callClaude("haiku", faqPrompt(parsed.title, draftText));
    totalCost += faqRes.costUsd || 0;
    console.log(`✓ FAQs ${((Date.now() - t) / 1000).toFixed(1)}s`);
    faqResult = parseFaqs(faqRes.text);
  } else {
    // STEP 1: Outline
    console.log("⏳ Step 1/4: outline (Sonnet)...");
    const t1 = Date.now();
    const outlineRes = await callClaude("sonnet", outlinePrompt(KEYWORD!, INTENT));
    totalCost += outlineRes.costUsd || 0;
    console.log(`✓ outline ${((Date.now() - t1) / 1000).toFixed(1)}s`);
    parsed = parseOutline(outlineRes.text);
    console.log(`  → "${parsed.title}"`);
    console.log(`  → /blog/${parsed.slug}`);

    // Verifica duplicação
    const targetDir = join(PROJECT_ROOT, "src", "app", "blog", parsed.slug);
    if (existsSync(targetDir)) {
      console.error(`\n✗ Slug "${parsed.slug}" já existe em src/app/blog/. Aborte ou remova primeiro.`);
      process.exit(1);
    }

    // STEP 2: Draft
    console.log("\n⏳ Step 2/4: draft (Sonnet)...");
    const t2 = Date.now();
    const draftRes = await callClaude("sonnet", draftPrompt(KEYWORD!, INTENT, outlineRes.text));
    totalCost += draftRes.costUsd || 0;
    console.log(`✓ draft ${((Date.now() - t2) / 1000).toFixed(1)}s`);
    draftText = draftRes.text;

    // STEP 3: FAQs
    console.log("\n⏳ Step 3/4: FAQs (Haiku)...");
    const t3 = Date.now();
    const faqRes = await callClaude("haiku", faqPrompt(parsed.title, draftText));
    totalCost += faqRes.costUsd || 0;
    console.log(`✓ FAQs ${((Date.now() - t3) / 1000).toFixed(1)}s`);
    faqResult = parseFaqs(faqRes.text);
  }

  // STEP 4: Quality Gate
  console.log("\n⏳ Step 4/4: quality gate...");
  const allowFew = INTENT === "comparison" || INTENT === "informational";
  const quality = runQualityGate(draftText, faqResult.faqs.length, { allowFewCodeBlocks: allowFew });
  console.log(`  metrics: ${quality.metrics.wordCount} palavras, ${quality.metrics.h2Count} H2s, ${quality.metrics.codeBlocks} code blocks, ${quality.metrics.faqCount} FAQs`);

  if (quality.warnings.length) console.log(`  ⚠ warnings: ${quality.warnings.join(", ")}`);
  if (!quality.pass) {
    const draftPath = join(tmpdir(), `ff-draft-${parsed.slug}.md`);
    // Inclui frontmatter pra resume funcionar
    const withFrontmatter = `Title: ${parsed.title}\nSlug: ${parsed.slug}\nMeta: ${parsed.meta}\nCategory: ${parsed.category}\nReadTime: ${parsed.readTime}\n\n${draftText}`;
    await writeFile(draftPath, withFrontmatter);
    console.error(`\n✗ Quality gate FAILED:`);
    quality.failures.forEach(f => console.error(`  - ${f}`));
    console.error(`\nDraft salvo em: ${draftPath}`);
    console.error(`\nPra retomar (após editar o draft):`);
    console.error(`  RESUME_FROM_DRAFT="${draftPath}" KEYWORD="${KEYWORD}" npm run gen:blog`);
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
    body: draftText,
    faqs: faqResult.faqs,
  };
  const tsx = generatePageTsx(post);

  const targetDir = join(PROJECT_ROOT, "src", "app", "blog", parsed.slug);
  await mkdir(targetDir, { recursive: true });
  const filePath = join(targetDir, "page.tsx");
  await writeFile(filePath, tsx);
  console.log(`\n✓ TSX written: src/app/blog/${parsed.slug}/page.tsx`);

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  if (totalCost > 0) {
    console.log(`\n💰 Custo: $${totalCost.toFixed(4)} USD | ⏱ ${elapsed}s\n`);
  } else {
    console.log(`\n⏱ Tempo total: ${elapsed}s (custo coberto pela assinatura Claude Code)\n`);
  }

  if (SKIP_PR) {
    console.log("→ SKIP_PR=true, finalizando sem PR. Commit manualmente quando quiser.");
    return;
  }

  // PR via gh CLI
  const branch = `blog/auto-${parsed.slug}`;
  console.log(`📦 Criando branch ${branch}...`);
  try {
    execFileSync("git", ["checkout", "-b", branch], { stdio: "inherit" });
    execFileSync("git", ["add", filePath.replace(/\\/g, "/")], { stdio: "inherit" });
    const commitMsg = `blog: ${parsed.title}\n\nAuto-gerado pelo blog pipeline.\nKeyword: ${KEYWORD}\nIntent: ${INTENT}\nMetrics: ${quality.metrics.wordCount} palavras, ${quality.metrics.h2Count} H2s, ${quality.metrics.faqCount} FAQs`;
    execFileSync("git", ["commit", "-m", commitMsg], { stdio: "inherit" });
    execFileSync("git", ["push", "origin", branch], { stdio: "inherit", env: { ...process.env, SKIP_BUILD_HOOK: "1" } });

    const prBody = `Post auto-gerado pelo blog pipeline.\n\n**Keyword:** ${KEYWORD}\n**Intent:** ${INTENT}\n**Métricas:** ${quality.metrics.wordCount} palavras, ${quality.metrics.h2Count} H2s, ${quality.metrics.faqCount} FAQs\n\nReview manual antes de merge.`;
    const ghBin = process.platform === "win32" ? "gh.exe" : "gh";
    execFileSync(ghBin, ["pr", "create", "--title", `[BLOG-AUTO] ${parsed.title}`, "--body", prBody], { stdio: "inherit" });

    console.log("\n✅ PR criado. Review e merge no GitHub.");
  } catch (err) {
    console.error("\n✗ Falha no PR:", err instanceof Error ? err.message : err);
    console.log(`Arquivo já está em ${filePath}. Commite manualmente quando quiser.`);
  }
}

main().catch(err => {
  console.error("\n✗ Pipeline error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
