# FakeForge Affiliate Research — 2026-09-28

Two-agent research (affiliate programs deep-dive + BR dev ecosystem reverse-engineering) sintetizado. Payouts USD via Mercury/Plenor LLC, BRL separado.

## Verdict

Affiliate = **lane secundária real, não business model**. Complementa o core FakeForge (Dev plan R$29/mês), não substitui. Estimativa: R$0-150 mês 1, R$400-900 mês 6, R$1.500-3.000 mês 12.

## Tier A — Ship this week (5 programs)

| # | Programa | Comissão | Cookie | Payout | Fit | Signup |
|---|---|---|---|---|---|---|
| 1 | **Mailtrap** | 25% recorrente | 60d | PayPal USD | ⭐ Killer — audience FakeForge testa SMTP | https://mailtrap.io/affiliate-program/ |
| 2 | **Kinsta** | $50-500 flat + 10% recurring vitalício | 60d | PayPal USD | Maior ceiling. Dashboard PT-BR | https://affiliate.kinsta.com/register |
| 3 | **Hostinger** | 40%+ tiered | 30d | PayPal USD (min $100) | Brand recall BR | https://affiliates.hostinger.com |
| 4 | **Cloudways** | $30 + 7% recurring vitalício | 90d | PayPal USD (min $250) | Hybrid compõe | https://www.cloudways.com/en/web-hosting-affiliate-program.php |
| 5 | **MercadoPago Devs** | CPA por integração | — | BRL bank | Zero friction BR checkout | https://www.mercadopago.com.br/partners/developers/pt |

## Tier B — Month 2 (após validar Tier A)

- **Postmark** — 20% recurring 12mo, requer post comparativo "melhor SMTP BR"
- **Vercel** — 20% recurring, 90d cookie
- **Supabase** — 20% recurring (verificar se programa está ativo antes)
- **Webflow** — 50% year-one, 90d cookie, requer tutorial dedicado
- **Framer** — 50% for 12mo mas requer Expert/template aprovado (4-6 semanas ramp)
- **Perplexity** — $10 flat + 10% recurring (via Dub)
- **Alura via Awin** — Awin pega 25% fee mas ainda vale
- **Coursera** — 20-45%, 30d cookie
- **DigitalOcean (Impact)** — $25 CPA ou 10% rev-share 12mo

## Skip permanente

- Udemy (cookie 7d)
- Cursor / Replit / GitHub Copilot (pagam em credits, não cash)
- Notion (programa fechado desde 04/2026 — requeue se reabrir)
- Cloudflare / Fly / Railway / Render / Neon / Sentry / Stripe / Twilio (sem programa público)
- Rocketseat Indica Dev (pontos/prêmios)
- Curso genérico afiliado (Udemy/bootcamp — anti-pattern confirmado)

## Padrão BR dev (competitive scan)

Grandes plataformas BR (Alura/Rocketseat/DIO/DevMedia/Origamid) **não fazem affiliate** — são cursos verticalmente integrados. 4Devs monetiza via ad sales direto. TabNews é anti-comercial por design.

**Único caso vivo**: solo blog **Hora de Codar** (Matheus) — Hostinger + AppMax + posts comparativos SEO ("Hostinger vs DigitalOcean vs Vultr"). Esse é o playbook a copiar.

## White-space (nenhum concorrente BR toca)

Nichos identificados sem cobertura BR + fit natural com FakeForge:
1. Hosting pra test envs (Railway/Render/DO — mas programas fracos em cash)
2. API testing tools (Postman/Mockoon/Insomnia — programas quase inexistentes)
3. LGPD/anonymization SaaS (produtos ainda imaturos)

**Tradução**: white-space existe, mas monetização Tier A vem dos 5 do topo. Não gastar tempo forçando os nichos até programas cash aparecerem.

## Contabilidade / rails

- **USD → Mercury (Plenor LLC)**: Mailtrap, Kinsta, Hostinger, Cloudways, Postmark, Vercel, Webflow, Framer, Perplexity, Coursera, DO, Mailersend
- **BRL → conta PJ BR (a abrir se rodar volume)**: MercadoPago, Alura, Asaas

Manter rails contabilmente separados. Mistura = dor de cabeça no tax return.

## Ação essa semana

1. Sign up nos 5 Tier A (uma tarde)
2. Puxar top 3 artigos SEO do FakeForge via GSC
3. 15 link placements contextuais (5 programs × 3 artigos)
4. Criar página `/stack-recomendada` como hub central (playbook Hora de Codar)

## Anti-pattern (confirmado por ambos agents)

Affiliate de curso genérico (Udemy/bootcamp). Audience dev BR saturada de course upsells, lê como spam instantaneamente. Search para "afiliado + dev BR" surfaces mostly MMN/get-rich-quick — sinal de que a categoria está queimada nesse público.

## Sources principais

Ver task outputs em `.claude/tasks/` (session 10d41e71) — af0fdc9a36eb008a4 (affiliate deep-dive) + a2cc51498a7d1c934 (BR ecosystem scan).
