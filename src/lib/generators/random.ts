export function generateRandomDigits(digits: number): string {
  const safe = Math.max(1, Math.min(20, Math.floor(digits)));
  const max = Math.pow(10, safe);
  const n = Math.floor(Math.random() * max);
  return String(n).padStart(safe, "0");
}

export function generateRandom4Digit(): string {
  return generateRandomDigits(4);
}

export function generateRandom6Digit(): string {
  return generateRandomDigits(6);
}

export function generateRandom8Digit(): string {
  return generateRandomDigits(8);
}
