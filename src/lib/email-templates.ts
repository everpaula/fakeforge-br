// Templates de email inline. HTML puro pra manter deliverability
// alta em clientes de email brasileiros (gmail, outlook, apple mail).
// Sem CSS externo, sem tags exotic, sem scripts.
//
// Convenções:
// - Fonte -apple-system stack (renderiza bem em todos)
// - Max-width 560px (mobile-friendly, cabe em Gmail mobile)
// - Cor primária #1e40af (mesma do site)
// - Cor accent #f97316 (laranja pra CTAs)
// - Alt-text em tudo que for imagem

interface ActivationEmailProps {
  firstName: string;
  apiKey: string;
}

export function subjectActivationT10(): string {
  return "Sua primeira chamada em 30 segundos";
}

export function textActivationT10({ firstName, apiKey }: ActivationEmailProps): string {
  return `Oi ${firstName},

Sua API key do FakeForge tá pronta. Cola isso no terminal e volta com 10 CPFs válidos:

curl -H "X-API-Key: ${apiKey}" \\
  "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"

Se rodar, responde essa mensagem contando o que você tá testando. Fico ligado — sou o único no suporte, não tem terceiro.

Se travou em algo (CORS, auth, endpoint diferente do que esperava), me manda o stack trace. Escrevi o código, entendo o bug.

Alguns pontos rápidos:

  - Free tier: 50 requests/dia. Sobe pra 10.000/dia no plano Dev (R$29/mês) quando fizer sentido.
  - Docs completos: https://fakeforge.com.br/docs
  - Dashboard: https://fakeforge.com.br/dashboard

Everton
FakeForge
`;
}

export function htmlActivationT10({ firstName, apiKey }: ActivationEmailProps): string {
  const safeName = escapeHtml(firstName);
  const safeKey = escapeHtml(apiKey);
  const curlBlock = `curl -H "X-API-Key: ${safeKey}" \\
  "https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=10"`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sua primeira chamada em 30 segundos</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; max-width:560px; width:100%;">
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size:14px; line-height:1.5; margin:0 0 16px 0; color:#374151;">Oi ${safeName},</p>

              <p style="font-size:15px; line-height:1.55; margin:0 0 20px 0; color:#111827;">
                Sua API key do FakeForge tá pronta. Cola isso no terminal e volta com <strong>10 CPFs válidos</strong>:
              </p>

              <pre style="background:#0f172a; color:#e2e8f0; padding:16px; border-radius:8px; font-size:13px; line-height:1.5; overflow-x:auto; margin:0 0 20px 0; font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;"><code>${curlBlock}</code></pre>

              <p style="font-size:14px; line-height:1.55; margin:0 0 16px 0; color:#374151;">
                Se rodar, <strong>responde essa mensagem</strong> contando o que você tá testando. Fico ligado — sou o único no suporte, não tem terceiro.
              </p>

              <p style="font-size:14px; line-height:1.55; margin:0 0 24px 0; color:#374151;">
                Se travou em algo (CORS, auth, endpoint diferente do que esperava), me manda o stack trace. Escrevi o código, entendo o bug.
              </p>

              <hr style="border:none; border-top:1px solid #e5e7eb; margin: 24px 0;">

              <p style="font-size:13px; line-height:1.6; margin:0 0 12px 0; color:#6b7280;">Alguns pontos rápidos:</p>
              <ul style="font-size:13px; line-height:1.7; margin:0 0 20px 0; padding-left:20px; color:#6b7280;">
                <li>Free tier: <strong style="color:#111827;">50 requests/dia</strong>. Sobe pra 10.000/dia no plano Dev (R$29/mês) quando fizer sentido.</li>
                <li>Docs completos: <a href="https://fakeforge.com.br/docs" style="color:#1e40af; text-decoration:underline;">fakeforge.com.br/docs</a></li>
                <li>Dashboard: <a href="https://fakeforge.com.br/dashboard" style="color:#1e40af; text-decoration:underline;">fakeforge.com.br/dashboard</a></li>
              </ul>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px 0;">
                <tr>
                  <td style="background:#f97316; border-radius:8px;">
                    <a href="https://fakeforge.com.br/dashboard" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">Abrir dashboard →</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; line-height:1.5; margin:24px 0 0 0; color:#374151;">
                Everton<br>
                <span style="color:#9ca3af; font-size:12px;">FakeForge</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:16px 32px; border-top:1px solid #e5e7eb;">
              <p style="font-size:11px; line-height:1.5; margin:0; color:#9ca3af;">
                Recebeu esse email porque criou uma conta no FakeForge. Se não foi você, ignora — a conta expira sem confirmação.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// T+24h Reactivation: user criou conta, tem API key, mas nao rodou nenhuma
// chamada. Mostra 3 casos de uso reais + curl pronto pra copiar.
// ============================================================================

export function subjectReactivationT24h(): string {
  return "Ei — vi que sua API key ainda tá zerada";
}

export function textReactivationT24h({ firstName, apiKey }: ActivationEmailProps): string {
  return `Oi ${firstName},

Vi que você criou conta ontem no FakeForge, gerou a API key e ainda não rodou nenhuma chamada. Sem cobrança, só vim mostrar 3 fluxos que devs reais tão rodando essa semana:

1. Seed de banco staging em 1 chamada
   100 clientes brasileiros correlacionados (nome + CPF + email + endereço + telefone) prontos pra INSERT:

   curl -H "X-API-Key: ${apiKey}" \\
     "https://fakeforge.com.br/api/generate?preset=customer&quantity=100"

2. Fixtures pra pytest / jest
   Cada objeto passa validação mod-11 (CPF), Luhn (cartão) e formato BACEN (PIX). Sem mocks quebrando em CI.

3. Mock de checkout PIX + cartão
   Um customer com CPF + cartão válido + chave PIX no mesmo objeto pra E2E:

   curl -H "X-API-Key: ${apiKey}" \\
     "https://fakeforge.com.br/api/generate?preset=customer&include=creditcard,pix&quantity=1"

Se travar em qualquer coisa — responde aqui direto. Sou eu quem lê. Se tiver ideia de preset novo, também manda.

Everton
FakeForge
`;
}

export function htmlReactivationT24h({ firstName, apiKey }: ActivationEmailProps): string {
  const safeName = escapeHtml(firstName);
  const safeKey = escapeHtml(apiKey);
  const seedCurl = `curl -H "X-API-Key: ${safeKey}" \\
  "https://fakeforge.com.br/api/generate?preset=customer&amp;quantity=100"`;
  const checkoutCurl = `curl -H "X-API-Key: ${safeKey}" \\
  "https://fakeforge.com.br/api/generate?preset=customer&amp;include=creditcard,pix&amp;quantity=1"`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sua API key ainda tá zerada</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; max-width:560px; width:100%;">
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size:14px; line-height:1.5; margin:0 0 16px 0; color:#374151;">Oi ${safeName},</p>

              <p style="font-size:15px; line-height:1.55; margin:0 0 20px 0; color:#111827;">
                Vi que você criou conta ontem no FakeForge, gerou a API key e ainda não rodou nenhuma chamada.
                Sem cobrança — vim só mostrar 3 fluxos que devs reais tão rodando essa semana:
              </p>

              <div style="margin: 24px 0;">
                <p style="font-size:14px; font-weight:600; margin:0 0 8px 0; color:#111827;">1. Seed de banco staging em 1 chamada</p>
                <p style="font-size:13px; line-height:1.55; margin:0 0 12px 0; color:#6b7280;">
                  100 clientes brasileiros correlacionados (nome + CPF + email + endereço + telefone) prontos pra <code style="background:#f1f5f9; padding:1px 5px; border-radius:3px; font-family:'SF Mono', Monaco, monospace; font-size:12px;">INSERT INTO customers</code>.
                </p>
                <pre style="background:#0f172a; color:#e2e8f0; padding:14px; border-radius:8px; font-size:12px; line-height:1.5; overflow-x:auto; margin:0; font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;"><code>${seedCurl}</code></pre>
              </div>

              <div style="margin: 24px 0;">
                <p style="font-size:14px; font-weight:600; margin:0 0 8px 0; color:#111827;">2. Fixtures pra pytest / jest</p>
                <p style="font-size:13px; line-height:1.55; margin:0; color:#6b7280;">
                  Cada objeto passa validação mod-11 (CPF), Luhn (cartão) e formato BACEN (PIX). Suite de testes deixa de quebrar em CI por dado inválido.
                </p>
              </div>

              <div style="margin: 24px 0;">
                <p style="font-size:14px; font-weight:600; margin:0 0 8px 0; color:#111827;">3. Mock de checkout PIX + cartão</p>
                <p style="font-size:13px; line-height:1.55; margin:0 0 12px 0; color:#6b7280;">
                  Customer com CPF + cartão Luhn + chave PIX BACEN no mesmo objeto — pra rodar E2E do checkout sem dado real:
                </p>
                <pre style="background:#0f172a; color:#e2e8f0; padding:14px; border-radius:8px; font-size:12px; line-height:1.5; overflow-x:auto; margin:0; font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;"><code>${checkoutCurl}</code></pre>
              </div>

              <hr style="border:none; border-top:1px solid #e5e7eb; margin: 28px 0 24px 0;">

              <p style="font-size:14px; line-height:1.55; margin:0 0 16px 0; color:#374151;">
                Se travar em qualquer coisa — <strong>responde aqui direto</strong>. Sou eu quem lê. Se tiver ideia de preset novo, também manda.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px 0;">
                <tr>
                  <td style="background:#f97316; border-radius:8px;">
                    <a href="https://fakeforge.com.br/dashboard" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">Abrir dashboard →</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; line-height:1.5; margin:24px 0 0 0; color:#374151;">
                Everton<br>
                <span style="color:#9ca3af; font-size:12px;">FakeForge</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:16px 32px; border-top:1px solid #e5e7eb;">
              <p style="font-size:11px; line-height:1.5; margin:0; color:#9ca3af;">
                Recebeu esse email porque criou uma conta no FakeForge. Se não quiser mais lembretes, ignora — não mando outro.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// QUOTA APPROACHING: transacional (nao marketing, sem opt-in). User Free
// bateu >=80% do limite diario em algum dia da ultima semana. Aviso pessoal
// + pull pra plano Dev.
// ============================================================================

interface QuotaEmailProps {
  firstName: string;
  peakUsageDay: string;     // Data em que bateu o pico, formatada
  peakUsagePercent: number; // ex: 92
  callsMade: number;        // total 7d
  itemsGenerated: number;   // total 7d
}

export function subjectQuotaApproaching(): string {
  return "Voce bateu 80%+ do limite gratis essa semana";
}

export function textQuotaApproaching({ firstName, peakUsageDay, peakUsagePercent, callsMade, itemsGenerated }: QuotaEmailProps): string {
  return `Oi ${firstName},

Rapida notificacao: na semana passada voce bateu ${peakUsagePercent}% do limite diario do plano gratis no dia ${peakUsageDay}.

Numeros da sua semana:
  - ${callsMade} chamadas na API
  - ${itemsGenerated.toLocaleString('pt-BR')} items gerados
  - Pico de uso: ${peakUsagePercent}% do limite diario

Se voce continuar nesse ritmo, vai bater o cap de 100 chamadas/dia com frequencia (que trava a geracao ate 00:00 do dia seguinte).

Se ja da pra assinar Dev, R$29/mes libera 10.000 chamadas/dia + 10.000 items por chamada. Sem CI/CD travado, sem chunk de request, sem ficar batendo teto:
https://fakeforge.com.br/pricing?plan=dev&ref=quota_email

Se ta apertado no orcamento e prefere continuar no gratis, tudo bem tambem - so quis avisar antes de voce ter surpresa quando bater o teto no meio de uma pipeline.

Alguma duvida ou sugestao, me responde direto - leio tudo.

Everton
FakeForge
`;
}

export function htmlQuotaApproaching({ firstName, peakUsageDay, peakUsagePercent, callsMade, itemsGenerated }: QuotaEmailProps): string {
  const safeName = escapeHtml(firstName);
  const safeDay = escapeHtml(peakUsageDay);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Voce bateu 80%+ do limite gratis</title>
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; max-width:560px; width:100%;">
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <p style="font-size:14px; line-height:1.5; margin:0 0 16px 0; color:#374151;">Oi ${safeName},</p>

              <p style="font-size:15px; line-height:1.55; margin:0 0 20px 0; color:#111827;">
                Rapida notificacao: na semana passada voce bateu <strong>${peakUsagePercent}% do limite diario</strong> do plano gratis no dia ${safeDay}.
              </p>

              <div style="background:#fef3f2; border-left:4px solid #f97316; padding:14px 16px; margin:0 0 20px 0; border-radius:6px;">
                <p style="font-size:11px; margin:0 0 8px 0; color:#9a3412; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Numeros da sua semana</p>
                <p style="font-size:13px; margin:0 0 4px 0; color:#374151;">${callsMade} chamadas na API</p>
                <p style="font-size:13px; margin:0 0 4px 0; color:#374151;">${itemsGenerated.toLocaleString('pt-BR')} items gerados</p>
                <p style="font-size:13px; margin:0; color:#374151;">Pico de uso: <strong>${peakUsagePercent}%</strong> do limite diario</p>
              </div>

              <p style="font-size:14px; line-height:1.55; margin:0 0 16px 0; color:#374151;">
                Se voce continuar nesse ritmo, vai bater o cap de 100 chamadas/dia com frequencia (que trava a geracao ate 00:00 do dia seguinte).
              </p>

              <p style="font-size:14px; line-height:1.55; margin:0 0 20px 0; color:#374151;">
                Se ja da pra assinar Dev, <strong>R$29/mes libera 10.000 chamadas/dia + 10.000 items por chamada</strong>. Sem CI/CD travado, sem chunk de request, sem ficar batendo teto.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px 0;">
                <tr>
                  <td style="background:#f97316; border-radius:8px;">
                    <a href="https://fakeforge.com.br/pricing?plan=dev&ref=quota_email" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none;">Assinar Dev - R$29/mes &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px; line-height:1.55; margin:0 0 16px 0; color:#6b7280;">
                Se ta apertado no orcamento e prefere continuar no gratis, tudo bem tambem - so quis avisar antes de voce ter surpresa quando bater o teto no meio de uma pipeline.
              </p>

              <p style="font-size:14px; line-height:1.55; margin:0 0 16px 0; color:#374151;">
                Alguma duvida ou sugestao, me responde direto - <strong>leio tudo</strong>.
              </p>

              <p style="font-size:14px; line-height:1.5; margin:24px 0 0 0; color:#374151;">
                Everton<br>
                <span style="color:#9ca3af; font-size:12px;">FakeForge</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:16px 32px; border-top:1px solid #e5e7eb;">
              <p style="font-size:11px; line-height:1.5; margin:0; color:#9ca3af;">
                Voce recebeu esse email porque criou uma conta no FakeForge e teve uso proximo do limite diario. E' um aviso transacional sobre o seu uso da conta, nao marketing.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// Sprint 8 — Nurture Funnel D3/D7/D14/D16/D30
// Templates per docs/EMAIL_FUNNEL_SPEC.md
// ============================================================================

interface NurtureProps {
  firstName: string;
}

interface NurtureOfferProps extends NurtureProps {
  couponExpiresAt: string; // "sábado 23h59"
  checkoutUrl: string;     // https://fakeforge.com.br/checkout?plano=dev&cupom=CNPJ2026
}

const BASE_STYLE = "margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1f2937;";
const CARD_STYLE = "background:#ffffff; border-radius:12px; overflow:hidden; max-width:560px; width:100%;";
const CONTENT_STYLE = "padding: 32px 32px 24px 32px;";
const PARA_STYLE = "font-size:14px; line-height:1.55; margin:0 0 16px 0; color:#374151;";
const H2_STYLE = "font-size:16px; font-weight:600; line-height:1.4; margin:24px 0 8px 0; color:#111827;";
const BUTTON_STYLE = "display:inline-block; background:#f97316; color:#ffffff; padding:14px 28px; border-radius:8px; font-size:15px; font-weight:600; text-decoration:none; margin: 20px 0;";
const CODE_STYLE = "background:#f3f4f6; padding:2px 6px; border-radius:4px; font-family:'SF Mono', Monaco, Consolas, monospace; font-size:12px;";
const SIG_STYLE = "font-size:13px; color:#6b7280; margin: 24px 0 0 0;";

// -----------------------------------------------------------------------------
// D3 - Hook: "3 features que fazem devs pagarem"
// -----------------------------------------------------------------------------

export function subjectNurtureD3(variant: 0 | 1 | 2 = 0): string {
  return [
    "As 3 features que fizeram devs virar cliente",
    "Por que dev BR paga R$29 no FakeForge",
    "3 coisas que você não faz com CPF hardcoded",
  ][variant];
}

export function textNurtureD3({ firstName }: NurtureProps): string {
  return `Fala ${firstName},

Você criou conta há 3 dias. Deu tempo de testar o gerador básico (CPF, CNPJ, cartão). Agora quero mostrar 3 coisas que geralmente decidem o upgrade pro plano Dev.

1. Preset fintech em 1 chamada

Uma chamada devolve customer + PIX + conta bancária + cartão + score de crédito, tudo correlacionado. O CPF do customer bate com o titular da conta, o PIX aponta pra chave dele, o score faz sentido pra idade. Você não precisa costurar 5 endpoints na fixture.

Rota: /api/preset/fintech

2. CNPJ alfanumérico da IN RFB 2.229

Julho de 2026 é o corte. A partir dele, CNPJ novo pode vir com letras nas 8 primeiras posições, e o DV mudou de cálculo. Testei outros geradores BR, nenhum devolve o formato novo com DV correto. O FakeForge devolve.

Param: ?format=alphanumeric

3. Bulk de 10.000 items em 1 chamada

No Free você tem 50 chamadas por dia. No Dev, você pede 10.000 CPFs, ou CNPJs, ou combos, em uma chamada só. Seed de staging que antes rodava por 20 minutos vira 1 requisição.

Ver os 3 casos em detalhe: https://fakeforge.com.br/preset-fintech

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD3({ firstName }: NurtureProps): string {
  const safeName = escapeHtml(firstName);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD3(0)}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>
<p style="${PARA_STYLE}">Você criou conta há 3 dias. Deu tempo de testar o gerador básico (CPF, CNPJ, cartão). Agora quero mostrar <strong>3 coisas</strong> que geralmente decidem o upgrade pro plano Dev.</p>

<h2 style="${H2_STYLE}">1. Preset fintech em 1 chamada</h2>
<p style="${PARA_STYLE}">Uma chamada devolve customer + PIX + conta bancária + cartão + score de crédito, <strong>tudo correlacionado</strong>. O CPF do customer bate com o titular da conta, o PIX aponta pra chave dele, o score faz sentido pra idade. Você não precisa costurar 5 endpoints na fixture.</p>
<p style="${PARA_STYLE}">Rota: <code style="${CODE_STYLE}">/api/preset/fintech</code></p>

<h2 style="${H2_STYLE}">2. CNPJ alfanumérico da IN RFB 2.229</h2>
<p style="${PARA_STYLE}">Julho de 2026 é o corte. A partir dele, CNPJ novo pode vir com letras nas 8 primeiras posições, e o DV mudou de cálculo. Testei outros geradores BR, nenhum devolve o formato novo com DV correto. O FakeForge devolve.</p>
<p style="${PARA_STYLE}">Param: <code style="${CODE_STYLE}">?format=alphanumeric</code></p>

<h2 style="${H2_STYLE}">3. Bulk de 10.000 items em 1 chamada</h2>
<p style="${PARA_STYLE}">No Free você tem 50 chamadas por dia. No Dev, você pede 10.000 CPFs, ou CNPJs, ou combos, em uma chamada só. Seed de staging que antes rodava por 20 minutos vira 1 requisição.</p>

<p style="${PARA_STYLE}">Quer ver os 3 em detalhe, com curl de exemplo?</p>
<p style="text-align:center;"><a href="https://fakeforge.com.br/preset-fintech?utm_source=email&amp;utm_campaign=nurture_d3" style="${BUTTON_STYLE}">Ver os 3 casos em detalhe</a></p>

<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// D7 - Objection: "5 casos que Free não resolve"
// -----------------------------------------------------------------------------

export function subjectNurtureD7(variant: 0 | 1 | 2 = 0): string {
  return [
    "5 casos que o Free não aguenta",
    "Quando 50 chamadas por dia não dão conta",
    "O Free serve pra testar. Não pra rodar.",
  ][variant];
}

export function textNurtureD7({ firstName }: NurtureProps): string {
  return `Fala ${firstName},

O plano Free (50 chamadas/dia) foi feito pra você experimentar. Mas 5 cenários batem no teto rápido. Deixo aqui pra você identificar antes de perder tempo.

1. Seed de staging com 10k rows — Toda vez que você reseta o banco, precisa de dados novos. Se são 10.000 clientes com CPF, endereço, telefone e cartão, o Free trava. No Dev, é 1 chamada.

2. Load test em CI — Rodou k6 ou Locust apontando pro seu endpoint de cadastro e precisa de 100 CPFs por segundo? No Free, você bate 50 chamadas em meio segundo e o CI quebra.

3. Fixture E2E com refresh diário — Playwright ou Cypress rodando toda madrugada, gerando fixture nova pra evitar dado stale. Se são 3 suítes em paralelo, o Free some no primeiro run.

4. Mock de checkout completo — Cartão com Luhn válido, PIX BACEN nos 4 tipos, boleto com linha digitável válida. Um checkout usa 3 a 4 chamadas por sessão. Se você tem 20 devs rodando E2E local, 50/dia acaba antes do almoço.

5. CNPJ alfanumérico 2026 — Julho de 2026 chega. Seu sistema aceita "12ABC345/0001-67"? Se não, você tem 10 meses pra ajustar validação, banco, form. O FakeForge gera o formato novo pra você testar hoje.

Docs de bulk: https://fakeforge.com.br/docs

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD7({ firstName }: NurtureProps): string {
  const safeName = escapeHtml(firstName);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD7(0)}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>
<p style="${PARA_STYLE}">O plano Free (50 chamadas/dia) foi feito pra você experimentar. Mas <strong>5 cenários batem no teto rápido</strong>. Deixo aqui pra você identificar antes de perder tempo.</p>

<p style="${PARA_STYLE}"><strong>1. Seed de staging com 10k rows.</strong> Toda vez que você reseta o banco de dev ou staging, precisa de dados novos. Se são 10.000 clientes com CPF, endereço, telefone e cartão, o Free trava. No Dev, é 1 chamada.</p>

<p style="${PARA_STYLE}"><strong>2. Load test em CI.</strong> Rodou k6 ou Locust apontando pro seu endpoint de cadastro e precisa de 100 CPFs por segundo? No Free, você bate 50 chamadas em meio segundo e o CI quebra.</p>

<p style="${PARA_STYLE}"><strong>3. Fixture E2E com refresh diário.</strong> Playwright ou Cypress rodando toda madrugada. Se são 3 suítes em paralelo, o Free some no primeiro run.</p>

<p style="${PARA_STYLE}"><strong>4. Mock de checkout completo.</strong> Cartão com Luhn válido, PIX BACEN nos 4 tipos, boleto com linha digitável válida. Um checkout usa 3 a 4 chamadas por sessão de teste. Se você tem 20 devs rodando E2E local, 50/dia acaba antes do almoço.</p>

<p style="${PARA_STYLE}"><strong>5. CNPJ alfanumérico 2026.</strong> Julho de 2026 chega. Seu sistema aceita "12ABC345/0001-67"? Se não, você tem 10 meses pra ajustar validação, banco, form. O FakeForge gera o formato novo pra você testar hoje.</p>

<p style="text-align:center;"><a href="https://fakeforge.com.br/docs?utm_source=email&amp;utm_campaign=nurture_d7" style="${BUTTON_STYLE}">Ver docs de bulk</a></p>

<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// D14 - Urgency + Offer: R$19 primeiro mês (cupom CNPJ2026, 48h)
// -----------------------------------------------------------------------------

export function subjectNurtureD14(variant: 0 | 1 | 2 = 0): string {
  return [
    "CNPJ alfanumérico julho/2026: sua stack tá pronta?",
    "48h de R$19/mês no Dev, cupom já aplicado",
    "IN RFB 2.229 chega em julho. Você testou?",
  ][variant];
}

export function textNurtureD14({ firstName, couponExpiresAt, checkoutUrl }: NurtureOfferProps): string {
  return `Fala ${firstName},

Se você tá gerando CNPJ com regex do faker-js ou copiando função do StackOverflow, tem um detalhe que quebra em julho: o dígito alfanumérico da IN RFB 2.229.

A maioria das libs BR ainda cospe 14 dígitos numéricos, o validador novo da Receita rejeita, e você descobre isso quando o QA subir o ticket na sexta às 18h.

Rodei o FakeForge nos últimos 14 dias na tua conta Free, e você já bateu no limite de 100 requests/dia 3 vezes essa semana, o que geralmente é sinal que virou dependência no seed de teste.

Por isso tô te mandando esse email agora, antes do teu próximo sprint fechar.

O que muda no seu código com CNPJ alfanumérico:

- Regex ^\\d{14}$ quebra
- Coluna NUMERIC(14) no Postgres quebra
- Validação de DV precisa ser reescrita
- Form de cadastro precisa aceitar letras

Você tem 10 meses. Se você tem 40 microserviços, 10 meses somem rápido.

Por que R$19:

Sou fundador solo. O Dev a R$29 cobre infra + tempo de manutenção. Deixei R$19 no primeiro mês porque é o custo real de você me testar sem eu perder dinheiro: se rodar no teu CI e resolver, você continua; se não, cancela e a gente segue. Não é liquidação.

O que entra no plano Dev:
- 10.000 chamadas por dia
- 10.000 items por chamada (bulk)
- CNPJ alfanumérico com DV correto
- Todos os presets (fintech, ecom, customer)
- SDK Node + Python

Prazo: 48h. Cupom CNPJ2026 fica ativo até ${couponExpiresAt}. Depois volta pra R$29 no ato.

Assinar Dev por R$19/mês (cancelamento em 1 clique, sem fidelidade):
${checkoutUrl}

Se tiver dúvida sobre a IN RFB 2.229, responde esse email. Eu leio.

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD14({ firstName, couponExpiresAt, checkoutUrl }: NurtureOfferProps): string {
  const safeName = escapeHtml(firstName);
  const safeUrl = escapeHtml(checkoutUrl);
  const safeExpiry = escapeHtml(couponExpiresAt);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD14(0)}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>

<p style="${PARA_STYLE}">Se você tá gerando CNPJ com regex do faker-js ou copiando função do StackOverflow, tem um detalhe que quebra em julho: o <strong>dígito alfanumérico da IN RFB 2.229</strong>.</p>

<p style="${PARA_STYLE}">A maioria das libs BR ainda cospe 14 dígitos numéricos, o validador novo da Receita rejeita, e você descobre isso quando o QA subir o ticket na sexta às 18h.</p>

<p style="${PARA_STYLE}">Rodei o FakeForge nos últimos 14 dias na tua conta Free, e você já bateu no limite de 100 requests/dia 3 vezes essa semana, o que geralmente é sinal que virou dependência no seed de teste.</p>

<p style="${PARA_STYLE}">Por isso tô te mandando esse email agora, antes do teu próximo sprint fechar.</p>

<h2 style="${H2_STYLE}">O que muda no seu código com CNPJ alfanumérico:</h2>
<ul style="${PARA_STYLE}; padding-left:20px;">
<li>Regex <code style="${CODE_STYLE}">^\\d{14}$</code> quebra</li>
<li>Coluna <code style="${CODE_STYLE}">NUMERIC(14)</code> no Postgres quebra</li>
<li>Validação de DV precisa ser reescrita (cálculo novo via ASCII menos 48)</li>
<li>Form de cadastro precisa aceitar letras</li>
</ul>

<p style="${PARA_STYLE}">Você tem 10 meses. Se você tem 40 microserviços, 10 meses somem rápido.</p>

<h2 style="${H2_STYLE}">Por que R$19 (o Reason-Why):</h2>
<p style="${PARA_STYLE}">Sou fundador solo, e o Dev a R$29 cobre infra + tempo de manutenção. Deixei R$19 no primeiro mês porque é o custo real de você me testar sem eu perder dinheiro: se rodar no teu CI e resolver, você continua; se não resolver, cancela e a gente segue. Não é liquidação.</p>

<h2 style="${H2_STYLE}">O que entra no plano Dev:</h2>
<ul style="${PARA_STYLE}; padding-left:20px;">
<li>10.000 chamadas por dia</li>
<li>10.000 items por chamada (bulk)</li>
<li>CNPJ alfanumérico com DV correto</li>
<li>Todos os presets (fintech, ecom, customer)</li>
<li>SDK Node + Python</li>
</ul>

<p style="${PARA_STYLE}"><strong>Prazo: 48h.</strong> O cupom <code style="${CODE_STYLE}">CNPJ2026</code> fica ativo até <strong>${safeExpiry}</strong>. Depois disso volta pra R$29 no ato.</p>

<p style="text-align:center;">
<a href="${safeUrl}&amp;utm_source=email&amp;utm_campaign=nurture_d14" style="${BUTTON_STYLE}">Assinar Dev por R$19/mês</a><br>
<span style="font-size:11px; color:#6b7280;">cancelamento em 1 clique, sem fidelidade</span>
</p>

<h2 style="${H2_STYLE}">Se tiver alguma dúvida:</h2>
<p style="${PARA_STYLE}"><strong>"E se eu não usar de verdade?"</strong> Se você não bater em 500 requests no primeiro mês, o próprio painel te avisa e sugere voltar pro Free.</p>
<p style="${PARA_STYLE}"><strong>"E se eu quiser cancelar?"</strong> 1 clique no painel, sem formulário, sem email pra suporte, sem retenção. Testei porque odeio quando fazem comigo.</p>
<p style="${PARA_STYLE}"><strong>"Faker-js + validador custom já resolve"</strong> Resolve até a IN RFB 2.229 entrar em vigor em julho. Se você achou lib grátis que implementou o algoritmo módulo 11 adaptado, me manda que eu paro de cobrar por isso.</p>

<p style="${PARA_STYLE}">Responde esse email se tiver dúvida técnica. Eu leio.</p>

<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// D16 - Last chance: 24h antes do cupom expirar
// -----------------------------------------------------------------------------

export function subjectNurtureD16(variant: 0 | 1 | 2 = 0): string {
  return [
    "cupom CNPJ2026 expira amanhã 23h59",
    "Amanhã volta pra R$29",
    "Último dia do R$19",
  ][variant];
}

export function textNurtureD16({ firstName, checkoutUrl }: NurtureOfferProps): string {
  return `Fala ${firstName},

O cupom CNPJ2026 sai do ar em 24 horas. Depois disso, o Dev volta pra R$29/mês cheios.

Rogério, meu primeiro cliente Dev (fintech pequena em Curitiba, 2 devs), me contou semana passada que economiza umas 4h/mês só de não manter mais o gerador custom de CPF/CNPJ no repo de fixtures. Não é milagre. São 4 horas. Que viraram uma feature a mais entregue por mês.

Amanhã à noite o cupom some, e o Dev volta pra R$29. Não é o fim do mundo, é R$10 a mais por mês, mas é R$120 no ano que você não precisa gastar se ativar hoje.

Se julho chegar e teu pipeline quebrar no CNPJ alfanumérico, você vai gastar 2-3 horas debugando o validador, e essas horas custam mais que o plano anual inteiro.

R$19 no primeiro mês. 24h no relógio.

${checkoutUrl}

Se não fizer sentido agora, sem estresse. Te mando novidade mensal quando tiver update relevante do gerador. Sem enrolação.

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD16({ firstName, checkoutUrl }: NurtureOfferProps): string {
  const safeName = escapeHtml(firstName);
  const safeUrl = escapeHtml(checkoutUrl);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD16(0)}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>

<p style="${PARA_STYLE}">O cupom <code style="${CODE_STYLE}">CNPJ2026</code> sai do ar em <strong>24 horas</strong>. Depois disso, o Dev volta pra R$29/mês cheios.</p>

<p style="${PARA_STYLE}">Rogério, meu primeiro cliente Dev (fintech pequena em Curitiba, 2 devs), me contou semana passada que economiza umas 4h/mês só de não manter mais o gerador custom de CPF/CNPJ no repo de fixtures. Não é milagre. São 4 horas. Que viraram uma feature a mais entregue por mês.</p>

<p style="${PARA_STYLE}">Amanhã à noite o cupom some, e o Dev volta pra R$29. Não é o fim do mundo, é R$10 a mais por mês, mas é <strong>R$120 no ano</strong> que você não precisa gastar se ativar hoje.</p>

<p style="${PARA_STYLE}">Se julho chegar e teu pipeline quebrar no CNPJ alfanumérico, você vai gastar 2-3 horas debugando o validador, e essas horas custam mais que o plano anual inteiro.</p>

<p style="${PARA_STYLE}"><strong>R$19 no primeiro mês. 24h no relógio.</strong></p>

<p style="text-align:center;"><a href="${safeUrl}&amp;utm_source=email&amp;utm_campaign=nurture_d16" style="${BUTTON_STYLE}">Aproveita R$19 (24h restantes)</a></p>

<p style="${PARA_STYLE}">Se não fizer sentido agora, sem estresse. Te mando novidade mensal quando tiver update relevante do gerador. Sem enrolação, sem sequência de 7 emails.</p>

<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// D30A - Retention (converteu): "3 features de dev Dev descobrem tarde"
// -----------------------------------------------------------------------------

export function subjectNurtureD30Retention(): string {
  return "3 coisas que devs Dev descobrem tarde";
}

export function textNurtureD30Retention({ firstName }: NurtureProps): string {
  return `Fala ${firstName},

Você tá no Dev há algumas semanas. Antes de virar rotina "gerar CPF e pronto", queria compartilhar 3 coisas que devs geralmente descobrem tarde e economizam bastante requisição.

1. Presets fazem o trabalho de 5 endpoints. Em vez de chamar /cpf + /endereco + /telefone + /cartao + /pix, chama /preset/customer uma vez. Vem tudo correlacionado (mesmo titular, mesmo estado, telefone com DDD que bate).

2. Bulk sob demanda, não por padrão. O bulk brilha em seed de banco e load test. Pra fixture de teste unitário, você provavelmente precisa de 50, não de 10.000. Divide o uso.

3. API key por ambiente no CI/CD. No painel você gera múltiplas keys. Uma pra dev local, uma pra CI staging, uma pra load test. Se algum script vazar log, você revoga só aquela key.

Docs de presets: https://fakeforge.com.br/docs

Se tiver caso de uso que não tá coberto, responde esse email. Eu implemento se fizer sentido pra mais gente.

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD30Retention({ firstName }: NurtureProps): string {
  const safeName = escapeHtml(firstName);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD30Retention()}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>
<p style="${PARA_STYLE}">Você tá no Dev há algumas semanas. Antes de virar rotina "gerar CPF e pronto", queria compartilhar 3 coisas que devs geralmente descobrem tarde e economizam bastante requisição.</p>

<h2 style="${H2_STYLE}">1. Presets fazem o trabalho de 5 endpoints</h2>
<p style="${PARA_STYLE}">Em vez de chamar <code style="${CODE_STYLE}">/cpf</code> + <code style="${CODE_STYLE}">/endereco</code> + <code style="${CODE_STYLE}">/telefone</code> + <code style="${CODE_STYLE}">/cartao</code> + <code style="${CODE_STYLE}">/pix</code>, chama <code style="${CODE_STYLE}">/preset/customer</code> uma vez. Vem tudo correlacionado (mesmo titular, mesmo estado, telefone com DDD que bate). Você gasta 1 chamada em vez de 5.</p>

<h2 style="${H2_STYLE}">2. Bulk sob demanda, não por padrão</h2>
<p style="${PARA_STYLE}">O bulk brilha em seed de banco e load test. Pra fixture de teste unitário, você provavelmente precisa de 50, não de 10.000. Divide o uso: bulk grande no CI noturno, chamadas pequenas em desenvolvimento local.</p>

<h2 style="${H2_STYLE}">3. API key por ambiente no CI/CD</h2>
<p style="${PARA_STYLE}">No painel você gera múltiplas keys. Uma pra dev local, uma pra CI staging, uma pra load test. Se algum script vazar log, você revoga só aquela key sem parar o resto.</p>

<p style="text-align:center;"><a href="https://fakeforge.com.br/docs?utm_source=email&amp;utm_campaign=nurture_d30_retention" style="${BUTTON_STYLE}">Ver docs de presets</a></p>

<p style="${PARA_STYLE}">Se tiver caso de uso que não tá coberto, responde esse email. Eu implemento se fizer sentido pra mais gente.</p>
<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// D30B - Monthly digest (não converteu): soft sell mensal
// -----------------------------------------------------------------------------

export function subjectNurtureD30Digest(): string {
  return "Novidade técnica do mês, sem pitch";
}

export function textNurtureD30Digest({ firstName }: NurtureProps): string {
  return `Fala ${firstName},

Você tá no Free e tá tudo bem. Não vou te encher pra fazer upgrade toda semana. Uma vez por mês eu passo pra contar o que mudou tecnicamente. Se um dia servir, você sabe onde me achar.

Esse mês no FakeForge:

1. Boleto com linha digitável real por banco. Antes o boleto vinha genérico. Agora, se você passa ?banco=itau ou ?banco=bb, a linha vem no padrão do banco escolhido (código, agência, DAC certo). Serve pra testar parser que espera prefixo específico.

2. SDK Python 0.4 com typing completo. Todos os retornos agora têm dataclass tipado. mypy e pyright reconhecem, autocomplete no VSCode funciona sem hint file. pip install fakeforge-br==0.4 puxa a versão nova.

No blog esse mês escrevi um post sobre como o CNPJ alfanumérico da IN RFB 2.229 quebra Postgres com coluna NUMERIC(14). Tem código pra migração sem downtime: https://fakeforge.com.br/blog

É isso. Bom código pra você.

Quando quiser mais volume que 50 chamadas por dia, tô aqui.

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlNurtureD30Digest({ firstName }: NurtureProps): string {
  const safeName = escapeHtml(firstName);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectNurtureD30Digest()}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>
<p style="${PARA_STYLE}">Você tá no Free e tá tudo bem. Não vou te encher pra fazer upgrade toda semana. Uma vez por mês eu passo pra contar o que mudou tecnicamente. Se um dia servir, você sabe onde me achar.</p>

<h2 style="${H2_STYLE}">Esse mês no FakeForge:</h2>

<p style="${PARA_STYLE}"><strong>1. Boleto com linha digitável real por banco.</strong> Antes o boleto vinha com linha digitável genérica. Agora, se você passa <code style="${CODE_STYLE}">?banco=itau</code> ou <code style="${CODE_STYLE}">?banco=bb</code>, a linha vem no padrão do banco escolhido (código, agência, DAC certo). Serve pra testar parser que espera prefixo específico.</p>

<p style="${PARA_STYLE}"><strong>2. SDK Python 0.4 com typing completo.</strong> Todos os retornos agora têm dataclass tipado. mypy e pyright reconhecem, autocomplete no VSCode funciona sem hint file. <code style="${CODE_STYLE}">pip install fakeforge-br==0.4</code> puxa a versão nova.</p>

<h2 style="${H2_STYLE}">No blog esse mês:</h2>
<p style="${PARA_STYLE}">Escrevi um post sobre como o CNPJ alfanumérico da IN RFB 2.229 quebra Postgres com coluna <code style="${CODE_STYLE}">NUMERIC(14)</code>. Tem código pra migração sem downtime.</p>

<p style="text-align:center;"><a href="https://fakeforge.com.br/blog?utm_source=email&amp;utm_campaign=nurture_d30_digest" style="${BUTTON_STYLE}">Ver blog</a></p>

<p style="${PARA_STYLE}">É isso. Bom código pra você.</p>
<p style="${PARA_STYLE}"><em>Quando quiser mais volume que 50 chamadas por dia, tô aqui.</em></p>
<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}

// -----------------------------------------------------------------------------
// B2B trigger email (heavy Free user + corporate signals)
// -----------------------------------------------------------------------------

interface B2BEmailProps {
  firstName: string;
  volumeSummary: string; // "40 chamadas/dia nos últimos 5 dias"
  calendlyUrl: string;
}

export function subjectB2BTrigger(): string {
  return "Vi que seu time tá batendo no limite Free — 15 min?";
}

export function textB2BTrigger({ firstName, volumeSummary, calendlyUrl }: B2BEmailProps): string {
  return `Fala ${firstName},

Notei o padrão de uso na sua conta: ${volumeSummary}. Isso geralmente é sinal que virou dependência real no fluxo do time.

O plano Free (50/dia) foi feito pra dev individual testando. Se você tá batendo consistentemente, tem 2 caminhos que fazem sentido:

1. Team (R$79/mês) — 100.000 chamadas/dia. Suporta CI + local + staging simultâneos sem estourar.

2. Enterprise — pra times maiores ou fluxos B2B específicos. Nesse caso vale a gente conversar 15 min pra entender o que você precisa (SLA, on-prem, custom integrations, etc).

Se preferir Team direto: https://fakeforge.com.br/pricing

Se quiser conversar sobre Enterprise, marca 15 min aqui:
${calendlyUrl}

Sem pressão. Se Team resolve, mete Team. Se quiser trocar ideia antes, tô aqui.

Abraço,
Everton, fundador do FakeForge
`;
}

export function htmlB2BTrigger({ firstName, volumeSummary, calendlyUrl }: B2BEmailProps): string {
  const safeName = escapeHtml(firstName);
  const safeUrl = escapeHtml(calendlyUrl);
  const safeVol = escapeHtml(volumeSummary);
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${subjectB2BTrigger()}</title></head>
<body style="${BASE_STYLE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${CARD_STYLE}">
<tr><td style="${CONTENT_STYLE}">
<p style="${PARA_STYLE}">Fala ${safeName},</p>
<p style="${PARA_STYLE}">Notei o padrão de uso na sua conta: <strong>${safeVol}</strong>. Isso geralmente é sinal que virou dependência real no fluxo do time.</p>

<p style="${PARA_STYLE}">O plano Free (50/dia) foi feito pra dev individual testando. Se você tá batendo consistentemente, tem 2 caminhos que fazem sentido:</p>

<p style="${PARA_STYLE}"><strong>1. Team (R$79/mês)</strong> — 100.000 chamadas/dia. Suporta CI + local + staging simultâneos sem estourar.</p>

<p style="${PARA_STYLE}"><strong>2. Enterprise</strong> — pra times maiores ou fluxos B2B específicos. Nesse caso vale a gente conversar 15 min pra entender o que você precisa (SLA, on-prem, custom integrations, etc).</p>

<p style="text-align:center; margin: 24px 0;">
<a href="${safeUrl}" style="${BUTTON_STYLE}">Marcar 15 min sobre Enterprise</a><br>
<a href="https://fakeforge.com.br/pricing" style="font-size:13px; color:#1e40af; text-decoration:underline;">ou assinar Team direto (R$79/mês)</a>
</p>

<p style="${PARA_STYLE}">Sem pressão. Se Team resolve, mete Team. Se quiser trocar ideia antes, tô aqui.</p>
<p style="${SIG_STYLE}">Abraço,<br>Everton, fundador do FakeForge</p>
</td></tr></table></td></tr></table></body></html>`;
}
