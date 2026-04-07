# Roadmap - FakeForge BR

## Visao Geral

Produto: gerador de dados brasileiros ficticios para desenvolvimento e testes.
Modelo: freemium (web gratuito, API paga por volume).
Mercado: desenvolvedores brasileiros, QA, empresas com CI/CD.

---

## Sprint 1 (Semanas 1-2) - CONCLUIDA em 2026-04-07

- [x] 15 geradores brasileiros com validacao
- [x] API REST (GET + POST) com export JSON/CSV/SQL
- [x] Web UI com selecao por categoria e export
- [x] Repositorio privado no GitHub

---

## Sprint 2 (Semanas 3-4) - Landing Page + SEO

Objetivo: trazer trafego organico. "gerador de CPF" tem 100K-500K buscas/mes.

- [ ] Landing page com hero section, proposta de valor, CTA
- [ ] Paginas SEO individuais: /gerador-cpf, /gerador-cnpj, /gerador-cep
- [ ] Meta tags e Open Graph otimizados por pagina
- [ ] Pagina /docs com documentacao da API
- [ ] Validadores de CPF/CNPJ (atrai busca "validar CPF")
- [ ] Analytics (Plausible ou Umami, privacy-first)

---

## Sprint 3 (Semanas 5-6) - API Robusta + Schema Builder

Objetivo: devs integrando no CI/CD.

- [ ] Rate limiting (100 req/dia free, por IP)
- [ ] Sistema de API keys (sem auth completo ainda)
- [ ] Schema builder: template com multiplos campos correlacionados
- [ ] Dados relacionais coerentes (email bate com nome, endereco consistente)
- [ ] Snippets de integracao prontos (Node.js, Python, cURL)
- [ ] Streaming para bulk generation (1K-10K sem timeout)

---

## Sprint 4 (Semanas 7-8) - Monetizacao

Objetivo: primeiro MRR.

- [ ] Auth com Supabase (magic link + GitHub OAuth)
- [ ] Dashboard do usuario (historico, API keys, uso)
- [ ] Stripe: Free (100/dia), Dev R$29/mes (10K/dia), Team R$79/mes (100K/dia)
- [ ] Paywall no rate limit com upgrade page
- [ ] Schemas salvos para usuarios pagos
- [ ] Pix via Stripe Brasil ou Mercado Pago

---

## Sprint 5 (Semanas 9-10) - Crescimento

Objetivo: 500 usuarios organicos.

- [ ] Blog com 5 artigos SEO em PT-BR
- [ ] GitHub repo publico: client library npm @fakeforge/br
- [ ] Product Hunt launch
- [ ] Open Graph / social cards
- [ ] Widget de feedback in-app

---

## Sprint 6 (Semanas 11-12) - Polish + Beta Publico

Objetivo: 15+ testers ativos.

- [ ] Mobile responsive completo
- [ ] Performance: 10K registros em <3s
- [ ] Error handling com mensagens claras
- [ ] Onboarding (tooltip na primeira visita)
- [ ] Botao "Experimentar" com dados pre-preenchidos
- [ ] Monitoring (UptimeRobot free)
- [ ] LGPD notice

---

## Pos-MVP (Meses 4-6)

- [ ] Novos tipos: RG, CNH, titulo eleitor, PIS/PASEP
- [ ] SDK Python e Node.js publicados no PyPI/npm
- [ ] Team workspaces com RBAC
- [ ] Webhooks para integracao com CI/CD
- [ ] Dashboard de analytics de uso
- [ ] Programa de referral

---

## Metricas de Sucesso

| Fase | Metrica | Meta |
|------|---------|------|
| Sprint 2 | Visitantes/mes via SEO | 1.000 |
| Sprint 4 | Primeiro pagante | 1 |
| Sprint 6 | Usuarios pagos | 15 |
| Mes 6 | MRR | R$1.500-3.000 |
| Mes 12 | MRR | R$5.000-10.000 |
