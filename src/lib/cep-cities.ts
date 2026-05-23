/**
 * City-specific metadata for the /gerador-cep/[city] dynamic route.
 * Used for programmatic SEO targeting long-tail "gerador CEP [cidade]" keywords.
 *
 * Each city aligns with STATES_DATA in generators/cep.ts for content coherence.
 */

export type CepCity = {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  cepPrefix: string;
  neighborhoods: string[];
  intro: string;
  stateContext: string;
  topQueries: string[];
};

export const CEP_CITIES: CepCity[] = [
  {
    slug: "sao-paulo",
    name: "São Paulo",
    state: "São Paulo",
    stateCode: "SP",
    cepPrefix: "01",
    neighborhoods: [
      "Bela Vista",
      "Consolação",
      "Liberdade",
      "Pinheiros",
      "Vila Mariana",
      "Moema",
      "Itaim Bibi",
      "Jardim Paulista",
      "Perdizes",
      "Lapa",
    ],
    intro:
      "São Paulo é o maior centro urbano do Brasil e tem a estrutura de CEPs mais complexa do país. CEPs da capital começam em 01 (Centro), passam por 02-05 (zona norte e leste), 04-05 (zona sul) e 05 (zona oeste).",
    stateContext:
      "O estado de São Paulo usa o prefixo CEP entre 01 e 19. Municípios da Grande SP geralmente ficam em 06-09. Capitais regionais como Campinas (13), Ribeirão Preto (14) e Santos (11) têm prefixos próprios.",
    topQueries: [
      "gerador de CEP São Paulo",
      "CEP fictício SP",
      "gerar endereço SP teste",
      "CEP Bela Vista válido",
    ],
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    state: "Rio de Janeiro",
    stateCode: "RJ",
    cepPrefix: "20",
    neighborhoods: [
      "Copacabana",
      "Botafogo",
      "Flamengo",
      "Leblon",
      "Ipanema",
      "Tijuca",
      "Barra da Tijuca",
      "Centro",
      "Laranjeiras",
      "Gávea",
    ],
    intro:
      "O Rio de Janeiro usa o prefixo CEP 20 para a capital, com a Zona Sul (Copacabana, Ipanema, Leblon) concentrada em 22000-22999 e o Centro em 20000-20999. A Zona Oeste (Barra da Tijuca, Recreio) fica em 22600-22799.",
    stateContext:
      "O estado do Rio usa prefixos 20-28. Niterói tem prefixo próprio (24), assim como Petrópolis (25) e cidades da Região dos Lagos. Cabo Frio fica em 28900-28999.",
    topQueries: [
      "gerador de CEP Rio de Janeiro",
      "CEP Copacabana válido",
      "gerar endereço Zona Sul RJ",
      "CEP fictício RJ teste",
    ],
  },
  {
    slug: "belo-horizonte",
    name: "Belo Horizonte",
    state: "Minas Gerais",
    stateCode: "MG",
    cepPrefix: "30",
    neighborhoods: [
      "Savassi",
      "Funcionários",
      "Lourdes",
      "Centro",
      "Serra",
      "Buritis",
      "Pampulha",
      "Santo Agostinho",
    ],
    intro:
      "Belo Horizonte usa o prefixo CEP 30 para o Centro e bairros nobres como Savassi (30140-XXX), Funcionários (30150-XXX) e Lourdes (30170-XXX). A região hospitalar concentra-se em 30130-XXX. Pampulha fica em 31, fora do prefixo principal.",
    stateContext:
      "Minas Gerais é o estado com mais municípios do Brasil (853) e usa prefixos CEP de 30 a 39. Uberlândia (38400-XXX), Juiz de Fora (36000-XXX) e Contagem (32000-XXX) têm prefixos específicos.",
    topQueries: [
      "gerador de CEP Belo Horizonte",
      "CEP BH válido teste",
      "CEP Savassi fictício",
      "gerar endereço MG",
    ],
  },
  {
    slug: "porto-alegre",
    name: "Porto Alegre",
    state: "Rio Grande do Sul",
    stateCode: "RS",
    cepPrefix: "90",
    neighborhoods: [
      "Moinhos de Vento",
      "Centro Histórico",
      "Bom Fim",
      "Cidade Baixa",
      "Menino Deus",
      "Petrópolis",
    ],
    intro:
      "Porto Alegre usa o prefixo CEP 90 para a capital, com bairros centrais como Centro Histórico (90010-XXX), Bom Fim (90035-XXX) e Cidade Baixa (90040-XXX). Moinhos de Vento, área comercial e gastronômica, concentra-se em 90570-XXX.",
    stateContext:
      "O Rio Grande do Sul usa prefixos CEP 90-99. Caxias do Sul (95000-XXX), Pelotas (96000-XXX) e Santa Maria (97000-XXX) têm prefixos próprios. A região serrana (Gramado, Canela) fica em 95670-XXX.",
    topQueries: [
      "gerador de CEP Porto Alegre",
      "CEP POA válido",
      "gerar endereço RS teste",
      "CEP Moinhos de Vento fictício",
    ],
  },
  {
    slug: "curitiba",
    name: "Curitiba",
    state: "Paraná",
    stateCode: "PR",
    cepPrefix: "80",
    neighborhoods: [
      "Batel",
      "Centro",
      "Água Verde",
      "Bigorrilho",
      "Juvevê",
      "Alto da XV",
      "Rebouças",
      "Cristo Rei",
    ],
    intro:
      "Curitiba usa o prefixo CEP 80 para a capital. O Centro fica em 80010-XXX a 80060-XXX, enquanto Batel (bairro nobre) concentra-se em 80420-XXX. Água Verde (80240-XXX) e Bigorrilho (80730-XXX) também são áreas centrais bem buscadas.",
    stateContext:
      "O Paraná usa prefixos CEP 80-87. Londrina tem prefixo 86 (86010-XXX a 86099-XXX), Maringá fica em 87010-XXX e Foz do Iguaçu em 85850-XXX.",
    topQueries: [
      "gerador de CEP Curitiba",
      "CEP CWB válido",
      "CEP Batel fictício",
      "gerar endereço PR teste",
    ],
  },
  {
    slug: "salvador",
    name: "Salvador",
    state: "Bahia",
    stateCode: "BA",
    cepPrefix: "40",
    neighborhoods: [
      "Barra",
      "Ondina",
      "Rio Vermelho",
      "Pituba",
      "Itaigara",
      "Caminho das Árvores",
      "Pelourinho",
    ],
    intro:
      "Salvador usa o prefixo CEP 40 para a capital. O Pelourinho (Centro Histórico) fica em 40020-XXX, enquanto a orla atlântica concentra-se em 40140-XXX (Barra) e 40170-XXX (Ondina). Bairros corporativos como Pituba (41830-XXX) e Caminho das Árvores (41820-XXX) já usam prefixo 41.",
    stateContext:
      "A Bahia usa prefixos CEP 40-48. Feira de Santana (44000-XXX), Vitória da Conquista (45000-XXX), Ilhéus (45650-XXX) e Porto Seguro (45810-XXX) têm prefixos específicos da região.",
    topQueries: [
      "gerador de CEP Salvador",
      "CEP SSA válido",
      "CEP Pelourinho fictício",
      "gerar endereço BA teste",
    ],
  },
  {
    slug: "recife",
    name: "Recife",
    state: "Pernambuco",
    stateCode: "PE",
    cepPrefix: "50",
    neighborhoods: [
      "Boa Viagem",
      "Casa Forte",
      "Espinheiro",
      "Madalena",
      "Centro",
      "Graças",
      "Derby",
    ],
    intro:
      "Recife usa o prefixo CEP 50 para a capital. Boa Viagem, a famosa orla, concentra-se em 51020-XXX a 51030-XXX. O Centro do Recife (Recife Antigo, São José) fica em 50030-XXX. Bairros nobres como Espinheiro (52020-XXX) e Casa Forte (52061-XXX) usam prefixo 52.",
    stateContext:
      "Pernambuco usa prefixos CEP 50-56. Olinda (53010-XXX), Jaboatão dos Guararapes (54100-XXX), Caruaru (55000-XXX) e Petrolina (56300-XXX) têm prefixos próprios.",
    topQueries: [
      "gerador de CEP Recife",
      "CEP REC válido",
      "CEP Boa Viagem fictício",
      "gerar endereço PE teste",
    ],
  },
  {
    slug: "fortaleza",
    name: "Fortaleza",
    state: "Ceará",
    stateCode: "CE",
    cepPrefix: "60",
    neighborhoods: [
      "Meireles",
      "Aldeota",
      "Centro",
      "Cocó",
      "Varjota",
      "Dionísio Torres",
    ],
    intro:
      "Fortaleza usa o prefixo CEP 60 para a capital. Meireles, a área mais nobre da orla, fica em 60160-XXX. Aldeota concentra-se em 60150-XXX a 60155-XXX. O Centro de Fortaleza fica em 60010-XXX. Bairros emergentes como Cocó usam 60192-XXX.",
    stateContext:
      "O Ceará usa prefixos CEP 60-63. Caucaia (61600-XXX), Maracanaú (61900-XXX), Sobral (62010-XXX), Juazeiro do Norte (63000-XXX) e Crato (63100-XXX) têm prefixos específicos da região.",
    topQueries: [
      "gerador de CEP Fortaleza",
      "CEP FOR válido",
      "CEP Meireles fictício",
      "gerar endereço CE teste",
    ],
  },
  {
    slug: "brasilia",
    name: "Brasília",
    state: "Distrito Federal",
    stateCode: "DF",
    cepPrefix: "70",
    neighborhoods: [
      "Asa Sul",
      "Asa Norte",
      "Lago Sul",
      "Lago Norte",
      "Sudoeste",
      "Noroeste",
      "Águas Claras",
    ],
    intro:
      "Brasília usa o prefixo CEP 70 para todo o Plano Piloto. Asa Sul fica em 70100-XXX a 70390-XXX, Asa Norte em 70770-XXX a 70910-XXX. Lago Sul concentra-se em 71600-XXX e Lago Norte em 71500-XXX. Bairros novos como Águas Claras usam 71900-XXX.",
    stateContext:
      "O Distrito Federal usa exclusivamente o prefixo 70-73. Por ser unidade federativa única (não tem municípios em volta), todos os CEPs do DF estão dentro dessa faixa. Cidades-satélites como Taguatinga (72010-XXX) e Ceilândia (72220-XXX) têm prefixos específicos.",
    topQueries: [
      "gerador de CEP Brasília",
      "CEP BSB válido",
      "CEP Asa Sul fictício",
      "gerar endereço DF teste",
    ],
  },
  {
    slug: "florianopolis",
    name: "Florianópolis",
    state: "Santa Catarina",
    stateCode: "SC",
    cepPrefix: "88",
    neighborhoods: [
      "Centro",
      "Trindade",
      "Lagoa da Conceição",
      "Jurerê",
      "Canasvieiras",
      "Ingleses",
    ],
    intro:
      "Florianópolis usa o prefixo CEP 88 para a capital. O Centro da ilha fica em 88010-XXX a 88060-XXX. Trindade, área universitária, concentra-se em 88036-XXX. Praias do norte como Jurerê (88053-XXX), Canasvieiras (88054-XXX) e Ingleses (88058-XXX) têm prefixos próximos.",
    stateContext:
      "Santa Catarina usa prefixos CEP 88-89. Joinville (89200-XXX), Blumenau (89010-XXX), Itajaí (88301-XXX) e Chapecó (89800-XXX) têm prefixos próprios.",
    topQueries: [
      "gerador de CEP Florianópolis",
      "CEP Floripa válido",
      "CEP Jurerê fictício",
      "gerar endereço SC teste",
    ],
  },
];

export function getCity(slug: string): CepCity | undefined {
  return CEP_CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CEP_CITIES.map((c) => c.slug);
}
