# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FakeForge BR — a Next.js web app and REST API that generates realistic, valid Brazilian test data (CPF, CNPJ, addresses, names, financial data, etc.). Built for developers who need fake-but-valid Brazilian-format data for testing and development.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (Turbopack)
npm run start    # Serve production build
npm run lint     # ESLint
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4.

**Two entry points serve the same generators:**
- `src/app/page.tsx` — Client-side UI. Category-grouped type selector, quantity controls, results grid with copy-per-item, export buttons. Shows API CTA only after first generation (conversion funnel: casual user → discovers API → integrates → hits rate limit → pays).
- `src/app/api/generate/route.ts` — REST API. GET (query params) and POST (JSON body). Supports `format` param for JSON/CSV/SQL export. Handles object flattening for CSV/SQL output.

**Generator modules** live in `src/lib/generators/`. Each file is self-contained with no external dependencies:
- `index.ts` — Central dispatcher. Exports `generate()` which routes by `DataType` union type, `DATA_TYPES` metadata array (label, description, category), and all individual generators. Max 10,000 items per call.
- `cpf.ts` / `cnpj.ts` — Brazilian document numbers with mod-11 check digit calculation. Both include `validate*()` functions.
- `cep.ts` — Generates coherent addresses where city, state, CEP prefix, and neighborhood all match. Uses hardcoded reference data for 10 states.
- `person.ts` — Gender-aware name generation from curated Brazilian name lists.
- `contact.ts` — Email (BR domains), mobile (9-prefix + valid DDD), landline. Email uses accent-stripped first+last name.
- `financial.ts` — Bank accounts (17 real bank codes including Nubank/Inter/C6), PIX keys (4 types), credit cards (Visa/Mastercard/Elo with Luhn checksum).
- `company.ts` — Composes from other generators (CNPJ + address + contact + procedural company names).

**Key invariant:** All generated data must pass format validation (CPF/CNPJ checksums, Luhn for cards, valid DDD codes, coherent address components). Never generate data that would fail a standard Brazilian format validator.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Project state (active SEO work)

Last touched: 2026-05-26. Picking this repo up cold? Read this first.

**Sprint 1 (commit 2fd38f2) — SEO foundation**
- `src/components/GeneratorSchema.tsx` — reusable WebApplication JSON-LD. Wired into gerador-cpf, gerador-cnpj, gerador-cep, gerador-pix, gerador-pessoa.
- `src/app/comparacao/fakeforge-vs-mockaroo/page.tsx` — long-form comparison page with 24-row table and Article schema.
- `src/app/sitemap.ts` — Mockaroo comparison URL added.
- `docs/SEO_MARKETING_ROADMAP.md` — full strategy doc, read before planning sprint 3+.

**Sprint 2 (commit 7b1bdc5) — programmatic SEO for CEPs**
- `src/lib/cep-cities.ts` — metadata for 10 capitals (slug, name, state, stateCode, cepPrefix, neighborhoods, intro, stateContext, topQueries). Aligned with `STATES_DATA` in `src/lib/generators/cep.ts`.
- `src/app/gerador-cep/[city]/page.tsx` — dynamic route with `generateStaticParams` + `generateMetadata`. Each city renders hero, bairros chips, 4 SEO sections, 5 FAQ items, cross-links, BreadcrumbSchema, GeneratorSchema.
- `src/app/sitemap.ts` — `cityRoutes` map prepends the 10 city URLs.
- `src/app/gerador-cep/page.tsx` — 5-column grid links to all 10 city pages.

**Sprint 3 (commit 6287c35) — 3 dedicated comparison pages**
- `/comparacao/fakeforge-vs-fakerjs`, `/comparacao/fakeforge-vs-4devs`, `/comparacao/fakeforge-vs-fakerpy`. Template replicated from Mockaroo page.

**Sprint 3+ (commits fcbea43 + f8a20f3) — full GeneratorSchema rollout**
- WebApplication schema now on all 18 generators + 5 cartão sub-routes (visa/master/elo/hiper/amex).

**Hard rules for this codebase**
- Stay under 50 programmatic-SEO pages total. Each new page needs ≥60% unique copy or it does not ship.
- Never use deprecated `HowTo` schema. WebApplication / SoftwareApplication / Article / FAQPage / Breadcrumb only.
- Generated data must keep passing format validation (mod-11, Luhn, valid DDD). Schemas and SEO copy do not change that.

**Likely next moves (in priority order)**

1. **Sprint 4 — Viral loop / watermark on exports (~1-2h, highest ROI per hour).** Inspired by Joseph Liu's SuperDemo playbook (Starter Story interview, 2026-05-26): watermarks on shareable output attribute ~30% of his SaaS traffic. Spec below.
2. OG images per route (1-2h, social sharing CTR).
3. Share-preview URLs (`/preview/[slug]`) showing sample output + "generate yours" CTA. ~3-4h. Translates SuperDemo's shareable-output pattern to data export context.
4. Reddit / dev.to BR / GitHub issue engagement: comment with generated fixtures on devs asking for BR test data. Behavioral, no code.
5. More auto-gen blog posts via existing pipeline (FEBRABAN boleto, LGPD pseudonimização, IE-SP, CNH algorithm DENATRAN).

### Sprint 4 spec — Watermark on exports

**Why:** ungated free tools survive in user codebases for months. Watermark in export = downstream developer reads `// Generated by ...` 6 months later, clicks link. Joseph Liu attributes 30% of SuperDemo traffic to this loop. FakeForge currently exports zero attribution.

**Where the code lives:** `src/app/api/generate/route.ts`, functions `toCSV` (line 215) and `toSQL` (line 234). JSON path returns `NextResponse.json({ type, quantity, data })` (lines 174, 195, 212).

**Per-format approach:**

| Format | Approach | Notes |
|---|---|---|
| **SQL** | Prepend block of `--` comment lines before `CREATE TABLE`. | Universally tolerated by SQL clients. Persists in seed scripts and migrations. Highest discoverability. |
| **JSON** | Add `_meta: { source, url, generated_at, license }` field to response wrapper. | Already wrapped in `{ type, quantity, data }`. Add `_meta` alongside. Discoverable when devs inspect the payload. |
| **CSV** | Prepend single `# Generated by FakeForge BR (https://fakeforge.com.br)` line. | Risky: Excel strips, some parsers reject. Make this opt-out via `?watermark=false` query param so power users can disable. Pandas handles `comment='#'`. |

**Suggested watermark text (PT-BR primary, EN secondary):**
```
Generated by FakeForge BR — free Brazilian test data
https://fakeforge.com.br
Generated at: 2026-05-26T14:23:51Z
License: CC0 (public domain test data)
```

**Acceptance criteria:**
- All three formats include a watermark by default.
- CSV watermark can be disabled with `?watermark=false`.
- SQL watermark survives a copy-paste into psql / MySQL Workbench / DBeaver without syntax errors.
- JSON `_meta` is the first key in the response (developers reading the payload see it before scrolling).
- Existing API consumers do not break (no test fails because parser hits an unexpected comment line on CSV — confirm with the rate-limit smoke test).
- No banned words, no em-dashes in watermark text.

**Out of scope for sprint 4:**
- Image watermarks. There are no image exports.
- HTML watermark (no HTML export path).
- Configurable watermark text per user. Static text only.

**Definition of done:**
- Watermark applied in `toCSV`, `toSQL`, and the three `NextResponse.json` returns inside `route.ts`.
- One-line update to the FakeForge API docs (`/docs` route) noting the watermark and the opt-out param.
- Commit message: `feat: viral loop watermark on JSON/CSV/SQL exports`.

## Style rules (apply to every file in this repo)

User-facing copy (PT-BR or EN) must obey:
- Zero em-dashes (—). Use commas, periods, or parentheses.
- No banned words: leverage, optimize, scalable, robust, seamless, holistic, transformative, streamline, empower, data-driven (and PT equivalents like otimizar, escalável, robusto).
- No "LATAM" anchor in any US-facing content. Use "5 countries", "9 markets", or specific country names.
- Portuguese always carries correct accents (São, não, válidos, endereço).
- Never name specific past employers in public artifacts (Shopee, Rappi, inDrive, Embraer, Porto).
- Run text through the humanizer pass if it shows AI tells: "stands as", "serves as", rule-of-three, inline bold headers, present-participle pile-ups.

Code must obey:
- No comments unless the *why* is non-obvious. Identifiers carry the *what*.
- No backward-compat shims for code we just changed.
- UI work goes through the UI Designer + Frontend Developer agents by default, not freehand.

## Bootstrapping a fresh Claude Code session

1. Read this file (auto-loaded).
2. Read `docs/SEO_MARKETING_ROADMAP.md` for sprint context.
3. Check `git log --oneline -10` to confirm the last commits match Sprint 1/2 above.
4. Cross-session memory (style rules, interview prep, other projects) lives in the central agency dir, not here. If something contradicts what is in this file, this file wins for FakeForge work.
