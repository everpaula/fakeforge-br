// CNH (Carteira Nacional de Habilitação) — 11 dígitos
// Algorithm: 9-digit base + 2 check digits via modified mod-11
// Reference: DENATRAN — algoritmo oficial de validação

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generateCNH(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 9; i++) digits.push(randomDigit());

  // First check digit: weights 9..1 over inverted base
  let dsc = 0;
  let sum = 0;
  for (let i = 0, j = 9; i < 9; i++, j--) {
    sum += digits[i] * j;
  }
  let d1 = sum % 11;
  if (d1 >= 10) {
    d1 = 0;
    dsc = 2;
  }
  digits.push(d1);

  // Second check digit: weights 1..9 over inverted base
  sum = 0;
  for (let i = 0, j = 1; i < 9; i++, j++) {
    sum += digits[i] * j;
  }
  let d2 = (sum % 11) - dsc;
  if (d2 < 0) d2 += 11;
  if (d2 >= 10) d2 = 0;
  digits.push(d2);

  const cnh = digits.join("");
  if (formatted) {
    return `${cnh.slice(0, 3)} ${cnh.slice(3, 6)} ${cnh.slice(6, 9)} ${cnh.slice(9)}`;
  }
  return cnh;
}

export function validateCNH(input: string): boolean {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  let dsc = 0;
  let sum = 0;
  for (let i = 0, j = 9; i < 9; i++, j--) sum += digits[i] * j;
  let d1 = sum % 11;
  if (d1 >= 10) {
    d1 = 0;
    dsc = 2;
  }
  if (d1 !== digits[9]) return false;

  sum = 0;
  for (let i = 0, j = 1; i < 9; i++, j++) sum += digits[i] * j;
  let d2 = (sum % 11) - dsc;
  if (d2 < 0) d2 += 11;
  if (d2 >= 10) d2 = 0;

  return d2 === digits[10];
}
