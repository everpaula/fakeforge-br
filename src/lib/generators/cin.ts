// CIN (Carteira de Identidade Nacional) — substitui o RG
// O CIN usa o CPF como número único de identificação. Os 11 dígitos
// do número do documento são o próprio CPF do titular.
// Inclui dados de emissão (UF emissora, data, validade).

import { generateCPF } from "./cpf";

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export interface CIN {
  numero: string; // CPF formatado
  uf_emissora: string;
  data_emissao: string; // ISO date YYYY-MM-DD
  data_validade: string; // 10 anos após emissão
  identificador_unico: string; // 12 chars hex pseudo
}

export function generateCIN(): CIN {
  const cpf = generateCPF(true);

  const today = new Date();
  const start = new Date(today.getFullYear() - 4, 0, 1); // CIN existe desde 2022
  const issued = randomDate(start, today);
  const expires = new Date(issued);
  expires.setFullYear(expires.getFullYear() + 10);

  // Random UF
  const uf = UFS[Math.floor(Math.random() * UFS.length)];

  // Identificador único (NIA - Número de Identificação Aleatório)
  const idLen = 12;
  let id = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < idLen; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return {
    numero: cpf,
    uf_emissora: uf,
    data_emissao: `${issued.getFullYear()}-${pad(issued.getMonth() + 1)}-${pad(issued.getDate())}`,
    data_validade: `${expires.getFullYear()}-${pad(expires.getMonth() + 1)}-${pad(expires.getDate())}`,
    identificador_unico: id,
  };
}
