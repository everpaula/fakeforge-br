function randomDigit(): number {
  return Math.floor(Math.random() * 10);
}

function calculateCheckDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function generateCPF(formatted = true): string {
  const digits: number[] = [];
  for (let i = 0; i < 9; i++) {
    digits.push(randomDigit());
  }

  const firstCheck = calculateCheckDigit(digits, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  digits.push(firstCheck);

  const secondCheck = calculateCheckDigit(digits, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  digits.push(secondCheck);

  const cpf = digits.join("");

  if (formatted) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  }
  return cpf;
}

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const first = calculateCheckDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (first !== digits[9]) return false;

  const second = calculateCheckDigit(digits.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return second === digits[10];
}
