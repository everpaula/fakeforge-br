# TabNews self-post

**Target:** tabnews.com.br
**Account needed:** TabCoins to publish (você ganha 2 por dia + por engajamento; geralmente 5-10 TabCoins liberam o primeiro post). Se zerar, comenta em 3-5 posts úteis primeiro pra ganhar reputação.
**Tipo:** Conteúdo (não Patrocinado).
**Link goal:** 1 follow link permanente do tabnews + tráfego referral pra fakeforge.com.br
**Tempo:** ~30 min pra ajustar + publicar

---

## Título

```
Gerador de dados BR para testes com validação real de CPF/CNPJ/cartão/PIX (mod-11, Luhn, BACEN)
```

## Corpo (markdown)

```markdown
Construí um gerador de dados brasileiros pra testes de software. Diferente dos geradores genéricos (Faker.js, Mockaroo), implementa os algoritmos oficiais BR — os números gerados passam em validador real de mod-11 (CPF/CNPJ), Luhn (cartão), e nos 4 formatos BACEN de PIX.

## O problema que motivou

Toda vez que entro num projeto BR, encontro a mesma cena: fixtures com CPF "111.111.111-11" hardcoded, CNPJ "00.000.000/0001-00", e o teste de integração que valida formato falha. Aí alguém abre o Faker.js, gera 11 dígitos quaisquer, e o problema continua porque não passa no mod-11 da Receita.

Os geradores online (4devs, gerador.de) resolvem caso a caso, mas você precisa abrir o navegador toda vez. Pra CI/CD não serve.

## O que esse faz

- **CPF/CNPJ válidos** (mod-11 da Receita Federal com pesos corretos)
- **CNPJ alfanumérico 2026** (IN RFB 2.229, vigência 01/07/2026, dígito via ASCII-48)
- **Cartão de crédito** com Luhn (Visa, Master, Elo, Hipercard, Amex)
- **PIX** nos 4 formatos BACEN (CPF, email, telefone +55, EVP UUID v4)
- **CEP por estado** (faixa correta — 22000 só RJ, 01000 só SP)
- **Telefone com DDD válido** (67 DDDs ANATEL, sem inventar 38 ou 24)
- **API REST grátis** com 50 chamadas/dia (sem cadastro)
- **Export JSON, CSV, SQL** (o SQL vem com CREATE TABLE + INSERT pronto pra psql/mysql)

## Exemplo: popular staging via curl

```bash
# 100 customers correlacionados (nome + CPF + email coerente + endereço + DDD do estado)
curl -X POST https://fakeforge.com.br/api/generate \
  -H "Content-Type: application/json" \
  -d '{"preset":"customer","quantity":100,"format":"sql"}' \
  | psql $STAGING_DB
```

## Exemplo: fixture pytest

```python
@pytest.fixture(scope="session")
def br_customers():
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"preset": "customer", "quantity": 200}
    )
    return res.json()["data"]

def test_create_order(br_customers, client):
    c = br_customers[0]
    res = client.post("/orders", json={"cpf": c["cpf"], ...})
    assert res.status_code == 201
```

## Stack

Next.js 16 + TypeScript + Supabase + Vercel. Tudo grátis (free tier dos 3). Open question pra quem quiser dar uma olhada: o repo é fechado por enquanto, mas tô documentando os algoritmos no blog (link no rodapé do site) pra quem quiser implementar do zero.

## O que eu queria saber

1. Você usa qual stack pra popular DB de staging? Faker.js? Script próprio? Dump anonimizado de prod?
2. Em produção BR, vocês já passaram CPF pelo mod-11 server-side ou confiaram em validação só do frontend?
3. CNPJ alfanumérico — alguém já refatorou validador pra aceitar? Bug comum é a regex velha `/^\d{14}$/` que vai começar a rejeitar legítimos em julho/26.

Curioso pra trocar ideia se alguém tá no mesmo problema.

[fakeforge.com.br](https://fakeforge.com.br)
```

## Notas de execução

1. **Tom**: técnico, sem self-promotion explícito. TabNews pune autopromoção (downvote agressivo). Foco em explicar o problema e abrir conversa.
2. **Não use UTM**: TabNews bloqueia links com tracking params.
3. **Responda comentários**: TabCoins por engajamento ajudam a manter ranking. Posts caem rápido se você abandona.
4. **Não cross-post igual**: a versão dev.to é mais técnica e em inglês. A do TabNews é conversacional em PT.
5. **Bug do ano**: a observação sobre CNPJ alfanumérico (vigência 01/07/2026 + bug de regex `\d{14}` que vai rejeitar legítimos) é genuína e útil. É o tipo de detalhe técnico que gera comentário.

## Métricas de sucesso (30 dias)

- ✅ Bom: 50+ TabCoins, 5+ comentários técnicos, 20+ cliques pro site
- 🚀 Ótimo: 100+ TabCoins, post fica no top da semana, alguém de outra ferramenta BR (4devs, gerador.de) responde
- ❌ Ruim: <10 TabCoins, downvotado por percepção de autopromoção
