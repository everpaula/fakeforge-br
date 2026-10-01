import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CEP em Node.js: formato + consulta ViaCEP",
  description: "Como validar CEP em Node.js: regex de formato e consulta de existência no ViaCEP, código standalone e testes com Jest. Sem dependências.",
  keywords: "validar cep nodejs, validação de cep nodejs, verificar cep nodejs, cep existe nodejs, viacep nodejs, regex cep, consultar cep nodejs",
  alternates: { canonical: "/validar-cep-nodejs" },
  openGraph: {
    title: "Validar CEP em Node.js com código pronto",
    description: "Formato + ViaCEP. Código standalone, testes com Jest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CEP em Node.js?",
    "a": "Valide o formato com a regex /^\\d{5}-?\\d{3}$/ e depois consulte https://viacep.com.br/ws/{cep}/json/ com fetch. Resposta com o campo erro significa CEP inexistente. Sem dependências no Node 18+."
  },
  {
    "q": "CEP tem dígito verificador?",
    "a": "Não. O CEP tem 8 dígitos, escritos como 5 + hífen + 3, e nenhum deles é verificador. Validar um CEP significa checar o formato e depois confirmar a existência numa base, como o ViaCEP."
  },
  {
    "q": "Como checar se um CEP existe?",
    "a": "Consulte GET https://viacep.com.br/ws/{cep}/json/ com os 8 dígitos. Resposta 200 com dados significa que existe. Resposta 200 com o campo erro significa formato certo e CEP inexistente. HTTP 400 significa formato inválido."
  },
  {
    "q": "O CEP 00000-000 é válido?",
    "a": "No formato, sim: são 8 dígitos. Na existência, não: o ViaCEP devolve erro. É o exemplo clássico de por que só a regex não basta."
  },
  {
    "q": "A API do FakeForge valida CEP?",
    "a": "Não. A API gera CEPs com prefixo de região coerente (type=cep), mas não garante que cada um exista na base dos Correios. Para confirmar existência, use o ViaCEP ou a página /buscar-cep."
  }
];

export default function ValidarCepNodejs() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Node.js · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CEP em Node.js"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CEP em Node.js, confira o formato de 8 dígitos com hífen opcional e consulte o ViaCEP, porque o CEP não tem dígito verificador."} {"Formato correto não garante que o CEP existe: 00000-000 passa na regex e não está na base dos Correios. Abaixo: uma função ES6 sem dependências para o formato, a consulta de existência e testes sem depender de rede."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: estrutura do CEP definida pelos Correios. A consulta de existência usa o ViaCEP, serviço público e gratuito."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`const cep = '01310-100';
if (!/^\\d{5}-?\\d{3}$/.test(cep)) throw new Error('formato inválido');

const res = await fetch(\`https://viacep.com.br/ws/\${cep.replace('-', '')}/json/\`);
const dados = await res.json();

console.log(dados.erro ? 'não existe' : \`\${dados.logradouro}, \${dados.localidade}/\${dados.uf}\`);`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Node 18+ (fetch nativo), sem npm install. Salve como .mjs e rode com node."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar o formato do CEP em Node.js"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Validação offline, instantânea e sem rede. Serve para barrar erro de digitação no formulário antes de qualquer consulta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// validador-cep.mjs: formato (offline, Node 18+, zero dependências)
import { fileURLToPath } from 'node:url';

const FORMATO_CEP = /^\\d{5}-?\\d{3}$/;

/** 8 dígitos, hífen opcional depois do quinto. Não confirma que o CEP existe. */
export function cepFormatoValido(cep) {
  return typeof cep === 'string' && FORMATO_CEP.test(cep.trim());
}

/** '01310-100' -> '01310100'. Lança erro se o formato for inválido. */
export function normalizaCep(cep) {
  if (!cepFormatoValido(cep)) throw new Error(\`CEP com formato inválido: \${cep}\`);
  return cep.trim().replace('-', '');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const cep of ['01310-100', '01310100', '1310-100', '01310-10', 'abcde-fgh']) {
    console.log(cep.padEnd(12), cepFormatoValido(cep));
  }
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o CEP é estruturado (e por que não existe dígito verificador)"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CEP 01310-100

0 1 3 1 0 - 1 0 0
| | | | |   +-- 3 últimos dígitos: sufixo de distribuição (identifica o logradouro ou a unidade)
| | | | +-- 5º dígito: subdivisor de subsetor
| | | +-- 4º dígito: subsetor
| | +-- 3º dígito: setor
| +-- 2º dígito: subregião
+-- 1º dígito: região postal (0 = Grande São Paulo)

Não há dígito verificador: nenhuma conta prova que o CEP existe.
Só a consulta à base (ViaCEP) confirma.`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: confirmar que o CEP existe com o ViaCEP"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"O ViaCEP responde 400 quando o formato é inválido e 200 com o campo erro quando o formato está certo mas o CEP não existe. O código abaixo trata os dois casos e deixa falha de rede propagar, sem confundir queda de serviço com CEP inexistente."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// existencia-cep.mjs: consulta ViaCEP (Node 18+). Salve a Rota 1 como validador-cep.mjs
import { fileURLToPath } from 'node:url';
import { cepFormatoValido, normalizaCep } from './validador-cep.mjs';

/** true se o CEP existe na base do ViaCEP. Erros de rede e 5xx viram exceção. */
export async function cepExiste(cep) {
  if (!cepFormatoValido(cep)) return false;
  const res = await fetch(\`https://viacep.com.br/ws/\${normalizaCep(cep)}/json/\`, {
    signal: AbortSignal.timeout(5000),
  });
  if (res.status === 400) return false; // ViaCEP responde 400 quando o formato é inválido
  if (!res.ok) throw new Error(\`ViaCEP respondeu \${res.status}\`);
  const dados = await res.json();
  return !dados.erro; // CEP inexistente: 200 com { erro: "true" }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(await cepExiste('01310-100')); // true (Av. Paulista, São Paulo)
  console.log(await cepExiste('99999-999')); // false (formato ok, não existe)
  console.log(await cepExiste('1234')); // false (formato inválido, nem consulta)
}`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CEP com Jest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Com Jest em modo ESM. Os testes trocam o "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"fetch"}</code>{" por um dublê, então rodam em CI sem acessar a internet."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// existencia-cep.test.mjs (Jest, sem rede: fetch é trocado por um dublê)
import { cepFormatoValido, normalizaCep } from './validador-cep.mjs';
import { cepExiste } from './existencia-cep.mjs';

describe('formato', () => {
  test.each(['01310-100', '01310100', ' 01310-100 '])('aceita %p', (cep) => {
    expect(cepFormatoValido(cep)).toBe(true);
  });

  test.each(['1310-100', '01310-10', '013101000', 'abcde-fgh', '', '01310--100'])('rejeita %p', (cep) => {
    expect(cepFormatoValido(cep)).toBe(false);
  });

  test('normaliza', () => {
    expect(normalizaCep('01310-100')).toBe('01310100');
    expect(() => normalizaCep('123')).toThrow();
  });
});

describe('existência (ViaCEP mockado)', () => {
  const fetchOriginal = globalThis.fetch;
  afterEach(() => { globalThis.fetch = fetchOriginal; });

  const resposta = (status, corpo) => async () => ({ status, ok: status < 400, json: async () => corpo });

  test('CEP existente', async () => {
    globalThis.fetch = resposta(200, { cep: '01310-100', uf: 'SP' });
    await expect(cepExiste('01310-100')).resolves.toBe(true);
  });

  test('CEP inexistente', async () => {
    globalThis.fetch = resposta(200, { erro: 'true' });
    await expect(cepExiste('99999-999')).resolves.toBe(false);
  });

  test('formato inválido nem consulta', async () => {
    globalThis.fetch = () => { throw new Error('consultou a rede com CEP inválido'); };
    await expect(cepExiste('123')).resolves.toBe(false);
  });
});`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CEP: algoritmo local ou serviço externo"}</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">{"Regex local"}</th>
                <th className="text-center px-3 py-2 text-muted">{"Consulta ao ViaCEP"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[["Confere o formato de 8 dígitos", "Sim", "Sim, responde 400"], ["Confirma que o CEP existe", "Não", "Sim"], ["Devolve logradouro, bairro, cidade e UF", "Não", "Sim"], ["Funciona offline", "Sim", "Não"], ["Latência", "Desprezível", "Depende da rede"], ["Custo", "R$ 0", "Gratuito"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CEP em Node.js"}</h2>
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
          <Link href="/gerador-cep" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Gerador de CEP"}</Link>
          <Link href="/gerador-cep-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CEP em Node.js"}</Link>
          <Link href="/validar-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CEP em Python"}</Link>
          <Link href="/validar-cep-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CEP via curl"}</Link>
          <Link href="/buscar-cep" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Buscar CEP (consulta real)"}</Link>
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
        { name: "Gerador CEP", url: "/gerador-cep" },
        { name: "Node.js", url: "/validar-cep-nodejs" },
      ]} />
    </PageShell>
  );
}
