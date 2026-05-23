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

Last touched: 2026-05-13. Picking this repo up cold? Read this first.

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

**Hard rules for this codebase**
- Stay under 50 programmatic-SEO pages total. Each new page needs ≥60% unique copy or it does not ship.
- Never use deprecated `HowTo` schema. WebApplication / SoftwareApplication / Article / FAQPage / Breadcrumb only.
- Generated data must keep passing format validation (mod-11, Luhn, valid DDD). Schemas and SEO copy do not change that.

**Likely next moves (in priority order)**
1. Sprint 3: comparison pages for Faker.js, 4Devs, Faker-py (~5-6h). Template lives in `comparacao/fakeforge-vs-mockaroo`.
2. OG images per route (1-2h).
3. Per-route GeneratorSchema on the remaining generators (cnh, cin, rg, pis, titulo-eleitor, placa-mercosul, cartao, empresa, conta-bancaria, endereco, telefone, email).

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
