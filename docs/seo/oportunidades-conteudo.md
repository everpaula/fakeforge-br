# Oportunidades de Conteúdo SEO — FakeForge BR

Baseado em pesquisa de "People Also Ask", concorrentes e buscas relacionadas (abril 2026).

## Novas Landing Pages (alta prioridade)

### 1. /gerador-pessoa
**Keyword:** "gerador de pessoa fictícia", "gerador de dados pessoais"
**Volume estimado:** alto — QMIX e Box4Dev ranqueiam bem com isso
**O que fazer:** Landing page para `type=person` com pessoa completa (nome, CPF, email, telefone, endereço)
**Diferencial:** Mostrar que os dados são correlacionados (email usa o nome)

### 2. /gerador-empresa
**Keyword:** "gerador de empresa fictícia", "gerador de dados de empresa"
**Volume estimado:** médio — 4devs tem "gerador de empresas" com tráfego
**O que fazer:** Landing page para `type=company` com CNPJ, razão social, fantasia, endereço, telefone

### 3. /gerador-conta-bancaria
**Keyword:** "gerador de conta bancária", "dados bancários teste"
**Volume estimado:** médio
**O que fazer:** Landing page para `type=bankAccount` com banco, agência, conta

### 4. /gerador-endereco
**Keyword:** "gerador de endereço fictício", "gerador de endereço brasileiro"
**Volume estimado:** médio — aparece em buscas de seed de banco
**O que fazer:** Landing page para `type=address` com endereço completo por estado

---

## Novos Blog Posts (alta prioridade)

### 5. "Como popular banco de dados com dados fictícios brasileiros"
**Keyword:** "popular banco dados teste", "seed banco dados brasileiro", "dados fictícios seed"
**Por quê:** Busca com volume significativo, aparece em Laravel/Django/Node contexts
**Conteúdo:** Tutorial com export SQL direto do FakeForge, exemplos Laravel seeder, Prisma seed, Django fixtures

### 6. "FakeForge vs Faker.js vs 4devs: qual usar para dados brasileiros?"
**Keyword:** "faker brasileiro", "alternativa faker.js brasil", "4devs alternativa"
**Por quê:** Muita gente busca "faker brasileiro" e encontra libs desatualizadas (fakerbr, faker-br, leite)
**Conteúdo:** Comparação honesta — quando usar cada um, vantagens/desvantagens

### 7. "Como testar pagamento PIX em ambiente de desenvolvimento"
**Keyword:** "testar pix desenvolvimento", "pix sandbox", "simular pix teste"
**Por quê:** Volume alto, mistura gateway sandbox + dados de teste
**Conteúdo:** Diferença entre dados de teste (FakeForge) e sandbox de gateway (OpenPix, Pagar.me)

### 8. "Gerador de cartão de crédito para testes: como funciona o algoritmo de Luhn"
**Keyword:** "gerador cartão crédito teste", "algoritmo luhn", "cartão válido teste"
**Por quê:** Volume alto, muitas perguntas no "People Also Ask"
**Conteúdo:** Explicar Luhn, mostrar implementação, link para gerador

---

## FAQ Expansions (adicionar às landing pages existentes)

### Perguntas que aparecem no "People Also Ask" e que NÃO temos:

**CPF:**
- "Como saber se um CPF é falso?"
- "Quantos CPFs existem no Brasil?"
- "O que acontece se usar CPF falso?"
- "Como consultar CPF na Receita Federal?"

**CNPJ:**
- "Qual a diferença entre CNPJ matriz e filial?"
- "Como verificar se um CNPJ é ativo?"
- "Posso usar CNPJ gerado para abrir empresa?"

**Cartão:**
- "O cartão gerado funciona para compras?"
- "Como funciona o algoritmo de Luhn?"
- "É crime gerar número de cartão de crédito?"

---

## Concorrentes Identificados

| Concorrente | Pontos fortes | Onde FakeForge é melhor |
|---|---|---|
| **4devs.com.br** | Muitas ferramentas, SEO maduro | API REST, dados correlacionados, export SQL |
| **geradordecpf.org** | SEO forte para "gerador cpf" | Múltiplos tipos, API, presets |
| **geradorde-cpf.com** | Muitas landing pages variantes | API, dados completos, sem ads |
| **freetool.dev** | Interface limpa | API REST, foco brasileiro |
| **box4dev** | Geração em massa | API programática, presets, CI/CD |
| **QMIX Digital** | Gerador de pessoa completa (22 campos) | API, export formatos, correlação |

---

## Prioridade de Implementação

1. **Landing pages** /gerador-pessoa e /gerador-empresa (capturam tráfego direto)
2. **Blog post** "Como popular banco de dados..." (long-tail com intent de solução)
3. **Blog post** "FakeForge vs Faker.js vs 4devs" (captura tráfego de comparação)
4. **FAQ expansions** nas landing pages existentes
5. **Blog post** PIX em dev e Luhn
