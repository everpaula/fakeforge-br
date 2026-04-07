import { generateCPF } from "./cpf";
import { generateCNPJ } from "./cnpj";
import { generateCEP, generateAddress } from "./cep";
import { generatePerson, generateFullName, generateFirstName, generateLastName } from "./person";
import { generateEmail, generatePhone, generateLandline } from "./contact";
import { generateBankAccount, generatePIXKey, generateCreditCard } from "./financial";
import { generateCompany } from "./company";

export {
  generateCPF,
  generateCNPJ,
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
};

export type DataType =
  | "cpf"
  | "cnpj"
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
      case "company": results.push(generateCompany()); break;
    }
  }

  return results;
}

export const DATA_TYPES: { value: DataType; label: string; description: string; category: string }[] = [
  { value: "cpf", label: "CPF", description: "Cadastro de Pessoa Física (válido)", category: "Documentos" },
  { value: "cnpj", label: "CNPJ", description: "Cadastro Nacional de Pessoa Jurídica (válido)", category: "Documentos" },
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
  { value: "creditCard", label: "Cartão de Crédito", description: "Visa, Mastercard ou Elo (Luhn válido)", category: "Financeiro" },
  { value: "company", label: "Empresa", description: "CNPJ, razão social, endereço e contato", category: "Empresa" },
];
