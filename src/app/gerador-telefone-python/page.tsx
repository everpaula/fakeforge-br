import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Gerador de Telefone em Python: SDK + Algoritmo ANATEL (2026)",
  description: "Gere telefone brasileiro válido em Python com o SDK fakeforge-br (pip install) ou algoritmo local do padrão ANATEL. Snippets pra pytest, Django e testes de SMS. Grátis 50/dia.",
  keywords: "gerador de telefone python, gerar celular python, telefone valido python, ddd python, telefone anatel python, gerador de numero python, python telefone teste, gerar numero celular python",
  alternates: { canonical: "/gerador-telefone-python" },
  openGraph: {
    title: "Gerador de Telefone em Python — SDK oficial + algoritmo local",
    description: "SDK oficial fakeforge-br + algoritmo ANATEL puro em Python. Pra pytest, Django e testes de SMS.",
    type: "article",
    locale: "pt_BR",
  },
};

export default function GeradorTelefonePython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Python · SDK + algoritmo</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">Telefone em Python</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Pra gerar telefone brasileiro válido em Python, instale <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">pip install fakeforge-br</code> e chame <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">FakeForge().phone(n)</code>. Cada número segue o padrão da ANATEL: DDD de dois dígitos (um dos 67 válidos) mais o 9 do celular mais 8 dígitos, totalizando 11 dígitos no celular e 10 no fixo. Sem SDK, um algoritmo local replica a mesma lógica offline.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`pip install fakeforge-br

from fakeforge import FakeForge
celulares = FakeForge().phone(100)  # 100 celulares BR válidos`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          Free 50 chamadas/dia sem cadastro. Zero deps runtime além do install.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 1: SDK oficial fakeforge-br</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          A mais rápida. <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.phone(n)</code> gera celular, <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">.landline(n)</code> gera fixo.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Instalação
pip install fakeforge-br

from fakeforge import FakeForge

ff = FakeForge()

# 1 celular formatado
celular = ff.phone(1)[0]
print(celular)  # "(11) 98765-4321"

# 1000 celulares sem formatação
celulares = ff.phone(1000, formatted=False)

# Telefone fixo (10 dígitos, sem o 9)
fixos = ff.landline(100)

# Preset customer (telefone + nome + email correlacionados)
pessoas = ff.preset("customer", 10)
for p in pessoas:
    print(p["telefone"], p["nome"])`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: correlação com outros campos (nome, endereço, DDD coerente), presets fintech/ecom, bulk até 10k por chamada. Requer internet (chama endpoint HTTP).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Rota 2: algoritmo local (offline)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Se você não quer dep externa ou precisa gerar telefone 100% offline, o padrão ANATEL é simples de replicar:
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# gerador_telefone.py - implementação pura, offline
import random

DDDS_VALIDOS = [
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48, 49,
    51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67, 68, 69,
    71, 73, 74, 75, 77, 79,
    81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99,
]


def gerar_celular(formatado: bool = True) -> str:
    """Gera celular BR: DDD + 9 + 8 dígitos (11 no total)."""
    ddd = random.choice(DDDS_VALIDOS)
    numero = "".join(str(random.randint(0, 9)) for _ in range(8))
    if formatado:
        return f"({ddd}) 9{numero[:4]}-{numero[4:]}"
    return f"{ddd}9{numero}"


def gerar_fixo(formatado: bool = True) -> str:
    """Gera fixo BR: DDD + 8 dígitos (10 no total). Primeiro dígito 2-5."""
    ddd = random.choice(DDDS_VALIDOS)
    primeiro = random.randint(2, 5)
    resto = "".join(str(random.randint(0, 9)) for _ in range(7))
    numero = f"{primeiro}{resto}"
    if formatado:
        return f"({ddd}) {numero[:4]}-{numero[4:]}"
    return f"{ddd}{numero}"


def validar_telefone(numero: str) -> bool:
    """Valida se o número segue o padrão ANATEL (DDD válido + tamanho certo)."""
    d = [c for c in numero if c.isdigit()]
    if len(d) not in (10, 11):
        return False
    ddd = int("".join(d[:2]))
    if ddd not in DDDS_VALIDOS:
        return False
    if len(d) == 11:
        return d[2] == "9"
    return d[2] in ("2", "3", "4", "5")`}</code></pre>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Vantagens: zero deps, offline, controle total. Limitação: só telefone, sem correlação com outros campos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Uso em testes de SMS (Twilio/Zenvia)</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          Testar envio de SMS sem disparar mensagem real: gera celular válido, faz mock do client de SMS e confere se o payload foi montado certo.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# tests/conftest.py
import pytest
from fakeforge import FakeForge

@pytest.fixture(scope="session")
def ff():
    return FakeForge()

@pytest.fixture
def celulares(ff):
    return ff.phone(50)


# tests/test_sms_signup.py
def test_signup_envia_sms_para_celular_valido(client, celulares, monkeypatch):
    enviados = []
    monkeypatch.setattr(
        "myapp.sms.twilio_client.messages.create",
        lambda **kwargs: enviados.append(kwargs) or {"sid": "SM_fake"},
    )

    for celular in celulares[:10]:
        response = client.post("/signup", json={"telefone": celular, "email": "test@test.com"})
        assert response.status_code == 201

    assert len(enviados) == 10`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">Comparação: qual escolher</h2>

        <div className="overflow-x-auto rounded-lg bg-card border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted">Cenário</th>
                <th className="text-center px-3 py-2 text-muted">SDK fakeforge-br</th>
                <th className="text-center px-3 py-2 text-muted">Algoritmo local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Só telefone simples", "✅", "✅"],
                ["Pessoa correlacionada (nome+telefone+email)", "✅", "❌"],
                ["Celular e fixo no mesmo DDD", "✅", "⚠️ repete manual"],
                ["100% offline", "❌", "✅"],
                ["Zero deps runtime", "✅", "✅"],
                ["Bulk 10k+", "✅ 1 chamada", "⚠️ loop"],
                ["Custo", "Free 50/dia", "R$0"],
              ].map(([c, sdk, local], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{c}</td>
                  <td className="px-3 py-2 text-center text-foreground">{sdk}</td>
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
            { q: "Como gerar telefone brasileiro válido em Python?", a: "Instale pip install fakeforge-br e chame FakeForge().phone(n). Cada número segue o padrão ANATEL: DDD válido (um dos 67) + 9 (celular) + 8 dígitos. Alternativa offline: algoritmo local escolhe DDD válido e monta o número sem depender de rede." },
            { q: "Qual a diferença entre celular e fixo gerado em Python?", a: "Celular tem 11 dígitos e sempre inclui o 9 depois do DDD. Fixo tem 10 dígitos e o primeiro dígito após o DDD vai de 2 a 5. Use .phone(n) para celular e .landline(n) para fixo." },
            { q: "Dá pra gerar telefone em Python sem instalar SDK nenhum?", a: "Sim. O algoritmo local (função gerar_celular/gerar_fixo) roda 100% offline em Python puro, sem nenhuma dependência externa, escolhendo um DDD válido da lista dos 67 códigos ANATEL." },
            { q: "Quantos DDDs válidos existem no Brasil?", a: "67. Vão de 11 a 99, mas com lacunas (não existem 20, 23, 25, 26, 29, 36, 39, 40, 50, 52, 56-60, 70, 72, 76, 78, 80 e 90). O algoritmo local já usa a lista completa e correta." },
            { q: "O número gerado pode disparar SMS de verdade?", a: "Não. Os números são fictícios e não correspondem a nenhuma linha ativa. São seguros pra testar formulários, validação de máscara e integração com APIs de SMS sem risco de enviar mensagem real." },
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
          <Link href="/" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API</Link>
          <Link href="/gerador-telefone-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão Node.js</Link>
          <Link href="/gerador-telefone-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Versão curl</Link>
          <Link href="/gerador-telefone" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Gerador de Telefone</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs completas</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Como gerar telefone brasileiro válido em Python?", acceptedAnswer: { "@type": "Answer", text: "Instale pip install fakeforge-br e chame FakeForge().phone(n). Cada número segue o padrão ANATEL: DDD válido (um dos 67) + 9 (celular) + 8 dígitos. Alternativa offline: algoritmo local escolhe DDD válido e monta o número sem depender de rede." } },
              { "@type": "Question", name: "Qual a diferença entre celular e fixo gerado em Python?", acceptedAnswer: { "@type": "Answer", text: "Celular tem 11 dígitos e sempre inclui o 9 depois do DDD. Fixo tem 10 dígitos e o primeiro dígito após o DDD vai de 2 a 5. Use .phone(n) para celular e .landline(n) para fixo." } },
              { "@type": "Question", name: "Dá pra gerar telefone em Python sem instalar SDK nenhum?", acceptedAnswer: { "@type": "Answer", text: "Sim. O algoritmo local roda 100% offline em Python puro, sem dependência externa, escolhendo um DDD válido da lista dos 67 códigos ANATEL." } },
              { "@type": "Question", name: "Quantos DDDs válidos existem no Brasil?", acceptedAnswer: { "@type": "Answer", text: "67 DDDs, entre 11 e 99, com lacunas. O algoritmo local e o SDK usam a lista completa e correta." } },
              { "@type": "Question", name: "O número gerado pode disparar SMS de verdade?", acceptedAnswer: { "@type": "Answer", text: "Não. Os números são fictícios e não correspondem a nenhuma linha ativa, sendo seguros para testes de formulários e integrações de SMS." } },
            ],
          }),
        }}
      />

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Gerador Telefone", url: "/gerador-telefone" },
        { name: "Python", url: "/gerador-telefone-python" },
      ]} />
    </PageShell>
  );
}
