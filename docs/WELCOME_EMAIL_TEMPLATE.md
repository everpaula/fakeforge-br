# Welcome Email Template (Supabase Auth)

Aplicar manualmente no **Supabase Dashboard → Authentication → Email Templates → Confirm signup**.

Esse template substitui o "Confirme seu email" genérico do Supabase pelo welcome com 3 casos de uso concretos. Aumenta ativação porque o usuário entende o que fazer no dia 1.

## Subject

```
Bem-vindo ao FakeForge. Aqui está sua chave pra começar agora.
```

## Body (HTML)

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.5;">

  <h1 style="font-size: 22px; margin: 0 0 16px 0; color: #111827;">
    Você está dentro do FakeForge BR.
  </h1>

  <p style="margin: 0 0 16px 0;">
    Antes de qualquer coisa: <a href="{{ .ConfirmationURL }}" style="color: #1e40af; font-weight: 600;">confirme seu email aqui</a>.
    Depois disso, você desbloqueia API key pessoal com 50 chamadas/dia (vs 50 anônimas que você já tinha), histórico de gerações e os presets correlacionados.
  </p>

  <h2 style="font-size: 16px; margin: 24px 0 12px 0; color: #111827;">
    3 coisas pra fazer nos primeiros 5 minutos
  </h2>

  <div style="border-left: 3px solid #1e40af; padding: 8px 0 8px 16px; margin: 12px 0;">
    <p style="margin: 0 0 4px 0; font-weight: 600;">1. Popule seu banco de staging em 1 chamada</p>
    <p style="margin: 0; font-size: 14px; color: #6b7280;">
      <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px;">curl -H "X-API-Key: SUA_KEY" "https://fakeforge.com.br/api/generate?preset=customer&amp;quantity=100&amp;format=sql"</code>
    </p>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
      Volta um INSERT INTO pronto. CPFs passam mod-11. Email derivado do nome. CEP bate com estado.
    </p>
  </div>

  <div style="border-left: 3px solid #1e40af; padding: 8px 0 8px 16px; margin: 12px 0;">
    <p style="margin: 0 0 4px 0; font-weight: 600;">2. Rode no pytest ou jest como factory</p>
    <p style="margin: 0; font-size: 14px; color: #6b7280;">
      Endpoint <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">GET /api/generate?type=cpf&amp;quantity=10</code> devolve JSON puro. Cole no setup do teste e vira fixture instantânea.
    </p>
  </div>

  <div style="border-left: 3px solid #1e40af; padding: 8px 0 8px 16px; margin: 12px 0;">
    <p style="margin: 0 0 4px 0; font-weight: 600;">3. Teste fluxo de pagamento ponta a ponta</p>
    <p style="margin: 0; font-size: 14px; color: #6b7280;">
      Cartão de crédito Visa/Master/Elo/Amex passa em Luhn. Chave PIX vem nos 4 formatos BACEN. Use em sandboxes do Stripe, Mercado Pago, PagBank.
    </p>
  </div>

  <p style="margin: 24px 0 16px 0;">
    Dashboard com sua API key:
    <br/>
    <a href="https://fakeforge.com.br/dashboard" style="display: inline-block; margin-top: 8px; background: #1e40af; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
      Ir pro dashboard
    </a>
  </p>

  <p style="margin: 24px 0 0 0; font-size: 13px; color: #9ca3af;">
    Quando bater no limite do free (50/dia), sobe pra Dev em <a href="https://fakeforge.com.br/pricing" style="color: #6b7280;">R$ 29/mês</a> com 10.000 chamadas/dia.
  </p>

  <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
    Se você não criou conta no FakeForge, ignore este email.
  </p>
</div>
```

## Body (texto plano fallback)

```
Você está dentro do FakeForge BR.

Antes de qualquer coisa: confirme seu email em {{ .ConfirmationURL }}.

Depois disso, você desbloqueia API key pessoal com 50 chamadas/dia, histórico de gerações e os presets correlacionados.

3 coisas pra fazer nos primeiros 5 minutos:

1. Popule seu banco de staging em 1 chamada
   curl -H "X-API-Key: SUA_KEY" "https://fakeforge.com.br/api/generate?preset=customer&quantity=100&format=sql"
   Volta um INSERT INTO pronto.

2. Rode no pytest ou jest como factory
   GET /api/generate?type=cpf&quantity=10
   Devolve JSON puro.

3. Teste fluxo de pagamento ponta a ponta
   Cartão Visa/Master/Elo/Amex passa em Luhn. Chave PIX nos 4 formatos BACEN.

Dashboard: https://fakeforge.com.br/dashboard

Quando bater no limite do free (50/dia), sobe pra Dev em R$ 29/mês com 10.000 chamadas/dia.

Se você não criou conta no FakeForge, ignore este email.
```

## Como aplicar

1. Login em https://supabase.com/dashboard/project/_/auth/templates
2. Selecionar **Confirm signup**
3. Substituir Subject + Message (HTML)
4. Salvar
5. Testar: criar conta com email novo

Tempo total: ~3 minutos.
