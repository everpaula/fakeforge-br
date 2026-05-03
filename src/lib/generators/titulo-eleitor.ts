// Título de Eleitor — 12 dígitos
// Formato: NNNNNNNN UU DD
//   8 dígitos: número sequencial
//   2 dígitos: código da UF (01-28)
//   2 dígitos verificadores: mod-11 com regras específicas
// Algoritmo oficial do TSE.

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

const UF_CODES = [
  "01", // SP
  "02", // MG
  "03", // RJ
  "04", // RS
  "05", // BA
  "06", // PR
  "07", // CE
  "08", // PE
  "09", // SC
  "10", // GO
  "11", // MA
  "12", // PB
  "13", // PA
  "14", // ES
  "15", // PI
  "16", // RN
  "17", // AL
  "18", // MT
  "19", // MS
  "20", // DF
  "21", // SE
  "22", // AM
  "23", // RO
  "24", // AC
  "25", // AP
  "26", // RR
  "27", // TO
  "28", // ZZ (exterior)
];

function calcCheckDigit(numbers: number[], weights: number[], uf?: string): number {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) sum += numbers[i] * weights[i];
  let dig = sum % 11;
  if (dig === 10) dig = 0;
  // Regra especial: para UF 01 (SP) ou 02 (MG), se resto for 0, dígito é 1
  if (dig === 0 && (uf === "01" || uf === "02")) dig = 1;
  return dig;
}

export function generateTituloEleitor(formatted = true): string {
  // 8 dígitos sequenciais
  const seq: number[] = [];
  for (let i = 0; i < 8; i++) seq.push(randomDigit());

  // UF aleatória entre 01-28
  const ufCode = UF_CODES[Math.floor(Math.random() * UF_CODES.length)];
  const ufDigits = ufCode.split("").map(Number);

  // 1º dígito verificador: mod-11 com pesos 2..9 sobre os 8 sequenciais
  const weights1 = [2, 3, 4, 5, 6, 7, 8, 9];
  const d1 = calcCheckDigit(seq, weights1, ufCode);

  // 2º dígito verificador: mod-11 com pesos 7,8,9 sobre UF + d1
  const weights2 = [7, 8, 9];
  const d2 = calcCheckDigit([...ufDigits, d1], weights2, ufCode);

  const titulo = seq.join("") + ufCode + String(d1) + String(d2);
  if (formatted) {
    return `${titulo.slice(0, 4)} ${titulo.slice(4, 8)} ${titulo.slice(8, 12)}`;
  }
  return titulo;
}

export function validateTituloEleitor(input: string): boolean {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 12) return false;
  if (/^(\d)\1{11}$/.test(cleaned)) return false;

  const ufCode = cleaned.slice(8, 10);
  if (!UF_CODES.includes(ufCode)) return false;

  const seq = cleaned.slice(0, 8).split("").map(Number);
  const ufDigits = ufCode.split("").map(Number);
  const d1 = Number(cleaned[10]);
  const d2 = Number(cleaned[11]);

  const weights1 = [2, 3, 4, 5, 6, 7, 8, 9];
  if (calcCheckDigit(seq, weights1, ufCode) !== d1) return false;

  const weights2 = [7, 8, 9];
  if (calcCheckDigit([...ufDigits, d1], weights2, ufCode) !== d2) return false;

  return true;
}
