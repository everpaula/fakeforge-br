// RG (Registro Geral) — formato SP, mais comum no Brasil
// 9 dígitos: 8 numéricos + 1 dígito verificador (pode ser X = 10)
// Algoritmo: módulo 11 com pesos 2,3,4,5,6,7,8,9
// Outros estados têm formatos próprios — usamos SP como padrão por ser
// o mais aceito em formulários nacionais.

function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

export function generateRG(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 8; i++) digits.push(randomDigit());

  // Calcular dígito verificador (mod-11 com pesos 2..9)
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[i] * weights[i];
  const remainder = sum % 11;
  const checkDigit = remainder === 10 ? "X" : String((11 - remainder) % 11);

  const rg = digits.join("") + checkDigit;
  if (formatted) {
    return `${rg.slice(0, 2)}.${rg.slice(2, 5)}.${rg.slice(5, 8)}-${rg.slice(8)}`;
  }
  return rg;
}

export function validateRG(input: string): boolean {
  const cleaned = input.replace(/[^0-9X]/gi, "").toUpperCase();
  if (cleaned.length !== 9) return false;
  if (/^(\d)\1{8}$/.test(cleaned)) return false;

  const digits = cleaned.slice(0, 8).split("").map(Number);
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += digits[i] * weights[i];
  const remainder = sum % 11;
  const expected = remainder === 10 ? "X" : String((11 - remainder) % 11);

  return cleaned[8] === expected;
}
