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
