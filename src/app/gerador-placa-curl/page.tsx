import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Placa Mercosul via curl: API REST + Testes OCR",
  description: "Gere placa de carro brasileira (Mercosul e antiga) via curl. API REST + bash. CONTRAN 729/2018. Pipeline pra testes de OCR/ALPR. Grátis 50/dia sem cadastro.",
  keywords: "gerador placa curl, placa mercosul api rest, gerador placa bash, contran 729 curl, placa carro ocr teste, placa valida curl",
  alternates: { canonical: "/gerador-placa-curl" },
  openGraph: { title: "Gerador de Placa Mercosul via curl", description: "API REST + bash + pipeline de testes OCR.", type: "article", locale: "pt_BR" },
};

export default function GeradorPlacaCurl() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">curl · bash · OCR</p>
        <h1 className="text-3xl font-bold tracking-tight">Gerador de <span className="text-primary">Placa Mercosul via curl</span></h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          A API REST do FakeForge gera placa Mercosul (LLLNLNN) e formato antigo (LLL-NNNN) direto via curl, conforme a Resolução CONTRAN 729/2018. Sem letras I, O ou Q. Útil pra popular pipeline de teste de OCR e ALPR sem SDK.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=placa&quantity=100"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: API REST oficial</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# 5 placas Mercosul
curl "https://fakeforge.com.br/api/generate?type=placa&quantity=5"
# {"type":"placa","quantity":5,"data":["ABC1D23","XYZ9K45",...]}

# Placa no formato antigo
curl "https://fakeforge.com.br/api/generate?type=placaAntiga&quantity=5"

# CSV
curl "https://fakeforge.com.br/api/generate?type=placa&quantity=100&format=csv"

# SQL
curl "https://fakeforge.com.br/api/generate?type=placa&quantity=100&format=sql"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local em bash (offline)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# placa.sh - gera placa Mercosul localmente, sem API

LETRAS=(A B C D E F G H J K L M N P R S T U V W X Y Z)  # sem I, O, Q

gerar_placa_mercosul() {
  local l1=\${LETRAS[$((RANDOM % \${#LETRAS[@]}))]}
  local l2=\${LETRAS[$((RANDOM % \${#LETRAS[@]}))]}
  local l3=\${LETRAS[$((RANDOM % \${#LETRAS[@]}))]}
  local d1=$((RANDOM % 10))
  local l4=\${LETRAS[$((RANDOM % \${#LETRAS[@]}))]}
  local d2=$((RANDOM % 10))
  local d3=$((RANDOM % 10))
  echo "$l1$l2$l3$d1$l4$d2$d3"
}

for i in $(seq 1 10); do
  gerar_placa_mercosul
done`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Testes de OCR/ALPR em bash</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Padrão comum: gerar um lote de placas conhecidas, salvar como ground truth, e comparar contra a saída do seu pipeline de OCR.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/usr/bin/env bash
# testa-ocr.sh - valida saida do pipeline de OCR contra placas geradas

curl -s "https://fakeforge.com.br/api/generate?type=placa&quantity=100" \\
  | jq -r '.data[]' > placas-esperadas.txt

while read -r placa; do
  saida_ocr=$(./scripts/rodar_ocr.sh "$placa")  # seu binário/wrapper de OCR
  if [ "$saida_ocr" != "$placa" ]; then
    echo "FALHOU: esperado=$placa lido=$saida_ocr"
    exit 1
  fi
done < placas-esperadas.txt

echo "OCR passou em 100 placas Mercosul"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">API REST</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo bash local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só placa Mercosul", "✅", "✅"],
                ["Placa antiga também", "✅", "⚠️ precisa outra função"],
                ["Export CSV/SQL nativo", "✅", "❌"],
                ["100% offline", "❌", "✅"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, api, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{api}</td>
                  <td className="px-3 py-2 text-center text-foreground">{local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Como gerar placa Mercosul via curl?", a: "GET https://fakeforge.com.br/api/generate?type=placa&quantity=100. Retorna JSON com placas no formato LLLNLNN, sem as letras I, O ou Q. Use type=placaAntiga pro formato legado." },
            { q: "Dá pra usar essas placas pra testar um pipeline de OCR?", a: "Sim. É um dos usos mais comuns: gerar um lote como ground truth, salvar num arquivo, e comparar contra a saída do seu OCR/ALPR pra validar a taxa de acerto." },
            { q: "Existe jeito de gerar placa sem chamar a API?", a: "Sim. O algoritmo local em bash monta a placa Mercosul sorteando letras válidas (sem I, O, Q) e dígitos, sem depender de rede." },
            { q: "A API valida se a placa tem letra proibida?", a: "As placas geradas pela API já vêm sem I, O ou Q, então não é necessário validar depois. Se você receber placas de outra fonte, use a regex [A-HJ-NP-Z] pra filtrar." },
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

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Docs API</Link>
          <Link href="/gerador-placa-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Python</Link>
          <Link href="/gerador-placa-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
          <Link href="/gerador-placa-mercosul" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Placa</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar placa Mercosul via curl?", acceptedAnswer: { "@type": "Answer", text: "GET https://fakeforge.com.br/api/generate?type=placa&quantity=100. Retorna placas no formato LLLNLNN, sem as letras I, O ou Q." } },
              { "@type": "Question", name: "Dá pra usar essas placas pra testar um pipeline de OCR?", acceptedAnswer: { "@type": "Answer", text: "Sim. Gerar um lote como ground truth e comparar contra a saída do OCR/ALPR é um dos usos mais comuns." } },
              { "@type": "Question", name: "Existe jeito de gerar placa sem chamar a API?", acceptedAnswer: { "@type": "Answer", text: "Sim. O algoritmo local em bash monta a placa Mercosul sorteando letras válidas e dígitos, sem depender de rede." } },
              { "@type": "Question", name: "A API valida se a placa tem letra proibida?", acceptedAnswer: { "@type": "Answer", text: "As placas geradas já vêm sem I, O ou Q. Pra placas de outra fonte, use a regex [A-HJ-NP-Z] pra filtrar." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[{ name: "Início", url: "/" }, { name: "Gerador Placa", url: "/gerador-placa-mercosul" }, { name: "curl", url: "/gerador-placa-curl" }]} />
    </PageShell>
  );
}
