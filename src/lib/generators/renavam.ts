// RENAVAM — 11 dígitos, algoritmo DENATRAN
// Registro Nacional de Veículos Automotores
//
// Estrutura: 10 dígitos base + 1 dígito verificador
// Algoritmo do DV:
//   - Multiplicar os 10 dígitos base pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
//     (esquerda pra direita)
//   - Somar os produtos
//   - Multiplicar a soma por 10
//   - Mod 11
//   - Se resultado for 10 ou 11, dígito verificador = 0. Senão, = resultado.

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generateRenavam(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 10; i++) digits.push(randomDigit());

  // Pesos DENATRAN (esquerda pra direita)
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * weights[i];

  const remainder = (sum * 10) % 11;
  const checkDigit = remainder >= 10 ? 0 : remainder;
  digits.push(checkDigit);

  const renavam = digits.join("");
  if (formatted) {
    // Formato usual: XXXXXXXXXXX (11 dígitos sem separador oficial, mas
    // documentos costumam mostrar com espaços a cada 4 pra legibilidade)
    return `${renavam.slice(0, 4)} ${renavam.slice(4, 8)} ${renavam.slice(8)}`;
  }
  return renavam;
}

export function validateRenavam(input: string): boolean {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * weights[i];

  const remainder = (sum * 10) % 11;
  const expected = remainder >= 10 ? 0 : remainder;
  return expected === digits[10];
}
