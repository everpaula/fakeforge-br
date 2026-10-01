import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CEP em Python: formato + consulta ViaCEP",
  description: "Como validar CEP em Python: regex de formato e consulta de existência no ViaCEP, código standalone e testes com pytest. Sem dependências.",
  keywords: "validar cep python, validação de cep python, verificar cep python, cep existe python, viacep python, regex cep, consultar cep python",
  alternates: { canonical: "/validar-cep-python" },
  openGraph: {
    title: "Validar CEP em Python com código pronto",
    description: "Formato + ViaCEP. Código standalone, testes com pytest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CEP em Python?",
    "a": "Valide o formato com a regex \\d{5}-?\\d{3} e depois consulte https://viacep.com.br/ws/{cep}/json/. Resposta com o campo erro significa CEP inexistente. O código desta página usa só urllib da biblioteca padrão."
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

export default function ValidarCepPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Python · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CEP em Python"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CEP em Python, confira o formato de 8 dígitos com hífen opcional e consulte o ViaCEP, porque o CEP não tem dígito verificador."} {"Formato correto não garante que o CEP existe: 00000-000 passa na regex e não está na base dos Correios. Abaixo: uma função Python só com a biblioteca padrão para o formato, a consulta de existência e testes sem depender de rede."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: estrutura do CEP definida pelos Correios. A consulta de existência usa o ViaCEP, serviço público e gratuito."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`import json
import re
import urllib.request

cep = "01310-100"
assert re.fullmatch(r"\\d{5}-?\\d{3}", cep), "formato inválido"

with urllib.request.urlopen(f"https://viacep.com.br/ws/{cep.replace('-', '')}/json/", timeout=5) as resp:
    dados = json.load(resp)

print("não existe" if dados.get("erro") else f"{dados['logradouro']}, {dados['localidade']}/{dados['uf']}")`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Python 3.9+, sem pip install. Salve cada bloco no arquivo indicado no topo."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar o formato do CEP em Python"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Validação offline, instantânea e sem rede. Serve para barrar erro de digitação no formulário antes de qualquer consulta."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# validador_cep.py: formato (offline, só stdlib)
import re

FORMATO_CEP = re.compile(r"\\d{5}-?\\d{3}")


def cep_formato_valido(cep: str) -> bool:
    """8 dígitos, hífen opcional depois do quinto. Não confirma que o CEP existe."""
    return FORMATO_CEP.fullmatch(cep.strip()) is not None


def normaliza_cep(cep: str) -> str:
    """'01310-100' -> '01310100'. Levanta ValueError se o formato for inválido."""
    if not cep_formato_valido(cep):
        raise ValueError(f"CEP com formato inválido: {cep!r}")
    return cep.strip().replace("-", "")


if __name__ == "__main__":
    for cep in ("01310-100", "01310100", "1310-100", "01310-10", "abcde-fgh"):
        print(f"{cep!r:14} -> {cep_formato_valido(cep)}")`}</code></pre>
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
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# existencia_cep.py: consulta ViaCEP. Salve a Rota 1 como validador_cep.py
import json
import urllib.error
import urllib.request

from validador_cep import cep_formato_valido, normaliza_cep


def cep_existe(cep: str, timeout: float = 5.0) -> bool:
    """True se o CEP existe na base do ViaCEP. Erros de rede propagam como URLError."""
    if not cep_formato_valido(cep):
        return False
    try:
        with urllib.request.urlopen(f"https://viacep.com.br/ws/{normaliza_cep(cep)}/json/", timeout=timeout) as resp:
            dados = json.load(resp)
    except urllib.error.HTTPError as e:
        if e.code == 400:  # ViaCEP responde 400 quando o formato é inválido
            return False
        raise
    return not dados.get("erro")  # CEP inexistente: 200 com {"erro": "true"}


if __name__ == "__main__":
    print(cep_existe("01310-100"))  # True (Av. Paulista, São Paulo)
    print(cep_existe("99999-999"))  # False (formato ok, não existe)
    print(cep_existe("1234"))       # False (formato inválido, nem consulta)`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CEP com pytest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Rode com "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"pytest -q"}</code>{". Os testes trocam o "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"urlopen"}</code>{" por um dublê, então rodam em CI sem acessar a internet."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# test_validador_cep.py (pytest, sem rede: urlopen é trocado por um dublê)
import json
import urllib.request

import pytest

from existencia_cep import cep_existe
from validador_cep import cep_formato_valido, normaliza_cep


@pytest.mark.parametrize("cep", ["01310-100", "01310100", " 01310-100 "])
def test_formato_valido(cep):
    assert cep_formato_valido(cep)


@pytest.mark.parametrize("cep", ["1310-100", "01310-10", "013101000", "abcde-fgh", "", "01310--100"])
def test_formato_invalido(cep):
    assert not cep_formato_valido(cep)


def test_normaliza():
    assert normaliza_cep("01310-100") == "01310100"
    with pytest.raises(ValueError):
        normaliza_cep("123")


class RespostaFalsa:
    def __init__(self, corpo):
        self._corpo = json.dumps(corpo).encode()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def read(self, *args):
        return self._corpo


def test_cep_existente(monkeypatch):
    monkeypatch.setattr(urllib.request, "urlopen", lambda url, timeout=None: RespostaFalsa({"cep": "01310-100", "uf": "SP"}))
    assert cep_existe("01310-100") is True


def test_cep_inexistente(monkeypatch):
    monkeypatch.setattr(urllib.request, "urlopen", lambda url, timeout=None: RespostaFalsa({"erro": "true"}))
    assert cep_existe("99999-999") is False


def test_formato_invalido_nem_consulta(monkeypatch):
    def nao_deveria_chamar(*args, **kwargs):
        raise AssertionError("consultou a rede com CEP inválido")

    monkeypatch.setattr(urllib.request, "urlopen", nao_deveria_chamar)
    assert cep_existe("123") is False`}</code></pre>
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CEP em Python"}</h2>
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
          <Link href="/gerador-cep-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CEP em Python"}</Link>
          <Link href="/validar-cep-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CEP em Node.js"}</Link>
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
        { name: "Python", url: "/validar-cep-python" },
      ]} />
    </PageShell>
  );
}
