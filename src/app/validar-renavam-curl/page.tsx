import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar RENAVAM via curl: Shell e Bash com mod-11 DENATRAN",
  description: "Como validar RENAVAM via curl e Bash: função shell com algoritmo mod-11 DENATRAN, exemplos pra CI/CD e integração com API DETRAN.",
  keywords: "validar renavam curl, validar renavam bash, validar renavam shell, verificar renavam linha de comando, mod-11 renavam bash",
  alternates: { canonical: "/validar-renavam-curl" },
  openGraph: {
    title: "Validar RENAVAM via curl e Bash",
    description: "Script shell com mod-11 DENATRAN pra CI/CD e integração com API DETRAN.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  { q: "Como validar RENAVAM via linha de comando?", a: "Use a função Bash desta página: ela normaliza o input (remove não-dígitos, completa com zeros à esquerda), rejeita todos iguais e aplica o mod-11 DENATRAN com pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2. Zero dependências além de bash e GNU tools padrão." },
  { q: "A validação local funciona em pipelines CI/CD?", a: "Sim. A função não faz chamada HTTP, roda em qualquer runner (GitHub Actions, GitLab CI, Jenkins). Útil pra validar fixtures de teste antes do deploy, verificar seed de banco em staging, ou gate de PR que impede merge com dados inválidos." },
  { q: "Como integrar com API do DETRAN pra consulta real?", a: "A API do DETRAN estadual (SP, RJ, MG, etc) exige credenciais e cobra por consulta. A validação local via mod-11 serve pra pré-filtrar antes da consulta paga: só chama a API se o RENAVAM passar no DV, economizando chamadas inválidas." },
  { q: "RENAVAM com 9 dígitos funciona?", a: "RENAVAMs legados pré-2007 têm 9 dígitos. A função completa com zeros à esquerda via printf até chegar em 11 dígitos antes de aplicar o algoritmo. Isso evita false negatives em bases antigas." },
  { q: "O FakeForge gera RENAVAMs via API?", a: "Sim. curl 'https://fakeforge.com.br/api/generate?type=renavam&quantity=10' retorna 10 RENAVAMs com DV calculado, prontos pra popular banco de homologação, simular cadastro de veículos ou testar fluxo de despachante." },
];

export default function ValidarRenavamCurl() {
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
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Bash / curl / Shell</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">RENAVAM via curl</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra validar RENAVAM via linha de comando, aplica o mod-11 do DENATRAN com uma função Bash de 15 linhas. Útil em CI/CD, gate de PR e scripts de seed. Abaixo: função standalone, exemplos de uso e integração com API do DETRAN estadual.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`#!/bin/bash
valida_renavam() {
  local s=$(printf '%s' "$1" | tr -cd '0-9')
  s=$(printf '%011s' "$s" | tr ' ' 0)
  [ \${#s} -ne 11 ] && return 1
  [[ "$s" =~ ^(.)\\1{10}$ ]] && return 1
  local pesos=(3 2 9 8 7 6 5 4 3 2) soma=0 i
  for i in {0..9}; do soma=$((soma + \${s:$i:1} * \${pesos[$i]})); done
  local resto=$(( (soma * 10) % 11 ))
  local dv=$([ "$resto" -ge 10 ] && echo 0 || echo "$resto")
  [ "\${s:10:1}" -eq "$dv" ]
}

valida_renavam "12345678900" && echo OK || echo FAIL`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Bash 4+, sem dependências externas. GNU coreutils padrão.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: função Bash standalone</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Salva como <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">valida_renavam.sh</code> e importa onde precisar.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# valida_renavam.sh — mod-11 DENATRAN pra RENAVAM
# Uso: valida_renavam "12345678900"
# Retorna: 0 se válido, 1 se inválido

valida_renavam() {
  # Normaliza: só dígitos, pad com zeros à esquerda até 11 chars
  local s=$(printf '%s' "$1" | tr -cd '0-9')
  s=$(printf '%011s' "$s" | tr ' ' 0)

  # Comprimento exato de 11
  [ \${#s} -ne 11 ] && return 1

  # Rejeita todos iguais (00000000000, 11111111111, ...)
  [[ "$s" =~ ^(.)\\1{10}$ ]] && return 1

  # Pesos DENATRAN
  local pesos=(3 2 9 8 7 6 5 4 3 2)
  local soma=0 i
  for i in {0..9}; do
    soma=$((soma + \${s:$i:1} * \${pesos[$i]}))
  done

  # Dígito verificador esperado
  local resto=$(( (soma * 10) % 11 ))
  local dv
  if [ "$resto" -ge 10 ]; then
    dv=0
  else
    dv=$resto
  fi

  # Compara com o 11º dígito do input
  [ "\${s:10:1}" -eq "$dv" ]
}

# Exemplos
for r in "12345678900" "12345678901" "00000000000" "123"; do
  if valida_renavam "$r"; then
    echo "$r: VALIDO"
  else
    echo "$r: INVALIDO"
  fi
done`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: pré-filtrar antes de consultar API DETRAN</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">A consulta real ao DETRAN é paga. Validar o DV localmente antes economiza chamadas inválidas e reduz custo.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`#!/bin/bash
# consulta_detran.sh — valida local depois chama API paga
source valida_renavam.sh

RENAVAM="$1"
TOKEN="\$DETRAN_API_TOKEN"

if ! valida_renavam "$RENAVAM"; then
  echo "RENAVAM inválido no DV. Nem chamo a API." >&2
  exit 1
fi

# Só chega aqui se o DV passou
curl -sS \\
  -H "Authorization: Bearer $TOKEN" \\
  "https://api.detran-sp.gov.br/v1/veiculos/renavam/$RENAVAM" \\
  | jq '.marca, .modelo, .ano'`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 3: gate de PR em CI/CD</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">GitHub Action que roda em cada PR, lê CSV de fixtures e falha se algum RENAVAM for inválido.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/validate-fixtures.yml
name: Validate test fixtures
on: [pull_request]
jobs:
  renavam-dv:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check RENAVAMs no CSV
        run: |
          source scripts/valida_renavam.sh
          falhas=0
          while IFS=, read -r plate renavam rest; do
            if ! valida_renavam "$renavam"; then
              echo "::error::RENAVAM inválido em fixture: $renavam"
              falhas=$((falhas + 1))
            fi
          done < fixtures/veiculos.csv
          [ "$falhas" -eq 0 ]`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Gerar RENAVAMs válidos via API do FakeForge</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Pra popular fixtures e banco de homologação com dados que passam no validador.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# 10 RENAVAMs válidos pra fixture
curl -sS "https://fakeforge.com.br/api/generate?type=renavam&quantity=10" \\
  | jq -r '.data[]'

# 100 RENAVAMs em SQL pronto pra inserir
curl -sS "https://fakeforge.com.br/api/generate?type=renavam&quantity=100&format=sql"

# Combinado: pessoa + veículo (preset futuro)
curl -sS "https://fakeforge.com.br/api/generate?preset=customer&quantity=50"`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Perguntas frequentes sobre validar RENAVAM via curl</h2>
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
          <Link href="/validar-renavam" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar online</Link>
          <Link href="/validar-renavam-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar em Python</Link>
          <Link href="/validar-renavam-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar em Node.js</Link>
          <Link href="/validar-cnh-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar CNH via curl</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Validar RENAVAM", url: "/validar-renavam" },
        { name: "Via curl", url: "/validar-renavam-curl" },
      ]} />
    </PageShell>
  );
}
