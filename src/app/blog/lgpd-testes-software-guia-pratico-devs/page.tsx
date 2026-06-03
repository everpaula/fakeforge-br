import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";

export const metadata: Metadata = {
  title: "LGPD em testes de software: guia prático para devs",
  description: "Como estruturar ambientes de teste conformes com a LGPD: anonimização, dados sintéticos e boas práticas para equipes de desenvolvimento.",
  openGraph: {
    title: "LGPD em testes de software: guia prático para devs",
    description: "Como estruturar ambientes de teste conformes com a LGPD: anonimização, dados sintéticos e boas práticas para equipes de desenvolvimento.",
    type: "article",
    images: ["/api/og?title=LGPD%20em%20testes%20de%20software%3A%20guia%20pr%C3%A1tico%20para%20devs&subtitle=Como%20estruturar%20ambientes%20de%20teste%20conformes%20com%20a%20LGPD%3A%20anonimiza%C3%A7%C3%A3o%2C%20dados%20sint%C3%A9ticos%20e%20boas%20pr%C3%A1ticas%20para%20equipes%20de%20desenvolvimento.&category=LGPD"],
  },
  alternates: { canonical: "/blog/lgpd-testes-software-guia-pratico-devs" },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage category="LGPD" title="LGPD em testes de software: guia prático para devs" className="mb-6" />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            LGPD em testes de software: guia prático para devs
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>03 de junho de 2026</time>
            <span>·</span>
            <span>14 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">Usar dados reais de clientes em ambiente de teste é mais que descuido de segurança, é uma violação direta da <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados (Lei 13.709/2018)</a>. Este guia mostra como estruturar fixtures, seeds e pipelines de CI/CD sem tocar em dados pessoais reais, mantendo conformidade com a LGPD e reprodutibilidade nos testes.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Usar dados reais em testes viola a LGPD</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">O que a lei diz sobre finalidade e necessidade (Art. 6º, I e III)</h3>
          <p className="mb-4">A LGPD estabelece princípios que se aplicam a qualquer tratamento de dado pessoal, inclusive dentro da sua empresa. O Art. 6º, I define o princípio da <strong className="text-foreground">finalidade</strong>: o tratamento só pode ocorrer para propósitos legítimos, específicos e informados ao titular. O Art. 6º, III define o princípio da <strong className="text-foreground">necessidade</strong>: o tratamento deve se limitar ao mínimo indispensável para atingir sua finalidade.</p>
          <p className="mb-4">Quando um titular de dados cedeu o CPF para contratar um serviço, a finalidade declarada não incluiu "ser usado como fixture em testes unitários". O uso nesse contexto viola o Art. 6º, I, independente de qualquer controle de acesso interno.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Por que "ambiente interno" não é base legal suficiente</h3>
          <p className="mb-4">Equipes argumentam que banco de testes é "ambiente controlado, sem saída para fora". A lei não faz essa distinção. O Art. 5º, X define tratamento como "toda operação realizada com dados pessoais", incluindo "armazenamento, utilização, acesso". Um banco de staging com dump de produção é tratamento de dados pessoais, ponto.</p>
          <p className="mb-4">Além disso, "ambiente interno" expande o círculo de acesso. Estagiários, freelancers contratados, pipelines de CI com secrets vazados, snapshots de banco em logs de debug, todos esses vetores multiplicam o risco sem qualquer base legal que os cubra.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Incidentes reais: o caso dos dumps de produção compartilhados por e-mail</h3>
          <p className="mb-4">Um padrão recorrente em times de produto: o dev precisa de dados para reproduzir um bug de produção, pede ao DBA um "dump pequeno" e recebe um CSV com 50 mil linhas por e-mail. O arquivo fica na caixa de entrada, no laptop, eventualmente no repositório como <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">fixtures/users_sample.csv</code>.</p>
          <p className="mb-4">A ANPD já publicou <a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Resolução CD/ANPD nº 2/2022</a> sobre comunicação de incidentes. Dump de produção exposto em repositório Git se enquadra como incidente de segurança com notificação obrigatória em até 72 horas quando o acesso não autorizado é confirmado.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">As bases legais que importam para dados de teste (LGPD Art. 7º)</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Consentimento (Art. 7º, I) é inviável para fixtures</h3>
          <p className="mb-4">Consentimento exige que o titular autorize de forma livre, informada e inequívoca o tratamento para finalidade específica. Nenhuma empresa vai contatar cada titular cujo CPF aparece em um fixture de teste para pedir autorização. Operacionalmente inviável. Base legal descartada.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Legítimo interesse (Art. 7º, IX) e seus limites</h3>
          <p className="mb-4">Legítimo interesse permite tratar dados quando o controlador tem interesse legítimo, desde que não prevaleçam os direitos fundamentais do titular. Para dados de teste, a justificativa seria "garantir qualidade do software". O problema: a ANPD exige que o controlador demonstre que o tratamento é necessário e proporcional. Dados sintéticos atingem o mesmo objetivo sem tratar dados reais. Logo, o interesse legítimo não sobrevive ao teste de proporcionalidade do Art. 7º, IX.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Anonimização como saída: quando o dado sai do escopo da lei (Art. 5º, III)</h3>
          <p className="mb-4">A melhor saída legal não é uma base legal: é remover o dado do escopo da lei. O Art. 5º, III define dado anonimizado como "dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião do tratamento". Dado anonimizado de forma irreversível não é dado pessoal. Não existe tratamento a justificar.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Diferença entre anonimização e pseudonimização na prática</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Pseudonimização (Art. 13, §4º): ainda é dado pessoal</h3>
          <p className="mb-4">Pseudonimização substitui o identificador direto por um pseudônimo. Trocar o CPF <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">123.456.789-09</code> por um hash SHA-256 é pseudonimização. Se a tabela de correspondência existe em algum lugar, o dado é reversível e <strong className="text-foreground">continua sendo dado pessoal</strong> sob a LGPD Art. 13, §4º.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Anonimização irreversível: critérios do ANPD</h3>
          <p className="mb-4">A ANPD publicou o <a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-de-anonimizacao-de-dados-pessoais.pdf" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Guia Orientativo de Anonimização</a> com três critérios principais: não-individualização, não-vinculação e não-inferência. Um CPF gerado sinteticamente que nunca existiu não falha nenhum dos três critérios. É, por definição, anônimo desde a origem.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Qual técnica usar em cada camada (banco, log, API mock)</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Camada</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Técnica recomendada</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Técnica a evitar</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Banco de dados de teste</td><td className="px-3 py-2">Geração sintética desde o seed</td><td className="px-3 py-2">Dump mascarado com hash reversível</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Logs de aplicação</td><td className="px-3 py-2">Substituição por placeholder estático</td><td className="px-3 py-2">Truncagem parcial (ex: <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">123.XXX.XXX-09</code>)</td></tr><tr className="border-b border-border"><td className="px-3 py-2">API mock / WireMock</td><td className="px-3 py-2">Fixture com dados gerados</td><td className="px-3 py-2">Captura de tráfego de produção</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Snapshots de banco (CI)</td><td className="px-3 py-2">Gerados em build time</td><td className="px-3 py-2">Cópia automatizada de staging</td></tr></tbody></table></div>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Estratégias para construir fixtures sem dados reais</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Geração sintética: dados correlacionados</h3>
          <p className="mb-4">O maior problema de dados aleatórios mal gerados não é a LGPD, é que quebram as próprias validações do sistema. Um CPF com dígitos verificadores errados vai falhar na camada de negócio antes de chegar ao banco. Dados sintéticos úteis precisam ser internamente consistentes: CPF válido, endereço no mesmo estado que o CEP, DDD de celular compatível com a cidade.</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// Geração de fixture completa via FakeForge API\nasync function gerarPessoa() {\n  const res = await fetch(\n    \"https://fakeforge.com.br/api/generate?type=pessoa&quantity=1&format=json\"\n  );\n  const { data } = await res.json();\n  return data[0] as {\n    nome: string;\n    cpf: string;\n    email: string;\n    telefone: string;\n    endereco: {\n      logradouro: string;\n      bairro: string;\n      cidade: string;\n      estado: string;\n      cep: string;\n    };\n  };\n}"}</code></pre>
          <p className="mb-4">A API retorna nome, CPF com dígito verificador correto e endereço correlacionado ao mesmo estado. Detalhes em <Link href="/docs" className="text-primary hover:underline">/docs</Link>.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mascaramento de produção: regras por campo e riscos residuais</h3>
          <p className="mb-4">Quando o time insiste em partir de dados reais, mascaramento é o caminho. A regra básica: substituir o campo inteiro por dado sintético válido, nunca truncar ou embaralhar parcialmente.</p>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// Substituir CPF real por CPF sintético em dump (TypeScript)\nimport { execSync } from \"child_process\";\n\nfunction mascaraCpf(linha: string): string {\n  // CPF no formato 000.000.000-00\n  return linha.replace(\n    /\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b/g,\n    () => gerarCpfSintetico()\n  );\n}\n\nfunction gerarCpfSintetico(): string {\n  // Gera 9 dígitos base\n  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));\n\n  const d1 = calcDigito(base, 10);\n  const d2 = calcDigito([...base, d1], 11);\n\n  const digits = [...base, d1, d2];\n  return `${digits.slice(0, 3).join(\"\")}.${digits.slice(3, 6).join(\"\")}.${digits.slice(6, 9).join(\"\")}-${digits.slice(9).join(\"\")}`;\n}\n\nfunction calcDigito(nums: number[], peso: number): number {\n  const soma = nums.reduce((acc, n, i) => acc + n * (peso - i), 0);\n  const resto = soma % 11;\n  return resto < 2 ? 0 : 11 - resto;\n}"}</code></pre>
          <blockquote className="border-l-4 border-accent pl-4 my-4 text-muted-foreground italic">AVISO: mascaramento de dump tem risco residual de reidentificação por combinação de campos (nome + CEP + data de nascimento). Prefira geração sintética pura sempre que o caso de uso permitir.</blockquote>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Seed determinístico: reprodutibilidade sem dados reais</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-ts">{"// Seed factory para Jest/Vitest\nimport { beforeAll } from \"vitest\";\n\nlet fixtures: Awaited<ReturnType<typeof gerarPessoa>>[] = [];\n\nbeforeAll(async () => {\n  const res = await fetch(\n    \"https://fakeforge.com.br/api/generate?type=pessoa&quantity=20&format=json\"\n  );\n  const { data } = await res.json();\n  fixtures = data;\n});\n\nexport function getFixture(index: number) {\n  return fixtures[index % fixtures.length];\n}"}</code></pre>
          <p className="mb-4">Para reprodutibilidade total em CI, persista o JSON gerado como artefato de build e reutilize-o em reruns. Ver seção de pipeline abaixo.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">CPF, CNPJ e documentos brasileiros em testes</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Algoritmo mod-11 e por que CPFs aleatórios quebram validações</h3>
          <p className="mb-4">O CPF usa dois dígitos verificadores calculados por módulo 11. Um CPF com 11 dígitos aleatórios tem aproximadamente 1% de chance de passar na validação. Em uma suíte com 500 registros, isso gera 495 falhas silenciosas no campo de documento antes de qualquer lógica de negócio ser testada. Use <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link> para CPF válido para fixtures ou implemente o algoritmo mod-11 localmente como no exemplo acima.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">CNPJ Alfanumérico (vigência 01/07/2026): impacto em suítes de teste existentes</h3>
          <p className="mb-4">A Receita Federal <a href="https://www.in.gov.br/en/web/dou/-/instrucao-normativa-rfb-n-2.229-de-5-de-setembro-de-2024-583843948" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">publicou a IN RFB 2.229/2024</a> que autoriza CNPJ com letras nas 8 primeiras posições a partir de 01/07/2026. Regex que aceita apenas <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">\d&#123;14&#125;</code> vai rejeitar CNPJs novos. Atualize fixtures e validadores antes da data de vigência. O <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">gerador de CNPJ Alfanumérico</Link> já gera no novo formato para você testar a migração.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Outros documentos: RG, CNH, PIS/PASEP, Título de Eleitor</h3>
          <p className="mb-4">Cada documento tem regra de formação própria. O <Link href="/gerador-cnh" className="text-primary hover:underline">gerador de CNH</Link> aplica o algoritmo DENATRAN. O <Link href="/gerador-pis" className="text-primary hover:underline">gerador de PIS/PASEP</Link> usa mod-11 com pesos específicos. O <Link href="/gerador-titulo-eleitor" className="text-primary hover:underline">Título de Eleitor</Link> inclui código de zona e seção. Números aleatórios nesses campos falham em sistemas que fazem qualquer validação de formato.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Dados financeiros sintéticos em ambiente de teste</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Chaves PIX válidas sem CPF/CNPJ real</h3>
          <p className="mb-4">A chave PIX do tipo CPF ou CNPJ precisa de documento válido para ser aceita em validações. Use <Link href="/gerador-pix" className="text-primary hover:underline">/gerador-pix</Link> para gerar chaves dos quatro tipos (CPF, CNPJ, e-mail, celular, aleatória) com formato correto para não travar fluxos de pagamento em testes de integração.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Cartões com Luhn correto (Visa, Mastercard, Elo, Hipercard)</h3>
          <p className="mb-4">O algoritmo de Luhn valida se um número de cartão é estruturalmente possível. Um número aleatório de 16 dígitos falha em qualquer biblioteca de validação de cartão. O <Link href="/gerador-cartao" className="text-primary hover:underline">gerador de cartão</Link> cobre Visa, Mastercard, Elo e Hipercard com BIN correto e Luhn válido.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Contas bancárias: códigos COMPE reais, números fictícios</h3>
          <p className="mb-4">Conta bancária precisa de código COMPE real (341 para Itaú, 260 para Nubank, 077 para Inter). Números de agência e conta são fictícios, mas o par banco+formato-de-conta deve ser válido para não rejeitar na camada de validação de formulário. O gerador de conta bancária usa os 17 códigos COMPE do catálogo do BACEN.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Pipeline de CI/CD conforme com a LGPD</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Separar variáveis de ambiente: produção vs. staging vs. teste</h3>
          <pre className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6 my-4 overflow-x-auto"><code className="language-yaml">{"# .github/workflows/test.yml\njobs:\n  test:\n    runs-on: ubuntu-latest\n    env:\n      DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}\n      # Nunca: DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}\n    steps:\n      - uses: actions/checkout@v4\n      - name: Gerar fixtures\n        run: |\n          curl -s \"https://fakeforge.com.br/api/generate?type=pessoa&quantity=100&format=json\" \\\n            > tests/fixtures/pessoas.json\n      - name: Seed banco de testes\n        run: npm run db:seed\n      - name: Executar testes\n        run: npm test"}</code></pre>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Gerar fixtures na build, nunca fazer dump de produção</h3>
          <p className="mb-4">A geração em build time resolve dois problemas: nenhum dado real entra no pipeline e as fixtures ficam registradas como artefato rastreável. Guarde o artefato por 30 dias para debugging, mas nunca promova para o próximo ambiente sem regeração.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Auditoria de acesso ao banco de testes</h3>
          <p className="mb-4">Liste quem tem credenciais do banco de testes com a mesma disciplina que lista acesso à produção. Banco de teste com dados mascarados que vazam para notebook pessoal ainda é incidente de segurança se os dados permitem reidentificação.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">API de dados sintéticos como dependência de projeto</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Chamar uma API vs. biblioteca local: trade-offs</h3>
          <div className="my-6 rounded-xl bg-card border border-border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-card-hover"><tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Critério</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">API externa (FakeForge)</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Biblioteca local</th></tr></thead><tbody><tr className="border-b border-border"><td className="px-3 py-2">Atualização de regras (ex: CNPJ alfanumérico)</td><td className="px-3 py-2">Automática</td><td className="px-3 py-2">Requer atualização de dependência</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Disponibilidade offline</td><td className="px-3 py-2">Não</td><td className="px-3 py-2">Sim</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Rastreabilidade de origem</td><td className="px-3 py-2">Via log de chamada</td><td className="px-3 py-2">Nenhuma</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Volume de geração</td><td className="px-3 py-2">Limitado por plano</td><td className="px-3 py-2">Ilimitado local</td></tr><tr className="border-b border-border"><td className="px-3 py-2">Manutenção do algoritmo</td><td className="px-3 py-2">Terceiro</td><td className="px-3 py-2">Seu time</td></tr></tbody></table></div>
          <p className="mb-4">Para equipes com alto volume de geração em CI, os <Link href="/pricing" className="text-primary hover:underline">planos da API</Link> partem de R$29/mês com 10.000 chamadas/dia.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Geração em tempo de build x geração em tempo de execução</h3>
          <p className="mb-4">Geração em build time é preferível para estabilidade: o mesmo artefato roda em todos os ambientes do pipeline. Geração em execução é útil para testes de stress onde volume e diversidade importam.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Controle de volume: quantos registros seu pipeline realmente precisa</h3>
          <p className="mb-4">Equipes tendem a supersuprir fixtures "por precaução". 20 registros cobrem a maioria das combinações de edge case em testes unitários. 500 cobrem integração com paginação e filtros. Acima disso, avalie se o teste em questão é de carga, que tem requisitos diferentes de dados.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Documentação de conformidade: o que registrar</h2>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Mapeamento de dados (ROPA) inclui ambientes de teste?</h3>
          <p className="mb-4">Sim. O Registro das Operações de Tratamento (ROPA), exigido pelo Art. 37 da LGPD e pelo Art. 30 do GDPR para controladores com obrigação espelhada, deve incluir todos os ambientes onde dados pessoais transitam. Se o banco de testes tem dados reais ou pseudonimizados, ele entra no ROPA.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Evidências para auditoria: fixture origin, anonimização aplicada, data</h3>
          <p className="mb-4">Para cada ambiente de teste, documente: origem dos dados (sintético/mascarado), técnica aplicada (geração sintética/mascaramento campo a campo), data de geração e quem executou. Um arquivo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">fixtures/README.md</code> com essas informações já satisfaz auditoria inicial da ANPD.</p>
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Relatório de Impacto à Proteção de Dados (RIPD): quando o teste obriga</h3>
          <p className="mb-4">O RIPD (Art. 38 da LGPD) é obrigatório para tratamentos que podem gerar risco aos titulares. Testes que usam dados reais de categorias sensíveis (saúde, biometria, dados financeiros detalhados) provavelmente obrigam RIPD. Testes com dados sintéticos não tratam dados pessoais e não precisam de RIPD.</p>
          <p className="mb-4">---</p>
          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">Resumo</h2>
          <ul className="list-disc list-inside space-y-2 pl-2 my-4"><li><strong className="text-foreground">Dados reais em teste são tratamento de dados pessoais</strong> sem base legal válida. Anonimização desde a origem é a única saída que elimina o problema pela raiz.</li><li><strong className="text-foreground">Pseudonimização não remove o dado do escopo da LGPD</strong> (Art. 13, §4º). Hash reversível ainda é dado pessoal.</li><li><strong className="text-foreground">CPF, CNPJ, PIX e cartões precisam de algoritmo correto</strong> (mod-11, Luhn) para não travar validações antes de qualquer lógica de negócio ser testada. Geradores como <Link href="/gerador-cpf" className="text-primary hover:underline">/gerador-cpf</Link> e <Link href="/gerador-cnpj" className="text-primary hover:underline">/gerador-cnpj</Link> resolvem isso sem código extra.</li><li><strong className="text-foreground">CNPJ Alfanumérico entra em vigor em 01/07/2026.</strong> Qualquer regex <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">\d&#123;14&#125;</code> vai rejeitar CNPJs novos. Atualize fixtures e validadores agora usando <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">/gerador-cnpj-alfanumerico</Link>.</li><li><strong className="text-foreground">Pipeline de CI/CD deve gerar fixtures na build</strong>, nunca promover dump de produção. Artefato gerado em build time é rastreável e não contém dados pessoais.</li><li><strong className="text-foreground">Documente a origem dos seus fixtures</strong> (sintético vs. mascarado, data, responsável). Uma linha por ambiente no ROPA já coloca seu time à frente de 90% das equipes em uma auditoria da ANPD.</li></ul>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details key="Staging com dados reais é tão " className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Staging com dados reais é tão arriscado quanto produção?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Mais arriscado, na verdade. Staging tem menos controle de acesso (estagiários, freelancers), então a exposição é maior. A LGPD não diferencia ambiente. Se o dado é real e foi copiado sem finalidade legítima, é incidente independente da camada. Use sintético em staging também.</p>
            </details>
            <details key="Se descobrirmos que usamos dad" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Se descobrirmos que usamos dados reais, precisamos notificar a ANPD?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Só se houve acesso não autorizado confirmado. Usar seu próprio dado de produção em teste da sua empresa não é acesso não autorizado. Porém, se o dump vazou (e-mail, GitHub público), aí sim: comunicar à ANPD em até 72h (Resolução CD/ANPD 2/2022). Documentar o incidente internamente já.</p>
            </details>
            <details key="FakeForge tem limite de requis" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">FakeForge tem limite de requisições no plano gratuito?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">A interface web é livre. Endpoints da API entram nos planos pagos a partir de R$29/mês com 10.000 chamadas/dia. Para fixtures em CI/CD local com volume baixo (até 100 registros), a chamada GET simples pode ficar dentro de quotas de rate limit. Confira `/pricing` antes de escalar.</p>
            </details>
            <details key="Posso usar fixture com CPF vál" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Posso usar fixture com CPF válido mas endereço aleatório?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Não. CPF gerado sinteticamente é ok. Mas se você pega endereço real de uma API de CEP e combina com CPF sintético, criou um pseudo-registro potencialmente reidentificável (CEP+bairro+nome = rastreável). FakeForge já correlaciona: use pessoa completa ou implemente a correlação localmente.</p>
            </details>
            <details key="Como validar que meu seed de t" className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">Como validar que meu seed de teste realmente cobre os edge cases?</span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">Gere 20+ registros com FakeForge, mas priorize casos deliberados (CPF mod-11 limítrofe, CEP de fronteira, DDD raro). Seed determinístico permite reruns idênticos. Combine seed gerado com fixtures hand-coded para edge cases. Cobertura ≠ aleatoriedade. Veja `beforeAll` no artigo para factory padrão.</p>
            </details>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Staging com dados reais é tão arriscado quanto produção?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Mais arriscado, na verdade. Staging tem menos controle de acesso (estagiários, freelancers), então a exposição é maior. A LGPD não diferencia ambiente. Se o dado é real e foi copiado sem finalidade legítima, é incidente independente da camada. Use sintético em staging também.\"}},{\"@type\":\"Question\",\"name\":\"Se descobrirmos que usamos dados reais, precisamos notificar a ANPD?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Só se houve acesso não autorizado confirmado. Usar seu próprio dado de produção em teste da sua empresa não é acesso não autorizado. Porém, se o dump vazou (e-mail, GitHub público), aí sim: comunicar à ANPD em até 72h (Resolução CD/ANPD 2/2022). Documentar o incidente internamente já.\"}},{\"@type\":\"Question\",\"name\":\"FakeForge tem limite de requisições no plano gratuito?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"A interface web é livre. Endpoints da API entram nos planos pagos a partir de R$29/mês com 10.000 chamadas/dia. Para fixtures em CI/CD local com volume baixo (até 100 registros), a chamada GET simples pode ficar dentro de quotas de rate limit. Confira `/pricing` antes de escalar.\"}},{\"@type\":\"Question\",\"name\":\"Posso usar fixture com CPF válido mas endereço aleatório?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Não. CPF gerado sinteticamente é ok. Mas se você pega endereço real de uma API de CEP e combina com CPF sintético, criou um pseudo-registro potencialmente reidentificável (CEP+bairro+nome = rastreável). FakeForge já correlaciona: use pessoa completa ou implemente a correlação localmente.\"}},{\"@type\":\"Question\",\"name\":\"Como validar que meu seed de teste realmente cobre os edge cases?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Gere 20+ registros com FakeForge, mas priorize casos deliberados (CPF mod-11 limítrofe, CEP de fronteira, DDD raro). Seed determinístico permite reruns idênticos. Combine seed gerado com fixtures hand-coded para edge cases. Cobertura ≠ aleatoriedade. Veja `beforeAll` no artigo para factory padrão.\"}}]}",
        }}
      />
    </PageShell>
  );
}
