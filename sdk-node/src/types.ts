/**
 * SDK oficial do FakeForge - types compartilhados
 *
 * @packageDocumentation
 */

/**
 * Tipos de dado que o FakeForge gera.
 * Corresponde 1:1 aos endpoints da API REST.
 */
export type DataType =
  | "cpf"
  | "cnpj"
  | "cnpjAlfa"
  | "cnh"
  | "cin"
  | "rg"
  | "pis"
  | "renavam"
  | "tituloEleitor"
  | "placa"
  | "placaAntiga"
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
  | "creditCardVisa"
  | "creditCardMastercard"
  | "creditCardElo"
  | "creditCardHipercard"
  | "creditCardAmex"
  | "company"
  | "random4"
  | "random6"
  | "random8";

/**
 * Presets disponíveis. Cada preset retorna um objeto com múltiplos campos
 * correlacionados (ex: customer = pessoa + endereço + contato).
 */
export type Preset =
  | "customer"
  | "employee"
  | "company"
  | "ecommerce_order"
  | "contact_list";

/**
 * Opções ao instanciar o cliente FakeForge.
 */
export interface FakeForgeOptions {
  /**
   * API key opcional. Sem key, o cliente usa o tier gratuito (50 chamadas/dia por IP).
   * Com key do plano Dev/Team, libera 10.000-100.000 chamadas/dia.
   * Pegue a sua em https://fakeforge.com.br/dashboard
   */
  apiKey?: string;

  /**
   * Base URL da API. Default: https://fakeforge.com.br
   * Só mude se estiver rodando FakeForge self-hosted.
   */
  baseUrl?: string;

  /**
   * Timeout de fetch em ms. Default: 30000 (30s).
   */
  timeoutMs?: number;
}

/**
 * Opções pra cada chamada de generate.
 */
export interface GenerateOptions {
  /** Quantidade de items. Default: 1. Máximo: 100 (Free) / 1000 (Dev) / 10000 (Team). */
  quantity?: number;

  /** Se true (default), retorna com formatação BR (pontos, hífens). Se false, retorna só dígitos. */
  formatted?: boolean;
}

/**
 * Objeto Pessoa retornado pelo endpoint /person e /preset=customer.
 */
export interface Person {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthdate: string;
  address?: Address;
}

/**
 * Objeto Endereço brasileiro.
 */
export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Objeto Cartão de crédito com Luhn válido.
 */
export interface CreditCard {
  number: string;
  brand: string;
  cvv: string;
  expiry: string;
}

/**
 * Objeto Conta bancária brasileira.
 */
export interface BankAccount {
  bank: string;
  bankCode: string;
  agency: string;
  account: string;
  accountType: string;
}

/**
 * Objeto Empresa (CNPJ + razão social + endereço).
 */
export interface Company {
  cnpj: string;
  name: string;
  brand: string;
  address?: Address;
}

/**
 * Erro específico do FakeForge com contexto adicional.
 */
export class FakeForgeError extends Error {
  public status: number;
  public code: string;
  public upgradeUrl?: string;
  public plan?: string;
  public dailyLimit?: number;
  public usedToday?: number;

  constructor(message: string, status: number, body?: Record<string, unknown>) {
    super(message);
    this.name = "FakeForgeError";
    this.status = status;
    this.code = (body?.error as string) || "unknown";
    this.upgradeUrl = (body?.upgrade_url as string) || (body?.upgrade as Record<string, string>)?.url;
    this.plan = body?.plan as string;
    this.dailyLimit = body?.daily_limit as number;
    this.usedToday = body?.your_usage_today as number;
  }
}
