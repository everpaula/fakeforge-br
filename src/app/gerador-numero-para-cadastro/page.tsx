import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GeneratorSchema from "@/components/GeneratorSchema";

export const metadata: Metadata = {
  title: "Gerador de Número para Cadastro Fake (Formulário e Signup)",
  description: "Gerador de número de telefone para teste de cadastro, signup, formulários e checkout. Passa validação de máscara e regex ANATEL. Para QA de fluxos de aquisição sem tocar em número real de usuário.",
  keywords: "gerador de numero para cadastro, número para cadastro fake, telefone para cadastro teste, celular para cadastro fake, gerador de telefone para formulario, numero para signup, numero para teste de cadastro",
  alternates: { canonical: "/gerador-numero-para-cadastro" },
  openGraph: {
    title: "Gerador de Número para Cadastro Fake",
    description: "Testa fluxo de signup e formulário sem tocar em número de usuário real. Formato ANATEL válido.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GeradorNumeroParaCadastro() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Ferramenta para desenvolvedores</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Número para <span className="text-primary">Cadastro Fake</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gera número de telefone no formato ANATEL válido pra testar fluxos de cadastro, signup, formulário
          de contato e checkout. Passa em máscara, regex e validador de front-end, mas não pertence a chip
          real — perfeito pra QA de aquisição sem tocar em dado de usuário real.
        </p>
      </div>

      <div className="space-y-6">
        <SingleGenerator
          type="phone"
          label="Celular para Cadastro"
          description="Formato ANATEL (11 dígitos com 9). Passa validação de signup."
        />
        <SingleGenerator
          type="landline"
          label="Fixo para Cadastro"
          description="10 dígitos sem 9. Pra cadastros que aceitam residencial."
        />
      </div>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Número para Cadastro Fake", url: "/gerador-numero-para-cadastro" },
      ]} />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Por que não usar seu próprio número em teste</h2>
          <p>
            Todo dev já usou o próprio celular pra testar signup. É a pior prática: seu número acaba
            em N registros da base de staging, dispara SMS de OTP no meio da noite quando alguém roda
            o CI, e mistura dado real com fake. Piora quando outro dev do time <strong className="text-foreground">
            reproduz o bug usando o mesmo número</strong> e a rate limit do SMS provider bloqueia vocês.
          </p>
          <p className="mt-2">
            Número fake resolve tudo: você tem infinito, cada dev pega o seu, não dispara SMS real (nossos
            números não estão vinculados a chip), e você pode versionar como fixture. É a maneira profissional
            de testar cadastro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Casos de uso reais</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-foreground">E2E Playwright/Cypress:</strong> fixture com 100 números pra
              testar fluxo de signup completo (formulário → OTP mockado → confirmação)
            </li>
            <li>
              <strong className="text-foreground">Seed de staging:</strong> popular 10.000 usuários pra ter dashboard
              realista, filtros funcionando e paginação carregada
            </li>
            <li>
              <strong className="text-foreground">Teste de validação:</strong> checar que sua regex ANATEL aceita
              10 e 11 dígitos, rejeita DDD 00, exige 9 no celular
            </li>
            <li>
              <strong className="text-foreground">QA de máscara:</strong> confirmar que input aceita
              &quot;(11) 98765-4321&quot;, &quot;11987654321&quot;, e converte entre formatos
            </li>
            <li>
              <strong className="text-foreground">Load test:</strong> stress test do endpoint de cadastro com
              1.000 signups paralelos, cada um com número único
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Playwright: cadastro E2E automatizado</h2>
          <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`import { test, expect } from '@playwright/test';

test('signup fluxo completo com número fake', async ({ page }) => {
  // Gera 1 celular fresh a cada rodada de teste
  const res = await fetch(
    'https://fakeforge.com.br/api/generate?type=phone&quantity=1'
  );
  const { data } = await res.json();
  const celular = data[0];

  await page.goto('/signup');
  await page.fill('#nome', 'Teste E2E');
  await page.fill('#celular', celular);
  await page.click('#continuar');

  await expect(page.locator('.otp-input')).toBeVisible();
  // Mockar OTP no backend, ou usar cheat code de staging
  await page.fill('.otp-input', '123456');
  await page.click('#confirmar');

  await expect(page).toHaveURL(/\\/welcome/);
});`}</code></pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Uso número fake em cadastro real vira problema?", a: "Se você usa fake em cadastro de produção (não de teste), o serviço vai eventualmente falhar em confirmar via SMS ou ligação — o que é o problema esperado. Não gera bloqueio de conta, mas o usuário fica sem receber notificação. Uso fake apenas em ambiente de teste." },
              { q: "Como faço mock do SMS de OTP no meu backend?", a: "Duas abordagens comuns: (1) em ambiente de teste, seu provider SMS retorna sempre 'delivered' sem enviar de fato; (2) você tem cheat code que aceita OTP fixo tipo 123456 em staging. Nossa ferramenta gera o número; o mock do SMS é do seu backend." },
              { q: "Tem gerador de OTP também?", a: "Sim. Nossa página /en/random-number-generator gera códigos de 4, 6 e 8 dígitos pra testar OTP, 2FA e verificação. É complementar ao gerador de número." },
              { q: "Posso reusar o mesmo número fake em vários testes?", a: "Pode, mas nem sempre é ideal. Se seu backend tem unique constraint em telefone, o segundo teste falha. Melhor gerar 100 na fixture e cada teste pegar um único. API do FakeForge te devolve 100 números únicos por chamada." },
              { q: "Como diferencia número fake de número banido/bloqueado?", a: "São coisas diferentes. Fake = número que passa validação de formato mas não pertence a chip. Banido = número que passou validação, existe, mas foi bloqueado pelo sistema por spam/fraude. Nossa ferramenta só gera fake — número banido é atributo do seu antifraude." },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                  <span className="text-sm font-medium text-foreground">{q}</span>
                  <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Ferramentas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gerador-telefone" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Gerador de Telefone (pilar)</Link>
            <Link href="/numero-de-celular-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Celular aleatório</Link>
            <Link href="/telefone-aleatorio" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Telefone aleatório</Link>
            <Link href="/gerador-de-numero-fake" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Número fake</Link>
            <Link href="/gerador-telefone-fixo" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">Fixo residencial</Link>
          </div>
        </section>
      </div>

      <GeneratorSchema
        name="Gerador de Número para Cadastro Fake"
        url="https://fakeforge.com.br/gerador-numero-para-cadastro"
        description="Gerador de número de telefone pra testar fluxos de cadastro, signup e checkout. Passa validação ANATEL mas não pertence a chip real."
        features={[
          "Formato ANATEL válido (celular ou fixo)",
          "Fixture pronta para Playwright e Cypress E2E",
          "Passa validação de máscara e regex",
          "Não dispara SMS real (número sem chip)",
          "50 chamadas grátis/dia sem cadastro",
          "Load test friendly (número único por chamada)",
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Uso número fake em cadastro real vira problema?", acceptedAnswer: { "@type": "Answer", text: "Se você usa fake em produção, o SMS não confirma. Não gera bloqueio, mas usuário fica sem notificação. Uso fake só em teste." } },
              { "@type": "Question", name: "Como faço mock do SMS de OTP no meu backend?", acceptedAnswer: { "@type": "Answer", text: "Duas opções: provider SMS em modo teste retorna 'delivered' sem enviar, ou cheat code aceita OTP fixo em staging." } },
              { "@type": "Question", name: "Tem gerador de OTP também?", acceptedAnswer: { "@type": "Answer", text: "Sim. /en/random-number-generator gera códigos de 4, 6 e 8 dígitos pra testar OTP e 2FA." } },
              { "@type": "Question", name: "Posso reusar o mesmo número fake em vários testes?", acceptedAnswer: { "@type": "Answer", text: "Pode, mas se seu backend tem unique constraint, o segundo teste falha. Gere 100 na fixture e cada teste pega um único." } },
              { "@type": "Question", name: "Como diferencia número fake de número banido?", acceptedAnswer: { "@type": "Answer", text: "Fake = passa validação mas não existe. Banido = existe mas foi bloqueado por spam/fraude. Nossa ferramenta só gera fake." } },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
