// PIS/PASEP/NIT/NIS — 11 dígitos, módulo 11 com pesos 3..2
// Programa de Integração Social (CLT) / Programa de Formação do Patrimônio
// do Servidor Público (estatutário) / NIT (autônomos) / NIS (beneficiários)
// Todos compartilham o mesmo formato e algoritmo.

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generatePIS(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 10; i++) digits.push(randomDigit());

  // Pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * weights[i];
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? 0 : 11 - remainder;
  digits.push(checkDigit);

  const pis = digits.join("");
  if (formatted) {
    return `${pis.slice(0, 3)}.${pis.slice(3, 8)}.${pis.slice(8, 10)}-${pis.slice(10)}`;
  }
  return pis;
}

export function validatePIS(input: string): boolean {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * weights[i];
  const remainder = sum % 11;
  const expected = remainder < 2 ? 0 : 11 - remainder;

  return digits[10] === expected;
}
