import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar RG via curl: mod-11 formato SP",
  description: "Como validar RG via curl: mod-11 do formato de São Paulo, dígito X, código standalone e testes com Postman. Sem dependências.",
  keywords: "validar rg curl, validação de rg curl, verificar rg curl, algoritmo rg sp curl, dígito verificador rg, rg mod-11, rg com x",
  alternates: { canonical: "/validar-rg-curl" },
  openGraph: {
    title: "Validar RG via curl com código pronto",
    description: "Mod-11 formato SP. Código standalone, testes com Postman e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar RG via curl?",
    "a": "Carregue o arquivo com source validador-rg.sh e chame valida_rg 12.345.678-2. Saída 0 é válido e 1 é inválido. A função aceita X ou x como verificador. Vale para o formato de São Paulo e precisa de bash 4 ou superior."
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

export default function ValidarRgCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"curl · bash · Postman"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"RG via curl"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar RG via curl, use o mod-11 do formato de São Paulo: pesos 2 a 9 sobre os 8 primeiros dígitos, com dígito verificador que pode ser X."} {"Não existe regra federal única para o RG: outros estados usam formatos próprios, e a nova CIN adota o CPF como número. Abaixo: uma função em bash puro, vetores de teste e testes automatizados."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: regra de dígito verificador usada no RG de São Paulo. Não há norma federal única; a CIN (Decreto 10.977/2022) usa o CPF como número."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`valida_rg() {
  local s=\${1//[.\\- ]/} k soma=0 dv
  s=\${s^^}
  [[ $s =~ ^[0-9]{8}[0-9X]$ && -n \${s//\${s:0:1}/} ]] || return 1
  for ((k = 0; k < 8; k++)); do soma=$((soma + \${s:k:1} * (k + 2))); done
  dv=$(( (11 - soma % 11) % 11 )); ((dv == 10)) && dv=X
  [[ \${s:8:1} == "$dv" ]]
}

valida_rg "12.345.678-2" && echo "válido" || echo "inválido"
valida_rg "10.000.006-X" && echo "válido" || echo "inválido"
valida_rg "12.345.678-3" && echo "válido" || echo "inválido"`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"bash 4+ (Linux, Git Bash, WSL). O macOS traz bash 3.2: instale um bash atual pelo Homebrew."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar RG via curl com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Regra do RG de São Paulo, o formato mais aceito em formulários nacionais. Aceita pontuação, o X em maiúsculo ou minúsculo e rejeita dígitos repetidos."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# validador-rg.sh: bash 4+, sem dependências. Regra do RG de São Paulo.
# Use com source ou direto. Saída: 0 = válido, 1 = inválido

valida_rg() {
  local s=\${1//[.\\- ]/} k soma=0 dv
  s=\${s^^}                                   # x minúsculo vira X
  [[ $s =~ ^[0-9]{8}[0-9X]$ ]] || return 1
  [[ -z \${s//\${s:0:1}/} ]] && return 1       # dígitos repetidos

  for ((k = 0; k < 8; k++)); do
    soma=$((soma + \${s:k:1} * (k + 2)))      # pesos 2 a 9
  done

  dv=$(( (11 - soma % 11) % 11 ))            # resto 0 e resto 1 caem em DV 0 e DV X
  ((dv == 10)) && dv=X
  [[ \${s:8:1} == "$dv" ]]
}

if [[ \${BASH_SOURCE[0]} == "$0" ]]; then
  for rg in "12.345.678-2" "12345678-2" "10.000.006-X" "10.000.006-x" "12.345.678-3" "11.111.111-1" "123"; do
    if valida_rg "$rg"; then echo "$rg -> válido"; else echo "$rg -> inválido"; fi
  done
fi`}</code></pre>
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
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# vetores-rg.sh: tabela de casos conhecidos. Salve a Rota 1 como validador-rg.sh
source ./validador-rg.sh

# RG|esperado (1 = válido, 0 = inválido)|por quê
VETORES=(
  "12.345.678-2|1|resto 9, DV 2"
  "34.567.890-4|1|resto 7, DV 4"
  "50.000.000-1|1|resto 10, DV 1"
  "24.680.135-9|1|resto 2, DV 9"
  "10.000.006-X|1|resto 1, DV 10 vira X"
  "12.345.678-3|0|DV errado"
  "10.000.006-0|0|deveria ser X"
  "11.111.111-1|0|dígitos repetidos"
  "12.345.678|0|sem DV"
)

falhas=0
for linha in "\${VETORES[@]}"; do
  IFS='|' read -r rg esperado motivo <<< "$linha"
  valida_rg "$rg" && obtido=1 || obtido=0
  if [[ $obtido != "$esperado" ]]; then echo "FALHOU: $rg ($motivo)"; falhas=$((falhas + 1)); fi
done

echo "$(( \${#VETORES[@]} - falhas ))/\${#VETORES[@]} vetores ok"
(( falhas == 0 ))`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar RG no Postman"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Cole o script na aba Tests do request. O Postman roda a mesma validação sobre a resposta e marca cada caso como passou ou falhou."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Postman > aba Tests do request da SUA API (exemplo: POST /clientes devolve { "rg": "12.345.678-2" })

function validaRg(rg) {
  const s = rg.toUpperCase().replace(/[^0-9X]/g, '');
  if (!/^\\d{8}[0-9X]$/.test(s) || new Set(s).size === 1) return false;
  const soma = [...s.slice(0, 8)].reduce((acc, n, i) => acc + Number(n) * (i + 2), 0);
  const dv = (11 - (soma % 11)) % 11;
  return s[8] === (dv === 10 ? 'X' : String(dv));
}

pm.test('status 201', () => pm.response.to.have.status(201));

pm.test('RG devolvido passa no mod-11 (formato SP)', () => {
  const { rg } = pm.response.json();
  pm.expect(rg, 'campo rg ausente').to.be.a('string');
  pm.expect(validaRg(rg), rg).to.be.true;
});

pm.test('validador rejeita RG com DV trocado', () => {
  pm.expect(validaRg('12.345.678-3')).to.be.false;
  pm.expect(validaRg('10.000.006-0')).to.be.false;
});
// Na pré-request, guarde um RG de teste: pm.variables.set('rg', '12.345.678-2');`}</code></pre>
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar RG via curl"}</h2>
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
          <Link href="/gerador-rg-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar RG via curl"}</Link>
          <Link href="/validar-rg-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar RG em Python"}</Link>
          <Link href="/validar-rg-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar RG em Node.js"}</Link>
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
        { name: "curl e bash", url: "/validar-rg-curl" },
      ]} />
    </PageShell>
  );
}
