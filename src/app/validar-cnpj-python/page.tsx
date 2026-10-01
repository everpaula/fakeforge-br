import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Validar CNPJ em Python: mod-11 + alfanumérico 2026",
  description: "Como validar CNPJ em Python: mod-11 tradicional e alfanumérico (IN RFB 2.229/2024), código standalone, testes com pytest e API FakeForge.",
  keywords: "validar cnpj python, validação de cnpj python, validar cnpj alfanumérico python, cnpj alfanumérico 2026, algoritmo cnpj python, dígito verificador cnpj, mod-11 cnpj",
  alternates: { canonical: "/validar-cnpj-python" },
  openGraph: {
    title: "Validar CNPJ em Python com código pronto",
    description: "Mod-11 + alfanumérico 2026. Código standalone, testes com pytest e dicas de produção.",
    type: "article",
    locale: "pt_BR",
  },
};

const faq = [
  {
    "q": "Como validar CNPJ em Python?",
    "a": "Use a função valida_cnpj desta página. Ela confere os dois dígitos verificadores pelo mod-11 e aceita o CNPJ tradicional e o alfanumérico. Com aceita_letras=False, rejeita letras para sistemas legados. Só biblioteca padrão."
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

export default function ValidarCnpjPython() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">{"Python · algoritmo local + API"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">{"CNPJ em Python"}</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          {"Para validar CNPJ em Python, recalcule os dois dígitos verificadores pelo mod-11 da Receita Federal, com pesos 5 a 2 e 9 a 2, tratando letras como ASCII menos 48."} {"Isso cobre o CNPJ tradicional e o alfanumérico, em vigor desde 01/07/2026 (IN RFB 2.229/2024). Abaixo: uma função Python só com a biblioteca padrão, testes automatizados e conferência com CNPJs gerados pela API."}
        </p>
        <p className="text-xs text-muted-foreground mt-3 max-w-2xl">{"Fonte: Receita Federal. O CNPJ alfanumérico foi instituído pela Instrução Normativa RFB nº 2.229/2024, com vigência a partir de 01/07/2026."}</p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`def valida_cnpj(cnpj: str) -> bool:
    c = [ord(ch) - 48 for ch in cnpj if ch.isalnum()]  # dígito = valor, letra A-Z = 17 a 42
    if len(c) != 14 or len(set(c)) == 1:
        return False
    for i, pesos in ((12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]), (13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])):
        resto = sum(v * p for v, p in zip(c[:i], pesos)) % 11
        if c[i] != (0 if resto < 2 else 11 - resto):
            return False
    return True


print(valida_cnpj("11.222.333/0001-81"))  # True (tradicional)
print(valida_cnpj("12.ABC.345/01DE-35"))  # True (alfanumérico)
print(valida_cnpj("11.222.333/0001-82"))  # False`}</code></pre>
        <p className="text-xs text-muted-foreground mt-2">
          {"Python 3.9+, sem pip install. Salve cada bloco no arquivo indicado no topo."}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Rota 1: validar CNPJ em Python com o algoritmo local"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Uma função só para os dois formatos. O parâmetro de modo legado rejeita letras para sistemas que ainda não migraram para o CNPJ alfanumérico."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# validador_cnpj.py (só stdlib)
import re

FORMATO_CNPJ = re.compile(r"[0-9A-Z]{2}\\.?[0-9A-Z]{3}\\.?[0-9A-Z]{3}/?[0-9A-Z]{4}-?\\d{2}")
PESOS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
PESOS_2 = [6] + PESOS_1  # pesos deslocados para o 2º DV (13 posições)


def _digito(base: str, pesos: list[int]) -> int:
    soma = sum((ord(c) - 48) * p for c, p in zip(base, pesos))  # '0'=0 ... '9'=9, 'A'=17 ... 'Z'=42
    resto = soma % 11
    return 0 if resto < 2 else 11 - resto


def valida_cnpj(cnpj: str, aceita_letras: bool = True) -> bool:
    """mod-11 da Receita Federal. Com aceita_letras=True cobre o CNPJ alfanumérico (IN RFB 2.229/2024)."""
    if not FORMATO_CNPJ.fullmatch(cnpj.strip()):
        return False
    c = re.sub(r"[./-]", "", cnpj.strip())
    if not aceita_letras and not c.isdigit():
        return False
    if len(set(c)) == 1:  # 00.000.000/0000-00 passa na conta, mas é inválido
        return False
    return int(c[12]) == _digito(c[:12], PESOS_1) and int(c[13]) == _digito(c[:13], PESOS_2)


if __name__ == "__main__":
    for cnpj in ("11.222.333/0001-81", "11222333000181", "12.ABC.345/01DE-35", "11.222.333/0001-82", "00.000.000/0000-00"):
        print(f"{cnpj:22} -> {valida_cnpj(cnpj)}")
    print("alfa bloqueado:", valida_cnpj("12.ABC.345/01DE-35", aceita_letras=False))`}</code></pre>
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
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# confere_cnpj_api.py (stdlib). Salve o validador da Rota 1 como validador_cnpj.py
import json
import urllib.request

from validador_cnpj import valida_cnpj


def gera(tipo: str, qtd: int = 20) -> list[str]:
    with urllib.request.urlopen(f"https://fakeforge.com.br/api/generate?type={tipo}&quantity={qtd}", timeout=10) as resp:
        return json.load(resp)["data"]


def troca_ultimo_digito(cnpj: str) -> str:
    return cnpj[:-1] + str((int(cnpj[-1]) + 1) % 10)


for tipo, aceita_letras in (("cnpj", False), ("cnpjAlfa", True)):
    lote = gera(tipo)
    rejeitados = [c for c in lote if not valida_cnpj(c, aceita_letras)]
    aceitos = [c for c in lote if valida_cnpj(troca_ultimo_digito(c), aceita_letras)]
    print(f"{tipo}: {len(lote)} gerados | válidos rejeitados: {len(rejeitados)} | inválidos aceitos: {len(aceitos)}")
    assert not rejeitados and not aceitos`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-3">{"Como testar o validador de CNPJ com pytest"}</h2>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{"Rode com "}<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded">{"pytest -q"}</code>{". Os casos cobrem válidos, inválidos e as bordas de CNPJ."}</p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# test_validador_cnpj.py (pytest)
import pytest

from validador_cnpj import valida_cnpj

NUMERICOS = ["11.222.333/0001-81", "11222333000181", "11.444.777/0001-61"]
ALFANUMERICOS = ["12.ABC.345/01DE-35", "12ABC34501DE35", "A1.B2C.3D4/0001-93"]
INVALIDOS = [
    "11.222.333/0001-82",  # DV errado
    "00.000.000/0000-00",  # repetidos
    "11.222.333/0001-8",   # curto demais
    "12.abc.345/01de-35",  # letras minúsculas não existem no padrão
    "",
]


@pytest.mark.parametrize("cnpj", NUMERICOS + ALFANUMERICOS)
def test_aceita_cnpj_valido(cnpj):
    assert valida_cnpj(cnpj) is True


@pytest.mark.parametrize("cnpj", INVALIDOS)
def test_rejeita_cnpj_invalido(cnpj):
    assert valida_cnpj(cnpj) is False


@pytest.mark.parametrize("cnpj", ALFANUMERICOS)
def test_modo_legado_rejeita_letras(cnpj):
    assert valida_cnpj(cnpj, aceita_letras=False) is False`}</code></pre>
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
        <h2 className="text-xl font-bold text-foreground mb-4">{"Perguntas frequentes sobre validar CNPJ em Python"}</h2>
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
          <Link href="/gerador-cnpj-python" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Gerar CNPJ em Python"}</Link>
          <Link href="/validar-cnpj-nodejs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ em Node.js"}</Link>
          <Link href="/validar-cnpj-curl" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">{"Validar CNPJ via curl"}</Link>
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
        { name: "Python", url: "/validar-cnpj-python" },
      ]} />
    </PageShell>
  );
}
