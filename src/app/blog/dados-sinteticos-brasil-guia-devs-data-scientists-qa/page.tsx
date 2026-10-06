import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "Dados Sintéticos no Brasil: Guia pra Devs, QA e ML",
  description:
    "Guia completo de dados sintéticos no mercado BR: diferença entre anonimização e dados sintéticos, casos de uso em ML, compliance LGPD, ferramentas disponíveis. Com exemplos.",
  keywords:
    "dados sintéticos brasil, synthetic data BR, gerador dados sintéticos, dados sintéticos LGPD, dados teste ML, data augmentation, data scientist synthetic data, QA dados sintéticos, compliance dados teste",
  openGraph: {
    title: "Dados Sintéticos no Brasil: Guia pra Devs, QA e ML",
    description:
      "Aprenda como usar dados sintéticos em desenvolvimento, testes e machine learning. Diferenças técnicas, casos de uso, conformidade LGPD e ferramentas disponíveis para o mercado brasileiro.",
    type: "article",
    images: [
      "/api/og?title=Dados%20Sintéticos&subtitle=Guia%20Completo%20Brasil&category=SYNTHETIC%20DATA",
    ],
  },
  alternates: {
    canonical:
      "/blog/dados-sinteticos-brasil-guia-devs-data-scientists-qa",
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link
          href="/blog"
          className="text-xs text-primary hover:underline mb-4 inline-block"
        >
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage
          category="Synthetic Data"
          title="Dados Sintéticos no Brasil: Guia Completo pra Devs, Data Scientists e QA"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            Dados Sintéticos no Brasil: o que são, por que importam, como usar
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>1º de outubro de 2026</time>
            <span>·</span>
            <span>16 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            Dados sintéticos são o futuro da engenharia de dados no Brasil. AWS, Microsoft Azure e Snowflake já posicionam "dados sintéticos" como categoria estratégica em seus anúncios de roadmap. Data scientists em startups de IA estão usando sintéticos para treinar modelos sem depender de aprovação de compliance. Times de QA em grandes corporações adotam dados sintéticos para eliminar gargalos de preparação de ambiente. Neste guia você aprende o que são, por que o mercado BR adota devagar, e como começar hoje mesmo com segurança jurídica e qualidade técnica.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 my-4 text-sm">
            <p className="font-semibold text-foreground mb-2">TL;DR</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • Dados sintéticos são informações geradas por algoritmo que nunca foram pessoais
              </li>
              <li>
                • Fora do escopo LGPD por definição — use à vontade em dev, teste e ML
              </li>
              <li>
                • 3 técnicas que NÃO são dados sintéticos: anonimização fraca, pseudonimização, "mascaramento" de produção
              </li>
            </ul>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 1: O que são dados sintéticos (sem jargão)
          </h2>

          <p className="mb-4">
            <strong>Definição simples:</strong> Dados sintéticos são números, textos, datas e outros valores gerados por algoritmo, que nunca existiram como referência a uma pessoa ou organização real.
          </p>

          <p className="mb-4">
            Diferente de anonimização (remover referência de dados reais) ou pseudonimização (substituir por hash), dados sintéticos nascerão do zero. Você pega um gerador, diz "crie 1000 CPFs válidos", recebe 1000 CPFs que passam em validação mod-11 da Receita Federal, mas nenhum deles corresponde a ninguém real.
          </p>

          <p className="mb-4">
            AWS define: "Synthetic data is data that is artificially manufactured rather than produced by real-world events." Microsoft chama: "Synthetic data generation uses artificial or simulated data instead of real data." Ambos nomeiam como categoria estratégica porque o problema é real: treinar IA, testar software, prototipar features — tudo sem risco de privacidade.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplos de dados sintéticos
          </h3>

          <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
            <li>CPF "123.456.789-09" (válido por mod-11, mas inexistente)</li>
            <li>Email "joao.silva.123456789@outlook.com" (formato real, destinatário sintético)</li>
            <li>
              Registro de compra: "cliente sintético A comprou 5 unidades em 2026-10-01" (distribuição realista, mas cliente nunca existiu)
            </li>
            <li>Imagem de rosto gerado por GAN (looks real, but person doesn't exist)</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplos que NÃO são sintéticos
          </h3>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>
              CPF real com hash: "a9f8d3c2b1e0..." (ainda é pseudo-pessoal, LGPD aplica-se)
            </li>
            <li>
              "Dados reais com nomes truncados": "Jo*** Si***" (técnica fraca, ainda é pessoal)
            </li>
            <li>
              Copiar produção pra staging: (maior risco de multa LGPD possível)
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 2: Anonimização vs Pseudonimização vs Dados Sintéticos
          </h2>

          <p className="mb-4">
            Aqui é onde muita gente se perde. Existem três técnicas, mas a lei trata cada uma diferente:
          </p>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Técnica
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Como funciona
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    LGPD Art.
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Risco
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-foreground font-medium">
                    Pseudonimização
                  </td>
                  <td className="px-3 py-2">
                    Substitui identificador por outro (hash, UUID) mantendo vínculo
                  </td>
                  <td className="px-3 py-2">Art. 5, III + 12</td>
                  <td className="px-3 py-2">
                    <span className="text-yellow-600">Alto</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-foreground font-medium">
                    Anonimização
                  </td>
                  <td className="px-3 py-2">
                    Remove referência de modo que re-identificação é inviável tecnicamente
                  </td>
                  <td className="px-3 py-2">Art. 12, § 2º</td>
                  <td className="px-3 py-2">
                    <span className="text-green-600">Muito baixo</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-foreground font-semibold">
                    Dados Sintéticos
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    Gera do zero, nunca foi pessoal
                  </td>
                  <td className="px-3 py-2 font-semibold">Não se aplica</td>
                  <td className="px-3 py-2 font-semibold">
                    <span className="text-green-600">Zero</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            <strong>LGPD Art. 12, § 2º diz:</strong> "Dados anonimizados são aqueles cuja re-identificação não é possível por meio de esforço técnico viável na atividade ordinária".
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            <strong>O problema:</strong> Pseudonimização não atinge esse padrão. Um CPF hasheado ainda é pseudonimizado — se você tem a chave de hash, recupera o CPF original. A ANPD considera pseudônimos como "dados pessoais" e exige consentimento ou justificativa de interesse legítimo.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Por que dados sintéticos ganham:</strong> Nunca foram pessoais, logo LGPD não aplica-se por definição. Sem consentimento necessário. Sem risco de re-identificação. Sem multa.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 3: Por que mercado BR adota devagar
          </h2>

          <p className="mb-4">
            Você já notou? Dados sintéticos existem desde 2015 (Faker.js, Mockaroo), mas Brasil adota com atraso:
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            1. Falta de educação
          </h3>

          <p className="mb-4">
            "Dados sintéticos" é termo desconhecido fora de bolhas de data science. Desenvolvedores e QAs conhecem "dados de teste" e "dados fake" (Faker.js), mas conceito de "sintético" como categoria técnica legal não é difundido em universidades ou bootcamps BR.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            2. Hábito enraizado de copiar produção
          </h3>

          <p className="mb-4">
            Prática comum: "copiar base de produção para staging, depois apagar nomes de clientes". Funciona? Reduz tempo de setup. É seguro? A ANPD discorda. Times não mudaram o hábito porque não conhecem alternativa que seja rápida.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            3. Ferramentas genéricas (Faker.js, Mockaroo) não validam Brasil
          </h3>

          <p className="mb-4">
            Mockaroo gera CPF no formato "XXX.XXX.XXX-XX", mas dígito verificador é aleatório. Faker.js gera nome e email, mas sem correlação. Sua validação de CPF rejeita gerado por Mockaroo, então você acaba voltando a produção. Ciclo vicioso.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            4. Oportunidade: LGPD multas subindo, CNPJ 2026, ML expansion
          </h3>

          <p className="mb-8">
            Agora em 2026, três fatores acelerem adoção:
          </p>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>
              <strong className="text-foreground">Multas LGPD subindo:</strong> ANPD está ativa desde 2022. Copiar dados reais para dev não tem justificativa legal mais forte.
            </li>
            <li>
              <strong className="text-foreground">CNPJ alfanumérico em julho/2026:</strong> Sistemas precisam testar novo formato antes de virar obrigatório. Dados sintéticos permitem escalar testes sem esperar cliente real com CNPJ novo.
            </li>
            <li>
              <strong className="text-foreground">Startups de IA no BR:</strong> Precisam de milhares de exemplos para treinar modelos. Anonimizar dados reais custa R$500-2000/mês. Gerar sintéticos custa R$29/mês.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 4: Casos de uso detalhados
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Dev Backend: Seed de staging
          </h3>

          <p className="mb-4">
            Seu backend valida CPF com mod-11 antes de aceitar cadastro. Testar localmente exige dados válidos. Mockaroo falha. Copiar produção é risco LGPD. Solução: FakeForge API gera 1000 CPFs válidos em JSON, importa no banco em 30 segundos.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            QA Engineer: BDD com massa correlacionada
          </h3>

          <p className="mb-4">
            Seu teste de Gherkin exige "quando cliente de São Paulo tenta comprar", precisa base com clientes de São Paulo. Criar manualmente é lento. Dados sintéticos garantem correlação: CEP, cidade, estado — tudo coerente. Seu teste passa, risco de bug por inconsistência geográfica cai.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Data Scientist: Data augmentation para ML
          </h3>

          <p className="mb-4">
            Seu dataset real tem 5000 exemplos de transação. Para treinar modelo robusto de detecção de fraude, precisa 50 mil. Comprar dados fica caro. Anonimizar em-house demora 2 meses. Solução: usar os 5000 reais como "padrão", depois gerar 45 mil sintéticos com mesma distribuição. Modelo treina mais rápido, com melhor generalização.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pesquisador de Mercado: Personas para survey
          </h3>

          <p className="mb-4">
            Você quer mapear disposição de pagamento por idade e região. Coleta real levaria 3 meses. Solução: gere 1000 personas sintéticas com perfil demográfico controlado, rode prototipo de survey em-house, itere, depois valide com subset real. Reduz custo de pesquisa em 70%.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Product Manager: Mockup com dados realistas
          </h3>

          <p className="mb-4">
            Você quer demonstrar feature de "dashboard de clientes" em reunião com board. Mockup com "Cliente 1, Cliente 2" parece artificial. Com dados sintéticos, dashboard mostra nomes reais, emails válidos, padrão de compra coerente. Stakeholder se sente mais confiante.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            DPO / Compliance: Documentação legal
          </h3>

          <p className="mb-4">
            Você audita pipeline de dados. Encontra dados reais em staging sem consentimento. Risco de multa. Dados sintéticos permitem documentar: "Este ambiente usa apenas dados sintéticos, logo fora do escopo LGPD". Reduz risco legal.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 5: Como gerar dados sintéticos corretos
          </h2>

          <p className="mb-4">
            Existem três critérios para dados sintéticos de qualidade:
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            1. Validação com algoritmo oficial
          </h3>

          <p className="mb-4">
            CPF deve passar em mod-11 da Receita Federal. CNPJ deve passar em checksum duplo. Seu validador em produção vai rejeitar dados inválidos — se gerador não respeita algoritmo, não vale.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            2. Correlação entre campos
          </h3>

          <p className="mb-4">
            Nome "João" com email "maria@..." parece estranho. CEP "01311-100" (São Paulo) com cidade "Fortaleza" quebra validação em produção. Dados sintéticos devem correlacionar automaticamente.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            3. Distribuição estatística controlada
          </h3>

          <p className="mb-4">
            Se seu dataset tem 60% clientes de SP e 40% de RJ, gerador sintético deve respeitar proporção. Caso contrário, modelo treinado erra em padrão real.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 6: Comparação de ferramentas
          </h2>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-2 sm:px-3 py-2 font-medium text-muted-foreground">
                    Ferramenta
                  </th>
                  <th className="text-left px-2 sm:px-3 py-2 font-medium text-muted-foreground">
                    CPF mod-11
                  </th>
                  <th className="text-left px-2 sm:px-3 py-2 font-medium text-muted-foreground">
                    CNPJ
                  </th>
                  <th className="text-left px-2 sm:px-3 py-2 font-medium text-muted-foreground">
                    API
                  </th>
                  <th className="text-left px-2 sm:px-3 py-2 font-medium text-muted-foreground">
                    Preço
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-2 sm:px-3 py-2 text-foreground font-semibold">
                    FakeForge
                  </td>
                  <td className="px-2 sm:px-3 py-2">✓ Nativo</td>
                  <td className="px-2 sm:px-3 py-2">✓ Nativo</td>
                  <td className="px-2 sm:px-3 py-2">✓ REST</td>
                  <td className="px-2 sm:px-3 py-2">R$29/mês</td>
                </tr>
                <tr>
                  <td className="px-2 sm:px-3 py-2 text-foreground">Faker.js</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">NPM (lib)</td>
                  <td className="px-2 sm:px-3 py-2">Grátis</td>
                </tr>
                <tr>
                  <td className="px-2 sm:px-3 py-2 text-foreground">Faker.py</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">PyPI (lib)</td>
                  <td className="px-2 sm:px-3 py-2">Grátis</td>
                </tr>
                <tr>
                  <td className="px-2 sm:px-3 py-2 text-foreground">Mockaroo</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">Não</td>
                  <td className="px-2 sm:px-3 py-2">✓ REST (pago)</td>
                  <td className="px-2 sm:px-3 py-2">USD 60/ano</td>
                </tr>
                <tr>
                  <td className="px-2 sm:px-3 py-2 text-foreground">Tonic.ai</td>
                  <td className="px-2 sm:px-3 py-2">✓</td>
                  <td className="px-2 sm:px-3 py-2">✓</td>
                  <td className="px-2 sm:px-3 py-2">✓ API</td>
                  <td className="px-2 sm:px-3 py-2">USD 2k+/mês</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Resumo:</strong> Faker.js/Faker.py são grátis mas não validam Brasil. Mockaroo é visual mas caro em USD. FakeForge é best-of-both: API REST barata em reais com validação BR nativa.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 7: Snippets práticos
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Python: Gerar pessoas com FakeForge
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import requests

# Gerar 50 pessoas com CPF, email, telefone correlacionados
response = requests.get(
    'https://fakeforge.com.br/api/generate',
    params={
        'type': 'pessoa',
        'quantity': 50,
        'format': 'json'
    },
    headers={'Authorization': 'Bearer SEU_TOKEN'}
)

pessoas = response.json()['data']

# Validar primeira pessoa
pessoa = pessoas[0]
print(f"Nome: {pessoa['nome']}")
print(f"CPF: {pessoa['cpf']}")
print(f"Email: {pessoa['email']}")
print(f"Telefone: {pessoa['telefone']}")
print(f"Validação mod-11: {pessoa['valido']}")`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Node.js: Seed de banco em CI/CD
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// seed.js - executar antes de cada teste
const axios = require('axios');

async function seedDatabase(db) {
  // Gerar 100 CPFs válidos de FakeForge
  const response = await axios.get(
    'https://fakeforge.com.br/api/generate',
    {
      params: { type: 'cpf', quantity: 100, format: 'json' },
      headers: { Authorization: \`Bearer \${process.env.FAKEFORGE_TOKEN}\` }
    }
  );

  const cpfs = response.data.data.map(d => d.cpf);

  // Inserir no banco
  await db.collection('clientes').insertMany(
    cpfs.map(cpf => ({ cpf, criado_em: new Date() }))
  );

  console.log('Seed concluído com', cpfs.length, 'CPFs sintéticos');
}

module.exports = seedDatabase;`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Comparação: Faker.js vs FakeForge
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// Faker.js: Gera formato, mas não valida
const faker = require('@faker-js/faker').faker;

const cpf = faker.helpers.regexToString('###\\.###\\.###-##');
console.log(cpf); // "123.456.789-00" - INVÁLIDO em mod-11!

// FakeForge: Gera validado
const fakeforge = require('fakeforge');

const cpf = await fakeforge.cpf();
console.log(cpf); // "123.456.789-09" - VÁLIDO por mod-11 ✓`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Seção 8: Pitfalls comuns
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pitfall 1: Confundir anonimização com sintético
          </h3>

          <p className="mb-4">
            Pensamento errado: "Vou apagar nomes de produção e usar no teste — é anonimizado."
            Realidade: Dados reais mascarados ainda são pessoais per LGPD. Risco permanece.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pitfall 2: Esquecer correlação entre campos
          </h3>

          <p className="mb-4">
            Você gera CPF com Faker e email com Mockaroo separado. Resultado: nome "João" com email "maria@...". Validação falha. Sempre usar ferramenta que correlaciona.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pitfall 3: Insuficiente volume para machine learning
          </h3>

          <p className="mb-4">
            Treinar modelo com 100 exemplos sintéticos não chega para robustez. Modelos precisam milhares. Para ML, gere 10-100x seu dataset real.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Pitfall 4: Esquecer que sintético nunca substitui real 100%
          </h3>

          <p className="mb-4">
            Dados sintéticos são perfeitos para teste, dev, ML prototipagem. Mas antes de ir para produção, sempre validar com subset de dados real. Sintético pode não capturar anomalia rara.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  LGPD permite usar dados sintéticos sem consentimento?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim. Dados sintéticos não são pessoais por definição, logo não estão sob LGPD. Você não precisa de consentimento. Pode usar à vontade em desenvolvimento e teste. Não há artigo LGPD que restrinja dados que nunca foram pessoais.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Qual é o nível de realismo de dados sintéticos?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Depende da ferramenta e do caso de uso. FakeForge garante validação (CPF passa em mod-11, CEP bate com estado) e correlação básica. Para distribuição estatística complexa (padrão de renda por idade, sazonalidade de consumo), ferramentas avançadas como Tonic.ai ou Syntho.ai são necessárias. Para teste e QA, FakeForge é suficiente.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Posso usar dados sintéticos em produção?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não recomendado. Dados sintéticos são para desenvolvimento, teste e ML prototipagem. Produção exige dados reais porque usuários precisam de funcionalidade real. Exceção: se seu negócio é gerar dados sintéticos como produto (você pode vender dados sintéticos legalmente).
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Quantos dados sintéticos preciso para treinar ML?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Regra: 10-100x seu dataset real para prototipagem. Se você tem 5000 exemplos reais, gere 50-500 mil sintéticos. Para produção, adicione sempre um subset real para validar. Modelos treinados 100% com sintéticos tendem sofrer degradação em dados reais inesperados.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Dados sintéticos de FakeForge passam em validação real?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                CPF sempre passa em validação mod-11 porque foi gerado respeitando algoritmo Receita Federal. CNPJ passa em checksum duplo. Endereço correlaciona por estado. Email é formato válido. Telefone respeita DDD real. Sim, passam em validação.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Dados sintéticos resolvem 100% do risco de privacidade?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim, por definição. Dados que nunca foram pessoais não têm risco de privacidade. O risco zero vem do fato que não há pessoa real para re-identificar. Diferente de anonimização (que pode falhar via linkage attack), dados sintéticos têm garantia matemática.
              </p>
            </details>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Conclusão: Por que adotar dados sintéticos hoje
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Dados sintéticos não são futurismo. São presente em 2026. AWS, Microsoft, Snowflake já posicionam como estratégia. Brasil está 2-3 anos atrás em adoção, mas janela está abrindo:
          </p>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>
              <strong className="text-foreground">Compliance:</strong> LGPD multas subindo. Dados sintéticos eliminam risco legal.
            </li>
            <li>
              <strong className="text-foreground">Velocidade:</strong> Gerador de dados em segundos vs horas setup manual.
            </li>
            <li>
              <strong className="text-foreground">Custo:</strong> R$29/mês vs R$500-2000 anonimização tradicional.
            </li>
            <li>
              <strong className="text-foreground">Experiência:</strong> Dados correlacionados e validados reduzem bugs de teste.
            </li>
          </ul>

          <p className="text-sm text-muted-foreground mb-8">
            Comece hoje. Não custa nada no plano gratuito. Gere seu primeiro CPF, pessoa, ou base de teste. Veja se valida em seu sistema. Depois, integre em CI/CD ou pipeline ML. Risco zero, retorno imediato.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 mt-10">
            <p className="text-sm font-semibold text-foreground mb-2">
              Próximo passo
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Teste dados sintéticos de FakeForge agora. Sem cadastro. Sem cartão de crédito.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/gerador-cpf"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Gerar CPF
              </Link>
              <Link
                href="/gerador-pessoa"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Gerar pessoa completa
              </Link>
              <Link
                href="/docs"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Documentação
              </Link>
              <Link
                href="/dados-sinteticos"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Voltar a landing
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Conteúdo relacionado
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              <Link
                href="/dados-sinteticos"
                className="text-primary hover:underline"
              >
                Landing page: Dados Sintéticos BR
              </Link>
            </li>
            <li>
              <Link
                href="/blog/lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros"
                className="text-primary hover:underline"
              >
                LGPD e dados de teste: guia prático
              </Link>
            </li>
            <li>
              <Link
                href="/blog/mockaroo-vs-fakeforge-qual-escolher-times-brasileiros"
                className="text-primary hover:underline"
              >
                Mockaroo vs FakeForge: comparação
              </Link>
            </li>
            <li>
              <Link
                href="/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers"
                className="text-primary hover:underline"
              >
                Anonimização vs pseudonimização
              </Link>
            </li>
            <li>
              <Link
                href="/blog/automatizar-dados-teste-ci-cd"
                className="text-primary hover:underline"
              >
                Automatizar dados de teste em CI/CD
              </Link>
            </li>
            <li>
              <Link
                href="/blog/popular-banco-dados-brasileiros-staging-completo"
                className="text-primary hover:underline"
              >
                Popular banco de dados com dados BR
              </Link>
            </li>
          </ul>
        </section>

        <ShareBar
          title="Dados Sintéticos no Brasil: Guia Completo pra Devs, Data Scientists e QA"
          path="/blog/dados-sinteticos-brasil-guia-devs-data-scientists-qa"
        />

        <BlogPostingSchema
          title="Dados Sintéticos no Brasil: Guia Completo pra Devs, Data Scientists e QA"
          slug="dados-sinteticos-brasil-guia-devs-data-scientists-qa"
          description="Guia completo de dados sintéticos no mercado BR: diferença entre anonimização e dados sintéticos, casos de uso em ML, compliance LGPD, ferramentas disponíveis."
          datePublished="2026-10-01"
          image="https://fakeforge.com.br/api/og?title=Dados%20Sintéticos&subtitle=Guia%20Completo%20Brasil&category=SYNTHETIC%20DATA"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "LGPD permite usar dados sintéticos sem consentimento?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. Dados sintéticos não são pessoais por definição, logo não estão sob LGPD. Você não precisa de consentimento.",
                },
              },
              {
                "@type": "Question",
                name: "Qual é o nível de realismo de dados sintéticos?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "FakeForge garante validação e correlação básica. Para distribuição complexa, ferramentas avançadas como Tonic.ai são necessárias.",
                },
              },
              {
                "@type": "Question",
                name: "Posso usar dados sintéticos em produção?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não recomendado para ambiente de usuários finais. Dados sintéticos são para desenvolvimento, teste e ML prototipagem.",
                },
              },
              {
                "@type": "Question",
                name: "Quantos dados sintéticos preciso para treinar ML?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Regra: 10-100x seu dataset real. Se você tem 5000 exemplos reais, gere 50-500 mil sintéticos.",
                },
              },
              {
                "@type": "Question",
                name: "Dados sintéticos de FakeForge passam em validação real?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim. CPF passa em mod-11, CNPJ passa em checksum duplo, endereço correlaciona por estado, telefone respeita DDD real.",
                },
              },
              {
                "@type": "Question",
                name: "Dados sintéticos resolvem 100% do risco de privacidade?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, por definição. Dados que nunca foram pessoais não têm risco de privacidade. Garantia matemática de zero risco.",
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "FakeForge",
                item: "https://fakeforge.com.br",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://fakeforge.com.br/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Dados Sintéticos no Brasil",
                item: "https://fakeforge.com.br/blog/dados-sinteticos-brasil-guia-devs-data-scientists-qa",
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
