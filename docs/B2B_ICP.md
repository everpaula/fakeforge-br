# FakeForge Enterprise — Ideal Customer Profile (ICP)

**Objetivo:** definir formal quem tem maior probabilidade de virar Enterprise ($500-5k/mês), pra você não perder tempo em outreach errado.

**Date:** 2026-09-24

---

## Perfil ideal em 1 frase

Fintech, marketplace ou banco brasileiro com **10+ devs**, ambiente CI/CD ativo, políticas LGPD implementadas, e **dor real de dados sintéticos** em staging/teste que hoje resolve via gambiarra.

---

## Critérios de qualificação (5)

### 1. Setor (must-have)
- ✅ **Fintech** (payment processor, digital bank, crédito, PIX-first)
- ✅ **Marketplace** (multi-vendor, checkout complex)
- ✅ **Insurtech** (venda de seguros online)
- ✅ **Banco tradicional** (com braço digital/tech)
- ✅ **Sr. dev tools BR** (SaaS que serve devs BR — Truora, Belvo, Pluggy)
- ⚠️ **Agência/consultoria dev** (revende, custo por chamada importa)
- ❌ Retail físico sem tech interno
- ❌ Agroindústria sem TI

### 2. Tamanho do time de engenharia (must-have)
- ✅ 10-50 devs → Starter/Growth (R$500-1.500/mês)
- ✅ 50-200 devs → Growth/Scale (R$1.500-5.000/mês)
- ✅ 200+ devs → Scale + on-premise (R$5.000+/mês)
- ❌ 1-5 devs → foca no plano Dev individual R$29 (não Enterprise)
- ❌ 0 devs internos (só terceirizado)

### 3. Sinais técnicos observáveis
- ✅ CI/CD ativo (GitHub Actions/GitLab CI/Jenkins observável nos repos públicos)
- ✅ Test automatizado documentado (blog posts, artigos)
- ✅ Stack moderna (Node/Python/Go/Rails/Elixir + Docker + K8s)
- ✅ Uso de gerador de dados hoje (github search: "faker", "faker.js" em repos deles)
- ⚠️ Legacy heavy (COBOL, VB.NET) → menos fit
- ❌ Sem repos públicos + sem blog tech

### 4. Sinais de dor LGPD
- ✅ DPO nomeado (obrigatório pra empresa >250 funcionários ou dado sensível)
- ✅ Post no blog sobre "compliance LGPD" ou "privacidade em desenvolvimento"
- ✅ Vaga aberta pra "Security Engineer" ou "Privacy Engineer"
- ✅ Multa ANPD histórica (sim, isso motiva compra)
- ✅ Setor regulado (banco, fintech, saúde, seguros)
- ❌ Sem menção pública de LGPD compliance

### 5. Sinais financeiros
- ✅ Levantou rodada Series A/B recente (dinheiro pra gastar)
- ✅ Cresceu >50% em headcount ano/ano
- ✅ Vagas abertas em backend/infra (>5 vagas)
- ⚠️ Startup pré-seed (dinheiro apertado, foca Dev R$29 e sobe depois)
- ❌ Empresa em layoff massivo

---

## Score de qualificação

Cada target ganha pontos:

| Critério | Pontos |
|---|---|
| Setor exato (fintech/marketplace/banco/insurtech) | 3 |
| Time 10+ devs | 2 |
| CI/CD ativo (repos públicos, GitHub Actions) | 2 |
| Menção pública de "faker" ou geração de dado teste | 2 |
| DPO nomeado ou compliance LGPD documentado | 2 |
| Uso de tecnologia moderna (Node/Python/K8s) | 1 |
| Fundraise recente ou crescimento acelerado | 1 |

- **>= 10 pontos:** Priority 1 — abordar essa semana
- **7-9 pontos:** Priority 2 — abordar mês
- **4-6 pontos:** Priority 3 — nurture LinkedIn, abordar em 60d
- **<4 pontos:** Fora do ICP no momento

---

## Roles alvo por tamanho de time

### Startup 10-30 devs (Starter/Growth)
- **CTO** (decisor final)
- **Head of Engineering** (compra técnica)
- **Founding Engineer** (influencer técnico se decisor)

### Empresa média 30-100 devs (Growth)
- **VP Engineering** (decisor final)
- **Head of Platform** ou **Head of DevEx** (compra técnica)
- **Head of Security** (LGPD gate)
- **Staff Engineer** de plataforma (influencer)

### Empresa grande 100+ devs (Scale)
- **CTO** ou **VP Tech** (decisor final, difícil acesso)
- **Head of DevEx** ou **Platform Engineering Manager** (compra técnica)
- **CISO / Head of Security** (gate LGPD)
- **Principal Engineer** de test/QA (influencer forte)
- **DPO** (gate final compliance)

Ordem de abordagem: **DevEx/Platform** primeiro, depois **Security/DPO**, por último **CTO**.

---

## Sinais de "não perde tempo" (red flags)

- Empresa não responde nenhum LinkedIn message em 30d
- CTO tem <100 conexões (perfil fake ou zero atividade)
- Roda tudo on-prem em COBOL/AS400
- Vertical zero regulado (jogos casuais, mídia)
- Time TI só terceirizado (Wipro, Accenture) — decisão fora da empresa
- Empresa em restructuring / M&A ativo
- Site sem página `/carreiras` (não contrata dev, não usa)
- Não tem repos públicos NEM blog técnico (impossível qualificar tecnicamente)

---

## Próximos passos após qualificação

1. **Priority 1:** LinkedIn connect + cold email personalizado no mesmo dia
2. **Priority 2:** LinkedIn connect essa semana, cold email semana seguinte
3. **Priority 3:** Só LinkedIn connect com hook técnico, sem pitch imediato

Ver `docs/B2B_OUTREACH_TEMPLATES.md` pra os templates.
