# dev.to post

**Target:** dev.to (account já existe ou cria 1 min via GitHub)
**Tipo:** Post canônico (não cross-post)
**Tags:** #testing #braziliandevs #javascript #qa
**Link goal:** 1 follow link de dev.to (DA 90+), exposure pra comunidade QA internacional
**Tempo:** ~30 min pra ajustar + publicar

---

## Título

```
Valid Brazilian test data: why generic faker libs fail (and how to fix it)
```

(English. dev.to indexa melhor em inglês e a audiência QA internacional é a target.)

## Tags

```
testing, qa, javascript, braziliandevs
```

(Use max 4. `braziliandevs` é a tag oficial pra conteúdo do Brasil.)

## Cover image

OG da home do FakeForge ou screenshot do gerador rodando. Mantém simples.

## Corpo (markdown)

````markdown
If you've ever worked on a software project targeting Brazil, you've hit this wall: your test data fails real-world validation. CPF "111.111.111-11" gets rejected at checkout. CNPJ "00.000.000/0001-00" trips the integration with the payment gateway. Generic faker libraries don't help because they generate digit strings without honoring the Brazilian-specific checksum rules.

This post explains why, what's different about Brazilian identifiers, and how to fix it in your test pipeline.

## What "valid" means in Brazil

Brazilian identifiers have a checksum digit (or two) computed from the rest of the number using **mod-11** (CPF, CNPJ, CNH, PIS, Título de Eleitor) or **Luhn / mod-10** (credit card, just like everywhere). Generic fakers don't implement mod-11. The result:

```javascript
// faker-js/faker
import { faker } from "@faker-js/faker";

const fakeCpf = faker.number.int({ min: 10000000000, max: 99999999999 });
console.log(fakeCpf); // 84329176504
// Try validating this with any real Brazilian CPF validator: it FAILS.
```

The reason: a real CPF has 9 base digits + 2 verification digits computed as `(sum_with_specific_weights) mod 11`. If you generate the digits randomly, the verification won't match, and any production-grade validator (the kind that protects against typos at signup) rejects it.

## Why this matters in your test suite

Three concrete cases I've debugged:

1. **Onboarding flow** rejects all test users because the CPF validator on the backend is strict (and correctly implemented).
2. **Payment integration** with Stripe Connect, Adyen, or local gateways (Mercado Pago, Cielo, PagSeguro) rejects all test cards because the gateway runs Luhn before forwarding.
3. **CNPJ validation** breaks in July 2026 because Brazil is rolling out **alphanumeric CNPJs** (IN RFB 2.229/2024). The regex `/^\d{14}$/` that protects most validators will start rejecting legitimate inputs. Your test suite has no coverage for this.

## What the fix looks like

You need a generator that implements the actual algorithm. Three options:

**Option 1: Implement it yourself.** ~50 lines per identifier. Maintainable if you only need 1-2. Painful at 5+ (CPF, CNPJ, CNH, PIS, CEP, phone with valid DDD, credit card with brand-specific BIN).

**Option 2: Find a Brazilian-specific lib.** `brazilian-utils` (npm) covers validation but not generation. Some libs cover generation but don't handle CNPJ alphanumeric yet.

**Option 3: Use an API.** Faster to integrate and stays updated when regulations change. I built [FakeForge](https://fakeforge.com.br) for this — free tier is 50 calls/day, no signup, REST.

## API example

```bash
# 100 valid CPFs
curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=100"

# 50 customers (name + CPF + email + phone + address, correlated)
curl -X POST "https://fakeforge.com.br/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"preset":"customer","quantity":50,"format":"sql"}'
```

The `format=sql` returns `CREATE TABLE + INSERT` ready for psql/mysql — useful for seeding staging.

## Integration with pytest

```python
import pytest, requests

@pytest.fixture(scope="session")
def br_customers():
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"preset": "customer", "quantity": 200}
    )
    return res.json()["data"]

def test_brazilian_checkout(br_customers, client):
    customer = br_customers[0]
    response = client.post("/checkout", json={
        "cpf": customer["cpf"],
        "email": customer["email"],
        "phone": customer["phone"],
        "address": customer["address"],
    })
    assert response.status_code == 201
```

## Integration with Jest

```typescript
// jest.global-setup.ts
import { writeFileSync } from "node:fs";

export default async () => {
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=100"
  );
  const { data } = await res.json();
  writeFileSync(".jest-fixtures/customers.json", JSON.stringify(data));
};
```

## The PIX wrinkle

If you build BR fintech, PIX is the payment rail to support (instant, mandatory, used by 90%+ of BR online consumers). PIX keys come in 4 BACEN-defined formats: CPF, email, phone +55, and EVP (UUID v4). Each has its own validation. Generic random data fails. Your sandbox testing breaks. The same generator covers this:

```bash
curl "https://fakeforge.com.br/api/generate?type=pixKey&quantity=20"
# Returns 20 keys mixing the 4 formats
```

## What "alphanumeric CNPJ" means

Brazil's Receita Federal is moving CNPJs to a mixed alphanumeric format starting **July 1, 2026**. The 8 root positions can contain A-Z plus digits 0-9. The 2 check digits remain numeric, but the mod-11 calculation treats letters by their ASCII code minus 48 (so "A" = 65 - 48 = 17).

Existing numeric CNPJs stay valid. But your validator regex `/^\d{14}$/` will start rejecting the new ones. If you have a BR-facing product, you have ~3 months to refactor. [Migration guide here](https://fakeforge.com.br/blog/cnpj-alfanumerico-checklist-migracao-2026).

## TL;DR

- Generic fakers don't generate valid Brazilian identifiers
- This breaks integration tests against real validators (your own or upstream)
- Either implement mod-11/Luhn yourself or use a generator that does
- CNPJ alphanumeric (July 2026) will silently break a lot of test suites if you don't update validators
- FakeForge solves this; other tools may too — point is, don't skip the validation step

What's your current approach? Curious to hear how others handle this in the international QA/test data community.
````

## Notas de execução

1. **Inglês, não português**: dev.to é internacional. A audiência QA gringa que mexe com produtos BR (Stripe Connect, Adyen, Square com Brazil rollout) é o target.
2. **3 tags max relevant**: `testing`, `qa`, `braziliandevs`. Não use `javascript` se não for o foco — vai diluir.
3. **Não auto-promova nos comentários**: responde técnico, sem `clique aqui pra comprar`.
4. **Cross-post no LinkedIn?**: vale, mas com framing diferente. dev.to vai pra dev/QA; LinkedIn pra engenharia executiva.
5. **Imagem de capa**: a OG image que o site já gera funciona. Não precisa criar nova.

## Métricas de sucesso (30 dias)

- ✅ Bom: 100+ reactions, 5+ comments, 200+ views
- 🚀 Ótimo: featured em #braziliandevs tag, picked up por newsletter de QA (Software Testing Weekly, Awesome Testing)
- ❌ Ruim: <20 reactions, sem engajamento — refazer outro tipo de post
