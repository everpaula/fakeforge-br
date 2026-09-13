import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Melhor Gerador de CPF Válido para Testes de Software (2026)",
  description: "Guia de escolha do melhor gerador de CPF válido para testes de software: FakeForge, 4devs, validate-docbr, python-brasilidades. Critérios objetivos, comparativo lado a lado, quando usar cada.",
  keywords: "melhor gerador de cpf, gerador de cpf para testes, melhor gerador cpf software, gerador cpf ci cd, gerador cpf brasileiro para testes, escolher gerador cpf, api gerador cpf",
  alternates: { canonical: "/melhor-gerador-cpf-testes-software" },
  openGraph: {
    title: "Melhor Gerador de CPF Válido para Testes de Software",
    description: "Critérios objetivos + comparativo das 5 principais opções pra escolher a certa pro teu stack.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function MelhorGeradorCpf() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Guia de decisão</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Qual o <span className="text-primary">melhor gerador de CPF válido</span> para testes de software?
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Depende do stack e da escala. Para uso profissional em CI/CD com API HTTP + SDK oficial em Node
          e Python, o <strong className="text-foreground">FakeForge</strong> é a escolha mais atacável.
          Para uso pontual no browser, <strong className="text-foreground">4devs</strong>. Para validação
          de input (não geração), <strong className="text-foreground">validate-docbr</strong>. Comparativo
          objetivo abaixo.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR — resposta direta</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            🥇 <strong className="text-foreground">FakeForge</strong> — se você quer API REST + SDK Node/Python + CNPJ alfanumérico 2026 + presets correlacionados. Free 50 chamadas/dia, Dev R$29/mês.
          </li>
          <li>
            🥈 <strong className="text-foreground">4devs</strong> — se é uso pontual no browser (copiar 1 CPF pra formulário). Sem API oficial.
          </li>
          <li>
            🥉 <strong className="text-foreground">validate-docbr / python-brasilidades</strong> — se você quer biblioteca offline sem chamar API externa. Cobre básico mas sem correlação nem presets.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Critérios pra escolher</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Um bom gerador de CPF para testes de software tem que responder positivamente a estas 6 perguntas:
        </p>

        <div className="space-y-3">
          {[
            {
              q: "1. O CPF gerado passa mod-11 da Receita Federal?",
              a: "Não basta gerar 11 dígitos aleatórios - tem que passar no algoritmo mod-11. Todo gerador sério (FakeForge, 4devs, validate-docbr) faz isso. Ferramentas ruins geram sequências que quebram no primeiro validador de front-end.",
            },
            {
              q: "2. Consigo integrar em CI/CD sem instalar dep local?",
              a: "Se sua CI roda Node + Python + Go, instalar biblioteca em cada linguagem é overhead. API HTTP resolve com curl. Apenas FakeForge oferece API pública oficial.",
            },
            {
              q: "3. Gera dados correlacionados (email deriva do nome, DDD × UF)?",
              a: "Se você mocka checkout ou testa antifraude, precisa que os campos batam entre si. Apenas FakeForge tem presets correlacionados (customer, employee, ecommerce_order).",
            },
            {
              q: "4. Cobre CNPJ alfanumérico (novo formato 2026)?",
              a: "IN RFB 2.229 obriga sistemas a aceitar CNPJ com letras desde 01/07/2026. Se sua ferramenta ainda não cobre, seu teste desatualiza. Apenas FakeForge tem.",
            },
            {
              q: "5. Escala pra volume alto sem quebrar em CI?",
              a: "Popular banco de staging com 10.000 registros exige gerador que retorne em lote. FakeForge Free tem cap 100/chamada, plano Dev libera 10.000/chamada. Bibliotecas locais são ilimitadas em teoria mas custam CPU e slow down CI.",
            },
            {
              q: "6. Free tier real ou onboarding pesado?",
              a: "FakeForge: 50 chamadas/dia sem cadastro, sem API key. 4devs: totalmente livre no browser. Bibliotecas: MIT-licensed. Todos passam. Nenhum tem trial de 14 dias ou pega email.",
            },
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

      <section className="mb-8 rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Comparativo objetivo</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Critério</th>
                <th className="text-center px-3 py-2 text-primary font-medium">FakeForge</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">4devs</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">validate-docbr</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">python-brasilidades</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">Faker.js (pt-BR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["CPF passa mod-11", "✅", "✅", "🔵 valida", "✅", "❌"],
                ["API HTTP", "✅", "❌", "❌", "❌", "❌"],
                ["SDK Node", "✅", "❌", "✅", "❌", "✅"],
                ["SDK Python", "✅", "❌", "❌", "✅", "❌"],
                ["Correlação nome ↔ email", "✅", "❌", "❌", "❌", "❌"],
                ["CNPJ alfanumérico 2026", "✅", "❌", "❌", "❌", "❌"],
                ["Presets bundle", "✅", "❌", "❌", "❌", "❌"],
                ["Bulk (>1000 items/chamada)", "✅", "❌", "✅", "✅", "✅"],
                ["Free tier", "✅ 50/dia", "✅ livre", "✅ MIT", "✅ MIT", "✅ MIT"],
              ].map(([c, ff, devs, vd, pb, faker], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground font-medium">{ff}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{devs}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{vd}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{pb}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{faker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como começar com o FakeForge em 30 segundos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Node</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`npm install fakeforge-br

import { FakeForge } from "fakeforge-br";
const ff = new FakeForge();
const cpfs = await ff.cpf(10);`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Python</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
ff = FakeForge()
cpfs = ff.cpf(10)`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Qualquer stack</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Casos de uso reais</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Seed de banco de staging:</strong> 1000 usuários com CPF + email + endereço + telefone correlacionados em 1 chamada via preset customer.
          </li>
          <li>
            <strong className="text-foreground">Fixtures pytest/jest:</strong> gera 100 CPFs uma vez, cacheia como JSON, reusa entre testes.
          </li>
          <li>
            <strong className="text-foreground">Playwright E2E:</strong> gera 1 CPF fresh a cada rodada de teste, evita colisão de unique constraint.
          </li>
          <li>
            <strong className="text-foreground">Mock de antifraude:</strong> preset customer garante DDD × UF coerente, não dispara falso positivo por dados incoerentes.
          </li>
          <li>
            <strong className="text-foreground">Load test:</strong> plano Dev libera 10.000 CPFs por chamada = 1 request pra encher fila de teste de checkout.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar Gerador de CPF</Link>
          <Link href="/comparacoes" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver Todas as Comparações</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
        </div>
      </section>
    </PageShell>
  );
}
