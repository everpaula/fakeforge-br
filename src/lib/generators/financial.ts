const BANK_NAMES = [
  { code: "001", name: "Banco do Brasil" },
  { code: "033", name: "Santander" },
  { code: "104", name: "Caixa Econômica Federal" },
  { code: "237", name: "Bradesco" },
  { code: "341", name: "Itaú Unibanco" },
  { code: "356", name: "Banco Real" },
  { code: "389", name: "Banco Mercantil do Brasil" },
  { code: "422", name: "Banco Safra" },
  { code: "453", name: "Banco Rural" },
  { code: "633", name: "Banco Rendimento" },
  { code: "652", name: "Itaú BBA" },
  { code: "745", name: "Citibank" },
  { code: "260", name: "Nu Pagamentos (Nubank)" },
  { code: "077", name: "Banco Inter" },
  { code: "336", name: "Banco C6" },
  { code: "290", name: "PagSeguro" },
  { code: "380", name: "PicPay" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(count: number): string {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export interface BankAccount {
  bankCode: string;
  bankName: string;
  agency: string;
  account: string;
  accountDigit: string;
}

export function generateBankAccount(): BankAccount {
  const bank = pick(BANK_NAMES);
  const agency = randomDigits(4);
  const account = randomDigits(Math.random() > 0.5 ? 6 : 7);
  const accountDigit = randomDigits(1);

  return {
    bankCode: bank.code,
    bankName: bank.name,
    agency,
    account,
    accountDigit,
  };
}

export function generatePIXKey(type: "cpf" | "email" | "phone" | "random_key" | "random" = "random"): string {
  const actualType = type === "random"
    ? pick(["cpf", "email", "phone", "random_key"] as const)
    : type;

  switch (actualType) {
    case "cpf":
      return randomDigits(11);
    case "email":
      return `user${randomDigits(4)}@${pick(["gmail.com", "hotmail.com", "outlook.com"])}`;
    case "phone":
      return `+55${pick(["11", "21", "31", "41", "51"])}9${randomDigits(8)}`;
    case "random_key":
      const hex = () => randomDigits(8).split("").map(d => "0123456789abcdef"[parseInt(d) % 16]).join("");
      return `${hex()}-${hex().slice(0, 4)}-${hex().slice(0, 4)}-${hex().slice(0, 4)}-${hex()}${hex().slice(0, 4)}`;
  }
}

export interface CreditCard {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  brand: string;
}

export function generateCreditCard(holderName?: string): CreditCard {
  const brands = [
    { name: "Visa", prefix: "4", length: 16 },
    { name: "Mastercard", prefix: pick(["51", "52", "53", "54", "55"]), length: 16 },
    { name: "Elo", prefix: pick(["636368", "438935", "504175"]), length: 16 },
  ];

  const brand = pick(brands);
  let number = brand.prefix;
  while (number.length < brand.length - 1) {
    number += randomDigits(1);
  }

  // Luhn check digit
  const digits = number.split("").map(Number);
  let sum = 0;
  let isEven = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  number += checkDigit;

  const now = new Date();
  const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const expYear = String(now.getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);

  return {
    number: number.replace(/(\d{4})/g, "$1 ").trim(),
    holder: holderName || "FULANO D SILVA",
    expiry: `${expMonth}/${expYear}`,
    cvv: randomDigits(3),
    brand: brand.name,
  };
}
