import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CPF via curl: mod-11 com código pronto",
  description: "Como validar CPF via curl: mod-11 da Receita Federal com código que roda standalone, testes com Postman e conferência com a API FakeForge.",
  keywords: "validar cpf curl, validação de cpf curl, verificar cpf curl, algoritmo cpf curl, mod-11 cpf, dígito verificador cpf, cpf válido curl",
  alternates: { canonical: "/validar-cpf-curl" },
  openGraph: {
    title: "Validar CPF via curl com código pronto",
    description: "Mod-11 Receita Federal. Código standalone, testes com Postman e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CPF via curl?",
    "a": "Carregue o arquivo com source validador-cpf.sh e chame valida_cpf 529.982.247-25. O código de saída 0 significa válido e 1 inválido, então funciona direto em if e em pipelines de CI. Precisa de bash 4 ou superior."
  },
  {
    "q": "Como funciona o cálculo dos dígitos verificadores do CPF?",
    "a": "Os 9 primeiros dígitos são multiplicados por pesos de 10 a 2, somados, o total é multiplicado por 10 e se toma o resto da divisão por 11. Resto 10 vira 0. O segundo dígito repete a conta com 10 dígitos e pesos de 11 a 2."
  },
  {
    "q": "CPF válido quer dizer que o CPF existe?",
    "a": "Não. A validação confere só a matemática dos dígitos verificadores. Saber se o CPF está regular exige consulta à Receita Federal, que não cabe num validador de formulário."
  },
  {
    "q": "Por que 111.111.111-11 é inválido se a conta bate?",
    "a": "Sequências de um dígito repetido passam no cálculo mod-11, mas a Receita Federal não emite esses números. Todo validador deve rejeitar os 10 casos, de 000.000.000-00 a 999.999.999-99."
  },
  {
    "q": "A API do FakeForge valida CPF?",
    "a": "Não. A API gera CPFs válidos com GET /api/generate?type=cpf, e a validação roda no seu código. Use os CPFs gerados como casos positivos e troque o último dígito para obter casos negativos."
  }
];

export default function ValidarCpfCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"curl · bash · Postman"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CPF via curl"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CPF via curl, exija 11 dígitos e recalcule os dois dígitos verificadores pelo mod-11 da Receita Federal, com pesos 10 a 2 e 11 a 2."} {"CPFs com todos os dígitos iguais são rejeitados mesmo quando a conta bate. A validação confirma só a matemática, não se o CPF está ativo. Abaixo: uma função em bash puro, teste automatizado e conferência com CPFs gerados pela API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: algoritmo de dígito verificador do CPF, definido pela Receita Federal."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`valida_cpf() {
  local d=\${1//[^0-9]/} i k soma dv
  [[ \${#d} -eq 11 && -n \${d//\${d:0:1}/} ]] || return 1
  for i in 9 10; do
    soma=0
    for ((k = 0; k < i; k++)); do soma=$((soma + \${d:k:1} * (i + 1 - k))); done
    dv=$(( (soma * 10 % 11) % 10 ))
    (( dv == \${d:i:1} )) || return 1
  done
  return 0
}

valida_cpf "529.982.247-25" && echo "válido" || echo "inválido"
valida_cpf "529.982.247-26" && echo "válido" || echo "inválido"`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"bash 4+ (Linux, Git Bash, WSL). O macOS traz bash 3.2: instale um bash atual pelo Homebrew."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CPF via curl com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Versão completa, pronta pra colar no projeto. Aceita CPF com ou sem pontuação, rejeita caracteres estranhos e as 10 sequências repetidas."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# validador-cpf.sh: bash 4+, sem dependências. Use com source ou direto.
# Código de saída: 0 = válido, 1 = inválido

_dv_cpf() {  # $1 = dígitos da base (9 ou 10). Imprime o DV
  local base=$1 k soma=0 resto
  for ((k = 0; k < \${#base}; k++)); do
    soma=$((soma + \${base:k:1} * (\${#base} + 1 - k)))
  done
  resto=$(( (soma * 10) % 11 ))
  echo $(( resto == 10 ? 0 : resto ))
}

valida_cpf() {
  [[ $1 =~ ^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$ ]] || return 1
  local d=\${1//[^0-9]/}
  [[ -z \${d//\${d:0:1}/} ]] && return 1  # 111.111.111-11 passa na conta, mas é inválido
  [[ \${d:9:1} == "$(_dv_cpf "\${d:0:9}")" && \${d:10:1} == "$(_dv_cpf "\${d:0:10}")" ]]
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for cpf in "529.982.247-25" "52998224725" "529.982.247-26" "111.111.111-11" "abc"; do
    if valida_cpf "$cpf"; then echo "$cpf -> válido"; else echo "$cpf -> inválido"; fi
  done
fi`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador do CPF funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CPF 529.982.247-25

1º DV: 5×10 + 2×9 + 9×8 + 9×7 + 8×6 + 2×5 + 2×4 + 4×3 + 7×2
      = 295
      (295 × 10) mod 11 = 2  ->  DV1 = 2  (resto 10 viraria 0)

2º DV: 5×11 + 2×10 + 9×9 + 9×8 + 8×7 + 2×6 + 2×5 + 4×4 + 7×3 + 2×2
      = 347
      (347 × 10) mod 11 = 5  ->  DV2 = 5

Resultado: 529.982.247-25`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: conferir o validador com CPFs da API do FakeForge"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"A API do FakeForge gera CPFs válidos, mas não tem endpoint de validação. O uso útil é como oráculo de teste: todo CPF gerado precisa passar no seu validador, e o mesmo CPF com o último dígito trocado precisa falhar."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# confere-cpf-api.sh: salve o validador da Rota 1 como validador-cpf.sh
source ./validador-cpf.sh

rejeitados=0 aceitos=0 total=0
while read -r cpf; do
  total=$((total + 1))
  valida_cpf "$cpf" || { echo "válido rejeitado: $cpf"; rejeitados=$((rejeitados + 1)); }
  errado="\${cpf%?}$(( (\${cpf: -1} + 1) % 10 ))"
  valida_cpf "$errado" && { echo "inválido aceito: $errado"; aceitos=$((aceitos + 1)); }
done < <(curl -s "https://fakeforge.com.br/api/generate?type=cpf&quantity=20&formatted=false" \\
  | grep -oE '"[0-9]{11}"' | tr -d '"')

echo "$total CPFs da API | válidos rejeitados: $rejeitados | inválidos aceitos: $aceitos"
(( total > 0 && rejeitados == 0 && aceitos == 0 ))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar CPF no Postman"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Cole o script na aba Tests do request. O Postman roda a mesma validação sobre a resposta e marca cada caso como passou ou falhou."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Postman > aba Tests do request:
// GET https://fakeforge.com.br/api/generate?type=cpf&quantity=20

function validaCpf(cpf) {
  const d = cpf.replace(/\\D/g, '').split('').map(Number);
  if (d.length !== 11 || new Set(d).size === 1) return false;
  return [9, 10].every((i) => {
    const soma = d.slice(0, i).reduce((acc, n, k) => acc + n * (i + 1 - k), 0);
    return d[i] === ((soma * 10) % 11) % 10;
  });
}

pm.test('status 200', () => pm.response.to.have.status(200));

pm.test('todos os CPFs passam no mod-11', () => {
  const { data } = pm.response.json();
  pm.expect(data).to.have.lengthOf(20);
  data.forEach((cpf) => pm.expect(validaCpf(cpf), cpf).to.be.true);
});

pm.test('validador rejeita CPF com DV trocado', () => {
  const [cpf] = pm.response.json().data;
  const errado = cpf.slice(0, -1) + ((Number(cpf.slice(-1)) + 1) % 10);
  pm.expect(validaCpf(errado)).to.be.false;
});
// Para validar a SUA API, troque por: const cpf = pm.response.json().cliente.cpf;`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CPF: algoritmo local ou serviço externo"}</h2>
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
              {[["Confere os dígitos verificadores", "Sim", "Não, a API só gera"], ["Gera CPFs válidos para teste", "Não", "Sim, até 10.000 por chamada"], ["Funciona offline", "Sim", "Não"], ["Confirma que o CPF está ativo na Receita", "Não", "Não"], ["Dependências", "Nenhuma", "Uma chamada HTTP"], ["Custo", "R$ 0", "Grátis até 50 chamadas por dia"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CPF via curl"}</h2>
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
          <Link href="/validar-cpf" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Validar CPF online"}</Link>
          <Link href="/gerador-cpf" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerador de CPF"}</Link>
          <Link href="/gerador-cpf-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CPF via curl"}</Link>
          <Link href="/validar-cpf-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CPF em Python"}</Link>
          <Link href="/validar-cpf-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CPF em Node.js"}</Link>
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
        { name: "Validar CPF", url: "/validar-cpf" },
        { name: "curl e bash", url: "/validar-cpf-curl" },
      ]} />
    </PageShell>
  );
}
