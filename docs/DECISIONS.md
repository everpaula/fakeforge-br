# Registro de Decisoes - FakeForge BR

Cada decisao significativa do projeto e registrada aqui com contexto e raciocinio.

---

## DEC-001: Escolher Test Data Generator como primeiro produto

**Data:** 2026-04-07
**Status:** Aprovada

**Contexto:** Full Agency Product Discovery com 8 agentes analisou 5 ideias de micro-SaaS (Test Data Generator, Testimonial Widget, Waitlist+Referral, Changelog Widget, Uptime Monitor).

**Decisao:** Construir o Test Data Generator primeiro como "learning project" que gera receita rapida, seguido pelo Changelog Widget como produto principal.

**Raciocinio:**
- MVP mais rapido: 3-4 semanas vs 4-6 das alternativas
- SEO organico massivo: "gerador de CPF" tem 100K-500K buscas/mes no Google BR
- Complexidade tecnica baixa (2/5): ideal para validar pipeline de build/deploy/monetizacao
- Niche defensible: nenhum concorrente faz dados brasileiros localizados bem

**Alternativa rejeitada:** Changelog Widget ficou em #1 no ranking geral (33 pontos vs 26), mas requer mais tempo de build e educacao do mercado. Sera o segundo produto.

---

## DEC-002: Zero dependencias externas para geracao

**Data:** 2026-04-07
**Status:** Aprovada

**Decisao:** Todos os geradores sao codigo proprio. Sem Faker.js, sem libs externas.

**Raciocinio:**
- Faker.js tem locale pt-BR incompleto (CPF basico, sem CEP coerente, sem PIX)
- Controle total sobre validacao (checksums mod-11, Luhn, DDDs)
- Sem risco de breaking changes em dependencia
- Tamanho do bundle menor
- O proprio codigo e o IP do produto

---

## DEC-003: Web-first, API como upsell

**Data:** 2026-04-07
**Status:** Aprovada

**Decisao:** Interface web gratuita e sem login. API aparece como CTA so depois que o usuario gera dados pela primeira vez.

**Raciocinio:**
- 90% do trafego SEO vem de usuarios casuais ("preciso de um CPF para teste")
- Mostrar curl/JSON na tela principal confunde esse publico
- Funil de conversao: usa gratis → percebe valor → descobre API → integra → bate limit → paga
- Testado: Mockaroo e UptimeRobot usam o mesmo modelo com sucesso

---

## DEC-004: DOCX single-column como formato nao aplicavel

**Data:** 2026-04-07
**Status:** N/A

**Contexto:** A ideia original era um gerador de CVs otimizados para ATS (Gupy). Essa ideia foi descartada apos analise de mercado. O formato DOCX e as regras de ATS nao se aplicam a este produto.

---

## DEC-005: Repositorio privado

**Data:** 2026-04-07
**Status:** Aprovada

**Decisao:** Codigo no GitHub privado (everpaula/fakeforge-br).

**Raciocinio:**
- Produto comercial, codigo e IP
- Client library sera open source depois (Sprint 5), mas o backend e fechado
- Evita que concorrentes copiem a logica de geracao e as regras de validacao

---

## DEC-006: Dark theme como padrao

**Data:** 2026-04-07
**Status:** Aprovada

**Decisao:** UI usa dark theme fixo com palette teal (#14b8a6) + amber (#f59e0b).

**Raciocinio:**
- Publico-alvo sao desenvolvedores, que preferem dark mode
- Teal se diferencia do azul corporativo dos concorrentes
- Amber como accent cria contraste sem ser agressivo
- Definido pelo Brand Guardian na Full Agency Discovery

---

## DEC-007: Modelo de monetizacao freemium com API paga

**Data:** 2026-04-07
**Status:** Planejada (implementacao na Sprint 4)

**Decisao:** Web gratuito sem limites. API: 100 req/dia free, Dev R$29/mes (10K/dia), Team R$79/mes (100K/dia).

**Raciocinio:**
- Web gratuito = maximo trafego SEO + viralidade
- Rate limit na API e o gate natural de conversao
- Devs que integram no CI/CD precisam de volume → pagam
- Precos alinhados com poder de compra brasileiro
- Mockaroo cobra $60/ano (~R$30/mes), nosso Dev plan e competitivo
