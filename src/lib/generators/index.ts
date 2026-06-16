import { generateCPF } from "./cpf";
import { generateCNPJ, generateCnpjAlfa } from "./cnpj";
import { generateRG } from "./rg";
import { generatePIS } from "./pis";
import { generateTituloEleitor } from "./titulo-eleitor";
import { generatePlaca } from "./placa";
import { generateCNH } from "./cnh";
import { generateCIN } from "./cin";
import { generateCEP, generateAddress } from "./cep";
import { generatePerson, generateFullName, generateFirstName, generateLastName } from "./person";
import { generateEmail, generatePhone, generateLandline } from "./contact";
import { generateBankAccount, generatePIXKey, generateCreditCard } from "./financial";
import { generateCompany } from "./company";
import { generateRandomDigits, generateRandom4Digit, generateRandom6Digit, generateRandom8Digit } from "./random";

export {
  generateCPF,
  generateCNPJ,
  generateCnpjAlfa,
  generateCNH,
  generateCIN,
  generateRG,
  generatePIS,
  generateTituloEleitor,
  generatePlaca,
  generateCEP,
  generateAddress,
  generatePerson,
  generateFullName,
  generateFirstName,
  generateLastName,
  generateEmail,
  generatePhone,
  generateLandline,
  generateBankAccount,
  generatePIXKey,
  generateCreditCard,
  generateCompany,
  generateRandomDigits,
  generateRandom4Digit,
  generateRandom6Digit,
  generateRandom8Digit,
};

export type DataType =
  | "cpf"
  | "cnpj"
  | "cnpjAlfa"
  | "cnh"
  | "cin"
  | "rg"
  | "pis"
  | "tituloEleitor"
  | "placa"
  | "placaAntiga"
  | "creditCardVisa"
  | "creditCardMastercard"
  | "creditCardElo"
  | "creditCardHipercard"
  | "creditCardAmex"
  | "random4"
  | "random6"
  | "random8"
  | "cep"
  | "address"
  | "person"
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "landline"
  | "bankAccount"
  | "pixKey"
  | "creditCard"
  | "company";

export interface GeneratorConfig {
  type: DataType;
  quantity: number;
  formatted?: boolean;
}

export function generate(config: GeneratorConfig): unknown[] {
  const { type, quantity, formatted = true } = config;
  const results: unknown[] = [];

  for (let i = 0; i < Math.min(quantity, 10000); i++) {
    switch (type) {
      case "cpf": results.push(generateCPF(formatted)); break;
      case "cnpj": results.push(generateCNPJ(formatted)); break;
      case "cnpjAlfa": results.push(generateCnpjAlfa(formatted)); break;
      case "cnh": results.push(generateCNH(formatted)); break;
      case "cin": results.push(generateCIN()); break;
      case "rg": results.push(generateRG(formatted)); break;
      case "pis": results.push(generatePIS(formatted)); break;
      case "tituloEleitor": results.push(generateTituloEleitor(formatted)); break;
      case "placa": results.push(generatePlaca("mercosul")); break;
      case "placaAntiga": results.push(generatePlaca("antiga")); break;
      case "cep": results.push(generateCEP(formatted)); break;
      case "address": results.push(generateAddress(formatted)); break;
      case "person": results.push(generatePerson()); break;
      case "fullName": results.push(generateFullName()); break;
      case "firstName": results.push(generateFirstName()); break;
      case "lastName": results.push(generateLastName()); break;
      case "email": results.push(generateEmail()); break;
      case "phone": results.push(generatePhone(formatted)); break;
      case "landline": results.push(generateLandline(formatted)); break;
      case "bankAccount": results.push(generateBankAccount()); break;
      case "pixKey": results.push(generatePIXKey()); break;
      case "creditCard": results.push(generateCreditCard()); break;
      case "creditCardVisa": results.push(generateCreditCard("visa")); break;
      case "creditCardMastercard": results.push(generateCreditCard("mastercard")); break;
      case "creditCardElo": results.push(generateCreditCard("elo")); break;
      case "creditCardHipercard": results.push(generateCreditCard("hipercard")); break;
      case "creditCardAmex": results.push(generateCreditCard("amex")); break;
      case "company": results.push(generateCompany()); break;
      case "random4": results.push(generateRandom4Digit()); break;
      case "random6": results.push(generateRandom6Digit()); break;
      case "random8": results.push(generateRandom8Digit()); break;
    }
  }

  return results;
}

export const DATA_TYPES: { value: DataType; label: string; description: string; category: string }[] = [
  { value: "cpf", label: "CPF", description: "Cadastro de Pessoa Física (válido)", category: "Documentos" },
  { value: "cnpj", label: "CNPJ", description: "Cadastro Nacional de Pessoa Jurídica (válido)", category: "Documentos" },
  { value: "cnpjAlfa", label: "CNPJ Alfanumérico", description: "Novo CNPJ com letras (vigência 01/07/2026)", category: "Documentos" },
  { value: "cnh", label: "CNH", description: "Carteira Nacional de Habilitação válida (mod-11 DENATRAN)", category: "Documentos" },
  { value: "cin", label: "CIN", description: "Carteira de Identidade Nacional (substitui o RG)", category: "Documentos" },
  { value: "rg", label: "RG", description: "Registro Geral formato SP (mod-11 com dígito X)", category: "Documentos" },
  { value: "pis", label: "PIS/PASEP", description: "PIS/PASEP/NIT/NIS válido (mod-11 com pesos 3-2)", category: "Documentos" },
  { value: "tituloEleitor", label: "Título de Eleitor", description: "Título com UF e dígitos verificadores TSE", category: "Documentos" },
  { value: "placa", label: "Placa Mercosul", description: "Placa formato LLLNLNN (CONTRAN 729/2018)", category: "Documentos" },
  { value: "placaAntiga", label: "Placa Antiga", description: "Placa formato LLL-NNNN (legado pré-2018)", category: "Documentos" },
  { value: "person", label: "Pessoa Completa", description: "Nome, sobrenome e gênero", category: "Pessoa" },
  { value: "fullName", label: "Nome Completo", description: "Nome e sobrenome brasileiro", category: "Pessoa" },
  { value: "firstName", label: "Primeiro Nome", description: "Nomes populares brasileiros", category: "Pessoa" },
  { value: "lastName", label: "Sobrenome", description: "Sobrenomes comuns no Brasil", category: "Pessoa" },
  { value: "email", label: "Email", description: "Email com domínios BR e internacionais", category: "Contato" },
  { value: "phone", label: "Celular", description: "Número de celular com DDD válido", category: "Contato" },
  { value: "landline", label: "Telefone Fixo", description: "Número fixo com DDD válido", category: "Contato" },
  { value: "cep", label: "CEP", description: "Código de Endereçamento Postal", category: "Endereço" },
  { value: "address", label: "Endereço Completo", description: "Rua, bairro, cidade, estado e CEP", category: "Endereço" },
  { value: "bankAccount", label: "Conta Bancária", description: "Banco, agência e conta", category: "Financeiro" },
  { value: "pixKey", label: "Chave PIX", description: "CPF, email, telefone ou aleatória", category: "Financeiro" },
  { value: "creditCard", label: "Cartão de Crédito", description: "Qualquer bandeira (Luhn válido)", category: "Financeiro" },
  { value: "creditCardVisa", label: "Cartão Visa", description: "Cartão Visa válido (prefixo 4 + Luhn)", category: "Financeiro" },
  { value: "creditCardMastercard", label: "Cartão Mastercard", description: "Cartão Mastercard válido (prefixo 51-55 + Luhn)", category: "Financeiro" },
  { value: "creditCardElo", label: "Cartão Elo", description: "Cartão Elo válido (prefixos BR + Luhn)", category: "Financeiro" },
  { value: "creditCardHipercard", label: "Cartão Hipercard", description: "Cartão Hipercard válido (prefixo 606282 + Luhn)", category: "Financeiro" },
  { value: "creditCardAmex", label: "Cartão Amex", description: "American Express (15 dígitos, prefixo 34/37 + Luhn)", category: "Financeiro" },
  { value: "company", label: "Empresa", description: "CNPJ, razão social, endereço e contato", category: "Empresa" },
  { value: "random4", label: "Random 4-digit code", description: "OTP / verification code (4 digits)", category: "Random" },
  { value: "random6", label: "Random 6-digit code", description: "OTP / verification code (6 digits)", category: "Random" },
  { value: "random8", label: "Random 8-digit code", description: "OTP / verification code (8 digits)", category: "Random" },
];
