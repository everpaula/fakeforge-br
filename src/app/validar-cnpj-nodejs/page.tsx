import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNPJ em Node.js: mod-11 + alfanumérico 2026",
  description: "Como validar CNPJ em Node.js: mod-11 tradicional e alfanumérico (IN RFB 2.229/2024), código standalone, testes com Jest e API FakeForge.",
  keywords: "validar cnpj nodejs, validação de cnpj nodejs, validar cnpj alfanumérico nodejs, cnpj alfanumérico 2026, algoritmo cnpj nodejs, dígito verificador cnpj, mod-11 cnpj",
  alternates: { canonical: "/validar-cnpj-nodejs" },
  openGraph: {
    title: "Validar CNPJ em Node.js com código pronto",
    description: "Mod-11 + alfanumérico 2026. Código standalone, testes com Jest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CNPJ em Node.js?",
    "a": "Use a função validaCnpj desta página. Ela confere os dois dígitos verificadores pelo mod-11 e aceita o CNPJ tradicional e o alfanumérico. Com aceitaLetras: false, rejeita letras para sistemas legados. Sem dependências."
  },
  {
    "q": "Como funciona o cálculo do dígito verificador do CNPJ?",
    "a": "Cada caractere vira um valor (dígito mantém o valor, letra usa o código ASCII menos 48). Multiplica-se pelos pesos 5,4,3,2,9,8,7,6,5,4,3,2, soma-se e toma-se o resto por 11. Resto menor que 2 dá DV 0, senão DV é 11 menos o resto. O segundo DV usa 13 caracteres e os pesos 6,5,4,3,2,9,8,7,6,5,4,3,2."
  },
  {
    "q": "Como validar o CNPJ alfanumérico?",
    "a": "Com o mesmo mod-11, tratando letras de A a Z como 17 a 42. A regra vale desde 01/07/2026 pela IN RFB 2.229/2024. Os dois dígitos verificadores continuam numéricos, e os CNPJs numéricos antigos seguem válidos."
  },
  {
    "q": "CNPJ válido quer dizer que a empresa existe?",
    "a": "Não. A validação confere só os dígitos verificadores. Saber se o CNPJ está ativo e qual a situação cadastral exige consulta à Receita Federal."
  },
  {
    "q": "A API do FakeForge valida CNPJ?",
    "a": "Não. A API gera CNPJ tradicional (type=cnpj) e alfanumérico (type=cnpjAlfa), e a validação roda no seu código. Use os lotes gerados como casos positivos e troque o último dígito para casos negativos."
  }
];

export default function ValidarCnpjNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Node.js · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CNPJ em Node.js"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CNPJ em Node.js, recalcule os dois dígitos verificadores pelo mod-11 da Receita Federal, com pesos 5 a 2 e 9 a 2, tratando letras como ASCII menos 48."} {"Isso cobre o CNPJ tradicional e o alfanumérico, em vigor desde 01/07/2026 (IN RFB 2.229/2024). Abaixo: uma função ES6 sem dependências, testes automatizados e conferência com CNPJs gerados pela API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: Receita Federal. O CNPJ alfanumérico foi instituído pela Instrução Normativa RFB nº 2.229/2024, com vigência a partir de 01/07/2026."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`const PESOS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const dv = (base, pesos) => {
  const resto = [...base].reduce((acc, ch, i) => acc + (ch.charCodeAt(0) - 48) * pesos[i], 0) % 11;
  return resto < 2 ? 0 : 11 - resto; // letra A-Z vale 17 a 42
};

const validaCnpj = (cnpj) => {
  const c = cnpj.replace(/[./-]/g, '');
  if (!/^[0-9A-Z]{12}\\d{2}$/.test(c) || new Set(c).size === 1) return false;
  return Number(c[12]) === dv(c.slice(0, 12), PESOS) && Number(c[13]) === dv(c.slice(0, 13), [6, ...PESOS]);
};

console.log(validaCnpj('11.222.333/0001-81')); // true (tradicional)
console.log(validaCnpj('12.ABC.345/01DE-35')); // true (alfanumérico)
console.log(validaCnpj('11.222.333/0001-82')); // false`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Node 18+ (fetch nativo), sem npm install. Salve como .mjs e rode com node."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CNPJ em Node.js com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Uma função só para os dois formatos. O parâmetro de modo legado rejeita letras para sistemas que ainda não migraram para o CNPJ alfanumérico."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// validador-cnpj.mjs (ES modules, Node 18+, zero dependências)
import { fileURLToPath } from 'node:url';

const FORMATO_CNPJ = /^[0-9A-Z]{2}\\.?[0-9A-Z]{3}\\.?[0-9A-Z]{3}\\/?[0-9A-Z]{4}-?\\d{2}$/;
const PESOS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_2 = [6, ...PESOS_1]; // pesos deslocados para o 2º DV (13 posições)

function digito(base, pesos) {
  // '0'=0 ... '9'=9, 'A'=17 ... 'Z'=42 (código ASCII menos 48)
  const soma = [...base].reduce((acc, ch, i) => acc + (ch.charCodeAt(0) - 48) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

// aceitaLetras=true cobre o CNPJ alfanumérico (IN RFB 2.229/2024)
export function validaCnpj(cnpj, { aceitaLetras = true } = {}) {
  if (typeof cnpj !== 'string' || !FORMATO_CNPJ.test(cnpj.trim())) return false;
  const c = cnpj.trim().replace(/[./-]/g, '');
  if (!aceitaLetras && !/^\\d+$/.test(c)) return false;
  if (new Set(c).size === 1) return false; // 00.000.000/0000-00 passa na conta, mas é inválido
  return Number(c[12]) === digito(c.slice(0, 12), PESOS_1) && Number(c[13]) === digito(c.slice(0, 13), PESOS_2);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const cnpj of ['11.222.333/0001-81', '11222333000181', '12.ABC.345/01DE-35', '11.222.333/0001-82', '00.000.000/0000-00']) {
    console.log(cnpj.padEnd(22), validaCnpj(cnpj));
  }
  console.log('alfa bloqueado:', validaCnpj('12.ABC.345/01DE-35', { aceitaLetras: false }));
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador do CNPJ funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CNPJ 11.222.333/0001-81

1º DV: soma dos 12 caracteres × pesos 5,4,3,2,9,8,7,6,5,4,3,2 = 102
      102 mod 11 = 3  ->  resto < 2 dá 0, senão 11 - resto  ->  DV1 = 8
2º DV: soma dos 13 caracteres × pesos 6,5,4,3,2,9,8,7,6,5,4,3,2 = 120
      120 mod 11 = 10  ->  DV2 = 1

CNPJ alfanumérico 12.ABC.345/01DE-35

Valor de cada caractere = código ASCII - 48:  0-9 valem 0 a 9,  A=17, B=18, C=19 ... Z=42
Valores: [1, 2, 17, 18, 19, 3, 4, 5, 0, 1, 20, 21]
1º DV: soma = 459,  459 mod 11 = 8  ->  DV1 = 3
2º DV: soma = 424,  424 mod 11 = 6  ->  DV2 = 5`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: conferir o validador com CNPJs da API do FakeForge"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"A API do FakeForge gera CNPJ tradicional (type=cnpj) e alfanumérico (type=cnpjAlfa), mas não tem endpoint de validação. Use os lotes gerados como oráculo: todos precisam passar, e com o último dígito trocado precisam falhar."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// confere-cnpj-api.mjs (Node 18+). Salve o validador da Rota 1 como validador-cnpj.mjs
import { validaCnpj } from './validador-cnpj.mjs';

async function gera(tipo, qtd = 20) {
  const res = await fetch(\`https://fakeforge.com.br/api/generate?type=\${tipo}&quantity=\${qtd}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return (await res.json()).data;
}

const trocaUltimoDigito = (cnpj) => cnpj.slice(0, -1) + ((Number(cnpj.at(-1)) + 1) % 10);
let falhou = false;

for (const [tipo, aceitaLetras] of [['cnpj', false], ['cnpjAlfa', true]]) {
  const lote = await gera(tipo);
  const rejeitados = lote.filter((c) => !validaCnpj(c, { aceitaLetras }));
  const aceitos = lote.filter((c) => validaCnpj(trocaUltimoDigito(c), { aceitaLetras }));
  console.log(\`\${tipo}: \${lote.length} gerados | válidos rejeitados: \${rejeitados.length} | inválidos aceitos: \${aceitos.length}\`);
  if (rejeitados.length || aceitos.length) falhou = true;
}

if (falhou) process.exit(1);`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CNPJ com Jest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Com Jest em modo ESM. Os casos cobrem válidos, inválidos e as bordas de CNPJ."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// validador-cnpj.test.mjs (Jest)
import { validaCnpj } from './validador-cnpj.mjs';

const NUMERICOS = ['11.222.333/0001-81', '11222333000181', '11.444.777/0001-61'];
const ALFANUMERICOS = ['12.ABC.345/01DE-35', '12ABC34501DE35', 'A1.B2C.3D4/0001-93'];

describe('validaCnpj', () => {
  test.each([...NUMERICOS, ...ALFANUMERICOS])('aceita %s', (cnpj) => {
    expect(validaCnpj(cnpj)).toBe(true);
  });

  test.each([
    '11.222.333/0001-82', // DV errado
    '00.000.000/0000-00', // repetidos
    '11.222.333/0001-8', // curto demais
    '12.abc.345/01de-35', // minúsculas não existem no padrão
    '',
  ])('rejeita %p', (cnpj) => {
    expect(validaCnpj(cnpj)).toBe(false);
  });

  test.each(ALFANUMERICOS)('modo legado rejeita letras em %s', (cnpj) => {
    expect(validaCnpj(cnpj, { aceitaLetras: false })).toBe(false);
  });
});`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CNPJ: algoritmo local ou serviço externo"}</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">{"Algoritmo local"}</th>
                <th className="text-center px-3 py-2 text-muted">{"API FakeForge (geração)"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["Confere os dígitos verificadores", "Sim", "Não, a API só gera"], ["Cobre CNPJ alfanumérico", "Sim, com a função desta página", "Gera com type=cnpjAlfa"], ["Gera CNPJs válidos para teste", "Não", "Sim, até 10.000 por chamada"], ["Funciona offline", "Sim", "Não"], ["Confirma que a empresa existe", "Não", "Não"], ["Custo", "R$ 0", "Grátis até 50 chamadas por dia"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CNPJ em Node.js"}</h2>
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
          <Link href="/validar-cnpj" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Validar CNPJ online"}</Link>
          <Link href="/gerador-cnpj" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerador de CNPJ"}</Link>
          <Link href="/gerador-cnpj-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CNPJ em Node.js"}</Link>
          <Link href="/validar-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ em Python"}</Link>
          <Link href="/validar-cnpj-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ via curl"}</Link>
          <Link href="/gerador-cnpj-alfanumerico" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerador de CNPJ alfanumérico"}</Link>
          <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Checklist de migração 2026"}</Link>
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
        { name: "Validar CNPJ", url: "/validar-cnpj" },
        { name: "Node.js", url: "/validar-cnpj-nodejs" },
      ]} />
    </PageShell>
  );
}
