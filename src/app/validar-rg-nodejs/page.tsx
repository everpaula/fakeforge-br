import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar RG em Node.js: mod-11 formato SP",
  description: "Como validar RG em Node.js: mod-11 do formato de São Paulo, dígito X, código standalone e testes com Jest. Sem dependências.",
  keywords: "validar rg nodejs, validação de rg nodejs, verificar rg nodejs, algoritmo rg sp nodejs, dígito verificador rg, rg mod-11, rg com x",
  alternates: { canonical: "/validar-rg-nodejs" },
  openGraph: {
    title: "Validar RG em Node.js com código pronto",
    description: "Mod-11 formato SP. Código standalone, testes com Jest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar RG em Node.js?",
    "a": "Use a função validaRg desta página: ela remove a pontuação, exige 8 dígitos mais o verificador (0 a 9 ou X) e confere o mod-11 com pesos 2 a 9. Vale para o formato de São Paulo. Sem dependências."
  },
  {
    "q": "Existe algoritmo oficial para validar RG?",
    "a": "Não há regra federal única. Cada estado emissor definiu o seu formato, e o RG de São Paulo usa mod-11 com pesos de 2 a 9. A Carteira de Identidade Nacional (Decreto 10.977/2022) passa a usar o CPF como número único."
  },
  {
    "q": "Como calcular o dígito verificador do RG de SP?",
    "a": "Multiplique os 8 primeiros dígitos por pesos de 2 a 9, some, tome o resto por 11 e calcule (11 menos o resto) mod 11. Resultado 10 é escrito como X."
  },
  {
    "q": "Por que o RG pode terminar em X?",
    "a": "O X representa o valor 10 do dígito verificador, que não cabe em um algarismo. Um validador precisa aceitar X e x, e nunca deve aceitar X nas 8 primeiras posições."
  },
  {
    "q": "A API do FakeForge valida RG?",
    "a": "Não. A API não tem endpoint de validação, e a validação roda no seu código. A função desta página cobre o formato de São Paulo. RGs de outros estados têm regras próprias."
  }
];

export default function ValidarRgNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Node.js · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"RG em Node.js"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar RG em Node.js, use o mod-11 do formato de São Paulo: pesos 2 a 9 sobre os 8 primeiros dígitos, com dígito verificador que pode ser X."} {"Não existe regra federal única para o RG: outros estados usam formatos próprios, e a nova CIN adota o CPF como número. Abaixo: uma função ES6 sem dependências, vetores de teste e testes automatizados."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: regra de dígito verificador usada no RG de São Paulo. Não há norma federal única; a CIN (Decreto 10.977/2022) usa o CPF como número."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`const validaRg = (rg) => {
  const s = rg.toUpperCase().replace(/[^0-9X]/g, '');
  if (!/^\\d{8}[0-9X]$/.test(s) || new Set(s).size === 1) return false;
  const soma = [...s.slice(0, 8)].reduce((acc, n, i) => acc + Number(n) * (i + 2), 0);
  const dv = (11 - (soma % 11)) % 11;
  return s[8] === (dv === 10 ? 'X' : String(dv));
};

console.log(validaRg('12.345.678-2')); // true
console.log(validaRg('10.000.006-X')); // true (DV X = 10)
console.log(validaRg('12.345.678-3')); // false`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Node 18+ (fetch nativo), sem npm install. Salve como .mjs e rode com node."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar RG em Node.js com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Regra do RG de São Paulo, o formato mais aceito em formulários nacionais. Aceita pontuação, o X em maiúsculo ou minúsculo e rejeita dígitos repetidos."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// validador-rg.mjs (ES modules, Node 18+, zero dependências). Regra do RG de São Paulo.
import { fileURLToPath } from 'node:url';

/** mod-11 com pesos 2 a 9 sobre 8 dígitos. O DV pode ser X (valor 10). */
export function validaRg(rg) {
  const s = String(rg).replace(/[.\\-\\s]/g, '').toUpperCase();
  if (!/^\\d{8}[0-9X]$/.test(s) || new Set(s).size === 1) return false;
  const soma = [...s.slice(0, 8)].reduce((acc, n, i) => acc + Number(n) * (i + 2), 0);
  const dv = (11 - (soma % 11)) % 11; // resto 0 e resto 1 caem em DV 0 e DV X
  const esperado = dv === 10 ? 'X' : String(dv);
  return s[8] === esperado;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const rg of ['12.345.678-2', '12345678-2', '10.000.006-X', '10.000.006-x', '12.345.678-3', '11.111.111-1', '123']) {
    console.log(rg.padEnd(14), validaRg(rg));
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador do RG funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`RG 12.345.678-2
1×2 + 2×3 + 3×4 + 4×5 + 5×6 + 6×7 + 7×8 + 8×9
= 240
240 mod 11 = 9  ->  (11 - 9) mod 11 = 2  ->  DV = 2

RG 10.000.006-X
1×2 + 0×3 + 0×4 + 0×5 + 0×6 + 0×7 + 0×8 + 6×9
= 56
56 mod 11 = 1  ->  (11 - 1) mod 11 = 10  ->  DV = X (10 vira X)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: testar o validador com vetores conhecidos"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Como cada estado tem a sua regra, o teste mais confiável é uma tabela de casos fixos: um por resto possível, incluindo o caso do X, mais os inválidos. Se mudar a regra, você muda a tabela."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// vetores-rg.mjs: tabela de casos conhecidos. Salve a Rota 1 como validador-rg.mjs
import { validaRg } from './validador-rg.mjs';

// [RG, esperado, por quê]
const VETORES = [
  ['12.345.678-2', true, 'resto 9, DV 2'],
  ['34.567.890-4', true, 'resto 7, DV 4'],
  ['50.000.000-1', true, 'resto 10, DV 1'],
  ['24.680.135-9', true, 'resto 2, DV 9'],
  ['10.000.006-X', true, 'resto 1, DV 10 vira X'],
  ['12.345.678-3', false, 'DV errado'],
  ['10.000.006-0', false, 'deveria ser X'],
  ['11.111.111-1', false, 'dígitos repetidos'],
  ['12.345.678', false, 'sem DV'],
];

const falhas = VETORES.filter(([rg, esperado]) => validaRg(rg) !== esperado);
for (const [rg, , porQue] of falhas) console.log(\`FALHOU: \${rg} (\${porQue})\`);
console.log(\`\${VETORES.length - falhas.length}/\${VETORES.length} vetores ok\`);
if (falhas.length) process.exit(1);`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de RG com Jest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Com Jest em modo ESM. Os casos cobrem válidos, inválidos e as bordas de RG."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// validador-rg.test.mjs (Jest)
import { validaRg } from './validador-rg.mjs';

describe('validaRg (formato SP)', () => {
  test.each(['12.345.678-2', '12345678-2', '123456782', '34.567.890-4', '50.000.000-1'])('aceita %s', (rg) => {
    expect(validaRg(rg)).toBe(true);
  });

  test.each(['10.000.006-X', '10.000.006-x', '10000006X'])('DV X representa 10: %s', (rg) => {
    expect(validaRg(rg)).toBe(true);
  });

  test.each(['12.345.678-3', '10.000.006-0', '11.111.111-1', '12.345.678', 'X2.345.678-2', ''])('rejeita %p', (rg) => {
    expect(validaRg(rg)).toBe(false);
  });
});`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar RG: algoritmo local ou serviço externo"}</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">{"Validação local"}</th>
                <th className="text-center px-3 py-2 text-muted">{"Consulta ao órgão emissor"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["Confere o dígito verificador", "Sim, regra de SP", "Não se aplica"], ["Cobre todos os estados", "Não, só o formato SP", "Sim, cada estado no seu instituto"], ["Confirma que o RG foi emitido", "Não", "Sim"], ["Funciona offline", "Sim", "Não"], ["API pública disponível", "Não precisa", "Varia por estado"], ["Custo", "R$ 0", "Varia por estado"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar RG em Node.js"}</h2>
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
          <Link href="/gerador-rg" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Gerador de RG"}</Link>
          <Link href="/gerador-rg-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar RG em Node.js"}</Link>
          <Link href="/validar-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar RG em Python"}</Link>
          <Link href="/validar-rg-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar RG via curl"}</Link>
          <Link href="/gerador-cin" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerador de CIN"}</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Docs da API"}</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador RG", url: "/gerador-rg" },
        { name: "Node.js", url: "/validar-rg-nodejs" },
      ]} />
    </PageShell>
  );
}
