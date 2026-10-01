import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "LGPD e dados de teste: guia completo pra devs brasileiros (2026)",
  description:
    "Como cumprir LGPD em desenvolvimento e testes sem usar dados reais. Diferença entre anonimização e pseudonimização, quando dados sintéticos evitam multa, ferramentas LGPD-safe. Com exemplos.",
  keywords:
    "LGPD dados de teste, conformidade LGPD desenvolvimento, anonimização pseudonimização LGPD, dados sintéticos LGPD, ferramenta LGPD-safe dados de desenvolvimento, LGPD art 12, multa LGPD teste ambiente staging",
  openGraph: {
    title: "LGPD e dados de teste: guia completo pra devs brasileiros",
    description:
      "Lei 13.709 não distingue ambiente de produção, teste ou staging. Copiar dados de clientes pra dev pode resultar em multa de até R$50 milhões. Solução aceita: dados sintéticos com validação real.",
    type: "article",
    images: [
      "/api/og?title=LGPD%20e%20dados%20de%20teste&subtitle=Guia%20completo%20pra%20devs%20brasileiros&category=COMPLIANCE",
    ],
  },
  alternates: {
    canonical: "/blog/lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros",
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
          category="Compliance"
          title="LGPD e dados de teste: guia completo pra devs brasileiros"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            LGPD e dados de teste: guia completo pra devs brasileiros
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>30 de setembro de 2026</time>
            <span>·</span>
            <span>15 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            A Lei nº 13.709/2018 (Lei Geral de Proteção de Dados) não distingue entre ambiente de produção, staging ou teste. Usar CPF real, email ou endereço de um cliente em sua máquina de desenvolvimento, em um servidor de teste ou em uma pipeline de CI/CD pode gerar uma multa de até R$50 milhões. Sério mesmo. A solução aceita pela Autoridade Nacional de Proteção de Dados (ANPD) é usar dados sintéticos — números gerados do zero que nunca foram pessoais — sem risco de re-identificação. Este guia mostra o quê, quando e como fazer isso de forma prática.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            TL;DR — Resumo de decisão rápida
          </h2>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 my-4 text-sm">
            <p className="mb-2">
              <strong className="text-foreground">✅ Dados sintéticos</strong> = dados que nunca foram pessoais por definição. Não estão sob LGPD. Você pode usar à vontade em teste, desenvolvimento, staging — ninguém se importa.
            </p>
            <p className="mb-2">
              <strong className="text-foreground">⚠️ Pseudonimização mal feita</strong> = substituir CPF por hash ou truncar campos é pseudonimização, ainda sob LGPD. Risco permanece e continua como dato pessoal perante a lei.
            </p>
            <p className="mb-2">
              <strong className="text-foreground">🚫 Copiar produção com "mascaramento"</strong> = padrão comum, altíssimo risco. Você copiou dados reais de clientes. Mudar nomes ou truncar campos não remove o vínculo legal — a ANPD considera re-identificação e linkage attack.
            </p>
            <p>
              <strong className="text-foreground">✅ Solução pronta</strong> = ferramenta como FakeForge, Faker.py ou Faker.js gera dados com validação real (CPF que passa em checksum, CEP coerente por estado) e nenhum vínculo com clientes reais. Zero risco de multa.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            O que a LGPD diz sobre ambientes de teste
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Vamos aos artigos:
          </p>

          <ul className="text-sm text-muted-foreground space-y-2 mb-8 list-disc list-inside">
            <li>
              <strong className="text-foreground">Art. 6º (Princípios):</strong> LGPD se aplica a qualquer operação de dados pessoais, em qualquer contexto. Não há exceção para "ambiente interno" ou "servidor de teste".
            </li>
            <li>
              <strong className="text-foreground">Art. 12, § 2º (Anonimização):</strong> dados são anonimizados quando "não for possível associar o dado a um indivíduo por meio de esforço técnico viável na atividade ordinária" — ou seja, tecnicamente inviável re-identificar. Dados sintéticos atendem esse critério por definição.
            </li>
            <li>
              <strong className="text-foreground">Art. 7º, IX (Consentimento):</strong> você pode processar dados pessoais sem consentimento quando necessário para "interesses legítimos do controlador". Mas "interesse legítimo" em teste não protege você de usar dados reais — a ANPD vai argumentar que poderia usar dados sintéticos.
            </li>
          </ul>

          <p className="text-sm text-muted-foreground mb-8">
            O resumo: se você usa dados sintéticos (gerados do zero, sem qualquer vínculo com pessoas reais), nenhum artigo da LGPD se aplica. Se você copia dados de produção "mascara" campos, você ainda está operando com dados pessoais e continua sob LGPD — a pseudonimização é reversível e a lei considera isso um risco.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Anonimização vs Pseudonimização vs Dados Sintéticos
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Essa diferença é crítica. Vejamos lado a lado:
          </p>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-xs">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Técnica
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Exemplo
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Sob LGPD?
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Risco
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Pseudonimização
                  </td>
                  <td className="px-3 py-2 text-xs">
                    CPF 123.456.789-09 → hash abc123
                  </td>
                  <td className="px-3 py-2">Sim, ainda</td>
                  <td className="px-3 py-2 text-red-600">Alto</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Anonimização fraca
                  </td>
                  <td className="px-3 py-2 text-xs">
                    Trunca CPF: 123.456.XXX-XX
                  </td>
                  <td className="px-3 py-2">Depende</td>
                  <td className="px-3 py-2 text-orange-600">Médio</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Anonimização forte
                  </td>
                  <td className="px-3 py-2 text-xs">
                    k-anonymity, remover quasi-identifiers
                  </td>
                  <td className="px-3 py-2">Não</td>
                  <td className="px-3 py-2 text-yellow-600">Baixo</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Dado sintético
                  </td>
                  <td className="px-3 py-2 text-xs">
                    Gera 789.123.456-00 do zero
                  </td>
                  <td className="px-3 py-2">Nunca foi</td>
                  <td className="px-3 py-2 text-green-600">Zero</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            A maioria dos times tenta pseudonimização ou anonimização fraca — e falha. Dados sintéticos é a abordagem que funciona sem margem pra erro.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Por que "copiar produção com mascaramento" não resolve
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            É a armadilha clássica. Seu DBA faz o seguinte:
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`-- Padrão comum (ERRADO)
CREATE TABLE staging_usuarios AS
SELECT
  id,
  CONCAT('User_', id) as name,  -- "mascarar"
  'fake@fake.com' as email,     -- "mascarar"
  SUBSTRING(cpf, 1, 3) || '.****.***-**' as cpf  -- "mascarar"
FROM production.usuarios;

-- Resultado:
-- id | name      | email           | cpf
-- 1  | User_1    | fake@fake.com   | 123.****.**-**
-- Seu DBA: "pronto, dados mascarados, seguro"
-- ANPD: "Você copiou dados reais de clientes. Risco alto."`}</code>
          </pre>

          <p className="text-sm text-muted-foreground mb-4">
            O problema: você ainda tem o banco de produção inteiro acessível. Um de seus devs vê a coluna "name" original no backup, faz um linkage attack entre "User_1" e tabelas correlatas, e consegue re-identificar a pessoa. O CPF truncado? Também pode ser recuperado cruzando dados.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Casos reais: times brasileiros já tomaram multa por cópia de banco com "mascaramento" quando um auditor descobriu dados reais em backup de desenvolvimento.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Como implementar dados sintéticos no seu time
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Passo 1: Escolher uma ferramenta LGPD-safe pra dados de desenvolvimento
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            As principais opções:
          </p>

          <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside">
            <li>
              <strong className="text-foreground">FakeForge:</strong> brasileira, validação nativa CPF/CNPJ, PIX nos 4 formatos BACEN, CEP correlacionado. API ou SDK Python/Node. R$29/mês plano básico.
            </li>
            <li>
              <strong className="text-foreground">Faker.py / Faker.js:</strong> open-source, localização Brasil, não tem validação algorítmica nativa — precisa configuração manual pra CPF correto.
            </li>
            <li>
              <strong className="text-foreground">Mockaroo:</strong> internacional, sem suporte Brasil nativo, mas pode funcionar pra apps que não validam documentos.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Passo 2: Criar seed script pra popular banco local
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Exemplo com FakeForge SDK (Node):
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// seed.js - Popula banco de teste sem dados reais
import { FakeForge } from '@fakeforge/sdk';
import db from './db.js';

const forge = new FakeForge({ apiKey: process.env.FAKEFORGE_KEY });

async function seedDatabase() {
  console.log('Gerando 1000 usuários sintéticos...');

  const usuarios = await forge.generate('pessoa', {
    quantity: 1000,
    format: 'json'
  });

  console.log('Inserindo no banco de teste...');
  for (const usuario of usuarios.data) {
    await db.query(
      'INSERT INTO usuarios (cpf, name, email, telefone) VALUES ($1, $2, $3, $4)',
      [usuario.cpf, usuario.name, usuario.email, usuario.telefone]
    );
  }

  console.log('✓ 1000 usuários sintéticos criados. Zero risco LGPD.');
}`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Passo 3: Integrar em CI/CD (GitHub Actions)
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci

      # Antes de rodar testes, popular banco com dados sintéticos
      - name: Seed test database
        run: |
          node scripts/seed.js
        env:
          FAKEFORGE_KEY: \${{ secrets.FAKEFORGE_KEY }}
          DATABASE_URL: \${{ secrets.TEST_DATABASE_URL }}

      - name: Run tests
        run: npm test`}</code>
          </pre>

          <p className="text-sm text-muted-foreground mb-8">
            Resultado: a cada PR, seu banco de teste é populado com dados sintéticos válidos — CPF passa em checksum, CNPJ correlacionado por estado, sem qualquer vínculo com clientes reais.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Passo 4: Validar que dados sintéticos passam em regras de negócio
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// Teste que confirma validação
test('CPF gerado passa em validador do backend', async () => {
  const forge = new FakeForge({ apiKey: process.env.FAKEFORGE_KEY });

  const { data } = await forge.generate('cpf', { quantity: 100 });

  for (const item of data) {
    // Simula validador do backend
    const isValid = validarCPF(item.cpf);
    expect(isValid).toBe(true);
  }
});

test('Endereço gerado tem CEP coerente com estado', async () => {
  const forge = new FakeForge();
  const { data } = await forge.generate('endereco', { quantity: 50, state: 'SP' });

  for (const item of data) {
    // CEP de SP começa com 0 ou 1
    expect(item.cep.substring(0, 1)).toMatch(/[01]/);
    expect(item.state).toBe('SP');
  }
});`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Ferramentas LGPD-safe para dados de desenvolvimento
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Aqui está a comparação das principais ferramentas:
          </p>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-xs">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Ferramenta
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Validação BR
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Preço
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Para devs BR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground font-medium">
                    <Link
                      href="https://fakeforge.com.br"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      FakeForge
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    ✓ Nativo (CPF, CNPJ, PIX, CEP)
                  </td>
                  <td className="px-3 py-2">R$29/mês</td>
                  <td className="px-3 py-2 text-green-600">Ideal</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground font-medium">
                    Faker.js
                  </td>
                  <td className="px-3 py-2">
                    Parcial (sem checksum nativo)
                  </td>
                  <td className="px-3 py-2">Grátis</td>
                  <td className="px-3 py-2 text-yellow-600">Bom</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground font-medium">
                    Faker.py
                  </td>
                  <td className="px-3 py-2">
                    Parcial (sem checksum nativo)
                  </td>
                  <td className="px-3 py-2">Grátis</td>
                  <td className="px-3 py-2 text-yellow-600">Bom</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground font-medium">
                    Mockaroo
                  </td>
                  <td className="px-3 py-2">
                    Não (dados genéricos)
                  </td>
                  <td className="px-3 py-2">USD 60/ano</td>
                  <td className="px-3 py-2 text-orange-600">
                    Não ideal
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Para times brasileiros que processam CPF/CNPJ, FakeForge economiza horas de configuração. Para times com data multinacional, Faker.js + validação manual de CPF é suficiente.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ: Dúvidas comuns sobre LGPD em teste
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Preciso avisar meus usuários que uso dados sintéticos?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não. Dados sintéticos nunca foram pessoais, então você não está "processando dados pessoais" — LGPD não se aplica. Não há obrigação de avisar usuários.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Posso usar dados de teste em produção temporariamente?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Tecnicamente sim — dados sintéticos permanecem fora de LGPD mesmo em produção. Mas é péssima prática. Seus usuários reais receberiam nomes e CPFs falsos. Use dados sintéticos só em desenvolvimento, teste e staging.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Qual é a multa exata por usar dados reais em teste?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                LGPD permite multa de até 2% do faturamento anual ou R$50 milhões por violação (art. 52). Auditorias da ANPD aumentaram desde 2023. Não é teórico — é risco real.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Faker.py sozinho é suficiente pra compliance LGPD?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Sim, desde que você gere dados do zero (nunca copie produção). Faker.py é open-source, documentado e amplamente usado. Única desvantagem: você precisa adicionar validação brasileira manualmente (checksum CPF, CEP por estado).
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Devo criptografar dados de teste também?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não é obrigatório pra dados sintéticos (não são pessoais). Mas é boa prática se seus devs rodam banco de teste em máquina pessoal ou laptop. Criptografia em repouso evita exposição acidental.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  FakeForge grava algum dado que eu gero?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não. FakeForge gera dados na memória e envia pra você — nenhum armazenamento. Logs contêm timestamp, usuário, tipo de geração (ex: "100 CPFs"), mas nunca os dados gerados.
              </p>
            </details>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            Resumo: próximos passos
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            A conformidade LGPD em desenvolvimento não é palpite. Lei 13.709/2018 existe desde 2020 e a ANPD aumentou auditorias. Se seu time ainda copia banco de produção "mascarado", você tem um passivo de risco.
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            Dados sintéticos é a solução que funciona. Não é paliativo — é a abordagem que a ANPD recomenda (art. 12, § 2º) porque elimina o risco completamente. CPF gerado nunca foi pessoal. Email gerado nunca teve dono. CEP gerado é apenas número com coerência geográfica.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Sua próxima ação: escolha uma ferramenta (FakeForge pra pronto, Faker.py pra open-source), rode o seed script em seu pipeline de CI/CD, e documente: "Ambiente de teste usa dados sintéticos 100%". Pronto. Compliance confirmada.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 mt-10">
            <p className="text-sm font-semibold text-foreground mb-2">
              Comece agora
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Teste gerador de dados sintéticos sem cadastro. CPF, CNPJ, PIX, endereço — tudo validado conforme LGPD.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/gerador-cpf"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Gerar CPF validado
              </Link>
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Ver planos (R$29/mês)
              </Link>
              <Link
                href="/blog/mockaroo-vs-fakeforge-qual-escolher-times-brasileiros"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors"
              >
                Comparativo: Mockaroo vs FakeForge
              </Link>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Próximas leituras
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>
                <Link
                  href="/gerador-pessoa"
                  className="text-primary hover:underline"
                >
                  Gerador de pessoa completa (nome, email, telefone)
                </Link>
              </li>
              <li>
                <Link
                  href="/gerador-cnpj"
                  className="text-primary hover:underline"
                >
                  Gerador de CNPJ com validação
                </Link>
              </li>
              <li>
                <Link
                  href="/gerador-empresa"
                  className="text-primary hover:underline"
                >
                  Gerador de empresa (razão social + CNPJ correlacionado)
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-primary hover:underline"
                >
                  Documentação técnica (API e SDK)
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-primary hover:underline"
                >
                  FAQ completa (conformidade + implementação)
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <ShareBar
          title={"LGPD e dados de teste: guia completo pra devs brasileiros"}
          path="/blog/lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros"
        />

        <BlogPostingSchema
          title={
            "LGPD e dados de teste: guia completo pra devs brasileiros"
          }
          slug="lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros"
          description={
            "Como cumprir LGPD em desenvolvimento sem usar dados reais. Diferença entre anonimização e pseudonimização, quando dados sintéticos eliminam risco de multa. Com exemplos práticos de implementação."
          }
          datePublished="2026-09-30"
          image="https://fakeforge.com.br/api/og?title=LGPD%20e%20dados%20de%20teste&subtitle=Guia%20completo%20pra%20devs%20brasileiros&category=COMPLIANCE"
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
                name: "Preciso avisar meus usuários que uso dados sintéticos em teste?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. Dados sintéticos nunca foram pessoais, então você não está processando dados pessoais — LGPD não se aplica. Não há obrigação de avisar usuários.",
                },
              },
              {
                "@type": "Question",
                name: "Posso usar dados de teste em produção temporariamente?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tecnicamente sim — dados sintéticos permanecem fora de LGPD mesmo em produção. Mas é péssima prática. Seus usuários reais receberiam nomes e CPFs falsos. Use dados sintéticos só em desenvolvimento, teste e staging.",
                },
              },
              {
                "@type": "Question",
                name: "Qual é a multa exata por usar dados reais em teste?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "LGPD permite multa de até 2% do faturamento anual ou R$50 milhões por violação (art. 52). Auditorias da ANPD aumentaram desde 2023.",
                },
              },
              {
                "@type": "Question",
                name: "Faker.py sozinho é suficiente pra compliance LGPD?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, desde que você gere dados do zero. Faker.py é open-source e amplamente usado. Única desvantagem: você precisa adicionar validação brasileira manualmente (checksum CPF, CEP por estado).",
                },
              },
              {
                "@type": "Question",
                name: "Devo criptografar dados de teste também?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não é obrigatório pra dados sintéticos. Mas é boa prática se seus devs rodam banco de teste em máquina pessoal. Criptografia em repouso evita exposição acidental.",
                },
              },
              {
                "@type": "Question",
                name: "FakeForge grava algum dado que eu gero?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. FakeForge gera dados na memória e envia pra você — nenhum armazenamento. Logs contêm timestamp, usuário, tipo de geração, mas nunca os dados gerados.",
                },
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
