import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";

export const metadata: Metadata = {
  title: "Validar CPF: como checar se um CPF é válido online e no código",
  description: "Entenda o algoritmo mod-11 do CPF, implemente a validação em JavaScript e Python, e saiba quando consultar a Receita Federal sem violar a LGPD.",
  openGraph: {
    title: "Validar CPF: como checar se um CPF é válido online e no código",
    description: "Entenda o algoritmo mod-11 do CPF, implemente a validação em JavaScript e Python, e saiba quando consultar a Receita Federal sem violar a LGPD.",
    type: "article",
    images: ["/api/og?title=Validar%20CPF%3A%20como%20checar%20se%20um%20CPF%20%C3%A9%20v%C3%A1lido%20online%20e%20no%20c%C3%B3digo&subtitle=Entenda%20o%20algoritmo%20mod-11%20do%20CPF%2C%20implemente%20a%20valida%C3%A7%C3%A3o%20em%20JavaScript%20e%20Python%2C%20e%20saiba%20quando%20consultar%20a%20Receita%20Federal%20sem%20violar%20a%20LG&category=TUTORIAIS"],
  },
  alternates: { canonical: "/blog/como-validar-cpf-online-e-no-codigo" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="Tutoriais" title="Validar CPF: como checar se um CPF é válido online e no código" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Validar CPF: como checar se um CPF é válido online e no código
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>03 de junho de 2026</time>
            <span>·</span>
            <span>9 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">CPF válido e CPF de pessoa real existente são coisas distintas. Um CPF pode passar no algoritmo mod-11, ter máscara correta e ainda assim estar suspenso, cancelado ou nunca ter sido emitido. Entender essa diferença evita bugs silenciosos em produção e, mais importante, evita decisões erradas baseadas em dados que parecem corretos mas não são.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O que define um CPF como válido</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Estrutura do documento: 9 dígitos base e 2 verificadores</h3>
          <p className="mb-4">O CPF tem 11 dígitos numéricos: 9 dígitos base (D1 a D9) e 2 dígitos verificadores (D10 e D11). A máscara padrão é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">NNN.NNN.NNN-DD</code>. Os primeiros 8 dígitos são sequenciais dentro de uma região fiscal; o nono identifica a Superintendência Regional da Receita Federal (SRRF) responsável pela inscrição.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que o dígito verificador garante (e o que não garante)</h3>
          <p className="mb-4">Os dígitos D10 e D11 são derivados dos 9 anteriores via algoritmo mod-11. Eles garantem que qualquer erro de digitação em um único dígito resulta num CPF com verificadores incorretos. Isso cobre transposições simples e erros de uma tecla.</p>
          <p className="mb-4">O que os verificadores não garantem: que o CPF foi emitido, que pertence a uma pessoa viva, ou que está ativo na base da Receita Federal. Um CPF pode ser matematicamente perfeito e ainda assim nunca ter existido.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CPFs matematicamente válidos que a Receita Federal rejeita</h3>
          <p className="mb-4">Além das regras do algoritmo, a Receita Federal reserva alguns intervalos como inválidos por definição. O mais conhecido é a lista de CPFs com todos os dígitos iguais: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">000.000.000-00</code>, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">111.111.111-11</code> até <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">999.999.999-99</code>. Qualquer implementação que não bloqueie esses casos vai aceitar valores claramente fictícios como válidos.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">O algoritmo mod-11 explicado passo a passo</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cálculo do primeiro dígito verificador</h3>
          <p className="mb-4">Pegue os 9 primeiros dígitos e multiplique cada um por um peso decrescente, de 10 a 2:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-">{"D1×10 + D2×9 + D3×8 + D4×7 + D5×6 + D6×5 + D7×4 + D8×3 + D9×2"}</code></pre>
          <p className="mb-4">Some os produtos. Calcule o resto da divisão por 11. Se o resto for 0 ou 1, o primeiro verificador é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>. Caso contrário, é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cálculo do segundo dígito verificador</h3>
          <p className="mb-4">Repita o processo com os 10 primeiros dígitos (incluindo D10 já calculado), com pesos de 11 a 2. Mesma regra de resto: se resto for menor que 2, verificador é <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">0</code>; senão, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">11 - resto</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Casos especiais obrigatórios: CPFs com todos os dígitos iguais</h3>
          <p className="mb-4">Os 10 CPFs com todos os dígitos iguais (de <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">00000000000</code> a <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">99999999999</code>) passam matematicamente no mod-11 porque a soma dos produtos sempre produz um verificador consistente com a sequência. A Receita Federal os rejeita por critério administrativo. Toda implementação precisa checar esse caso explicitamente antes de rodar o algoritmo.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em TypeScript/JavaScript</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">validarCPF</code> anotada linha a linha</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"export function validarCPF(cpf: string): boolean {\n  // Remove máscara: pontos e traço\n  const digits = cpf.replace(/[.\\-]/g, \"\").trim();\n\n  // Rejeita comprimento errado ou não-numérico\n  if (!/^\\d{11}$/.test(digits)) return false;\n\n  // Rejeita CPFs com todos os dígitos iguais\n  if (/^(\\d)\\1{10}$/.test(digits)) return false;\n\n  const calc = (length: number): number => {\n    let sum = 0;\n    for (let i = 0; i < length; i++) {\n      sum += parseInt(digits[i]) * (length + 1 - i);\n    }\n    const remainder = sum % 11;\n    return remainder < 2 ? 0 : 11 - remainder;\n  };\n\n  const d10 = calc(9);\n  const d11 = calc(10);\n\n  return d10 === parseInt(digits[9]) && d11 === parseInt(digits[10]);\n}"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Remover máscara antes de calcular (erro mais comum)</h3>
          <p className="mb-4">O erro mais frequente em produção é receber <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">"123.456.789-09"</code> e tentar calcular diretamente sobre a string com pontuação. O caractere <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">"."</code> vira <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">NaN</code> no <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">parseInt</code>, o que faz a soma retornar <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">NaN</code> e o verificador calculado nunca bate com o esperado. A função acima trata isso na primeira linha com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">replace(/[.\-]/g, "")</code>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Conjunto de casos de teste: válidos, inválidos, edge cases</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"import { describe, it, expect } from \"vitest\";\nimport { validarCPF } from \"./cpf\";\n\ndescribe(\"validarCPF\", () => {\n  it(\"aceita CPF válido sem máscara\", () => {\n    expect(validarCPF(\"52998224725\")).toBe(true);\n  });\n\n  it(\"aceita CPF válido com máscara\", () => {\n    expect(validarCPF(\"529.982.247-25\")).toBe(true);\n  });\n\n  it(\"rejeita CPF com dígito errado\", () => {\n    expect(validarCPF(\"52998224724\")).toBe(false);\n  });\n\n  it(\"rejeita 111.111.111-11\", () => {\n    expect(validarCPF(\"111.111.111-11\")).toBe(false);\n  });\n\n  it(\"rejeita string vazia\", () => {\n    expect(validarCPF(\"\")).toBe(false);\n  });\n\n  it(\"rejeita CPF com letras\", () => {\n    expect(validarCPF(\"529.982.247-2A\")).toBe(false);\n  });\n\n  it(\"rejeita CPF com comprimento errado\", () => {\n    expect(validarCPF(\"5299822472\")).toBe(false);\n  });\n});"}</code></pre>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Implementação em Python</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Função <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">valida_cpf</code> equivalente com tipagem</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-python">{"import re\n\ndef valida_cpf(cpf: str) -> bool:\n    digits = re.sub(r\"[.\\-]\", \"\", cpf).strip()\n\n    if not re.fullmatch(r\"\\d{11}\", digits):\n        return False\n\n    if len(set(digits)) == 1:\n        return False\n\n    def calc(length: int) -> int:\n        total = sum(int(digits[i]) * (length + 1 - i) for i in range(length))\n        remainder = total % 11\n        return 0 if remainder < 2 else 11 - remainder\n\n    return calc(9) == int(digits[9]) and calc(10) == int(digits[10])"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Integração com Pydantic v2 como validador de campo personalizado</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-python">{"from pydantic import BaseModel, field_validator\n\nclass Cliente(BaseModel):\n    nome: str\n    cpf: str\n\n    @field_validator(\"cpf\")\n    @classmethod\n    def cpf_valido(cls, v: str) -> str:\n        if not valida_cpf(v):\n            raise ValueError(\"CPF inválido\")\n        return v"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Uso em Django Forms e FastAPI</h3>
          <p className="mb-4">Em Django Forms, implemente <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">clean_cpf</code> no formulário:</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-python">{"def clean_cpf(self):\n    cpf = self.cleaned_data.get(\"cpf\", \"\")\n    if not valida_cpf(cpf):\n        raise forms.ValidationError(\"CPF inválido.\")\n    return cpf"}</code></pre>
          <p className="mb-4">Em FastAPI, o modelo Pydantic com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">@field_validator</code> já funciona como dependência: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">async def criar_cliente(cliente: Cliente)</code>. O framework chama a validação automaticamente antes de entrar no handler.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Validar CPF online: o que cada ferramenta faz de fato</h2>
          <p className="mb-4">Existem três categorias de "validação online" e elas não são equivalentes.</p>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Ferramenta</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">O que faz</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Dado sai da máquina?</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Algoritmo local (biblioteca, regex)</td><td className="px-3 py-2">Verifica formato e dígitos verificadores</td><td className="px-3 py-2">Não</td></tr><tr className="border-b border-border"><td className="px-3 py-2"><Link href="/validar-cpf" className="text-primary hover:underline">FakeForge /validar-cpf</Link></td><td className="px-3 py-2">Algoritmo client-side, sem requisição ao servidor</td><td className="px-3 py-2">Não</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Portal da Receita Federal</td><td className="px-3 py-2">Consulta situação cadastral real</td><td className="px-3 py-2">Sim, CPF trafega ao servidor da RF</td></tr></tbody></table></div>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validação de formato (algoritmo local, sem rede)</h3>
          <p className="mb-4">Qualquer implementação do mod-11 roda completamente offline. Não há motivo para enviar o CPF a um servidor externo apenas para checar o formato. Isso aplica tanto para validação em formulários públicos quanto para suítes de testes automatizados.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">FakeForge <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">/validar-cpf</code>: validação client-side, nenhum dado trafega ao servidor</h3>
          <p className="mb-4">O <Link href="/validar-cpf" className="text-primary hover:underline">validador de CPF do FakeForge</Link> executa o algoritmo diretamente no navegador via JavaScript. O CPF digitado não é enviado a nenhuma API, não é registrado em log e não é armazenado. Útil para checar rapidamente se um CPF de fixture está correto ou para confirmar o resultado do seu próprio algoritmo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Receita Federal: situação cadastral pública vs. dados protegidos</h3>
          <p className="mb-4">O portal de consulta de situação cadastral permite verificar se um CPF está regular, suspenso, cancelado ou pendente de regularização. Para isso, o CPF é enviado ao servidor da Receita. O retorno é público: nome completo, situação e data de inscrição. Nenhum dado financeiro ou endereço é retornado sem convênio formal.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Consulta de situação cadastral na Receita Federal</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que o portal da Receita revela: nome, situação, data de inscrição</h3>
          <p className="mb-4">A consulta pública retorna três campos: nome completo do titular, situação cadastral atual e data de inscrição. Isso é suficiente para confirmar que o CPF foi emitido e está ativo, mas não é suficiente para verificar identidade porque qualquer pessoa com o número pode consultar.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que não está disponível sem convênio formal</h3>
          <p className="mb-4">Endereço, data de nascimento, nome da mãe, vínculos trabalhistas e dados fiscais são protegidos. O acesso programático a esses dados exige convênio com a Receita Federal, com base jurídica explícita e aprovação do comitê de segurança da informação da RF.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Scraping do portal da Receita: por que é arriscado tecnicamente e juridicamente</h3>
          <p className="mb-4">Tecnicamente: o portal usa CAPTCHA e pode retornar rate-limiting ou banimento de IP sem aviso. Juridicamente: automatizar o acesso ao portal pode configurar acesso não autorizado a sistema informático, nos termos da <a href="http://www.planalto.gov.br/ccivil_03/leis/l9983.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Lei 9.983/2000, que inseriu os Art. 313-A e Art. 313-B no Código Penal</a>. Há precedentes de autuações administrativas e inquéritos.</p>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic"><strong className="text-foreground">AVISO:</strong> Nunca automatize scraping do portal da Receita Federal sem convênio formal. Além do risco jurídico, qualquer dado obtido dessa forma não tem base legal sob a LGPD e não pode ser armazenado ou processado.</blockquote>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">LGPD e validação de CPF: onde está a linha</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CPF como dado pessoal direto (LGPD Art. 5º, I — Lei 13.709/2018)</h3>
          <p className="mb-4">O CPF identifica diretamente uma pessoa natural. Ele se enquadra como dado pessoal nos termos do <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Art. 5º, I da Lei 13.709/2018</a>, o que significa que qualquer operação sobre ele (coleta, armazenamento, transmissão, consulta) exige base legal documentada.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Bases legais para tratar CPF em produção: Art. 7º, II (contrato) e Art. 7º, IX (legítimo interesse)</h3>
          <p className="mb-4">As duas bases mais usadas em contexto de desenvolvimento de software são:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Art. 7º, II:</strong> execução de contrato do qual o titular é parte. Se o usuário está comprando um produto e o CPF é necessário para emissão de nota fiscal, há base legal clara.</li><li><strong className="text-foreground">Art. 7º, IX:</strong> legítimo interesse do controlador. Aplicável quando o tratamento é necessário para prevenir fraude, desde que não sobreponha os direitos do titular. Exige Relatório de Impacto (RIPD) para casos de alto risco.</li></ul>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validar formato em formulário público não requer consentimento, mas armazenar exige</h3>
          <p className="mb-4">Rodar o algoritmo mod-11 no navegador, sem transmitir o CPF, não constitui tratamento de dado pessoal sob a LGPD porque nenhum dado sai da máquina do usuário. O momento que exige base legal é o armazenamento ou transmissão. Um formulário de cadastro que coleta CPF deve ter aviso de privacidade claro antes do envio.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Gerar CPFs válidos para testes sem risco de LGPD</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que usar CPFs fictícios em fixtures e seeds</h3>
          <p className="mb-4">CPFs reais em seeds de banco de dados ou fixtures de testes violam o princípio da minimização de dados (LGPD Art. 6º, III). Além do risco legal, expõem dados pessoais a desenvolvedores que não precisam deles, aumentam a superfície de um eventual vazamento e podem travar pipelines de CI/CD que rodam em infraestrutura de terceiros.</p>
          <p className="mb-4">A solução direta é usar <Link href="/gerador-cpf" className="text-primary hover:underline">CPFs gerados especificamente para testes</Link>: matematicamente válidos, sem correspondência com pessoas reais.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">FakeForge API: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">GET /api/generate?type=cpf&amp;quantity=50&amp;format=json</code></h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-bash">{"curl \"https://fakeforge.com.br/api/generate?type=cpf&quantity=10&format=json\""}</code></pre>
          <p className="mb-4">O retorno inclui um campo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">_meta</code> com fonte, URL e data de geração, seguido do array <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">data</code> com os CPFs.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Exportação SQL com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">CREATE TABLE</code> pronto para popular banco de testes</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"const res = await fetch(\n  \"https://fakeforge.com.br/api/generate?type=cpf&quantity=50&format=sql\"\n);\nconst sql = await res.text();\n// sql contém CREATE TABLE + INSERT INTO prontos para executar\nawait db.execute(sql);"}</code></pre>
          <p className="mb-4">A mesma chamada funciona com <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">type=pessoa</code> para obter CPF, nome e endereço correlacionados, o que evita dados incoerentes em testes de integração. Veja a <Link href="/docs" className="text-primary hover:underline">referência completa da API REST</Link> e os <Link href="/pricing" className="text-primary hover:underline">planos para uso em CI/CD</Link>. Para <Link href="/gerador-pessoa" className="text-primary hover:underline">gerar uma pessoa completa com CPF, nome e endereço correlacionados</Link>, troque <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">type=cpf</code> por <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">type=pessoa</code>.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Erros frequentes na implementação de validação de CPF</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Não remover pontos e traço antes de calcular</h3>
          <p className="mb-4">O erro mais recorrente em code review. A entrada pode vir com ou sem máscara dependendo de onde o CPF foi coletado. Sempre normalize antes de qualquer cálculo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Ignorar a lista de CPFs universalmente inválidos</h3>
          <p className="mb-4">Os 10 CPFs com dígitos repetidos passam no mod-11. Sem a checagem explícita, <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">111.111.111-11</code> retorna <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">true</code>. Isso costuma aparecer como dado de teste em bancos de produção quando desenvolvedores usam valores triviais sem perceber que são aceitos pelo algoritmo.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Tratar "formato válido" como "CPF de pessoa real existente"</h3>
          <p className="mb-4">O algoritmo valida estrutura, não existência. Um CPF pode ser válido matematicamente e nunca ter sido emitido. Se o negócio exige confirmação de existência, isso requer consulta à Receita Federal com base legal adequada.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Validar apenas no front-end sem repetir no servidor</h3>
          <p className="mb-4">Validação no cliente melhora UX, mas não substitui a validação no servidor. Qualquer chamada direta à API bypassa o front-end. Valide o CPF no handler antes de persistir.</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li>Implemente o mod-11 com dois dígitos verificadores e bloqueie explicitamente os 10 CPFs com dígitos todos iguais antes de rodar qualquer cálculo.</li><li>Sempre normalize a entrada removendo pontos e traço; esse é o erro de implementação mais comum e silencioso.</li><li>Validação de formato roda 100% offline. Só consulte a Receita Federal quando precisar confirmar situação cadastral, e apenas com base legal documentada (Art. 7º, II ou IX da LGPD).</li><li>CPF é dado pessoal direto (LGPD Art. 5º, I); armazenar ou transmitir sem base legal expõe o controlador a sanções da ANPD.</li><li>Use CPFs gerados pelo <Link href="/gerador-cpf" className="text-primary hover:underline">FakeForge</Link> em fixtures e seeds. Nunca use CPFs reais em ambientes de desenvolvimento ou CI/CD.</li><li><Link href="/validar-cpf" className="text-primary hover:underline">Valide qualquer CPF diretamente no navegador</Link> sem transmitir o dado a nenhum servidor.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Qual é a diferença entre valid" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Qual é a diferença entre validação client-side e servidor? Preciso fazer em ambos?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Validação client-side melhora UX e reduz requisições desnecessárias, mas não é segura. Qualquer cliente pode modificar o JavaScript ou chamar a API diretamente. Sempre valide no servidor antes de persistir. O cliente é para feedback; o servidor é a linha de defesa real.</p>
            </details>
            <details key="Por que alguns validadores ace" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Por que alguns validadores aceitam 111.111.111-11 se é inválido?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Porque esses valores passam no mod-11 matematicamente. Sem checagem explícita de dígitos repetidos antes do cálculo, o algoritmo retorna verdadeiro. A Receita Federal rejeita por critério administrativo, não matemático. Sempre bloqueie os 10 CPFs com dígitos iguais no início da função, antes de fazer qualquer conta.</p>
            </details>
            <details key="Como testo meu validador de CP" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como testo meu validador de CPF sem usar dados reais?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Use a API do FakeForge: `GET /api/generate?type=cpf&amp;format=json` retorna CPFs válidos gerados. Ou copie CPFs dos testes do artigo. Nunca use CPFs reais em fixtures de banco de dados ou CI/CD — viola minimização de dados da LGPD e expõe dados pessoais desnecessariamente. CPFs fictícios passam no seu algoritmo e são legais.</p>
            </details>
            <details key="Se meu validador rejeita um CP" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se meu validador rejeita um CPF, sempre significa que é fictício?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. Um CPF pode ser rejeitado porque: 1) formato errado (pontuação, comprimento); 2) dígitos verificadores errados (erro de digitação); 3) dígitos todos iguais (reservado). Nenhum desses casos prova se é real ou fictício. Só a Receita Federal confirma existência. O validador prova apenas que o formato não é válido segundo a regra mod-11.</p>
            </details>
            <details key="Preciso consultar a Receita Fe" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Preciso consultar a Receita Federal toda vez que um usuário se cadastra?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não recomendado. Consulta sobrecarrega o portal da Receita e viola dados sem necessidade real. Base legal sob LGPD (Art. 7º) exige que o tratamento seja necessário, não confortável. Se o negócio exige validação de existência, consulte apenas para cadastros de alto risco (grandes transações, documentação fiscal). Para cadastros simples, validação de formato é suficiente.</p>
            </details>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Qual é a diferença entre validação client-side e servidor? Preciso fazer em ambos?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Validação client-side melhora UX e reduz requisições desnecessárias, mas não é segura. Qualquer cliente pode modificar o JavaScript ou chamar a API diretamente. Sempre valide no servidor antes de persistir. O cliente é para feedback; o servidor é a linha de defesa real.\"}},{\"@type\":\"Question\",\"name\":\"Por que alguns validadores aceitam 111.111.111-11 se é inválido?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Porque esses valores passam no mod-11 matematicamente. Sem checagem explícita de dígitos repetidos antes do cálculo, o algoritmo retorna verdadeiro. A Receita Federal rejeita por critério administrativo, não matemático. Sempre bloqueie os 10 CPFs com dígitos iguais no início da função, antes de fazer qualquer conta.\"}},{\"@type\":\"Question\",\"name\":\"Como testo meu validador de CPF sem usar dados reais?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Use a API do FakeForge: `GET /api/generate?type=cpf&format=json` retorna CPFs válidos gerados. Ou copie CPFs dos testes do artigo. Nunca use CPFs reais em fixtures de banco de dados ou CI/CD — viola minimização de dados da LGPD e expõe dados pessoais desnecessariamente. CPFs fictícios passam no seu algoritmo e são legais.\"}},{\"@type\":\"Question\",\"name\":\"Se meu validador rejeita um CPF, sempre significa que é fictício?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. Um CPF pode ser rejeitado porque: 1) formato errado (pontuação, comprimento); 2) dígitos verificadores errados (erro de digitação); 3) dígitos todos iguais (reservado). Nenhum desses casos prova se é real ou fictício. Só a Receita Federal confirma existência. O validador prova apenas que o formato não é válido segundo a regra mod-11.\"}},{\"@type\":\"Question\",\"name\":\"Preciso consultar a Receita Federal toda vez que um usuário se cadastra?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não recomendado. Consulta sobrecarrega o portal da Receita e viola dados sem necessidade real. Base legal sob LGPD (Art. 7º) exige que o tratamento seja necessário, não confortável. Se o negócio exige validação de existência, consulte apenas para cadastros de alto risco (grandes transações, documentação fiscal). Para cadastros simples, validação de formato é suficiente.\"}}]}",
        }}
      />
    </PageShell>
  );
}
