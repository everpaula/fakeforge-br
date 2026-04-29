function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function calculateCheckDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function generateCNPJ(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 8; i++) {
    digits.push(randomDigit());
  }
  // Branch number (0001 for headquarters)
  digits.push(0, 0, 0, 1);

  const firstCheck = calculateCheckDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  digits.push(firstCheck);

  const secondCheck = calculateCheckDigit(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  digits.push(secondCheck);

  const cnpj = digits.join("");

  if (formatted) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
  }
  return cnpj;
}

export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const first = calculateCheckDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (first !== digits[12]) return false;

  const second = calculateCheckDigit(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return second === digits[13];
}

// CNPJ Alfanumérico — Receita Federal IN 2229/2024, vigência 01/07/2026
// Os primeiros 12 caracteres podem ser 0-9 ou A-Z. Dígitos verificadores
// continuam numéricos. Cálculo usa código ASCII de cada caractere menos 48.
const ALFA_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomAlfaChar(): string {
  return ALFA_CHARS[Math.floor(Math.random() * ALFA_CHARS.length)];
}

function calculateAlfaCheckDigit(chars: string[], weights: number[]): number {
  const sum = chars.reduce((acc, char, i) => {
    const value = char.charCodeAt(0) - 48; // '0' = 0, '9' = 9, 'A' = 17, 'Z' = 42
    return acc + value * weights[i];
  }, 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function generateCnpjAlfa(formatted = true): string {
  const chars: string[] = [];
  for (let i = 0; i < 8; i++) chars.push(randomAlfaChar());
  // Branch (filial). Pode ser alfa também na nova regra, mas '0001' continua válido.
  chars.push("0", "0", "0", "1");

  const first = calculateAlfaCheckDigit(chars, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  chars.push(String(first));

  const second = calculateAlfaCheckDigit(chars, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  chars.push(String(second));

  const cnpj = chars.join("");

  if (formatted) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
  }
  return cnpj;
}

export function validateCnpjAlfa(input: string): boolean {
  const cleaned = input.replace(/[^0-9A-Z]/gi, "").toUpperCase();
  if (cleaned.length !== 14) return false;
  if (/^(.)\1{13}$/.test(cleaned)) return false;
  // Last 2 must be digits
  if (!/^\d{2}$/.test(cleaned.slice(12))) return false;

  const chars = cleaned.split("");
  const first = calculateAlfaCheckDigit(chars.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (String(first) !== chars[12]) return false;

  const second = calculateAlfaCheckDigit(chars.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return String(second) === chars[13];
}
