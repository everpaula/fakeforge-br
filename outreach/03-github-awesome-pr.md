# GitHub awesome-list PRs

**Target:** 3 awesome-lists com maintainer ativo e fit pra ferramenta.
**Link goal:** 3 follow links permanentes do github.com (DA 100)
**Tempo:** ~20 min total

---

## PRs propostos (em ordem de probabilidade de aceite)

### 1. awesome-brazil — github.com/yorevs/awesome-brazil
**Status repo:** ativo, maintained, aceita ferramentas
**Categoria sugerida:** `Tools` ou `Open Source`
**Probabilidade de aceite:** alta

**PR title:**
```
Add FakeForge — Brazilian test data generator with valid mod-11/Luhn checksums
```

**PR body:**
```markdown
This PR adds **FakeForge** to the Tools section.

FakeForge is a free generator and REST API for Brazilian test data with real algorithmic validation:

- **CPF/CNPJ** with valid mod-11 check digits (Receita Federal weights)
- **CNPJ alphanumeric 2026** (IN RFB 2.229, effective July 1, 2026)
- **Credit cards** (Visa, Mastercard, Elo, Hipercard, Amex) with Luhn checksum
- **PIX keys** in all 4 BACEN formats
- **CEP by state**, **DDDs by region**, correlated person profiles
- REST API with 50 free calls/day, no signup
- Export as JSON, CSV, or SQL (ready for psql/mysql)

URL: https://fakeforge.com.br
Tutorials and algorithm docs: https://fakeforge.com.br/blog

Use case: seeding staging databases, integration test fixtures, mocking checkout flows without exposing real customer data (LGPD-safe).

Happy to update wording/category to match the list's style — let me know.
```

**Markdown line pra adicionar na seção apropriada:**
```markdown
- [FakeForge](https://fakeforge.com.br) — Brazilian test data generator and REST API. Valid CPF/CNPJ (mod-11), credit cards (Luhn), PIX (BACEN formats), CEP by state. SQL/JSON/CSV export.
```

---

### 2. awesome-testing — github.com/TheJambo/awesome-testing
**Status repo:** ativo, foco em testing
**Categoria sugerida:** `Test Data Generation`
**Probabilidade de aceite:** média-alta (testing-focused, BR é nicho mas fit)

**PR title:**
```
Add FakeForge — Test data generator for Brazilian applications
```

**PR body:**
```markdown
This PR adds **FakeForge** under Test Data Generation.

FakeForge generates valid Brazilian test data for international QA teams building Brazil-facing products. Generic faker libraries don't honor Brazilian-specific checksum rules (mod-11 for CPF/CNPJ, Luhn for cards, BACEN formats for PIX). FakeForge does — generated values pass production-grade validators.

Use cases:
- Test fixtures for fintech integrations (Stripe Connect Brazil, Adyen, Cielo, Mercado Pago)
- Staging database seeds for Brazil e-commerce projects
- Mock data for KYC flows
- Integration tests against payment gateways with Brazilian routing

REST API, free tier, no signup. URL: https://fakeforge.com.br
```

**Markdown line:**
```markdown
- [FakeForge](https://fakeforge.com.br) — Brazilian test data generator. Valid CPF, CNPJ, credit cards, PIX keys. REST API, no signup.
```

---

### 3. awesome-faker-list ou awesome-mock-data (busca atual)
**Status repo:** verificar antes (alguns abandonados)
**Probabilidade:** depende do maintainer

**Comando pra encontrar:**
```bash
# No GitHub search, procura por:
# awesome mock data
# awesome fixtures
# awesome test data
# Filtrar: stars >100, pushed:>2025
```

Se achar maintained, mesmo formato dos 2 acima.

---

## Outras opções (PRs menores, fallback)

Se os 3 acima não derem, vale tentar:
- **awesome-postgres** — adicionar como `seed tool`
- **awesome-typescript** — não fit direto, mas se mencionar API REST + TS examples no blog, vale
- **awesome-pix** — específico de PIX, se existir e tiver tração

---

## Checklist de execução

1. [ ] Fork de `yorevs/awesome-brazil`
2. [ ] Branch `add-fakeforge`
3. [ ] Editar README.md na seção certa (alphabetical order dentro da categoria)
4. [ ] Validar com `awesome-lint` (se o repo usar)
5. [ ] Commit: `Add FakeForge under Tools section`
6. [ ] PR com body acima
7. [ ] Repetir pros outros 2 repos
8. [ ] Acompanhar 5 dias. Se silêncio: comentário curto reativando ("happy to adjust formatting if needed")

## Métricas de sucesso

- ✅ 1 PR merged em 30 dias = win (link DA 100 permanente)
- 🚀 2-3 merged = jackpot pro early-stage backlinks
- ❌ 0 merged em 60 dias = revisar pitch ou tentar outras lists
