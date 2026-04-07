import { generateCNPJ } from "./cnpj";
import { generateAddress } from "./cep";
import { generatePhone, generateEmail } from "./contact";

const COMPANY_PREFIXES = [
  "Tech", "Digital", "Global", "Brasil", "Nacional", "Prime",
  "Smart", "Nova", "Master", "Ultra", "Mega", "Super", "Max",
];

const COMPANY_CORES = [
  "Solutions", "Systems", "Serviços", "Comércio", "Indústria",
  "Consultoria", "Engenharia", "Logística", "Distribuidora",
  "Transportes", "Alimentos", "Construções", "Incorporadora",
  "Comunicações", "Tecnologia", "Informática", "Software",
];

const COMPANY_SUFFIXES = ["S.A.", "Ltda.", "ME", "EIRELI", "S/S"];

const TRADE_NAMES = [
  "Vortex", "Apex", "Zenith", "Orion", "Atlas", "Nexus",
  "Vertex", "Prisma", "Cosmos", "Quantum", "Phoenix", "Sigma",
  "Ômega", "Delta", "Lambda", "Éxito", "Sinergia", "Vanguarda",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface Company {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  phone: string;
  email: string;
  address: ReturnType<typeof generateAddress>;
}

function generateInscricaoEstadual(): string {
  let ie = "";
  for (let i = 0; i < 12; i++) {
    ie += Math.floor(Math.random() * 10).toString();
  }
  return ie;
}

export function generateCompany(): Company {
  const tradeName = pick(TRADE_NAMES);
  const core = pick(COMPANY_CORES);
  const suffix = pick(COMPANY_SUFFIXES);
  const razaoSocial = `${tradeName} ${core} ${suffix}`;
  const nomeFantasia = `${pick(COMPANY_PREFIXES)} ${tradeName}`;
  const address = generateAddress();

  return {
    cnpj: generateCNPJ(),
    razaoSocial,
    nomeFantasia,
    inscricaoEstadual: generateInscricaoEstadual(),
    phone: generatePhone(),
    email: generateEmail(tradeName.toLowerCase(), core.toLowerCase()),
    address,
  };
}
