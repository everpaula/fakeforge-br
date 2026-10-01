import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNPJ via curl: mod-11 + alfanumérico 2026",
  description: "Como validar CNPJ via curl: mod-11 tradicional e alfanumérico (IN RFB 2.229/2024), código standalone, testes com Postman e API FakeForge.",
  keywords: "validar cnpj curl, validação de cnpj curl, validar cnpj alfanumérico curl, cnpj alfanumérico 2026, algoritmo cnpj curl, dígito verificador cnpj, mod-11 cnpj",
  alternates: { canonical: "/validar-cnpj-curl" },
  openGraph: {
    title: "Validar CNPJ via curl com código pronto",
    description: "Mod-11 + alfanumérico 2026. Código standalone, testes com Postman e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CNPJ via curl?",
    "a": "Carregue o arquivo com source validador-cnpj.sh e chame valida_cnpj 11.222.333/0001-81. Saída 0 é válido e 1 é inválido. O flag --so-numerico rejeita letras para sistemas legados. Precisa de bash 4.3 ou superior."
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

export default function ValidarCnpjCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"curl · bash · Postman"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CNPJ via curl"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CNPJ via curl, recalcule os dois dígitos verificadores pelo mod-11 da Receita Federal, com pesos 5 a 2 e 9 a 2, tratando letras como ASCII menos 48."} {"Isso cobre o CNPJ tradicional e o alfanumérico, em vigor desde 01/07/2026 (IN RFB 2.229/2024). Abaixo: uma função em bash puro, testes automatizados e conferência com CNPJs gerados pela API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: Receita Federal. O CNPJ alfanumérico foi instituído pela Instrução Normativa RFB nº 2.229/2024, com vigência a partir de 01/07/2026."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`valida_cnpj() {
  local c=\${1//[.\\/-]/} p1=(5 4 3 2 9 8 7 6 5 4 3 2) p2=(6 5 4 3 2 9 8 7 6 5 4 3 2) n k v soma r dv
  [[ $c =~ ^[0-9A-Z]{12}[0-9]{2}$ && -n \${c//\${c:0:1}/} ]] || return 1
  for n in 12 13; do
    soma=0
    for ((k = 0; k < n; k++)); do
      printf -v v '%d' "'\${c:k:1}"  # código ASCII: letra A = 65, menos 48 = 17
      if ((n == 12)); then soma=$((soma + (v - 48) * p1[k])); else soma=$((soma + (v - 48) * p2[k])); fi
    done
    r=$((soma % 11)); dv=$((r < 2 ? 0 : 11 - r))
    ((dv == \${c:n:1})) || return 1
  done
  return 0
}

valida_cnpj "11.222.333/0001-81" && echo "válido" || echo "inválido"
valida_cnpj "12.ABC.345/01DE-35" && echo "válido" || echo "inválido"
valida_cnpj "11.222.333/0001-82" && echo "válido" || echo "inválido"`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"bash 4+ (Linux, Git Bash, WSL). O macOS traz bash 3.2: instale um bash atual pelo Homebrew."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CNPJ via curl com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Uma função só para os dois formatos. O parâmetro de modo legado rejeita letras para sistemas que ainda não migraram para o CNPJ alfanumérico."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# validador-cnpj.sh: bash 4+, sem dependências. Use com source ou direto.
# valida_cnpj <cnpj> [--so-numerico]    Saída: 0 = válido, 1 = inválido

PESOS_1=(5 4 3 2 9 8 7 6 5 4 3 2)
PESOS_2=(6 5 4 3 2 9 8 7 6 5 4 3 2)  # deslocados para o 2º DV

_dv_cnpj() {  # $1 = base (12 ou 13 caracteres), $2 = nome do array de pesos
  local base=$1 k v soma=0 resto
  local -n pesos=$2
  for ((k = 0; k < \${#base}; k++)); do
    printf -v v '%d' "'\${base:k:1}"   # '0'=48 ... 'A'=65
    soma=$((soma + (v - 48) * pesos[k]))
  done
  resto=$((soma % 11))
  echo $((resto < 2 ? 0 : 11 - resto))
}

valida_cnpj() {
  local c=\${1//[.\\/-]/}
  [[ $1 =~ ^[0-9A-Z]{2}\\.?[0-9A-Z]{3}\\.?[0-9A-Z]{3}/?[0-9A-Z]{4}-?[0-9]{2}$ ]] || return 1
  [[ $2 == "--so-numerico" && ! $c =~ ^[0-9]+$ ]] && return 1
  [[ -z \${c//\${c:0:1}/} ]] && return 1  # 00.000.000/0000-00 passa na conta, mas é inválido
  [[ \${c:12:1} == "$(_dv_cnpj "\${c:0:12}" PESOS_1)" && \${c:13:1} == "$(_dv_cnpj "\${c:0:13}" PESOS_2)" ]]
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for cnpj in "11.222.333/0001-81" "11222333000181" "12.ABC.345/01DE-35" "11.222.333/0001-82" "00.000.000/0000-00"; do
    if valida_cnpj "$cnpj"; then echo "$cnpj -> válido"; else echo "$cnpj -> inválido"; fi
  done
  valida_cnpj "12.ABC.345/01DE-35" --so-numerico || echo "alfa bloqueado no modo legado"
fi`}</code></pre>
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
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# confere-cnpj-api.sh: salve o validador da Rota 1 como validador-cnpj.sh
source ./validador-cnpj.sh

falhas=0
for tipo in cnpj cnpjAlfa; do
  total=0
  while read -r cnpj; do
    total=$((total + 1))
    valida_cnpj "$cnpj" || { echo "válido rejeitado: $cnpj"; falhas=$((falhas + 1)); }
    errado="\${cnpj%?}$(( (\${cnpj: -1} + 1) % 10 ))"
    valida_cnpj "$errado" && { echo "inválido aceito: $errado"; falhas=$((falhas + 1)); }
  done < <(curl -s "https://fakeforge.com.br/api/generate?type=$tipo&quantity=20&formatted=false" \\
    | grep -oE '"[0-9A-Z]{14}"' | tr -d '"')
  echo "$tipo: $total CNPJs conferidos"
  (( total > 0 )) || falhas=$((falhas + 1))
done

echo "falhas: $falhas"
(( falhas == 0 ))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar CNPJ no Postman"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Cole o script na aba Tests do request. O Postman roda a mesma validação sobre a resposta e marca cada caso como passou ou falhou."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Postman > aba Tests do request:
// GET https://fakeforge.com.br/api/generate?type=cnpjAlfa&quantity=20

const PESOS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const dv = (base, pesos) => {
  const resto = [...base].reduce((acc, ch, i) => acc + (ch.charCodeAt(0) - 48) * pesos[i], 0) % 11;
  return resto < 2 ? 0 : 11 - resto;
};
function validaCnpj(cnpj) {
  const c = cnpj.replace(/[./-]/g, '');
  if (!/^[0-9A-Z]{12}\\d{2}$/.test(c) || new Set(c).size === 1) return false;
  return Number(c[12]) === dv(c.slice(0, 12), PESOS) && Number(c[13]) === dv(c.slice(0, 13), [6, ...PESOS]);
}

pm.test('status 200', () => pm.response.to.have.status(200));

pm.test('todos os CNPJs alfanuméricos passam no mod-11', () => {
  const { data } = pm.response.json();
  pm.expect(data).to.have.lengthOf(20);
  data.forEach((cnpj) => pm.expect(validaCnpj(cnpj), cnpj).to.be.true);
});

pm.test('validador rejeita CNPJ com DV trocado', () => {
  const [cnpj] = pm.response.json().data;
  const errado = cnpj.slice(0, -1) + ((Number(cnpj.slice(-1)) + 1) % 10);
  pm.expect(validaCnpj(errado)).to.be.false;
});
// Para o CNPJ tradicional, use type=cnpj. Para validar a SUA API: pm.response.json().empresa.cnpj`}</code></pre>
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CNPJ via curl"}</h2>
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
          <Link href="/gerador-cnpj-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CNPJ via curl"}</Link>
          <Link href="/validar-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ em Python"}</Link>
          <Link href="/validar-cnpj-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ em Node.js"}</Link>
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
        { name: "curl e bash", url: "/validar-cnpj-curl" },
      ]} />
    </PageShell>
  );
}
