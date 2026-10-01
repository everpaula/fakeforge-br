import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNH via curl: algoritmo DENATRAN pronto",
  description: "Como validar CNH via curl: mod-11 do DENATRAN com código que roda standalone, testes com Postman e conferência com a API FakeForge.",
  keywords: "validar cnh curl, validação de cnh curl, verificar cnh curl, algoritmo cnh curl, dígito verificador cnh, cnh denatran mod-11, cnh válida curl",
  alternates: { canonical: "/validar-cnh-curl" },
  openGraph: {
    title: "Validar CNH via curl com código pronto",
    description: "Mod-11 DENATRAN. Código standalone, testes com Postman e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CNH via curl?",
    "a": "Carregue o arquivo com source validador-cnh.sh e chame valida_cnh \"123 456 789 00\". Saída 0 é válida e 1 é inválida. A função trata o desconto de 2 do segundo dígito. Precisa de bash 4 ou superior."
  },
  {
    "q": "Como calcular o dígito verificador da CNH?",
    "a": "O primeiro DV soma os 9 primeiros dígitos com pesos de 9 a 1 e toma o resto por 11. O segundo soma os mesmos 9 dígitos com pesos de 1 a 9, toma o resto por 11 e subtrai o desconto. Resultados de 10 ou mais viram 0."
  },
  {
    "q": "O que é o desconto de 2 no cálculo da CNH?",
    "a": "Quando o resto do primeiro DV é 10 ou mais, o DV vira 0 e o segundo DV é calculado subtraindo 2 do resto. Se o resultado ficar negativo, soma-se 11. Esquecer esse passo faz o validador rejeitar cerca de 1 em cada 11 CNHs legítimas."
  },
  {
    "q": "CNH válida quer dizer habilitação vigente?",
    "a": "Não. A validação confere só a matemática do número de registro. Vigência, suspensão e categoria só se consultam nos órgãos de trânsito (Senatran e Detrans)."
  },
  {
    "q": "A API do FakeForge valida CNH?",
    "a": "Não. A API gera CNHs com dígitos corretos (type=cnh), e a validação roda no seu código. Use o lote gerado como casos positivos e troque o último dígito para casos negativos."
  }
];

export default function ValidarCnhCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"curl · bash · Postman"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CNH via curl"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CNH via curl, recalcule os dois dígitos verificadores do registro de 11 dígitos pelo mod-11 do DENATRAN, com pesos 9 a 1 e 1 a 9."} {"Quando o primeiro cálculo dá resto 10, o dígito vira 0 e o segundo perde 2. A validação confirma só a matemática, não se a habilitação está vigente. Abaixo: uma função em bash puro, testes e conferência com CNHs da API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: algoritmo do dígito verificador do número de registro da CNH, do DENATRAN (hoje Senatran)."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`valida_cnh() {
  local d=\${1//[^0-9]/} k s1=0 s2=0 dv1 dv2 dsc=0
  [[ \${#d} -eq 11 && -n \${d//\${d:0:1}/} ]] || return 1
  for ((k = 0; k < 9; k++)); do s1=$((s1 + \${d:k:1} * (9 - k))); s2=$((s2 + \${d:k:1} * (k + 1))); done
  dv1=$((s1 % 11)); if ((dv1 >= 10)); then dv1=0; dsc=2; fi
  dv2=$(( (s2 % 11 - dsc + 11) % 11 )); ((dv2 >= 10)) && dv2=0
  ((dv1 == \${d:9:1} && dv2 == \${d:10:1}))
}

valida_cnh "123 456 789 00" && echo "válida" || echo "inválida"
valida_cnh "123 456 789 01" && echo "válida" || echo "inválida"`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"bash 4+ (Linux, Git Bash, WSL). O macOS traz bash 3.2: instale um bash atual pelo Homebrew."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CNH via curl com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Versão completa com o desconto do segundo dígito comentado. Aceita espaços, pontos e hífen, e rejeita os 11 dígitos iguais."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# validador-cnh.sh: bash 4+, sem dependências. Use com source ou direto.
# Saída: 0 = válida, 1 = inválida

valida_cnh() {
  [[ $1 =~ ^[0-9\\ .-]+$ ]] || return 1
  local d=\${1//[^0-9]/} k s1=0 s2=0 dv1 dv2 dsc=0
  [[ \${#d} -eq 11 ]] || return 1
  [[ -z \${d//\${d:0:1}/} ]] && return 1   # 11 dígitos iguais

  for ((k = 0; k < 9; k++)); do
    s1=$((s1 + \${d:k:1} * (9 - k)))   # 1º DV: pesos 9 a 1
    s2=$((s2 + \${d:k:1} * (k + 1)))   # 2º DV: pesos 1 a 9
  done

  dv1=$((s1 % 11))
  if ((dv1 >= 10)); then dv1=0; dsc=2; fi   # resto 10: DV vira 0 e o 2º DV perde 2

  dv2=$(( (s2 % 11 - dsc + 11) % 11 ))
  ((dv2 >= 10)) && dv2=0

  ((dv1 == \${d:9:1} && dv2 == \${d:10:1}))
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for cnh in "123 456 789 00" "12345678900" "987.654.321-09" "123 456 789 01" "123 456 702 02"; do
    if valida_cnh "$cnh"; then echo "$cnh -> válida"; else echo "$cnh -> inválida"; fi
  done
fi`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como o cálculo do dígito verificador da CNH funciona"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Um exemplo calculado à mão, para você conferir o código contra a conta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`CNH 123 456 789 00

1º DV: 1×9 + 2×8 + 3×7 + 4×6 + 5×5 + 6×4 + 7×3 + 8×2 + 9×1
      = 165
      165 mod 11 = 0  ->  DV1 = 0, desconto 0

2º DV: 1×1 + 2×2 + 3×3 + 4×4 + 5×5 + 6×6 + 7×7 + 8×8 + 9×9
      = 285
      285 mod 11 = 10  ->  resultado >= 10 vira 0

Caso do desconto: CNH 123 456 702 02

1º DV: 1×9 + 2×8 + 3×7 + 4×6 + 5×5 + 6×4 + 7×3 + 0×2 + 2×1
      = 142
      142 mod 11 = 10 (>= 10)  ->  DV1 = 0 e desconto = 2

2º DV: 1×1 + 2×2 + 3×3 + 4×4 + 5×5 + 6×6 + 7×7 + 0×8 + 2×9
      = 158
      158 mod 11 = 4, menos o desconto 2 = 2  ->  DV2 = 2`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 2: conferir o validador com CNHs da API do FakeForge"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"A API do FakeForge gera CNHs válidas, mas não tem endpoint de validação. Use o lote gerado como oráculo de teste: todas precisam passar no seu validador, e com o último dígito trocado precisam falhar."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# confere-cnh-api.sh: salve o validador da Rota 1 como validador-cnh.sh
source ./validador-cnh.sh

rejeitadas=0 aceitas=0 total=0
while read -r cnh; do
  total=$((total + 1))
  valida_cnh "$cnh" || { echo "válida rejeitada: $cnh"; rejeitadas=$((rejeitadas + 1)); }
  errada="\${cnh%?}$(( (\${cnh: -1} + 1) % 10 ))"
  valida_cnh "$errada" && { echo "inválida aceita: $errada"; aceitas=$((aceitas + 1)); }
done < <(curl -s "https://fakeforge.com.br/api/generate?type=cnh&quantity=30&formatted=false" \\
  | grep -oE '"[0-9]{11}"' | tr -d '"')

echo "$total CNHs da API | válidas rejeitadas: $rejeitadas | inválidas aceitas: $aceitas"
(( total > 0 && rejeitadas == 0 && aceitas == 0 ))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar CNH no Postman"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Cole o script na aba Tests do request. O Postman roda a mesma validação sobre a resposta e marca cada caso como passou ou falhou."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Postman > aba Tests do request:
// GET https://fakeforge.com.br/api/generate?type=cnh&quantity=30

function validaCnh(cnh) {
  const d = cnh.replace(/\\D/g, '').split('').map(Number);
  if (d.length !== 11 || new Set(d).size === 1) return false;
  let dv1 = d.slice(0, 9).reduce((acc, n, i) => acc + n * (9 - i), 0) % 11;
  let dsc = 0;
  if (dv1 >= 10) { dv1 = 0; dsc = 2; }
  const dv2 = ((d.slice(0, 9).reduce((acc, n, i) => acc + n * (i + 1), 0) % 11) - dsc + 11) % 11;
  return d[9] === dv1 && d[10] === (dv2 >= 10 ? 0 : dv2);
}

pm.test('status 200', () => pm.response.to.have.status(200));

pm.test('todas as CNHs passam no mod-11 DENATRAN', () => {
  const { data } = pm.response.json();
  pm.expect(data).to.have.lengthOf(30);
  data.forEach((cnh) => pm.expect(validaCnh(cnh), cnh).to.be.true);
});

pm.test('validador rejeita CNH com DV trocado', () => {
  const [cnh] = pm.response.json().data;
  const errada = cnh.slice(0, -1) + ((Number(cnh.slice(-1)) + 1) % 10);
  pm.expect(validaCnh(errada)).to.be.false;
});
// Para validar a SUA API, troque por: const cnh = pm.response.json().motorista.cnh;`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Validar CNH: algoritmo local ou serviço externo"}</h2>
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
              {[["Confere os dígitos verificadores", "Sim", "Não, a API só gera"], ["Gera CNHs válidas para teste", "Não", "Sim, até 10.000 por chamada"], ["Funciona offline", "Sim", "Não"], ["Confirma que a habilitação está vigente", "Não", "Não"], ["Dependências", "Nenhuma", "Uma chamada HTTP"], ["Custo", "R$ 0", "Grátis até 50 chamadas por dia"]].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CNH via curl"}</h2>
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
          <Link href="/gerador-cnh" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">{"Gerador de CNH"}</Link>
          <Link href="/gerador-cnh-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CNH via curl"}</Link>
          <Link href="/validar-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNH em Python"}</Link>
          <Link href="/validar-cnh-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNH em Node.js"}</Link>
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
        { name: "Gerador CNH", url: "/gerador-cnh" },
        { name: "curl e bash", url: "/validar-cnh-curl" },
      ]} />
    </PageShell>
  );
}
