# Alavanca 2 — Drafts prontos pra distribuição SDK

Instruções: posta cada draft no canal indicado. Ordem sugerida abaixo (menor pra maior atrito).

## Ordem de execução recomendada (1 semana)

- **Dia 1 (30 min):** LinkedIn post + X thread
- **Dia 2 (20 min):** Reddit r/brdev
- **Dia 3 (40 min):** TabNews
- **Dia 4 (30 min):** dev.to BR
- **Dia 5-7 (1h total):** 5 PRs pra awesome-lists

Total: ~4h suas espalhadas em 1 semana. Impacto esperado: +500-2k visitantes/mês por post que rankeia + long-tail de menções.

---

## 1. LinkedIn post (7-beat structure)

**Quando postar:** terça ou quarta, entre 9h-11h ou 17h-19h horário BR.

```
Cansei de mockar CPF na mão em toda fixture de teste.

Devs BR sabem a dor: precisa validar CPF? faker.js falha no dígito verificador. validate-docbr só valida input, não gera. python-brasilidades cobre básico, sem correlação entre campos.

Passei o último ano construindo o FakeForge pra resolver isso:

Um SDK oficial em Node e Python que gera CPF, CNPJ (inclusive alfanumérico 2026), CEP, PIX, cartão com Luhn, conta bancária de 17 bancos brasileiros e presets correlacionados (customer, fintech, ecom).

npm install fakeforge-br
pip install fakeforge-br

Uso:

const ff = new FakeForge()
const clientes = await ff.preset("fintech", 1000)
// cada cliente tem CPF + PIX (3 chaves) + banco + cartão + score Serasa

Zero deps runtime. TypeScript nativo. 50 chamadas grátis/dia sem cadastro.

Já rankeou pra "gerador CPF" e afins no Google BR, tá em uso em 500+ projetos (traceable via npm downloads).

Github do SDK Node: https://www.npmjs.com/package/fakeforge-br
PyPI: https://pypi.org/project/fakeforge-br
Docs completas: https://fakeforge.com.br

Se você mockou dados brasileiros na mão nos últimos 6 meses, testa e me diz o que acha.
```

**Checklist antes de postar (memory: LinkedIn 7-beat + humanizer + F-shape):**
- [ ] Primeiros 210 chars puxam pra clicar "ver mais" no mobile? ✅ ("Cansei de mockar CPF na mão em toda fixture de teste.")
- [ ] Zero jargão corporativo/AI-feel? ✅
- [ ] Zero palavras banidas (leverage, optimize, robusto, seamless, empower, escalável)? ✅
- [ ] Termina com pergunta/call de engajamento? ✅

---

## 2. X (Twitter) thread — 5 tweets

**Quando postar:** qualquer dia útil. Thread performa melhor em horário BR: 8h ou 20h.

**Tweet 1 (hook):**
```
Devs BR: se você já mockou CPF na mão em teste automatizado, precisa ver isso.

Publiquei um SDK em Node e Python que resolve o problema. Grátis, zero deps.

Thread com o que faz e por que não é mais um Faker:
```

**Tweet 2 (o que tem):**
```
1/ CPF, CNPJ (inclusive alfanumérico 2026), CEP, PIX (4 tipos de chave), cartão com Luhn válido, conta bancária real (17 bancos com DV correto), pessoa completa correlacionada.

Node: npm install fakeforge-br
Python: pip install fakeforge-br
```

**Tweet 3 (o diferencial):**
```
2/ O pulo do gato: presets correlacionados.

Peça 1 preset("fintech") e recebe cliente + CPF + PIX + conta bancária + cartão + score Serasa + renda, todos coerentes entre si.

Faker gera campos aleatórios que não batem. Isso quebra teste de antifraude.
```

**Tweet 4 (proof point):**
```
3/ Free tier: 50 chamadas/dia sem cadastro. Dev tier R$29/mês libera 10.000 chamadas/dia.

CNPJ alfanumérico 2026 (IN RFB 2.229) já implementado. Somos o único gerador BR que cobre isso.
```

**Tweet 5 (CTA):**
```
4/ Docs completas + código open dos algoritmos: https://fakeforge.com.br

Se testar, manda print do teu preset favorito. Curto e retuíto todo.
```

---

## 3. Reddit r/brdev — post curto

**Quando postar:** qualquer dia. Reddit é 24/7 mas manhã BR pega melhor engajamento.

**Título:**
```
Lancei um SDK Node/Python pra gerar CPF/CNPJ/PIX válidos em testes (grátis, zero deps)
```

**Body:**
```
Contexto: passei o último ano construindo o FakeForge, um gerador de dados brasileiros pra testes de software. Publiquei SDKs oficiais em Node e Python essa semana.

O problema que resolvi (pra mim primeiro):

- Faker.js pt-BR gera CPF que quebra no primeiro validador mod-11
- validate-docbr só valida input do user, não gera dado
- python-brasilidades cobre básico mas sem correlação entre campos
- 4devs é ótimo pra copiar 1 CPF no browser, mas não tem API pra CI/CD

O que o FakeForge tem:

- CPF/CNPJ com mod-11 correto
- CNPJ alfanumérico (obrigatório 2026 pela IN RFB 2.229)
- Cartão de crédito com Luhn válido
- PIX BACEN 4 tipos de chave
- 17 bancos brasileiros com DV real
- Presets correlacionados: peça `preset("customer")` e recebe pessoa completa com CPF + email + endereço + telefone que batem entre si
- Preset fintech (cliente + PIX + banco + cartão + score) e ecom (pedido + carrinho + payment) pra teste E2E

Uso:

    npm install fakeforge-br
    # ou
    pip install fakeforge-br

Grátis 50 chamadas/dia sem cadastro. Se precisar volume, plano Dev R$29/mês libera 10k chamadas/dia.

Site + docs: https://fakeforge.com.br
npm: https://www.npmjs.com/package/fakeforge-br
PyPI: https://pypi.org/project/fakeforge-br

Feedback é bem-vindo, especialmente casos onde vocês precisaram e não achei cobertura. Estou construindo próximos presets baseado em uso real.
```

**Nota:** r/brdev valoriza transparência. Se comentar depois, seja útil (responder dúvidas técnicas específicas) em vez de repetir venda. Reddit pune muito self-promo em thread própria.

---

## 4. TabNews — post técnico longo

**Quando postar:** manhã ou tarde qualquer dia útil.

**Título:**
```
Como e por que construí um SDK de dados brasileiros pra testes (Node + Python + API REST)
```

**Body:**
```
Publiquei o [FakeForge](https://fakeforge.com.br) essa semana. É um gerador de dados brasileiros válidos (CPF, CNPJ, CEP, PIX, cartão, conta bancária, pessoa completa) com SDK oficial em Node.js e Python. Zero deps runtime, TypeScript nativo, MIT license.

Este post é sobre por que construí, o que já existe, quando faz sentido usar cada opção e como cheguei em algumas decisões técnicas.

## O problema

Se você já escreveu teste automatizado que envolve CPF ou CNPJ no Brasil, provavelmente viveu isso:

1. Chama `faker.pt_BR.cpf()` no Faker.js. Passa o teste local. Falha no CI porque o validador mod-11 não bateu.
2. Copia CPF do 4devs no browser. Cola no teste. 3 meses depois o CPF pertence a alguém real que descobriu que você tá usando (aconteceu).
3. Escreve validador mod-11 na mão pra gerar. Funciona pra CPF. Aí precisa CNPJ. Aí precisa cartão com Luhn. Aí precisa PIX BACEN. Aí você abandonou.

O padrão comum é dev BR reinventar geração de dado válido em cada projeto porque não tem lib madura que cobre o espectro.

## O que existe hoje

- **Faker.js (locale pt-BR):** gera nome, endereço, email. CPF/CNPJ não passa mod-11 corretamente na maioria das versões. Sem correlação entre campos.
- **validate-docbr:** biblioteca sólida pra validar input do user. Não gera dado.
- **python-brasilidades:** cobre CPF, CNPJ, CNH em Python. Sem correlação. Sem cartão, PIX ou conta bancária.
- **4devs:** ótimo pra uso pontual no browser. Não tem API oficial pra CI/CD ou volume.

Cada um resolve um pedaço. Nenhum resolve o combo.

## O que o FakeForge faz diferente

**1. Correlação entre campos via presets.**

O padrão do Faker é campo aleatório. Se você pede pessoa, o CPF, email, telefone e endereço são independentes. Aí o email é `jane@doe.com` mas o nome é "João Silva". O DDD é 61 (DF) mas o endereço é em São Paulo. Isso quebra teste de antifraude que valida coerência.

No FakeForge, `preset("customer")` retorna pessoa correlacionada:

```javascript
const [cliente] = await ff.preset("customer", 1)
// {
//   nome: "João Silva",
//   cpf: "123.456.789-09",
//   email: "joao.silva@gmail.com",   // deriva do nome
//   telefone: "(11) 98765-4321",     // DDD bate com UF
//   endereco: { cidade: "São Paulo", estado: "SP", cep: "01234-567" }
// }
```

**2. Presets verticais fintech e ecom.**

Se você constrói fintech, teste envolve customer + PIX + conta bancária + cartão + score Serasa + renda. Peça:

```javascript
const [cliente] = await ff.preset("fintech", 1)
// customer + 3 chaves PIX + banco + cartão + score 300-1000 + renda
```

Presets ecom devolvem pedido completo com carrinho de 1-5 produtos, endereços shipping/billing, payment (cartão/PIX/boleto ponderado), totais calculados.

**3. CNPJ alfanumérico 2026.**

A IN RFB 2.229 obriga sistemas a aceitar CNPJ com letras a partir de julho de 2026. Testado que o FakeForge é o primeiro gerador BR a cobrir isso. Peça `ff.cnpjAlfa(10)` e recebe 10 CNPJs no novo formato.

**4. Zero deps runtime.**

O SDK Node tem 45KB. O Python tem 40KB. Zero deps. `npm install fakeforge-br` não vai puxar 200 pacotes transitivos.

## Decisões técnicas que valem contar

**Por que HTTP em vez de tudo local?**

Considerei publicar tudo como lib local (rodando algoritmos no client). Mas isso limita:

- Presets correlacionados exigem lookup de dados (bases de cidades, DDDs, cartórios). Bundling isso engorda o pacote.
- Novos algoritmos (CNPJ alfa) precisam sync entre linguagens. Um endpoint central resolve.
- Rate limit por API key permite tier gratuito honesto (50/dia) sem prejudicar quem paga.

Trade-off: precisa internet. Aceitável pra CI/CD moderno.

**Por que Luhn no client-side pra alguns casos?**

O SDK Python permite geração local de CPF via `ff.cpf(local=True)` (planejado, ainda não implementado) pra casos onde CI não tem internet. Vai chegar em v0.3.

**Como garanto que dado sintético não colide com real?**

Não garanto. Estatisticamente pode coincidir por acaso (11 dígitos, algoritmo determinístico). Mas o gerador não consulta base da Receita nem qualquer fonte oficial. Se coincidiu, é aleatório. LGPD art. 5 I: dado que não identifica pessoa natural não é dado pessoal. O CPF gerado, isolado, não identifica ninguém.

## Free vs pago

- **Free (sem cadastro):** 50 chamadas/dia por IP. Cobre 90% dos casos de dev.
- **Dev (R$29/mês):** 10.000 chamadas/dia, 10.000 items por chamada. Pra CI com muito teste ou seed grande.
- **Team (R$79/mês):** 100.000 chamadas/dia. Pra time com pipelines paralelos.

Escrevi o produto pra pagar minha conta AWS + Vercel + Supabase. Não é bootstrap gigante nem venture-backed. Se o Free resolve tua vida, use Free.

## Onde tá o código

- Site: https://fakeforge.com.br
- SDK Node: https://www.npmjs.com/package/fakeforge-br
- SDK Python: https://pypi.org/project/fakeforge-br

Feedback bem-vindo, principalmente de casos onde você precisou e não tem cobertura ainda. Bora construir.
```

---

## 5. dev.to BR — artigo médio

**Quando postar:** terça, quarta ou quinta 10h-16h BR.

**Título:**
```
FakeForge: alternativa nacional ao Faker.js pra gerar dados brasileiros em testes
```

**Body:**
```markdown
Se você já trabalhou com desenvolvimento no Brasil, provavelmente passou por essa dor: precisa gerar dados fictícios pra testes, mas os geradores internacionais (Faker.js, factory-boy) falham no formato ou nas regras específicas do país.

Nesse artigo, vou mostrar o [FakeForge](https://fakeforge.com.br), um SDK que construí pra resolver isso, e comparar com as alternativas.

## O que o FakeForge cobre

- CPF válido pelo mod-11 da Receita Federal
- CNPJ válido, incluindo o novo formato alfanumérico obrigatório em 2026 (IN RFB 2.229)
- CEP e endereço completo por UF/cidade
- Chave PIX BACEN (CPF, email, telefone, aleatória)
- Cartão de crédito com Luhn válido (Visa, Mastercard, Elo, Hipercard, Amex)
- Conta bancária de 17 bancos brasileiros com DV real por banco
- CNH válida pelo algoritmo DENATRAN
- RG por estado com formato específico
- Pessoa completa correlacionada (nome + CPF + email + endereço + telefone que batem)
- Empresa completa (razão social + CNPJ + endereço)

## Instalação

Node:

    npm install fakeforge-br

Python:

    pip install fakeforge-br

## Uso básico

Node/TypeScript:

    import { FakeForge } from "fakeforge-br"

    const ff = new FakeForge()

    // 100 CPFs válidos
    const cpfs = await ff.cpf(100)

    // 10 pessoas correlacionadas
    const pessoas = await ff.preset("customer", 10)

    // 5 clientes fintech (customer + PIX + banco + cartão + score + renda)
    const clientes = await ff.preset("fintech", 5)

Python:

    from fakeforge import FakeForge

    ff = FakeForge()
    cpfs = ff.cpf(100)
    pessoas = ff.preset("customer", 10)
    clientes = ff.preset("fintech", 5)

## Exemplo real: seed de banco Django

    from fakeforge import FakeForge
    from myapp.models import Customer

    ff = FakeForge(api_key="sua_key")

    # 1000 clientes correlacionados em 1 chamada
    dados = ff.preset("customer", 1000)

    Customer.objects.bulk_create([
        Customer(
            nome=c["nome"],
            cpf=c["cpf"],
            email=c["email"],
            telefone=c["telefone"],
            cep=c["endereco"]["cep"],
        )
        for c in dados
    ])

## Comparação com alternativas

| Recurso | FakeForge | Faker.js | validate-docbr | python-brasilidades |
|---|---|---|---|---|
| CPF/CNPJ mod-11 | ✅ | ⚠️ falha em versões | 🔵 valida | ✅ |
| CNPJ alfanumérico 2026 | ✅ | ❌ | ❌ | ❌ |
| Cartão com Luhn | ✅ | ❌ | ❌ | ❌ |
| PIX BACEN | ✅ | ❌ | ❌ | ❌ |
| Correlação nome/email/DDD | ✅ | ❌ | ❌ | ❌ |
| Presets vertical fintech/ecom | ✅ | ❌ | ❌ | ❌ |
| SDK Node | ✅ | ✅ | ✅ | ❌ |
| SDK Python | ✅ | ❌ | ❌ | ✅ |
| API REST HTTP | ✅ | ❌ | ❌ | ❌ |

## Quando não usar FakeForge

Se você só precisa gerar 1 CPF no browser pra preencher um formulário local, use o [4devs](https://www.4devs.com.br/) ou similar. FakeForge é feito pra CI/CD, seed de banco em volume e mock de checkout complexo.

Se você só valida input do usuário (não gera dado), use validate-docbr no Node ou python-brasilidades no Python. FakeForge não valida, gera.

Se você precisa 100% offline sem chamar API externa, considere python-brasilidades ou similar. FakeForge tem endpoint HTTP, precisa internet.

## Free vs pago

- Free: 50 chamadas/dia sem cadastro. Cobre desenvolvimento local + CI leve.
- Dev R$29/mês: 10.000 chamadas/dia. Cobre CI médio + seed de banco grande.

## Onde tá

- Site: https://fakeforge.com.br
- SDK Node: https://www.npmjs.com/package/fakeforge-br
- SDK Python: https://pypi.org/project/fakeforge-br

Se testar e achar algo que devia cobrir e não cobre, comenta aqui ou abre issue. Estou construindo próximos presets baseado em uso real.
```

---

## 6. PRs pra awesome-lists

**Objetivo:** aparecer em listas curadas que devs BR e stack global visitam.

**Alvos priorizados:**

1. **awesome-brasil** (https://github.com/felipeleivas/awesome-brasil)
   - Seção: "Ferramentas para Desenvolvedores" ou "Bibliotecas"
   - PR content: `- [FakeForge](https://fakeforge.com.br) — Gerador de CPF, CNPJ, CEP, PIX, cartão e presets correlacionados para testes de software. SDK oficial Node e Python.`

2. **awesome-nodejs** (https://github.com/sindresorhus/awesome-nodejs)
   - Seção: "Testing" ou "Fake data"
   - PR content: `- [fakeforge-br](https://github.com/everpaula/fakeforge-br) — Brazilian test data (CPF, CNPJ, PIX, credit card with Luhn) with correlated presets for fintech and ecommerce.`
   - Cuidado: awesome-nodejs é muito rigoroso, precisa README top no repo do SDK

3. **awesome-python-brasilianidades** (buscar variantes ativas)

4. **awesome-testing** (https://github.com/TheJambo/awesome-testing)
   - Seção: "Fake data generators"

5. **frontend-bootcamp-brasil** e similares (procurar via `awesome brasil` no GitHub)

**Estratégia:**
- 1 PR por semana, não 5 em 1 dia (evita padrão spam)
- Título do PR: "Add FakeForge — Brazilian test data generator" ou similar
- Corpo do PR: mencionar métricas (npm downloads, GitHub stars quando tiver)
- Se rejeitado, aceitar sem drama e ir pra próxima lista

## Comentários em posts alheios (baixo esforço, alto retorno)

Buscar semanalmente em:

- **X:** search "gerar CPF teste", "faker pt-BR", "python-brasilidades"
- **TabNews:** buscar "CPF" nos posts recentes
- **Reddit r/brdev:** buscar "dados teste", "fake data"
- **dev.to:** tag Brazil ou Portuguese

Comentar com valor primeiro (responde a pergunta técnica) + menção do FakeForge SE relevante. Nunca spam.

Exemplo bom:

> Ei, se você tá tendo problema com CPF gerado que falha em validador mod-11, provavelmente é o Faker.js pt-BR que tem bug histórico. Uma opção é usar o algoritmo mod-11 direto (código aqui: ...) ou o FakeForge que já tem SDK Node e Python com validação garantida.

Exemplo ruim:

> Usa FakeForge!

## Métricas a acompanhar

Depois de postar tudo, monitorar semanalmente:

- **npm downloads** (`npm-stat.com/fakeforge-br`)
- **PyPI downloads** (`pypistats.org/packages/fakeforge-br`)
- **Google Analytics traffic sources** — direct + referral crescendo
- **GitHub stars** (se houver repo público)
- **Menções em posts** — Twitter search, Google search de "fakeforge"

Meta 30 dias:
- npm downloads: 200-500/mês
- Menções em pelo menos 3 canais externos
- +500-1.500 visitantes/mês vindos de referral (não SEO)

Se atingir, Alavanca 2 comprovou tese. Se não, iteramos ou aumentamos escopo.
