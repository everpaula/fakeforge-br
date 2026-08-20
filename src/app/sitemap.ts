import type { MetadataRoute } from "next";
import { CEP_CITIES } from "@/lib/cep-cities";

// Datas reais de mudança significativa por página. Datas idênticas em todas
// as URLs (build-time `new Date()`) sinalizam ao Googlebot que o lastmod é
// não confiável e ele passa a ignorar o campo. Aqui mantemos data por
// página para preservar a sinalização real de crawl budget.
const D = {
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

  return [
    ...cityRoutes,
    { url: baseUrl, lastModified: D.home, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/geradores`, lastModified: D.home, changeFrequency: "weekly", priority: 0.9 },

    // Landings principais PT
    { url: `${baseUrl}/gerador-cpf`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cnpj-alfanumerico`, lastModified: D.jun13, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/gerador-cnh`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-cin`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-rg`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-pis`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-titulo-eleitor`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/gerador-placa-mercosul`, lastModified: D.jun15, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-cep`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/buscar-cep`, lastModified: D.newest, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gerador-telefone`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.8 },
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
    { url: `${baseUrl}/comparacao/fakeforge-vs-faker-py`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.85 },

    // Validadores
    { url: `${baseUrl}/validar-cpf`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/validar-cnpj`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.8 },
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
    { url: `${baseUrl}/blog/como-gerar-cpf-valido-python-testes`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/gerador-placa-mercosul-teste-software`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/blog/fakeforge-vs-fakerjs-vs-4devs`, lastModified: D.may26, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/algoritmo-luhn-cartao-credito`, lastModified: D.apr15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/validacao-cnpj-nodejs`, lastModified: D.apr15, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog/automatizar-dados-teste-ci-cd`, lastModified: D.home, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog/popular-banco-dados-brasileiros-staging-completo`, lastModified: D.home, changeFrequency: "monthly", priority: 0.95 },

    // Páginas institucionais
    { url: `${baseUrl}/pricing`, lastModified: D.jun01, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/sobre`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/parceiros`, lastModified: D.may15, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacidade`, lastModified: D.legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/termos`, lastModified: D.legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}
