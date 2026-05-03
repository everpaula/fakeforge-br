import { BANNED_WORDS, QUALITY_THRESHOLDS } from "./config.js";

export interface QualityResult {
  pass: boolean;
  failures: string[];
  warnings: string[];
  metrics: {
    wordCount: number;
    h2Count: number;
    codeBlocks: number;
    bannedHits: string[];
    faqCount: number;
  };
}

export function runQualityGate(body: string, faqCount: number, opts?: { allowFewCodeBlocks?: boolean }): QualityResult {
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const h2Count = (body.match(/^## /gm) || []).length;
  const codeBlocks = Math.floor((body.match(/```/g) || []).length / 2);
  const lower = body.toLowerCase();
  const bannedHits = BANNED_WORDS.filter(w => lower.includes(w.toLowerCase()));

  const failures: string[] = [];
  const warnings: string[] = [];

  if (wordCount < QUALITY_THRESHOLDS.minWords) failures.push(`word_count_too_low=${wordCount}`);
  if (wordCount > QUALITY_THRESHOLDS.maxWords) warnings.push(`word_count_too_high=${wordCount}`);
  if (h2Count < QUALITY_THRESHOLDS.minH2Count) failures.push(`h2_too_few=${h2Count}`);
  if (!opts?.allowFewCodeBlocks && codeBlocks < QUALITY_THRESHOLDS.minCodeBlocks) {
    failures.push(`code_blocks_too_few=${codeBlocks}`);
  }
  if (bannedHits.length > 0) failures.push(`banned: ${bannedHits.join(", ")}`);
  if (faqCount < QUALITY_THRESHOLDS.minFaqCount) failures.push(`faq_too_few=${faqCount}`);

  return {
    pass: failures.length === 0,
    failures,
    warnings,
    metrics: { wordCount, h2Count, codeBlocks, bannedHits, faqCount },
  };
}
