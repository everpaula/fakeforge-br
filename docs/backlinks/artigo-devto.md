---
title: "Stop Hardcoding Brazilian Test Data: Generate Realistic CPFs, CNPJs, and More with FakeForge BR"
published: true
description: "A zero-dependency API for generating valid Brazilian test data — CPF, CNPJ, CEP, PIX, credit cards, and full personas. Built for developers and QA teams who need realistic BR data without the headaches."
tags: testing, brazil, api, webdev
---

## The Problem Every Developer Working with Brazilian Systems Knows

If you have ever built software for the Brazilian market, you know the pain. You need a valid CPF to test your registration form. You need a CNPJ to test your B2B flow. You need a CEP that actually follows the format rules, a bank account that passes validation, a PIX key that looks real.

So what do most teams do? They hardcode `123.456.789-09` in every test, share a spreadsheet of "known good" fake documents across the team, or worse — use real customer data in staging environments.

None of these approaches scale. Hardcoded values get stale. Shared spreadsheets become a maintenance burden. Real data in non-production environments is a compliance nightmare under LGPD (Brazil's data protection law).

## FakeForge BR: Purpose-Built Brazilian Test Data

[FakeForge BR](https://fakeforge.com.br) is a test data generator built specifically for Brazilian data formats. It generates valid, fictitious data for CPF, CNPJ, CEP, phone numbers, bank accounts, PIX keys, credit cards, full person profiles, and company records.

A few technical decisions worth highlighting:

- **Zero external dependencies** for data generation — no Faker.js under the hood. Every generator implements the actual validation algorithms (CPF check digits, CNPJ verification, Luhn for credit cards) to produce data that passes real-world validators.
- **REST API** with both GET and POST endpoints, plus a free web interface.
- **Export formats**: JSON, CSV, and SQL inserts — ready to pipe into your database seeder or test fixtures.
- **Built with**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4.

## Quick Start: Web Interface

The fastest way to try it is at [fakeforge.com.br](https://fakeforge.com.br). Select a data type, configure options, and generate. No signup required.

But the real power is in the API.

## API Usage

### Generate Valid CPFs

The simplest call — generate CPFs with valid check digits:

**curl:**

```bash
curl -s "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"
```

**Node.js:**

```javascript
const response = await fetch(
  "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"
);
const data = await response.json();
console.log(data); // Array of 10 valid CPFs
```

**Python:**

```python
import requests

response = requests.get(
    "https://fakeforge.com.br/api/generate",
    params={"type": "cpf", "quantity": 10}
)
cpfs = response.json()
print(cpfs)  # List of 10 valid CPFs
```

### Generate Bulk Data with Presets

Instead of assembling individual fields, use presets that map to real business scenarios:

| Preset | What It Generates |
|---|---|
| `customer` | Full person + address + contact info |
| `employee` | Person + bank account + PIX key |
| `company` | CNPJ + razao social + address + contact |
| `ecommerce_order` | Customer + payment + shipping address |
| `contact_list` | Name + email + phone |

```bash
curl -s -X POST "https://fakeforge.com.br/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"preset":"ecommerce_order","quantity":50,"format":"sql"}'
```

Every field is internally consistent — the CEP matches the state, the phone area code matches the region, the email is derived from the person's name, the credit card has the correct cardholder name.

## Integrating with CI/CD

Here is where test data generation really pays off — automated pipelines. Instead of maintaining fixture files that rot over time, generate fresh data on every run.

### GitHub Actions Example

```yaml
name: E2E Tests with Brazilian Test Data

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - name: Seed test database
        run: |
          curl -s -X POST "https://fakeforge.com.br/api/generate" \
            -H "Content-Type: application/json" \
            -d '{"preset":"customer","quantity":100,"format":"sql"}' \
            > seed.sql
          psql $DATABASE_URL < seed.sql

      - name: Run E2E tests
        run: npm run test:e2e
```

### Node.js Test Helper

```typescript
// test/helpers/fake-data.ts
const FAKEFORGE = "https://fakeforge.com.br/api/generate";

export async function generateTestData(type: string, quantity = 1) {
  const response = await fetch(
    `${FAKEFORGE}?type=${type}&quantity=${quantity}`
  );
  return response.json();
}

// Usage in tests:
// const cpfs = await generateTestData("cpf", 5);
// const people = await generateTestData("person", 10);
```

### Python pytest Fixture

```python
# conftest.py
import pytest
import requests

@pytest.fixture
def fake_customers():
    """Generate 10 fake Brazilian customers for testing."""
    response = requests.post(
        "https://fakeforge.com.br/api/generate",
        json={"preset": "customer", "quantity": 10},
    )
    response.raise_for_status()
    return response.json()
```

## Available Data Types

| Type | Description |
|---|---|
| `cpf` | Valid CPF numbers (mod-11 check digits) |
| `cnpj` | Valid CNPJ numbers |
| `cep` / `address` | Brazilian postal codes + full addresses |
| `person` | Complete profiles (name, CPF, contact, address) |
| `email` | Brazilian-style emails (name-based) |
| `phone` / `landline` | Mobile + landline with valid area codes |
| `bankAccount` | Bank, agency, account number |
| `pixKey` | PIX keys (CPF, email, phone, or EVP/UUID) |
| `creditCard` | Visa/Mastercard/Elo (Luhn-valid) with CVV |
| `company` | CNPJ + razao social + address + contact |

Every generated document passes its respective validation algorithm. A CPF from FakeForge BR will pass any CPF validator. A credit card number will pass Luhn checks. But none of these numbers belong to real people or entities.

## Why Not Just Use Faker.js?

Fair question. Faker.js is excellent for generic international test data. But for Brazilian-specific data:

1. **Validation accuracy**: FakeForge implements the actual check-digit algorithms. Every CPF and CNPJ passes real validation, not just format checks.
2. **Regional consistency**: A person from São Paulo gets area code `11`, CEP starting with `01`-`09`, and real neighborhood names.
3. **Brazilian-specific types**: PIX keys, bank accounts matching real Brazilian banks, CNPJ with valid branch numbers.
4. **Zero dependencies**: No Faker.js under the hood. All algorithms implemented from scratch.
5. **Export flexibility**: SQL INSERT statements or CSV output are a query parameter away.

## Pricing

| Tier | Price | Rate Limit |
|---|---|---|
| **Free** | R$0 | 100 calls/day |
| **Dev** | R$29/month | 10,000/day |
| **Team** | R$79/month | 100,000/day |

The web interface is completely free, no signup needed. The free API tier is enough for local development.

## Open for Feedback

FakeForge BR is a solo project, actively developed. If you work with Brazilian data in your testing workflows, I'm genuinely interested in hearing what data types or features would be most useful. RG? CNH? Inscrição Estadual?

Drop a comment here or reach out through [fakeforge.com.br](https://fakeforge.com.br).

**[fakeforge.com.br](https://fakeforge.com.br)**
