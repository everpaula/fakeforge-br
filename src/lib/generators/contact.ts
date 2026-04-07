import { generatePerson } from "./person";

const EMAIL_DOMAINS = [
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "uol.com.br",
  "bol.com.br", "terra.com.br", "ig.com.br", "globo.com", "live.com",
  "protonmail.com", "icloud.com",
];

const DDD_CODES = [
  "11", "12", "13", "14", "15", "16", "17", "18", "19", // SP
  "21", "22", "24", // RJ
  "27", "28", // ES
  "31", "32", "33", "34", "35", "37", "38", // MG
  "41", "42", "43", "44", "45", "46", // PR
  "47", "48", "49", // SC
  "51", "53", "54", "55", // RS
  "61", // DF
  "62", "64", // GO
  "63", // TO
  "65", "66", // MT
  "67", // MS
  "68", // AC
  "69", // RO
  "71", "73", "74", "75", "77", // BA
  "79", // SE
  "81", "87", // PE
  "82", // AL
  "83", // PB
  "84", // RN
  "85", "88", // CE
  "86", "89", // PI
  "91", "93", "94", // PA
  "92", "97", // AM
  "95", // RR
  "96", // AP
  "98", "99", // MA
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function randomDigits(count: number): string {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export function generateEmail(firstName?: string, lastName?: string): string {
  if (!firstName || !lastName) {
    const person = generatePerson();
    firstName = person.firstName;
    lastName = person.lastName.split(" ")[0];
  }

  const cleanFirst = removeAccents(firstName).toLowerCase();
  const cleanLast = removeAccents(lastName.split(" ")[0]).toLowerCase();
  const domain = pick(EMAIL_DOMAINS);
  const separator = pick([".", "_", ""]);
  const suffix = Math.random() > 0.5 ? randomDigits(Math.floor(Math.random() * 3) + 1) : "";

  return `${cleanFirst}${separator}${cleanLast}${suffix}@${domain}`;
}

export function generatePhone(formatted = true): string {
  const ddd = pick(DDD_CODES);
  const firstDigit = "9";
  const rest = randomDigits(8);

  if (formatted) {
    return `(${ddd}) ${firstDigit}${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `${ddd}${firstDigit}${rest}`;
}

export function generateLandline(formatted = true): string {
  const ddd = pick(DDD_CODES);
  const firstDigit = pick(["2", "3", "4", "5"]);
  const rest = randomDigits(7);

  if (formatted) {
    return `(${ddd}) ${firstDigit}${rest.slice(0, 3)}-${rest.slice(3)}`;
  }
  return `${ddd}${firstDigit}${rest}`;
}
