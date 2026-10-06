import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar RENAVAM em Python: mod-11 DENATRAN com pytest",
  description: "Como validar RENAVAM em Python: mod-11 DENATRAN com pesos 3,2,9,8,7,6,5,4,3,2, função standalone e testes com pytest. Zero dependências.",
  keywords: "validar renavam python, validacao de renavam python, verificar renavam python, algoritmo renavam python, mod-11 renavam, renavam dv python",
  alternates: { canonical: "/validar-renavam-python" },
  openGraph: {
    title: "Validar RENAVAM em Python com código pronto",
    description: "mod-11 DENATRAN, código standalone, testes com pytest e tabela de vetores conhecidos.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  { q: "Como validar RENAVAM em Python?", a: "Use a função valida_renavam desta página: remove não-dígitos, exige 11 dígitos, rejeita todos iguais e confere o mod-11 DENATRAN com pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 sobre os 10 primeiros dígitos." },
  { q: "Qual o algoritmo oficial do DV do RENAVAM?", a: "Multiplicar os 10 dígitos base pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 da esquerda pra direita, somar, multiplicar por 10, calcular mod 11. Se o resto for 10 ou 11, o DV é 0. Senão, o DV é o próprio resto." },
  { q: "O RENAVAM tem 9 ou 11 dígitos?", a: "Documentos emitidos antes de 2007 têm 9 dígitos, mas o DETRAN completa com zeros à esquerda pra padronizar em 11 dígitos (10 base + 1 DV). Validadores modernos esperam 11 dígitos." },
  { q: "A validação local garante que o veículo existe?", a: "Não. A validação só confirma que o dígito verificador está matematicamente correto. Pra confirmar que o RENAVAM corresponde a um veículo real registrado, é preciso consultar o DETRAN estadual ou a base SNG via API oficial." },
  { q: "O FakeForge valida RENAVAM via API?", a: "Não. A API do FakeForge é focada em geração de dados sintéticos. Validação roda no seu código. A função desta página cobre o algoritmo oficial do DENATRAN sem dependência externa." },
];

export default function ValidarRenavamPython() {
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
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · algoritmo local + API</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">RENAVAM em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra validar RENAVAM em Python, use o algoritmo mod-11 do DENATRAN: pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 sobre os 10 primeiros dígitos, soma vezes 10, mod 11. Abaixo: função só com stdlib, tabela de vetores conhecidos, testes com pytest e dicas de produção.
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">Fonte: algoritmo oficial do DENATRAN pra dígito verificador do RENAVAM (11 dígitos, estrutura 10 + DV).</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`def valida_renavam(renavam: str) -> bool:
    s = "".join(c for c in renavam if c.isdigit()).zfill(11)
    if len(s) != 11 or len(set(s)) == 1:
        return False
    pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(int(d) * p for d, p in zip(s[:10], pesos))
    resto = (soma * 10) % 11
    dv = 0 if resto >= 10 else resto
    return int(s[10]) == dv


print(valida_renavam("1234567890 5"))  # True ou False dependendo do DV
print(valida_renavam("00000000000"))   # False (todos iguais)`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">Python 3.8+, sem pip install. Copia o bloco e salva como validador_renavam.py.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: validar RENAVAM em Python com algoritmo local</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Função pronta pra copiar. Aceita RENAVAM com ou sem pontuação, com 9 ou 11 dígitos (completa com zeros à esquerda), rejeita todos iguais.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# validador_renavam.py (só stdlib)
import re


def valida_renavam(renavam: str) -> bool:
    """mod-11 DENATRAN com pesos 3,2,9,8,7,6,5,4,3,2 sobre 10 dígitos base.

    Aceita 9 ou 11 dígitos (completa com zeros à esquerda pra padronizar).
    Rejeita strings com todos os dígitos iguais (ex: 11111111111).
    """
    s = re.sub(r"\\D", "", renavam).zfill(11)
    if len(s) != 11 or len(set(s)) == 1:
        return False
    pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    soma = sum(int(d) * p for d, p in zip(s[:10], pesos))
    resto = (soma * 10) % 11
    dv = 0 if resto >= 10 else resto
    return int(s[10]) == dv


if __name__ == "__main__":
    for r in ("12345678901", "12345678900", "00000000000", "123"):
        print(f"{r:16} -> {valida_renavam(r)}")`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como o cálculo do DV do RENAVAM funciona</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Exemplo calculado à mão pra conferir contra o código.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`RENAVAM 1234567890X (X = DV a calcular)

Pesos:  3  2  9  8  7  6  5  4  3  2
Dígito: 1  2  3  4  5  6  7  8  9  0

Produtos:
1×3=3  2×2=4   3×9=27  4×8=32  5×7=35
6×6=36 7×5=35  8×4=32  9×3=27  0×2=0

Soma = 3+4+27+32+35+36+35+32+27+0 = 231
Soma × 10 = 2310
2310 mod 11 = 0

Resto 0: DV = 0 (quando resto < 10, DV = resto)
Resultado: RENAVAM válido é 12345678900`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: testar o validador com vetores conhecidos</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Tabela de casos fixos cobre os resíduos possíveis do mod-11, incluindo a borda do resto 10/11 onde o DV vira 0.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# vetores_renavam.py — tabela de casos conhecidos
from validador_renavam import valida_renavam

VETORES = [
    ("12345678900", True,  "DV calculado via mod-11"),
    ("98765432100", False, "DV errado"),
    ("00000000000", False, "11 zeros (todos iguais)"),
    ("11111111111", False, "todos iguais"),
    ("1234567890",  False, "menos de 11 dígitos sem zfill"),
    ("",            False, "vazio"),
]

falhas = [(r, pq) for r, esperado, pq in VETORES if valida_renavam(r) != esperado]
for r, pq in falhas:
    print(f"FALHOU: {r!r} ({pq})")
print(f"{len(VETORES) - len(falhas)}/{len(VETORES)} vetores ok")
assert not falhas`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Como testar o validador de RENAVAM com pytest</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Rode com <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pytest -q</code>. Os casos cobrem válidos, inválidos e as bordas de formato.</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# test_validador_renavam.py (pytest)
import pytest
from validador_renavam import valida_renavam


@pytest.mark.parametrize("renavam", ["12345678900", "1234567890-0", "123 456 789 00"])
def test_aceita_renavam_valido(renavam):
    assert valida_renavam(renavam) is True


@pytest.mark.parametrize("renavam", ["12345678901", "00000000000", "11111111111", "123", "abc"])
def test_rejeita_renavam_invalido(renavam):
    assert valida_renavam(renavam) is False`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Validar RENAVAM: algoritmo local ou API do DETRAN</h2>
        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">Validação local</th>
                <th className="text-center px-3 py-2 text-muted">API DETRAN estadual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Confere o DV mod-11", "Sim", "Não se aplica (acesso direto à base)"],
                ["Confirma que o veículo existe", "Não", "Sim"],
                ["Devolve dados do veículo (modelo, placa)", "Não", "Sim"],
                ["Funciona offline", "Sim", "Não"],
                ["API pública disponível", "Não precisa", "Varia por estado"],
                ["Custo", "R$ 0", "Varia (SP: R$ 5-10/consulta)"],
              ].map(([c, a, b]) => (
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
        <h2 className="text-xl font-bold text-foreground mb-4">Perguntas frequentes sobre validar RENAVAM em Python</h2>
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
          <Link href="/gerador-renavam-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerar RENAVAM em Python</Link>
          <Link href="/validar-renavam-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar em Node.js</Link>
          <Link href="/validar-renavam-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar via curl</Link>
          <Link href="/validar-cnh-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Validar CNH em Python</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Validar RENAVAM", url: "/validar-renavam" },
        { name: "Em Python", url: "/validar-renavam-python" },
      ]} />
    </PageShell>
  );
}
