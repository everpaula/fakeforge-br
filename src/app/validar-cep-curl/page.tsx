import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CEP via curl: formato + consulta ViaCEP",
  description: "Como validar CEP via curl: regex de formato e consulta de existência no ViaCEP, código standalone e testes com Postman. Sem dependências.",
  keywords: "validar cep curl, validação de cep curl, verificar cep curl, cep existe curl, viacep curl, regex cep, consultar cep curl",
  alternates: { canonical: "/validar-cep-curl" },
  openGraph: {
    title: "Validar CEP via curl com código pronto",
    description: "Formato + ViaCEP. Código standalone, testes com Postman e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CEP via curl?",
    "a": "Rode curl -s https://viacep.com.br/ws/01310100/json/. Se o JSON trouxer o campo erro, o CEP não existe. Um HTTP 400 indica formato inválido. A função cep_existe desta página já traduz isso em código de saída."
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

export default function ValidarCepCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"curl · bash · Postman"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CEP via curl"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CEP via curl, confira o formato de 8 dígitos com hífen opcional e consulte o ViaCEP, porque o CEP não tem dígito verificador."} {"Formato correto não garante que o CEP existe: 00000-000 passa na regex e não está na base dos Correios. Abaixo: uma função em bash puro para o formato, a consulta de existência e testes sem depender de rede."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: estrutura do CEP definida pelos Correios. A consulta de existência usa o ViaCEP, serviço público e gratuito."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# Existe? 200 com dados = sim | 200 com "erro" = formato ok, CEP inexistente | 400 = formato inválido
curl -s "https://viacep.com.br/ws/01310100/json/"
curl -s "https://viacep.com.br/ws/99999999/json/"            # {"erro": "true"}
curl -s -o /dev/null -w "%{http_code}\\n" "https://viacep.com.br/ws/1234/json/"   # 400`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"bash 4+ (Linux, Git Bash, WSL). O macOS traz bash 3.2: instale um bash atual pelo Homebrew."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar o formato do CEP via curl"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Validação offline, instantânea e sem rede. Serve para barrar erro de digitação no formulário antes de qualquer consulta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# validador-cep.sh: formato (offline, bash 4+). Use com source ou direto.
# Saída: 0 = formato válido, 1 = inválido

cep_formato_valido() {
  [[ $1 =~ ^[0-9]{5}-?[0-9]{3}$ ]]
}

normaliza_cep() {  # '01310-100' -> '01310100'
  cep_formato_valido "$1" || { echo "CEP com formato inválido: $1" >&2; return 1; }
  echo "\${1//-/}"
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for cep in "01310-100" "01310100" "1310-100" "01310-10" "abcde-fgh"; do
    if cep_formato_valido "$cep"; then echo "$cep -> formato ok"; else echo "$cep -> formato inválido"; fi
  done
fi`}</code></pre>
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
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# existencia-cep.sh: consulta ViaCEP. Salve a Rota 1 como validador-cep.sh
source ./validador-cep.sh

# Saída: 0 = existe, 1 = não existe ou formato inválido, 2 = falha de rede
cep_existe() {
  cep_formato_valido "$1" || return 1
  local resp
  resp=$(curl -s --max-time 5 "https://viacep.com.br/ws/$(normaliza_cep "$1")/json/") || return 2
  [[ -n $resp && $resp != *'"erro"'* ]]
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for cep in "01310-100" "99999-999" "1234"; do
    cep_existe "$cep"; status=$?
    case $status in
      0) echo "$cep -> existe" ;;
      1) echo "$cep -> não existe / formato inválido" ;;
      *) echo "$cep -> falha de rede" ;;
    esac
  done
fi`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar CEP no Postman"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Cole o script na aba Tests do request. O Postman roda a mesma validação sobre a resposta e marca cada caso como passou ou falhou."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Postman > aba Tests do request:
// GET https://viacep.com.br/ws/{{cep}}/json/     (variável de ambiente cep = 01310100)

pm.test('status 200', () => pm.response.to.have.status(200));

pm.test('CEP existe (sem campo erro)', () => {
  const dados = pm.response.json();
  pm.expect(dados.erro, 'ViaCEP marcou o CEP como inexistente').to.be.undefined;
});

pm.test('resposta tem endereço coerente', () => {
  const dados = pm.response.json();
  pm.expect(dados.cep).to.match(/^\\d{5}-\\d{3}$/);
  pm.expect(dados.uf).to.have.lengthOf(2);
  pm.expect(dados.localidade).to.be.a('string').and.not.empty;
});

// Para o caso negativo, crie outro request com cep = 99999999 e troque o teste por:
// pm.expect(pm.response.json().erro).to.exist;`}</code></pre>
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CEP via curl"}</h2>
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
          <Link href="/gerador-cep-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CEP via curl"}</Link>
          <Link href="/validar-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CEP em Python"}</Link>
          <Link href="/validar-cep-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CEP em Node.js"}</Link>
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
        { name: "curl e bash", url: "/validar-cep-curl" },
      ]} />
    </PageShell>
  );
}
