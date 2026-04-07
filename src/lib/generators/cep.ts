interface Address {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  stateCode: string;
}

const STATES_DATA: { code: string; name: string; cities: { name: string; cepPrefix: string; neighborhoods: string[] }[] }[] = [
  {
    code: "SP", name: "São Paulo",
    cities: [
      { name: "São Paulo", cepPrefix: "01", neighborhoods: ["Bela Vista", "Consolação", "Liberdade", "Pinheiros", "Vila Mariana", "Moema", "Itaim Bibi", "Jardim Paulista", "Perdizes", "Lapa"] },
      { name: "Campinas", cepPrefix: "13", neighborhoods: ["Cambuí", "Barão Geraldo", "Taquaral", "Centro", "Nova Campinas", "Guanabara"] },
      { name: "Santos", cepPrefix: "11", neighborhoods: ["Gonzaga", "Boqueirão", "Embaré", "Aparecida", "Ponta da Praia", "José Menino"] },
      { name: "Ribeirão Preto", cepPrefix: "14", neighborhoods: ["Centro", "Jardim Sumaré", "Alto da Boa Vista", "Campos Elíseos", "Vila Seixas"] },
    ],
  },
  {
    code: "RJ", name: "Rio de Janeiro",
    cities: [
      { name: "Rio de Janeiro", cepPrefix: "20", neighborhoods: ["Copacabana", "Botafogo", "Flamengo", "Leblon", "Ipanema", "Tijuca", "Barra da Tijuca", "Centro", "Laranjeiras", "Gávea"] },
      { name: "Niterói", cepPrefix: "24", neighborhoods: ["Icaraí", "Centro", "São Francisco", "Ingá", "Santa Rosa"] },
    ],
  },
  {
    code: "MG", name: "Minas Gerais",
    cities: [
      { name: "Belo Horizonte", cepPrefix: "30", neighborhoods: ["Savassi", "Funcionários", "Lourdes", "Centro", "Serra", "Buritis", "Pampulha", "Santo Agostinho"] },
      { name: "Uberlândia", cepPrefix: "38", neighborhoods: ["Centro", "Santa Mônica", "Saraiva", "Jardim Karaíba", "Osvaldo Rezende"] },
    ],
  },
  {
    code: "RS", name: "Rio Grande do Sul",
    cities: [
      { name: "Porto Alegre", cepPrefix: "90", neighborhoods: ["Moinhos de Vento", "Centro Histórico", "Bom Fim", "Cidade Baixa", "Menino Deus", "Petrópolis"] },
      { name: "Caxias do Sul", cepPrefix: "95", neighborhoods: ["Centro", "Exposição", "São Pelegrino", "Madureira", "Rio Branco"] },
    ],
  },
  {
    code: "PR", name: "Paraná",
    cities: [
      { name: "Curitiba", cepPrefix: "80", neighborhoods: ["Batel", "Centro", "Água Verde", "Bigorrilho", "Juvevê", "Alto da XV", "Rebouças", "Cristo Rei"] },
      { name: "Londrina", cepPrefix: "86", neighborhoods: ["Centro", "Gleba Palhano", "Jardim Higienópolis", "Vila Brasil"] },
    ],
  },
  {
    code: "BA", name: "Bahia",
    cities: [
      { name: "Salvador", cepPrefix: "40", neighborhoods: ["Barra", "Ondina", "Rio Vermelho", "Pituba", "Itaigara", "Caminho das Árvores", "Pelourinho"] },
    ],
  },
  {
    code: "PE", name: "Pernambuco",
    cities: [
      { name: "Recife", cepPrefix: "50", neighborhoods: ["Boa Viagem", "Casa Forte", "Espinheiro", "Madalena", "Centro", "Graças", "Derby"] },
    ],
  },
  {
    code: "CE", name: "Ceará",
    cities: [
      { name: "Fortaleza", cepPrefix: "60", neighborhoods: ["Meireles", "Aldeota", "Centro", "Cocó", "Varjota", "Dionísio Torres"] },
    ],
  },
  {
    code: "DF", name: "Distrito Federal",
    cities: [
      { name: "Brasília", cepPrefix: "70", neighborhoods: ["Asa Sul", "Asa Norte", "Lago Sul", "Lago Norte", "Sudoeste", "Noroeste", "Águas Claras"] },
    ],
  },
  {
    code: "SC", name: "Santa Catarina",
    cities: [
      { name: "Florianópolis", cepPrefix: "88", neighborhoods: ["Centro", "Trindade", "Lagoa da Conceição", "Jurerê", "Canasvieiras", "Ingleses"] },
    ],
  },
];

const STREET_PREFIXES = ["Rua", "Avenida", "Travessa", "Alameda", "Praça"];
const STREET_NAMES = [
  "das Flores", "Brasil", "São Paulo", "Santos Dumont", "Tiradentes",
  "Dom Pedro II", "Getúlio Vargas", "Presidente Kennedy", "Rio Branco",
  "Independência", "da Liberdade", "Paulista", "Atlântica", "Beira Mar",
  "das Palmeiras", "dos Bandeirantes", "Marechal Deodoro", "XV de Novembro",
  "Sete de Setembro", "República", "Amazonas", "Paraná", "Minas Gerais",
  "Bahia", "Goiás", "Pernambuco", "do Comércio", "da Paz", "Europa",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(digits: number): string {
  return String(Math.floor(Math.random() * Math.pow(10, digits))).padStart(digits, "0");
}

export function generateAddress(formatted = true): Address {
  const state = pick(STATES_DATA);
  const city = pick(state.cities);
  const neighborhood = pick(city.neighborhoods);
  const streetPrefix = pick(STREET_PREFIXES);
  const streetName = pick(STREET_NAMES);
  const street = `${streetPrefix} ${streetName}, ${Math.floor(Math.random() * 9000) + 100}`;

  const cepSuffix = randomNumber(6);
  const cep = `${city.cepPrefix}${cepSuffix}`;
  const formattedCep = formatted ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep;

  return {
    cep: formattedCep,
    street,
    neighborhood,
    city: city.name,
    state: state.name,
    stateCode: state.code,
  };
}

export function generateCEP(formatted = true): string {
  return generateAddress(formatted).cep;
}
