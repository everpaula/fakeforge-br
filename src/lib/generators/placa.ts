// Placa veicular brasileira — Mercosul (LLLNLNN) e antiga (LLLNNNN).
// Resolução CONTRAN 729/2018. Letras válidas excluem I, O, Q por confusão visual.

const LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ"; // 23 letras (sem I, O, Q)
const DIGITS = "0123456789";

function pick(charset: string): string {
  return charset[Math.floor(Math.random() * charset.length)];
}

export function generatePlaca(format: "mercosul" | "antiga" = "mercosul"): string {
  const l = () => pick(LETTERS);
  const d = () => pick(DIGITS);

  if (format === "antiga") {
    // LLL-NNNN (ex: ABC-1234)
    return `${l()}${l()}${l()}-${d()}${d()}${d()}${d()}`;
  }
  // LLLNLNN (ex: ABC1D23)
  return `${l()}${l()}${l()}${d()}${l()}${d()}${d()}`;
}

export function validatePlaca(input: string): boolean {
  const cleaned = input.replace(/[\s-]/g, "").toUpperCase();
  if (cleaned.length !== 7) return false;
  // Mercosul: LLLNLNN
  const mercosul = /^[A-HJ-NP-Z]{3}[0-9][A-HJ-NP-Z][0-9]{2}$/;
  // Antiga: LLLNNNN
  const antiga = /^[A-HJ-NP-Z]{3}[0-9]{4}$/;
  return mercosul.test(cleaned) || antiga.test(cleaned);
}
