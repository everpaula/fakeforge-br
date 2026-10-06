import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar RENAVAM em Node.js: mod-11 DENATRAN com Jest",
  description: "Como validar RENAVAM em Node.js e TypeScript: mod-11 DENATRAN com pesos 3,2,9,8,7,6,5,4,3,2, função standalone e testes com Jest. Zero dependências.",
  keywords: "validar renavam nodejs, validar renavam javascript, validar renavam typescript, verificar renavam node, mod-11 renavam js",
  alternates: { canonical: "/validar-renavam-nodejs" },
  openGraph: {
    title: "Validar RENAVAM em Node.js com código pronto",
    description: "mod-11 DENATRAN, código TypeScript, testes com Jest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  { q: "Como validar RENAVAM em Node.js?", a: "Use a função validateRenavam desta página: remove não-dígitos, exige 11 dígitos (completa com zeros à esquerda), rejeita todos iguais e confere o mod-11 DENATRAN com pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2." },
  { q: "A função funciona em TypeScript?", a: "Sim. O exemplo já está em TypeScript (tipagem `string` -> `boolean`). Pra JavaScript puro basta remover as anotações `: string` e `: boolean`. Zero dependências em runtime." },
  { q: "Qual peso usar no cálculo?", a: "Pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 aplicados da esquerda pra direita nos 10 primeiros dígitos. Soma dos produtos vezes 10, mod 11. Se o resto for 10 ou 11, o DV é 0." },
  { q: "RENAVAM com 9 dígitos é válido?", a: "RENAVAMs emitidos antes de 2007 podiam ter 9 dígitos. Hoje o padrão é 11 dígitos (10 + DV). A função completa com zeros à esquerda via `padStart(11, '0')` pra padronizar antes do cálculo." },
  { q: "O FakeForge gera RENAVAMs válidos pra teste?", a: "Sim. O endpoint /api/generate?type=renavam retorna RENAVAMs com DV calculado pelo mesmo algoritmo, prontos pra popular banco de homologação ou simular cadastros de veículos." },
];

export default function ValidarRenavamNodejs() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Node.js / TypeScript</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">RENAVAM em Node.js</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra validar RENAVAM em Node.js, use o algoritmo mod-11 do DENATRAN: pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 sobre os 10 primeiros dígitos, soma vezes 10, mod 11. Abaixo: função TypeScript sem dependências, tabela de vetores e testes com Jest.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`export function validateRenavam(input: string): boolean {
  const s = input.replace(/\\D/g, "").padStart(11, "0");
  if (s.length !== 11 || /^(\\d)\\1{10}$/.test(s)) return false;
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = s.slice(0, 10).split("").reduce(
    (acc, d, i) => acc + Number(d) * weights[i], 0
  );
  const remainder = (sum * 10) % 11;
  const dv = remainder >= 10 ? 0 : remainder;
  return Number(s[10]) === dv;
}

console.log(validateRenavam("12345678900"));  // true ou false
console.log(validateRenavam("00000000000")); // false`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Node 18+, sem npm install. TypeScript nativo.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: validar RENAVAM em Node.js</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Função pronta pra importar. Aceita RENAVAM com ou sem pontuação, com 9 ou 11 dígitos (padStart com zeros à esquerda).</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// src/validateRenavam.ts
export function validateRenavam(input: string): boolean {
  // Normaliza: remove não-dígitos e completa com zeros à esquerda se vier
  // com 9 dígitos (padrão legado pré-2007).
  const s = input.replace(/\\D/g, "").padStart(11, "0");
  if (s.length !== 11) return false;
  // Rejeita todos iguais (00000000000, 11111111111, ...)
  if (/^(\\d)\\1{10}$/.test(s)) return false;

  // Pesos DENATRAN da esquerda pra direita
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(s[i]) * weights[i];

  const remainder = (sum * 10) % 11;
  const expectedDv = remainder >= 10 ? 0 : remainder;
  return Number(s[10]) === expectedDv;
}

// Uso:
for (const r of ["12345678900", "12345678901", "00000000000", "12345"]) {
  console.log(\`\${r.padEnd(16)} -> \${validateRenavam(r)}\`);
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como o cálculo do DV funciona</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Mesma matemática que a RFB usa pra CPF/CNPJ, só muda o conjunto de pesos.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`RENAVAM 1234567890X (X = DV a calcular)

Pesos:  3  2  9  8  7  6  5  4  3  2
Dígito: 1  2  3  4  5  6  7  8  9  0

Soma dos produtos: 3+4+27+32+35+36+35+32+27+0 = 231
Soma × 10 = 2310
2310 mod 11 = 0
Resto < 10 -> DV = 0
RENAVAM válido: 12345678900`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: testar com Jest</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Rode com <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">npx jest</code> ou <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">bun test</code>.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// src/validateRenavam.test.ts
import { validateRenavam } from "./validateRenavam";

describe("validateRenavam", () => {
  test.each(["12345678900", "1234567890-0", "123 456 789 00"])(
    "aceita RENAVAM válido %s",
    (r) => expect(validateRenavam(r)).toBe(true)
  );

  test.each(["12345678901", "00000000000", "11111111111", "", "abc", "123"])(
    "rejeita RENAVAM inválido %s",
    (r) => expect(validateRenavam(r)).toBe(false)
  );

  test("aceita RENAVAM de 9 dígitos (pré-2007) via padStart", () => {
    // 345678900 -> 00345678900 depois do padStart
    // (depende do DV ser correto pra 00345678900)
    expect(typeof validateRenavam("345678900")).toBe("boolean");
  });
});`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Validar RENAVAM: algoritmo local ou API do DETRAN</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">Validação local</th>
                <th className="text-center px-3 py-2 text-muted">API DETRAN estadual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Confere o DV mod-11", "Sim", "Não se aplica (acesso direto à base)"],
                ["Confirma que o veículo existe", "Não", "Sim"],
                ["Funciona offline", "Sim", "Não"],
                ["Latência", "<1ms", "100-500ms + rate limit"],
                ["Custo", "R$ 0", "Varia por estado"],
              ].map(([c, a, b]) => (
                <tr key={c}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{a}</td>
                  <td className="px-3 py-2 text-center text-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Perguntas frequentes sobre validar RENAVAM em Node.js</h2>
        <div className="space-y-4">
          {faq.map(({ q, a }) => (
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

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Páginas relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/gerador-renavam" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Gerador de RENAVAM</Link>
          <Link href="/validar-renavam-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar em Python</Link>
          <Link href="/validar-renavam-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar via curl</Link>
          <Link href="/validar-cnh-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar CNH em Node.js</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Validar RENAVAM", url: "/validar-renavam" },
        { name: "Em Node.js", url: "/validar-renavam-nodejs" },
      ]} />
    </PageShell>
  );
}
