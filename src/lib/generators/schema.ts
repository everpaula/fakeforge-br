import { generateCPF } from "./cpf";
import { generateCNPJ } from "./cnpj";
import { generateCEP, generateAddress } from "./cep";
import { generatePerson } from "./person";
import { generateEmail, generatePhone, generateLandline } from "./contact";
import { generateBankAccount, generatePIXKey, generateCreditCard } from "./financial";
import { generateCompany } from "./company";
import type { DataType } from "./index";

export interface SchemaField {
  name: string;
  type: DataType;
}

/**
 * Generates correlated records from a schema definition.
 * When schema includes "person" + "email" + "cpf", the email uses
 * the person's name and all fields belong to the same "identity".
 */
export function generateSchema(fields: SchemaField[], quantity: number): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const qty = Math.min(Math.max(1, quantity), 10000);

  for (let i = 0; i < qty; i++) {
    const record: Record<string, unknown> = {};

    // Pre-generate shared identity for correlation
    const person = generatePerson();
    const address = generateAddress();

    for (const field of fields) {
      record[field.name] = generateCorrelatedField(field.type, person, address);
    }

    results.push(record);
  }

  return results;
}

function generateCorrelatedField(
  type: DataType,
  person: ReturnType<typeof generatePerson>,
  address: ReturnType<typeof generateAddress>
): unknown {
  switch (type) {
    case "cpf": return generateCPF();
    case "cnpj": return generateCNPJ();
    case "cep": return address.cep;
    case "address": return address;
    case "person": return person;
    case "fullName": return person.fullName;
    case "firstName": return person.firstName;
    case "lastName": return person.lastName;
    case "email": return generateEmail(person.firstName, person.lastName.split(" ")[0]);
    case "phone": return generatePhone();
    case "landline": return generateLandline();
    case "bankAccount": return generateBankAccount();
    case "pixKey": return generatePIXKey();
    case "creditCard": return generateCreditCard(person.fullName.toUpperCase());
    case "company": return generateCompany();
  }
}

/**
 * Pre-built schema presets for common use cases.
 * Used via: POST /api/generate { preset: "customer", quantity: 10 }
 *       or: GET /api/generate?preset=customer&quantity=10
 */
export const SCHEMA_PRESETS: Record<string, SchemaField[]> = {
  customer: [
    { name: "nome", type: "fullName" },
    { name: "cpf", type: "cpf" },
    { name: "email", type: "email" },
    { name: "telefone", type: "phone" },
    { name: "endereco", type: "address" },
  ],
  employee: [
    { name: "nome", type: "fullName" },
    { name: "cpf", type: "cpf" },
    { name: "email", type: "email" },
    { name: "telefone", type: "phone" },
    { name: "endereco", type: "address" },
    { name: "conta_bancaria", type: "bankAccount" },
    { name: "pix", type: "pixKey" },
  ],
  company: [
    { name: "razao_social", type: "company" },
    { name: "cnpj", type: "cnpj" },
    { name: "telefone", type: "phone" },
    { name: "endereco", type: "address" },
  ],
  ecommerce_order: [
    { name: "cliente", type: "fullName" },
    { name: "cpf", type: "cpf" },
    { name: "email", type: "email" },
    { name: "telefone", type: "phone" },
    { name: "endereco_entrega", type: "address" },
    { name: "cartao", type: "creditCard" },
  ],
  contact_list: [
    { name: "nome", type: "fullName" },
    { name: "email", type: "email" },
    { name: "celular", type: "phone" },
    { name: "fixo", type: "landline" },
  ],
};
