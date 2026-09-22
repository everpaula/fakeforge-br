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

// Capitais restantes adicionadas em 2026-09-22 (Alavanca 1 programmatic SEO).
// Cobertura completa das 27 capitais brasileiras.
CEP_CITIES.push(
  { slug: "manaus", name: "Manaus", state: "Amazonas", stateCode: "AM", cepPrefix: "69",
    neighborhoods: ["Adrianópolis", "Ponta Negra", "Chapada", "Flores", "Centro", "Compensa", "Cidade Nova"],
    intro: "Manaus usa o prefixo CEP 69 para a capital do Amazonas. O Centro Histórico fica em 69005-XXX. Bairros nobres como Adrianópolis (69057-XXX), Ponta Negra (69037-XXX) e Chapada (69050-XXX) concentram alto valor imobiliário. Distrito Industrial fica em 69075-XXX.",
    stateContext: "O Amazonas usa prefixos CEP 69000-69299. Devido às distâncias fluviais, muitos municípios do interior usam prefixos que se sobrepõem com Roraima (69300+).",
    topQueries: ["gerador de CEP Manaus", "CEP AM válido", "CEP Ponta Negra fictício", "gerar endereço Amazonas teste"] },

  { slug: "belem", name: "Belém", state: "Pará", stateCode: "PA", cepPrefix: "66",
    neighborhoods: ["Umarizal", "Nazaré", "Batista Campos", "Centro", "Reduto", "São Braz", "Marco"],
    intro: "Belém usa prefixo CEP 66 para a capital do Pará. Umarizal (66055-XXX) e Nazaré (66040-XXX) são os bairros mais buscados por sistemas imobiliários e delivery. Centro histórico fica em 66017-XXX.",
    stateContext: "O Pará usa prefixos 66-68. Santarém tem prefixo 68000-XXX e Marabá 68501-XXX. Ananindeua, região metropolitana, usa 67000-XXX.",
    topQueries: ["gerador de CEP Belém", "CEP PA válido", "CEP Umarizal fictício", "gerar endereço Pará teste"] },

  { slug: "goiania", name: "Goiânia", state: "Goiás", stateCode: "GO", cepPrefix: "74",
    neighborhoods: ["Setor Bueno", "Setor Marista", "Setor Oeste", "Centro", "Setor Sul", "Jardim América", "Setor Aeroporto"],
    intro: "Goiânia usa prefixo CEP 74 pra capital de Goiás. Setor Bueno (74210-XXX) e Setor Marista (74180-XXX) são as áreas mais valorizadas. Centro fica em 74023-XXX. Setor Oeste (74110-XXX) concentra hospitais e faculdades.",
    stateContext: "Goiás usa prefixos 72-76. Anápolis (75000-XXX) tem prefixo próprio, assim como Aparecida de Goiânia (74900-XXX) e Rio Verde (75901-XXX).",
    topQueries: ["gerador de CEP Goiânia", "CEP GO válido", "CEP Setor Bueno fictício", "gerar endereço Goiás teste"] },

  { slug: "vitoria", name: "Vitória", state: "Espírito Santo", stateCode: "ES", cepPrefix: "29",
    neighborhoods: ["Praia do Canto", "Enseada do Suá", "Centro", "Jardim da Penha", "Barro Vermelho", "Bento Ferreira"],
    intro: "Vitória usa CEP 29 pra capital do ES. Praia do Canto (29055-XXX) é o bairro mais nobre. Enseada do Suá (29050-XXX) tem shopping e centro empresarial. Jardim da Penha (29060-XXX) fica próximo à UFES.",
    stateContext: "Espírito Santo usa prefixos 29. Vila Velha, cidade vizinha, tem prefixos 29100-29118. Cariacica (29140-XXX), Serra (29160-XXX). Cachoeiro de Itapemirim usa 29300-XXX.",
    topQueries: ["gerador de CEP Vitória", "CEP ES válido", "CEP Praia do Canto fictício", "gerar endereço ES teste"] },

  { slug: "natal", name: "Natal", state: "Rio Grande do Norte", stateCode: "RN", cepPrefix: "59",
    neighborhoods: ["Ponta Negra", "Tirol", "Petrópolis", "Lagoa Nova", "Candelária", "Barro Vermelho", "Cidade Alta"],
    intro: "Natal usa CEP 59 pra capital do RN. Ponta Negra (59090-XXX) é o cartão-postal turístico. Tirol (59015-XXX) e Petrópolis (59020-XXX) concentram alto valor imobiliário. Centro (Cidade Alta) fica em 59025-XXX.",
    stateContext: "RN usa prefixos 59. Mossoró tem prefixo próprio (59600-XXX), assim como Parnamirim (59140-XXX) e Caicó (59300-XXX).",
    topQueries: ["gerador de CEP Natal", "CEP RN válido", "CEP Ponta Negra Natal fictício", "gerar endereço RN teste"] },

  { slug: "joao-pessoa", name: "João Pessoa", state: "Paraíba", stateCode: "PB", cepPrefix: "58",
    neighborhoods: ["Manaíra", "Tambaú", "Cabo Branco", "Bessa", "Centro", "Miramar", "Bancários"],
    intro: "João Pessoa usa CEP 58 pra capital da Paraíba. Manaíra (58038-XXX), Tambaú (58039-XXX) e Cabo Branco (58045-XXX) formam a orla mais buscada. Bessa (58036-XXX) é bairro emergente. Centro histórico em 58010-XXX.",
    stateContext: "Paraíba usa prefixos 58. Campina Grande, segunda maior cidade, tem prefixo 58400-XXX. Santa Rita (58300-XXX) e Cabedelo (58101-XXX) fazem parte da região metropolitana.",
    topQueries: ["gerador de CEP João Pessoa", "CEP PB válido", "CEP Manaíra fictício", "gerar endereço Paraíba teste"] },

  { slug: "teresina", name: "Teresina", state: "Piauí", stateCode: "PI", cepPrefix: "64",
    neighborhoods: ["Fátima", "Jóquei", "Centro", "Ilhotas", "Cristo Rei", "Piçarra", "São Cristóvão"],
    intro: "Teresina usa CEP 64 pra capital do Piauí. Jóquei (64048-XXX) e Fátima (64049-XXX) concentram alto valor. Ilhotas (64014-XXX) é bairro tradicional. Centro fica em 64000-XXX.",
    stateContext: "Piauí usa prefixos 64. Parnaíba, cidade litorânea, tem prefixo 64200-XXX. Picos (64600-XXX) e Floriano (64800-XXX) são outros municípios importantes.",
    topQueries: ["gerador de CEP Teresina", "CEP PI válido", "CEP Jóquei fictício", "gerar endereço Piauí teste"] },

  { slug: "maceio", name: "Maceió", state: "Alagoas", stateCode: "AL", cepPrefix: "57",
    neighborhoods: ["Ponta Verde", "Jatiúca", "Pajuçara", "Farol", "Centro", "Poço", "Cruz das Almas"],
    intro: "Maceió usa CEP 57 pra capital de Alagoas. Ponta Verde (57035-XXX), Jatiúca (57036-XXX) e Pajuçara (57030-XXX) formam a orla turística mais valorizada. Farol (57055-XXX) é bairro nobre residencial.",
    stateContext: "Alagoas usa prefixos 57. Arapiraca, cidade interior, tem prefixo 57300-XXX. Marechal Deodoro (57160-XXX), berço histórico, também tem prefixo próprio.",
    topQueries: ["gerador de CEP Maceió", "CEP AL válido", "CEP Ponta Verde fictício", "gerar endereço Alagoas teste"] },

  { slug: "aracaju", name: "Aracaju", state: "Sergipe", stateCode: "SE", cepPrefix: "49",
    neighborhoods: ["Jardins", "Coroa do Meio", "Atalaia", "Farolândia", "Centro", "13 de Julho", "Grageru"],
    intro: "Aracaju usa CEP 49 pra capital de Sergipe. Jardins (49026-XXX) e 13 de Julho (49020-XXX) concentram alto valor. Coroa do Meio (49035-XXX) e Atalaia (49037-XXX) formam a orla marítima. Centro em 49010-XXX.",
    stateContext: "Sergipe usa prefixos 49. Nossa Senhora do Socorro, região metropolitana, tem prefixo 49160-XXX. Itabaiana (49500-XXX) e Estância (49200-XXX) são outros municípios.",
    topQueries: ["gerador de CEP Aracaju", "CEP SE válido", "CEP Jardins Aracaju fictício", "gerar endereço Sergipe teste"] },

  { slug: "sao-luis", name: "São Luís", state: "Maranhão", stateCode: "MA", cepPrefix: "65",
    neighborhoods: ["Renascença", "Ponta d'Areia", "Cohama", "Calhau", "Centro", "Olho d'Água", "Vinhais"],
    intro: "São Luís usa CEP 65 pra capital do Maranhão. Renascença (65075-XXX) é o bairro mais valorizado. Calhau (65071-XXX) e Ponta d'Areia (65077-XXX) formam a orla nobre. Centro histórico, patrimônio UNESCO, em 65010-XXX.",
    stateContext: "Maranhão usa prefixos 65. Imperatriz, segunda maior cidade, tem prefixo 65900-XXX. São José de Ribamar (65110-XXX) e Paço do Lumiar (65130-XXX) formam a região metropolitana.",
    topQueries: ["gerador de CEP São Luís", "CEP MA válido", "CEP Renascença fictício", "gerar endereço Maranhão teste"] },

  { slug: "cuiaba", name: "Cuiabá", state: "Mato Grosso", stateCode: "MT", cepPrefix: "78",
    neighborhoods: ["Jardim Aclimação", "Jardim das Américas", "Bosque da Saúde", "Centro Norte", "Centro Sul", "Goiabeiras", "Coxipó"],
    intro: "Cuiabá usa CEP 78 pra capital do MT. Jardim Aclimação (78050-XXX) e Jardim das Américas (78060-XXX) são os bairros mais buscados. Bosque da Saúde (78040-XXX) é área hospitalar. Centro em 78005-XXX.",
    stateContext: "MT usa prefixos 78. Rondonópolis (78700-XXX), segundo maior município, tem prefixo próprio. Sinop (78550-XXX), no norte agrícola, também. Várzea Grande (78110-XXX) faz parte da grande Cuiabá.",
    topQueries: ["gerador de CEP Cuiabá", "CEP MT válido", "CEP Aclimação fictício", "gerar endereço Mato Grosso teste"] },

  { slug: "campo-grande", name: "Campo Grande", state: "Mato Grosso do Sul", stateCode: "MS", cepPrefix: "79",
    neighborhoods: ["Jardim dos Estados", "Centro", "Vila Célia", "Chácara Cachoeira", "Monte Castelo", "Amambaí"],
    intro: "Campo Grande usa CEP 79 pra capital do MS. Jardim dos Estados (79020-XXX) é o bairro mais nobre. Centro em 79002-XXX. Chácara Cachoeira (79040-XXX) tem imóveis de alto padrão.",
    stateContext: "MS usa prefixos 79. Dourados, segunda maior cidade, tem prefixo 79800-XXX. Corumbá (79300-XXX), na fronteira com Bolívia, e Três Lagoas (79600-XXX), polo industrial, também têm prefixos próprios.",
    topQueries: ["gerador de CEP Campo Grande", "CEP MS válido", "CEP Jardim dos Estados fictício", "gerar endereço MS teste"] },

  { slug: "porto-velho", name: "Porto Velho", state: "Rondônia", stateCode: "RO", cepPrefix: "76",
    neighborhoods: ["Areal", "Nova Porto Velho", "Centro", "Nova Esperança", "Embratel", "Agenor de Carvalho"],
    intro: "Porto Velho usa CEP 76 pra capital de Rondônia. Areal (76804-XXX) e Nova Porto Velho (76820-XXX) são os bairros mais buscados. Centro em 76801-XXX.",
    stateContext: "RO usa prefixos 76. Ji-Paraná (76900-XXX), segunda maior cidade, tem prefixo próprio. Ariquemes (76870-XXX) e Vilhena (76980-XXX) são outros municípios importantes.",
    topQueries: ["gerador de CEP Porto Velho", "CEP RO válido", "CEP Areal Porto Velho fictício", "gerar endereço Rondônia teste"] },

  { slug: "rio-branco", name: "Rio Branco", state: "Acre", stateCode: "AC", cepPrefix: "69",
    neighborhoods: ["Bosque", "Jardim América", "Centro", "Dom Giocondo", "Estação Experimental", "Nova Estação"],
    intro: "Rio Branco usa CEP 69 pra capital do Acre. Bosque (69908-XXX) é o bairro mais nobre. Centro em 69900-XXX. Como o AC tem cidade única grande, muitos serviços centralizam ali.",
    stateContext: "Acre usa prefixos 69900-69999. Cruzeiro do Sul, segunda cidade, tem prefixo 69980-XXX. Sena Madureira (69940-XXX) e Brasileia (69932-XXX) na fronteira com Bolívia.",
    topQueries: ["gerador de CEP Rio Branco", "CEP AC válido", "CEP Bosque fictício", "gerar endereço Acre teste"] },

  { slug: "boa-vista", name: "Boa Vista", state: "Roraima", stateCode: "RR", cepPrefix: "69",
    neighborhoods: ["Aparecida", "Caçari", "Centro", "Pricumã", "São Vicente", "Mecejana", "Paraviana"],
    intro: "Boa Vista usa CEP 69 pra capital de Roraima. Aparecida (69306-XXX) e Caçari (69307-XXX) concentram alto valor. Centro em 69301-XXX. Cidade planejada, um dos poucos casos no Brasil.",
    stateContext: "Roraima usa prefixos 69300-69399. Rorainópolis (69373-XXX) e Pacaraima (69345-XXX), na fronteira com Venezuela, são outros municípios.",
    topQueries: ["gerador de CEP Boa Vista", "CEP RR válido", "CEP Aparecida fictício", "gerar endereço Roraima teste"] },

  { slug: "macapa", name: "Macapá", state: "Amapá", stateCode: "AP", cepPrefix: "68",
    neighborhoods: ["Trem", "Centro", "Buritizal", "Santa Rita", "Pacoval", "Zerão"],
    intro: "Macapá usa CEP 68 pra capital do Amapá. Centro em 68900-XXX. Trem (68901-XXX) e Buritizal (68902-XXX) são bairros centrais. Cidade cortada pela linha do Equador.",
    stateContext: "Amapá usa prefixos 68900-68999. Santana (68925-XXX), segundo município, tem prefixo próprio.",
    topQueries: ["gerador de CEP Macapá", "CEP AP válido", "CEP Trem Macapá fictício", "gerar endereço Amapá teste"] },

  { slug: "palmas", name: "Palmas", state: "Tocantins", stateCode: "TO", cepPrefix: "77",
    neighborhoods: ["Plano Diretor Sul", "Plano Diretor Norte", "Aureny III", "Taquaralto", "Jardim Aureny II"],
    intro: "Palmas usa CEP 77 pra capital do TO. Cidade planejada mais nova do Brasil (fundada em 1989). Plano Diretor Sul (77016-XXX) e Plano Diretor Norte (77006-XXX) concentram alto valor imobiliário.",
    stateContext: "Tocantins usa prefixos 77. Araguaína (77800-XXX), segunda maior cidade, e Gurupi (77400-XXX) têm prefixos próprios.",
    topQueries: ["gerador de CEP Palmas", "CEP TO válido", "CEP Plano Diretor fictício", "gerar endereço Tocantins teste"] },
);

export function getCity(slug: string): CepCity | undefined {
  return CEP_CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CEP_CITIES.map((c) => c.slug);
}
