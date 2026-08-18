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
FakeForge BR
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
                <span style="color:#9ca3af; font-size:12px;">FakeForge BR</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:16px 32px; border-top:1px solid #e5e7eb;">
              <p style="font-size:11px; line-height:1.5; margin:0; color:#9ca3af;">
                Recebeu esse email porque criou uma conta no FakeForge BR. Se não foi você, ignora — a conta expira sem confirmação.
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
