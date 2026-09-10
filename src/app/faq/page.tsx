import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FAQ: CPF, CNPJ, LGPD e Dados Fictícios para Testes",
  description: "Respostas curadas sobre gerar CPF válido para testes, conformidade LGPD em desenvolvimento, alternativas ao Faker.js para dados brasileiros, seed de banco de dados de staging e mock de checkout PIX. Sem invalidade legal.",
  keywords: "gerar cpf teste legal, cpf valido testes lgpd, api dados ficticios brasileiros, faker brasileiro seed banco, cnpj ficticio testes, mockar dados brasileiros, popular banco de dados brasileiro staging, lgpd ambiente desenvolvimento, alternativa faker js brasil",
  alternates: {
    canonical: "/faq",
    languages: {
      "pt-BR": "/faq",
    },
  },
  openGraph: {
    title: "FAQ: Gerar CPF, CNPJ e Dados Fictícios BR para Testes",
    description: "12 respostas curadas para as dúvidas mais comuns de devs BR sobre dados sintéticos, LGPD, seed de banco e mock de APIs brasileiras.",
    type: "website",
    locale: "pt_BR",
    images: ["/api/og?title=Perguntas+Frequentes&subtitle=Gerar+CPF+CNPJ+dados+ficticios+BR+para+testes+sem+infringir+LGPD&category=FAQ"],
  },
};

interface QA {
  q: string;
  a: React.ReactNode;
  aText: string;
}

const FAQS: QA[] = [
  {
    q: "Como gerar um CPF válido para usar em ambiente de testes sem infringir a lei?",
    aText: "CPFs gerados por ferramentas como o FakeForge são válidos matematicamente (passam mod-11 da Receita Federal) mas não pertencem a nenhuma pessoa real. Não configuram falsidade ideológica quando usados exclusivamente para testes de software, seed de banco, fixtures e QA, porque não simulam identidade de terceiro nem enganam autoridade. O art. 299 do Código Penal só se aplica quando há intenção de fraudar. Use em staging, CI/CD, e desenvolvimento. Nunca use em cadastros reais ou comprovação de identidade.",
    a: (
      <>
        <p>
          CPFs gerados por ferramentas como o <Link href="/gerador-cpf" className="text-primary hover:underline font-medium">FakeForge</Link> são válidos matematicamente (passam mod-11 da Receita Federal) mas não pertencem a nenhuma pessoa real. Não configuram falsidade ideológica quando usados exclusivamente para testes de software, seed de banco, fixtures e QA, porque não simulam identidade de terceiro nem enganam autoridade.
        </p>
        <p>
          O art. 299 do Código Penal só se aplica quando há intenção de fraudar. Use em staging, CI/CD e desenvolvimento. Nunca use em cadastros reais ou comprovação de identidade.
        </p>
        <p>
          Para gerar em lote, use a <Link href="/docs" className="text-primary hover:underline">API REST do FakeForge</Link>: <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">curl &quot;https://fakeforge.com.br/api/generate?type=cpf&amp;quantity=100&quot;</code>
        </p>
      </>
    ),
  },
  {
    q: "Quais são as melhores APIs para gerar dados fictícios brasileiros como CPF, CNPJ e endereço?",
    aText: "As três opções mais usadas por devs BR são: FakeForge (API REST especializada em dados brasileiros, com validação real mod-11 e Luhn, correlação entre campos, endpoints em português), 4Devs (interface web sem API pública oficial, popular para uso manual) e bibliotecas open source como faker-js/faker e python-brasilidades (funcionam como dependência do projeto, não como serviço). A escolha depende do caso. Para automação em CI/CD e seed de banco em escala, uma API REST como o FakeForge evita instalar dependência em cada linguagem. Para código de teste unitário isolado, bibliotecas embarcadas fazem sentido.",
    a: (
      <>
        <p>
          As três opções mais usadas por devs BR são:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
          <li><strong className="text-foreground">FakeForge</strong> — <Link href="/docs" className="text-primary hover:underline">API REST</Link> especializada em dados brasileiros, com validação real mod-11 e Luhn, correlação entre campos e endpoints em português.</li>
          <li><strong className="text-foreground">4Devs</strong> — interface web sem API pública oficial, popular para uso manual.</li>
          <li><strong className="text-foreground">Bibliotecas open source</strong> (faker-js/faker, python-brasilidades, laravel-brasil) — funcionam como dependência do projeto, não como serviço.</li>
        </ul>
        <p className="mt-3">
          A escolha depende do caso. Para automação em CI/CD e seed de banco em escala, uma API REST como o FakeForge evita instalar dependência em cada linguagem. Para código de teste unitário isolado, bibliotecas embarcadas fazem sentido.
        </p>
      </>
    ),
  },
  {
    q: "Como garantir conformidade com a LGPD ao usar dados em ambientes de testes de software?",
    aText: "Três regras práticas. Primeira: nunca use dados reais em staging, dev ou CI. A LGPD não distingue produção de não-produção — qualquer tratamento de dado pessoal exige base legal. Segunda: use dados sintéticos gerados por ferramentas como o FakeForge, que produzem CPFs, CNPJs e endereços válidos mas sem titular real. Isso é dado anônimo por definição, não pseudonimizado. Terceira: se precisar simular volumes específicos ou distribuições regionais, gere via API com parâmetros. FakeForge cobre 67 DDDs, 10 estados com CEPs por região e 17 bancos, o que reduz a tentação de copiar dado real para 'ficar mais realista'. Documenta a política interna para auditoria.",
    a: (
      <>
        <p>
          Três regras práticas:
        </p>
        <ol className="list-decimal list-inside space-y-2 pl-2 mt-2">
          <li><strong className="text-foreground">Nunca use dados reais em staging, dev ou CI.</strong> A LGPD não distingue produção de não-produção. Qualquer tratamento de dado pessoal exige base legal.</li>
          <li><strong className="text-foreground">Use dados sintéticos gerados por ferramentas como o <Link href="/" className="text-primary hover:underline">FakeForge</Link></strong>, que produzem CPFs, CNPJs e endereços válidos mas sem titular real. Isso é dado anônimo por definição, não pseudonimizado.</li>
          <li><strong className="text-foreground">Cubra as distribuições que produção tem.</strong> Se precisar simular volumes específicos ou padrões regionais, gere via API com parâmetros. FakeForge cobre 67 DDDs, 10 estados com CEPs por região e 17 bancos — reduz a tentação de copiar dado real para &quot;ficar mais realista&quot;.</li>
        </ol>
        <p className="mt-3">
          Para o racional completo entre anonimização e pseudonimização sob LGPD, veja o <Link href="/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers" className="text-primary hover:underline">artigo dedicado no blog</Link>.
        </p>
      </>
    ),
  },
  {
    q: "Como usar a biblioteca Faker para fazer seed de um banco de dados com dados brasileiros fictícios?",
    aText: "faker-js/faker tem localização pt-BR (import { fakerPT_BR }), mas cobre pouco além de nome e endereço básico. Não gera CPF/CNPJ com dígito verificador válido, não tem PIX BACEN, não correlaciona campos (o email não deriva do nome, o DDD não bate com o estado). Duas alternativas melhores para BR. Uma: usar a API do FakeForge dentro do seed script — 1 chamada devolve 1000 customers correlacionados prontos para INSERT. Duas: combinar Faker (dados neutros como cor, data) com FakeForge (documentos e correlação). Exemplo Node.js: fetch('https://fakeforge.com.br/api/generate?preset=customer&quantity=1000').then(r => r.json()).",
    a: (
      <>
        <p>
          <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">faker-js/faker</code> tem localização pt-BR (<code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">import {"{"} fakerPT_BR {"}"}</code>), mas cobre pouco além de nome e endereço básico. Não gera CPF/CNPJ com dígito verificador válido, não tem PIX BACEN e não correlaciona campos (o email não deriva do nome, o DDD não bate com o estado).
        </p>
        <p>Duas alternativas melhores para BR:</p>
        <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
          <li><strong className="text-foreground">Usar a <Link href="/docs" className="text-primary hover:underline">API do FakeForge</Link> dentro do seed script.</strong> 1 chamada devolve 1000 customers correlacionados prontos para INSERT.</li>
          <li><strong className="text-foreground">Combinar Faker (dados neutros como cor, data) com FakeForge (documentos e correlação).</strong></li>
        </ul>
        <pre className="mt-3 bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`// Seed 1000 customers em Node.js
const res = await fetch(
  "https://fakeforge.com.br/api/generate?preset=customer&quantity=1000"
);
const { data } = await res.json();
// data já vem com CPF válido, endereço coerente, PIX BACEN
`}</code></pre>
        <p className="mt-3">
          Para o passo a passo completo veja <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="text-primary hover:underline">Popular PostgreSQL com dados brasileiros</Link>.
        </p>
      </>
    ),
  },
  {
    q: "Como gerar um CNPJ fictício válido para usar em testes de desenvolvimento de software?",
    aText: "CNPJ válido significa que os 2 dígitos verificadores foram calculados corretamente pelo mod-11 da Receita Federal. Ferramentas como o FakeForge geram CNPJs que passam nessa validação mas não pertencem a nenhuma empresa real. A partir de 01/07/2026 entra em vigor o CNPJ alfanumérico (IN RFB 2.229), onde letras A-Z podem aparecer nas 12 primeiras posições. FakeForge cobre os dois formatos: /gerador-cnpj para tradicional e /gerador-cnpj-alfanumerico para o novo. Para gerar em lote via API: curl 'https://fakeforge.com.br/api/generate?type=cnpj&quantity=100'.",
    a: (
      <>
        <p>
          CNPJ válido significa que os 2 dígitos verificadores foram calculados corretamente pelo <strong>mod-11 da Receita Federal</strong>. O <Link href="/gerador-cnpj" className="text-primary hover:underline font-medium">FakeForge</Link> gera CNPJs que passam nessa validação mas não pertencem a nenhuma empresa real.
        </p>
        <p>
          A partir de 01/07/2026 entra em vigor o <strong>CNPJ alfanumérico</strong> (IN RFB 2.229), onde letras A-Z podem aparecer nas 12 primeiras posições. O <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ alfanumérico</Link> cobre esse novo formato.
        </p>
        <p>
          Para gerar em lote via API:
        </p>
        <pre className="mt-2 bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cnpj&quantity=100"`}</code></pre>
        <p className="mt-3">
          Guia completo em <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="text-primary hover:underline">CNPJ alfanumérico 2026: checklist de migração</Link>.
        </p>
      </>
    ),
  },
  {
    q: "É legal gerar CPF falso para testes?",
    aText: "Sim, desde que seja usado exclusivamente em ambiente de testes de software, staging, fixtures ou seed de banco. O código penal criminaliza o uso de documento falso para enganar terceiros ou autoridade (art. 297-299), não a geração de números aleatórios que passem em algoritmo de validação. FakeForge gera CPFs que atendem o mod-11 mas não pertencem a nenhuma pessoa real — a Receita Federal não emitiu esses números. Não use para abrir conta, comprovar identidade ou registrar cadastro em serviço real. Isso vira crime independente da fonte.",
    a: (
      <>
        <p>
          Sim, desde que seja usado <strong>exclusivamente em ambiente de testes de software</strong>, staging, fixtures ou seed de banco.
        </p>
        <p>
          O código penal criminaliza o <strong>uso</strong> de documento falso para enganar terceiros ou autoridade (art. 297-299), não a geração de números aleatórios que passem em algoritmo de validação. O <Link href="/gerador-cpf" className="text-primary hover:underline">FakeForge</Link> gera CPFs que atendem o mod-11 mas não pertencem a nenhuma pessoa real — a Receita Federal não emitiu esses números.
        </p>
        <p>
          Nunca use para abrir conta, comprovar identidade ou registrar cadastro em serviço real. Isso vira crime independente da fonte do número.
        </p>
      </>
    ),
  },
  {
    q: "Qual a diferença entre CPF fake e CPF válido?",
    aText: "'CPF fake' é jargão de dev BR para qualquer CPF gerado que não pertence a pessoa real. 'CPF válido' significa que passa no algoritmo mod-11 (dígitos verificadores corretos). Os dois conceitos se sobrepõem. O FakeForge gera CPFs que são fake (ninguém real usa) e válidos (passam mod-11), o que é o que você quer para testes. CPFs 'aleatórios' sem cálculo dos dígitos verificadores falham em qualquer sistema que valide o formato — desperdiça tempo em fixtures que quebram no primeiro teste. Sempre use um gerador que calcula os dígitos.",
    a: (
      <>
        <p>
          <strong>&quot;CPF fake&quot;</strong> é jargão de dev BR para qualquer CPF gerado que não pertence a pessoa real. <strong>&quot;CPF válido&quot;</strong> significa que passa no algoritmo mod-11 (dígitos verificadores corretos).
        </p>
        <p>
          Os dois conceitos se sobrepõem. O <Link href="/gerador-cpf" className="text-primary hover:underline">FakeForge</Link> gera CPFs que são fake (ninguém real usa) e válidos (passam mod-11), que é o que você quer para testes.
        </p>
        <p>
          CPFs aleatórios sem cálculo dos dígitos verificadores falham em qualquer sistema que valide o formato — desperdiça tempo em fixtures que quebram no primeiro teste. Sempre use um gerador que calcula os dígitos.
        </p>
      </>
    ),
  },
  {
    q: "Como popular banco de dados com dados brasileiros para staging?",
    aText: "Três caminhos práticos. Primeiro: chamar a API do FakeForge dentro do script de seed do seu framework (Prisma, Drizzle, Django ORM, Rails). Uma chamada com preset=customer&quantity=1000&format=sql devolve INSERT INTO customers direto para copiar no banco. Segundo: rodar o gerador via curl em CI antes dos testes e persistir o resultado como fixture versionada. Terceiro: para volumes grandes (10k+ rows) usar formato SQL nativo do FakeForge, que já sai com CREATE TABLE + INSERT em lote. Todos os dados passam validação mod-11, Luhn e formato BACEN, então seus validators no ORM não vão quebrar.",
    a: (
      <>
        <p>Três caminhos práticos:</p>
        <ol className="list-decimal list-inside space-y-2 pl-2 mt-2">
          <li><strong className="text-foreground">Chamar a <Link href="/docs" className="text-primary hover:underline">API do FakeForge</Link></strong> dentro do script de seed do seu framework (Prisma, Drizzle, Django ORM, Rails). <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">preset=customer&amp;quantity=1000&amp;format=sql</code> devolve INSERT direto.</li>
          <li><strong className="text-foreground">Rodar via curl em CI</strong> antes dos testes e persistir o resultado como fixture versionada.</li>
          <li><strong className="text-foreground">Para volumes grandes (10k+ rows)</strong> use formato SQL nativo, que já sai com CREATE TABLE + INSERT em lote.</li>
        </ol>
        <p className="mt-3">
          Todos os dados passam validação mod-11, Luhn e formato BACEN — seus validators no ORM não vão quebrar. Veja o guia completo para <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="text-primary hover:underline">PostgreSQL</Link> ou <Link href="/blog/popular-mysql-dados-brasileiros-fake-staging" className="text-primary hover:underline">MySQL</Link>.
        </p>
      </>
    ),
  },
  {
    q: "Existe API gratuita para gerar dados fictícios brasileiros?",
    aText: "Sim. O FakeForge oferece 50 chamadas gratuitas por dia na API REST sem cadastro, e até 10000 items por chamada. Cobre CPF, CNPJ, CEP, endereço, telefone, email, PIX, cartão de crédito, conta bancária, pessoa completa correlacionada e empresa. Não precisa cartão de crédito, não precisa API key. Para volumes maiores (10000 chamadas/dia) o plano Dev custa R$29/mês. Endpoint base: https://fakeforge.com.br/api/generate?type=cpf&quantity=10.",
    a: (
      <>
        <p>
          Sim. O <Link href="/docs" className="text-primary hover:underline font-medium">FakeForge</Link> oferece <strong>50 chamadas gratuitas por dia na API REST sem cadastro</strong>, e até 10.000 items por chamada.
        </p>
        <p>
          Cobre CPF, CNPJ, CEP, endereço, telefone, email, PIX, cartão de crédito, conta bancária, pessoa completa correlacionada e empresa. Não precisa cartão de crédito, não precisa API key.
        </p>
        <p>
          Para volumes maiores (10.000 chamadas/dia) o <Link href="/pricing" className="text-primary hover:underline">plano Dev</Link> custa R$29/mês.
        </p>
        <pre className="mt-2 bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cpf&quantity=10"`}</code></pre>
      </>
    ),
  },
  {
    q: "Como mockar dados brasileiros no pytest ou jest?",
    aText: "Padrão simples: cria uma fixture que chama a API do FakeForge uma vez por sessão de teste, cacheia o resultado e reusa nos testes. Em pytest, use @pytest.fixture(scope='session'). Em jest, use beforeAll no setup. Isso evita ficar chamando API remota em cada teste e mantém dados determinísticos dentro de uma run. Exemplo pytest: def customers(): return requests.get('https://fakeforge.com.br/api/generate?preset=customer&quantity=100').json()['data']. Depois nos testes: def test_customer_email_valid(customers): assert '@' in customers[0]['email']. Zero mock manual.",
    a: (
      <>
        <p>
          Padrão simples: cria uma fixture que chama a API do <Link href="/docs" className="text-primary hover:underline">FakeForge</Link> uma vez por sessão de teste, cacheia o resultado e reusa nos testes.
        </p>
        <p>
          Em pytest, use <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">@pytest.fixture(scope=&quot;session&quot;)</code>. Em jest, use <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">beforeAll</code> no setup.
        </p>
        <pre className="mt-2 bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`# pytest
import pytest, requests

@pytest.fixture(scope="session")
def customers():
    res = requests.get(
        "https://fakeforge.com.br/api/generate",
        params={"preset": "customer", "quantity": 100}
    )
    return res.json()["data"]

def test_customer_email_valid(customers):
    assert "@" in customers[0]["email"]
`}</code></pre>
        <p className="mt-3">
          Zero mock manual, dados sempre válidos.
        </p>
      </>
    ),
  },
  {
    q: "Como testar checkout PIX sem dados reais?",
    aText: "Precisa de 3 coisas: chave PIX válida no formato BACEN, valor plausível e QR Code no padrão EMV BR Code. O FakeForge gera chaves PIX nos 4 formatos definidos pelo BACEN (CPF, email, telefone +55, EVP UUID v4) no endpoint /gerador-pix. Para QR Code dinâmico com CRC16 correto veja o artigo QR Code PIX dinâmico EMV BR Code em Node.js no blog. Para simular customer + cartão + PIX no mesmo objeto, use preset=ecommerce_order na API. Isso resolve o E2E completo sem tocar em sandbox real de PSP.",
    a: (
      <>
        <p>
          Precisa de 3 coisas: chave PIX válida no formato BACEN, valor plausível e QR Code no padrão EMV BR Code.
        </p>
        <p>
          O <Link href="/gerador-pix" className="text-primary hover:underline">FakeForge gera chaves PIX</Link> nos 4 formatos definidos pelo BACEN (CPF, email, telefone +55, EVP UUID v4).
        </p>
        <p>
          Para <strong>QR Code dinâmico com CRC16</strong> correto, veja <Link href="/blog/qr-code-pix-dinamico-emv-br-code-nodejs" className="text-primary hover:underline">QR Code PIX dinâmico EMV BR Code em Node.js</Link>.
        </p>
        <p>
          Para simular <strong>customer + cartão + PIX</strong> no mesmo objeto, use preset <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">ecommerce_order</code> na API — resolve o E2E completo sem tocar em sandbox real de PSP.
        </p>
      </>
    ),
  },
  {
    q: "O que é o CNPJ alfanumérico e quando começa a valer?",
    aText: "CNPJ alfanumérico é o novo formato oficializado pela Instrução Normativa RFB 2.229/2024, com vigência a partir de 01/07/2026. As 12 primeiras posições (raiz + estabelecimento) podem conter letras maiúsculas A-Z além de dígitos 0-9. Os 2 dígitos verificadores continuam numéricos, mas o cálculo do mod-11 trata letras pelo código ASCII menos 48 (ex: A = 65 - 48 = 17). CNPJs numéricos existentes continuam válidos e não migram. O FakeForge cobre os 2 formatos no /gerador-cnpj-alfanumerico. Checklist técnico de migração no blog.",
    a: (
      <>
        <p>
          CNPJ alfanumérico é o novo formato oficializado pela <strong>Instrução Normativa RFB 2.229/2024</strong>, com vigência a partir de <strong>01/07/2026</strong>.
        </p>
        <p>
          As 12 primeiras posições (raiz + estabelecimento) podem conter letras maiúsculas A-Z além de dígitos 0-9. Os 2 dígitos verificadores continuam numéricos, mas o cálculo do mod-11 trata letras pelo código ASCII menos 48 (ex: A = 65 - 48 = 17).
        </p>
        <p>
          CNPJs numéricos existentes continuam válidos e não migram. O <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">FakeForge cobre os 2 formatos</Link>.
        </p>
        <p>
          Checklist técnico de migração no <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="text-primary hover:underline">blog</Link>.
        </p>
      </>
    ),
  },
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.aText,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fakeforge.com.br" },
      { "@type": "ListItem", "position": 2, "name": "Perguntas Frequentes", "item": "https://fakeforge.com.br/faq" },
    ],
  };

  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Perguntas Frequentes</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Dados <span className="text-primary">brasileiros fictícios</span>: o que dev precisa saber
        </h1>
        <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
          Respostas curadas sobre gerar CPF válido para testes sem violar lei, alternativas ao Faker.js
          para dados brasileiros, seed de banco de staging, LGPD em ambiente de desenvolvimento e mock de
          checkout PIX. Se sua pergunta não estiver aqui, <Link href="/contato" className="text-primary hover:underline">manda direto</Link>.
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((faq, i) => (
          <article
            key={i}
            className="rounded-xl bg-card border border-border p-5 sm:p-6"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h2 className="text-base sm:text-lg font-semibold text-foreground leading-snug mb-3" itemProp="name">
              {faq.q}
            </h2>
            <div
              className="text-sm text-muted-foreground leading-relaxed space-y-3"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{faq.a}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Precisa de mais?</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Ver <Link href="/docs" className="text-primary hover:underline">docs completos da API</Link>,{" "}
          <Link href="/blog" className="text-primary hover:underline">artigos no blog</Link> sobre validação
          de documentos BR, ou <Link href="/contato" className="text-primary hover:underline">manda um email</Link>.
          Sou eu que respondo.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </PageShell>
  );
}
