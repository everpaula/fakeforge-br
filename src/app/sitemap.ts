import type { MetadataRoute } from "next";
import { CEP_CITIES } from "@/lib/cep-cities";
import { ESTADOS_BR } from "@/lib/data/estados-br";

// Datas reais de mudança significativa por página. Datas idênticas em todas
// as URLs (build-time `new Date()`) sinalizam ao Googlebot que o lastmod é
// não confiável e ele passa a ignorar o campo. Aqui mantemos data por
// página para preservar a sinalização real de crawl budget.
const D = {
  oct01: new Date("2026-10-01"),          // Fase 3 Python RENAVAM/titulo/boleto + blog LGPD
  sep30: new Date("2026-09-30"),          // validator hub Fase 4A + Fase 3 telefone/empresa/placa + blog Mockaroo
  home: new Date("2026-06-18"),           // último refactor AI-slop + funnel
  newest: new Date("2026-06-17"),         // /buscar-cep + chart 90d
  jun15: new Date("2026-06-15"),          // random number EN + cluster placa
  jun13: new Date("2026-06-13"),          // EN cluster expansion
  jun01: new Date("2026-06-01"),          // landings refinadas
  may26: new Date("2026-05-26"),          // OG custom em blog posts
  may15: new Date("2026-05-15"),          // landings core estáveis
  apr15: new Date("2026-04-15"),          // posts iniciais
  legal: new Date("2026-03-01"),          // termos/privacidade
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fakeforge.com.br";

  const cityRoutes: MetadataRoute.Sitemap = CEP_CITIES.map((c) => ({
    url: `${baseUrl}/gerador-cep/${c.slug}`,
    lastModified: D.may15,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Alavanca 1 programmatic SEO (2026-09-22): CNH e RG por estado (27 UFs cada = 54 pages).
  const cnhPorEstadoRoutes: MetadataRoute.Sitemap = ESTADOS_BR.map((e) => ({
    url: `${baseUrl}/gerador-cnh/${e.slug}`,
    lastModified: D.home,
    changeFrequency: "monthly" as const,
    priority: 0.88,
  }));

  const rgPorEstadoRoutes: MetadataRoute.Sitemap = ESTADOS_BR.map((e) => ({
    url: `${baseUrl}/gerador-rg/${e.slug}`,
    lastModified: D.home,
    changeFrequency: "monthly" as const,
    priority: 0.88,
  }));

  return [
    ...cityRoutes,
    ...cnhPorEstadoRoutes,
    ...rgPorEstadoRoutes,
    { url: baseUrl, lastModified: D.home, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/geradores`, lastModified: D.home, changeFrequency: "weekly", priority: 0.9 },

    // Landings principais PT
    { url: `${baseUrl}/gerador-cpf`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-alfanumerico`, lastModified: D.jun13, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/gerador-cnpj-valido`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/gerador-renavam`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },

    // /quota-estourada - dead-end contextual (nao indexar em SEO mas ainda no sitemap pra referencia)
    // Sprint 2 AEO - hub de comparacoes redesenhado
    { url: `${baseUrl}/comparacoes`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-validate-docbr`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-python-brasilidades`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },

    // Sprint 2 AEO T4 - Q&A pages dedicadas por prompt Ubersuggest (HowTo/FAQ schema)
    { url: `${baseUrl}/melhor-gerador-cpf-testes-software`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/como-gerar-cpf-valido-sem-infringir-lei`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/como-garantir-lgpd-ambiente-testes`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },

    // Sprint 3 - Vertical presets (bundles ricos correlacionados)
    { url: `${baseUrl}/preset-fintech`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/preset-ecom`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/gerador-cnh`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cin`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-pis`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-titulo-eleitor`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-placa-mercosul`, lastModified: D.jun15, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/buscar-cep`, lastModified: D.newest, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-telefone`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.8 },
    // Cluster telefone expansion (audit 10/09) - reduzir concentracao 54% do pilar
    { url: `${baseUrl}/numero-de-celular-aleatorio`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/telefone-aleatorio`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-de-numero-fake`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-telefone-fixo`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-numero-para-cadastro`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-email`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-pix`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-cartao`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-cartao/visa`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cartao/mastercard`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cartao/elo`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cartao/hipercard`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cartao/amex`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-pessoa`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-empresa`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-conta-bancaria`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gerador-endereco`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },

    // Landings EN
    { url: `${baseUrl}/en/cpf-generator`, lastModified: D.jun15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/en/cnpj-generator`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/en/cep-generator`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/en/credit-card-generator`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/en/person-generator`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/en/pix-key-generator`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/en/random-number-generator`, lastModified: D.jun15, changeFrequency: "monthly", priority: 0.9 },

    // Comparison
    { url: `${baseUrl}/comparacao/fakeforge-vs-alternativas`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-mockaroo`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-fakerjs`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-4devs`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/alternativa-ao-4devs-com-api`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/4devs-tem-api`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },

    // Fase 1 4devs: landings gerador X + linguagem/framework (intent tecnico alto)
    // CPF
    { url: `${baseUrl}/gerador-cpf-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cpf-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cpf-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cpf-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cpf-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // CNPJ (numerico + alfanumerico 2026)
    { url: `${baseUrl}/gerador-cnpj-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // Cartao com Luhn (testes de checkout)
    { url: `${baseUrl}/gerador-cartao-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cartao-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cartao-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cartao-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cartao-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // PIX (4 tipos BACEN)
    { url: `${baseUrl}/gerador-pix-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-pix-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-pix-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-pix-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-pix-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // CNH (DENATRAN)
    { url: `${baseUrl}/gerador-cnh-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnh-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnh-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnh-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnh-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // RG (formato por UF)
    { url: `${baseUrl}/gerador-rg-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // Endereço (todas UFs)
    { url: `${baseUrl}/gerador-endereco-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-endereco-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-endereco-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-endereco-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-endereco-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    // CEP (27 capitais)
    { url: `${baseUrl}/gerador-cep-python`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep-nodejs`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep-curl`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep-jest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep-pytest`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comparacao/fakeforge-vs-faker-py`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },

    // Fase 3 (sep 30): telefone, empresa, placa por linguagem (dados AI GSC: top 1-3 verticais)
    { url: `${baseUrl}/gerador-telefone-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-telefone-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-telefone-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-empresa-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-empresa-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-empresa-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-placa-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-placa-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-placa-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.85 },

    // Fase 3 (oct 01): RENAVAM, Titulo de Eleitor, Boleto FEBRABAN em Python
    { url: `${baseUrl}/gerador-renavam-python`, lastModified: D.oct01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-titulo-eleitor-python`, lastModified: D.oct01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-boleto-python`, lastModified: D.oct01, changeFrequency: "monthly", priority: 0.85 },

    // Validadores
    { url: `${baseUrl}/validar-cpf`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/validar-cnpj`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/validar-cpf-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cpf-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cpf-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnpj-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnpj-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnpj-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cep-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cep-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cep-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnh-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnh-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-cnh-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-rg-python`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-rg-nodejs`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/validar-rg-curl`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/algoritmo-luhn`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },

    // AEO / FAQ (Ubersuggest gap 0% AI visibility -> respostas curadas com Schema)
    { url: `${baseUrl}/faq`, lastModified: D.home, changeFrequency: "weekly", priority: 0.9 },

    // Cluster cartão de crédito (Sprint Ago P1, 30K vol addressable)
    { url: `${baseUrl}/cartao-credito-fake`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerar-cartao-credito`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/cartao-credito-valido`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerar-cartao-com-cpf`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/cartao-credito-teste-stripe`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },

    // Docs + blog index
    { url: `${baseUrl}/docs`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: D.home, changeFrequency: "weekly", priority: 0.7 },

    // Blog posts (datas por época de publicação aproximada)
    { url: `${baseUrl}/blog/cnpj-alfanumerico-checklist-migracao-2026`, lastModified: D.jun13, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/blog/algoritmo-luhn-cartao-credito-validacao-testes`, lastModified: D.jun13, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/validar-cpf-javascript-algoritmo-passo-a-passo`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/cartao-credito-falso-testes-fake-teste-sandbox`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerador-conta-bancaria-17-bancos-brasileiros`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerador-cpf-valido-online-como-funciona`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerador-cep-brasileiro-testes-formato-estados`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/validar-cpf-csharp-dotnet-mod11-xunit`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/validar-cpf-ruby-on-rails-mod-11-rspec`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/validar-cpf-java-spring-boot-algoritmo-mod11-junit`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/cpf-php-laravel-algoritmo-mod11-validacao-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/lgpd-testes-software-guia-pratico-devs`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/como-validar-cpf-online-e-no-codigo`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerar-cnpj-valido-testes-algoritmo-mod11-api`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/documentos-brasileiros-formatos-algoritmos-validacao`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerador-conta-corrente-nodejs-digito-verificador-banco`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/cnpj-fake-vs-cnpj-valido-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/gerador-inscricao-estadual-sp-algoritmo`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/gerar-boleto-febraban-linha-digitavel-nodejs-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/conta-bancaria-fake-bradesco-itau-nubank-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/validar-cnh-javascript-algoritmo-denatran`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/anonimizacao-vs-pseudonimizacao-lgpd-developers`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/fakeforge-vs-mockaroo-vs-fakerjs-dados-brasileiros`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/mockar-cep-cypress-dados-brasileiros-falsos`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/qr-code-pix-dinamico-emv-br-code-nodejs`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/popular-mysql-dados-brasileiros-fake-staging`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/popular-postgresql-dados-brasileiros-staging`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/popular-django-dados-brasileiros-seed-orm`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/como-gerar-cpf-valido-python-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/gerador-placa-mercosul-teste-software`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/fakeforge-vs-fakerjs-vs-4devs`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/algoritmo-luhn-cartao-credito`, lastModified: D.apr15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/validacao-cnpj-nodejs`, lastModified: D.apr15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/automatizar-dados-teste-ci-cd`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/popular-banco-dados-brasileiros-staging-completo`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },

    // Blog pillars (sep 30 - oct 01): comparativo + LGPD
    { url: `${baseUrl}/blog/mockaroo-vs-fakeforge-qual-escolher-times-brasileiros`, lastModified: D.sep30, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog/lgpd-dados-teste-desenvolvimento-guia-completo-devs-brasileiros`, lastModified: D.oct01, changeFrequency: "monthly", priority: 0.95 },

    // Páginas institucionais
    { url: `${baseUrl}/pricing`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/empresa`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/parceiros`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacidade`, lastModified: D.legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/termos`, lastModified: D.legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}
