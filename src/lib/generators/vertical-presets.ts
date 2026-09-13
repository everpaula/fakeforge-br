/**
 * Vertical presets: bundles ricos com dados correlacionados pra um caso de uso específico.
 * Diferente dos SCHEMA_PRESETS (records planos), retornam structures nested (arrays,
 * sub-objects, computed totals).
 */

import { generateCPF } from "./cpf";
import { generateAddress } from "./cep";
import { generatePerson } from "./person";
import { generateEmail, generatePhone } from "./contact";
import { generateBankAccount, generateCreditCard } from "./financial";
import { randomUUID } from "crypto";

// ============================================================================
// Distributions
// ============================================================================

/** Box-Muller: retorna número de distribuição normal padrão (média 0, stddev 1). */
function normalStandard(): number {
  const u1 = Math.max(Math.random(), 1e-10);
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Score Serasa 300-1000 com distribuição normal ponderada:
 * média 650, stddev 150, clamped. Aproxima distribuição real do brasileiro
 * (~60% acima de 600, ~15% abaixo de 500).
 */
export function generateScoreSerasa(): number {
  const score = Math.round(650 + normalStandard() * 150);
  return Math.max(300, Math.min(1000, score));
}

/**
 * Renda mensal em BRL com distribuição log-normal:
 * mediana ~R$3.500, tail até R$25k, mínimo R$1.412 (salário mínimo 2026),
 * teto de simulação R$50k. Arredonda pra dezenas.
 */
export function generateRendaMensal(): number {
  const val = Math.exp(8.16 + normalStandard() * 0.7);
  const clamped = Math.max(1412, Math.min(50000, val));
  return Math.round(clamped / 10) * 10;
}

// ============================================================================
// Fintech preset
// ============================================================================

interface PixKey {
  type: "cpf" | "email" | "phone" | "aleatoria";
  value: string;
}

function generateFintechPixKeys(cpfFormatted: string, email: string, phoneFormatted: string): PixKey[] {
  const cpfDigits = cpfFormatted.replace(/\D/g, "");
  const phoneDigits = phoneFormatted.replace(/\D/g, "");
  const keys: PixKey[] = [
    { type: "cpf", value: cpfDigits },
    { type: "email", value: email },
    { type: "phone", value: `+55${phoneDigits}` },
  ];
  // 60% dos brasileiros tem chave aleatória além das principais
  if (Math.random() < 0.6) {
    keys.push({ type: "aleatoria", value: randomUUID() });
  }
  return keys;
}

export interface FintechPresetItem {
  customer: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: ReturnType<typeof generateAddress>;
    renda_mensal: number;
    score_serasa: number;
  };
  pix_keys: PixKey[];
  bank_account: ReturnType<typeof generateBankAccount>;
  credit_card: ReturnType<typeof generateCreditCard>;
}

export function generateFintechPreset(quantity: number): FintechPresetItem[] {
  const qty = Math.min(Math.max(1, quantity), 10000);
  const results: FintechPresetItem[] = [];

  for (let i = 0; i < qty; i++) {
    const person = generatePerson();
    const address = generateAddress();
    const cpf = generateCPF();
    const email = generateEmail(person.firstName, person.lastName.split(" ")[0]);
    const phone = generatePhone();

    results.push({
      customer: {
        nome: person.fullName,
        cpf,
        email,
        telefone: phone,
        endereco: address,
        renda_mensal: generateRendaMensal(),
        score_serasa: generateScoreSerasa(),
      },
      pix_keys: generateFintechPixKeys(cpf, email, phone),
      bank_account: generateBankAccount(),
      credit_card: generateCreditCard("any", person.fullName.toUpperCase()),
    });
  }

  return results;
}

// ============================================================================
// Ecom preset
// ============================================================================

interface Product {
  name: string;
  category: string;
  priceMinCents: number;
  priceMaxCents: number;
  variations: string[];
}

const PRODUCT_CATALOG: Product[] = [
  // Moda (8)
  { name: "Camiseta Básica Algodão", category: "moda", priceMinCents: 3990, priceMaxCents: 8990, variations: ["P / Preto", "P / Branco", "M / Preto", "M / Branco", "M / Azul", "G / Preto", "G / Branco", "GG / Cinza"] },
  { name: "Calça Jeans Slim", category: "moda", priceMinCents: 12990, priceMaxCents: 24990, variations: ["38 / Escuro", "40 / Escuro", "40 / Claro", "42 / Escuro", "42 / Claro", "44 / Escuro", "44 / Claro", "46 / Escuro"] },
  { name: "Tênis Casual Branco", category: "moda", priceMinCents: 15990, priceMaxCents: 39990, variations: ["37", "38", "39", "40", "41", "42", "43", "44"] },
  { name: "Moletom com Capuz", category: "moda", priceMinCents: 8990, priceMaxCents: 18990, variations: ["P / Cinza", "M / Cinza", "M / Preto", "G / Cinza", "G / Preto", "G / Marinho", "GG / Preto", "GG / Marinho"] },
  { name: "Jaqueta Corta-Vento", category: "moda", priceMinCents: 19990, priceMaxCents: 44990, variations: ["P / Preto", "M / Preto", "M / Verde", "G / Preto", "G / Verde", "G / Azul", "GG / Preto", "GG / Azul"] },
  { name: "Vestido Midi Estampado", category: "moda", priceMinCents: 9990, priceMaxCents: 22990, variations: ["PP / Floral", "P / Floral", "P / Liso", "M / Floral", "M / Liso", "G / Floral", "G / Liso", "GG / Liso"] },
  { name: "Mochila Notebook 15\"", category: "moda", priceMinCents: 7990, priceMaxCents: 18990, variations: ["Preto", "Cinza", "Azul Marinho"] },
  { name: "Boné Aba Curva", category: "moda", priceMinCents: 3490, priceMaxCents: 8990, variations: ["Preto", "Branco", "Vermelho", "Bege"] },

  // Eletrônicos (8)
  { name: "Fone Bluetooth Over-Ear", category: "eletronicos", priceMinCents: 14990, priceMaxCents: 39990, variations: ["Preto", "Branco", "Azul"] },
  { name: "Mouse Gamer 6400 DPI", category: "eletronicos", priceMinCents: 8990, priceMaxCents: 24990, variations: ["Preto RGB", "Branco RGB", "Preto sem RGB"] },
  { name: "Teclado Mecânico ABNT2", category: "eletronicos", priceMinCents: 19990, priceMaxCents: 49990, variations: ["Switch Blue", "Switch Red", "Switch Brown"] },
  { name: "Webcam Full HD 1080p", category: "eletronicos", priceMinCents: 12990, priceMaxCents: 29990, variations: ["Padrão", "Com tripé"] },
  { name: "Cabo HDMI 2.1 - 2m", category: "eletronicos", priceMinCents: 2490, priceMaxCents: 5990, variations: ["2m", "3m", "5m"] },
  { name: "Carregador USB-C 65W", category: "eletronicos", priceMinCents: 6990, priceMaxCents: 14990, variations: ["Preto", "Branco"] },
  { name: "Hub USB 3.0 - 4 portas", category: "eletronicos", priceMinCents: 3990, priceMaxCents: 8990, variations: ["Preto", "Prata"] },
  { name: "Mousepad Gamer Grande", category: "eletronicos", priceMinCents: 2990, priceMaxCents: 7990, variations: ["Preto liso", "Preto RGB", "Estampado"] },

  // Alimentos (8)
  { name: "Café Torrado Gourmet 500g", category: "alimentos", priceMinCents: 2490, priceMaxCents: 5990, variations: ["Grão", "Moído médio", "Moído fino"] },
  { name: "Chocolate Amargo 70%", category: "alimentos", priceMinCents: 990, priceMaxCents: 2490, variations: ["100g", "150g", "200g"] },
  { name: "Azeite Extra Virgem 500ml", category: "alimentos", priceMinCents: 3490, priceMaxCents: 7990, variations: ["Português", "Espanhol", "Nacional"] },
  { name: "Mel Silvestre 400g", category: "alimentos", priceMinCents: 1990, priceMaxCents: 3990, variations: ["Silvestre", "Eucalipto", "Laranjeira"] },
  { name: "Chá Verde Orgânico", category: "alimentos", priceMinCents: 1490, priceMaxCents: 2990, variations: ["Sachês x25", "Sachês x50", "Granel 100g"] },
  { name: "Biscoito Integral Aveia", category: "alimentos", priceMinCents: 690, priceMaxCents: 1490, variations: ["Aveia", "Aveia e Mel", "Aveia e Cacau"] },
  { name: "Granola Zero Açúcar 500g", category: "alimentos", priceMinCents: 1990, priceMaxCents: 3490, variations: ["Tradicional", "Frutas Vermelhas", "Chocolate"] },
  { name: "Ração Premium Cães 15kg", category: "alimentos", priceMinCents: 8990, priceMaxCents: 22990, variations: ["Filhote", "Adulto Raças Pequenas", "Adulto Raças Grandes", "Sênior"] },

  // Casa (8)
  { name: "Edredom Queen Dupla Face", category: "casa", priceMinCents: 14990, priceMaxCents: 34990, variations: ["Cinza", "Marinho", "Bege", "Rosé"] },
  { name: "Panela Antiaderente 24cm", category: "casa", priceMinCents: 6990, priceMaxCents: 14990, variations: ["Preto", "Vermelho", "Grafite"] },
  { name: "Kit 4 Toalhas Banho", category: "casa", priceMinCents: 8990, priceMaxCents: 19990, variations: ["Branco", "Cinza", "Azul", "Sortido"] },
  { name: "Jogo Americano 4 unidades", category: "casa", priceMinCents: 2990, priceMaxCents: 6990, variations: ["Bege", "Cinza", "Preto"] },
  { name: "Luminária de Mesa LED", category: "casa", priceMinCents: 4990, priceMaxCents: 12990, variations: ["Branca", "Preta", "Madeira"] },
  { name: "Vaso Decorativo Cerâmica", category: "casa", priceMinCents: 3490, priceMaxCents: 8990, variations: ["Branco Pequeno", "Branco Médio", "Terracota Pequeno", "Terracota Médio"] },
  { name: "Tapete Sala Antiderrapante", category: "casa", priceMinCents: 9990, priceMaxCents: 24990, variations: ["1x1,5m Cinza", "1,5x2m Cinza", "2x2,5m Cinza", "1,5x2m Bege"] },
  { name: "Almofada Decorativa 45x45", category: "casa", priceMinCents: 3490, priceMaxCents: 7990, variations: ["Cinza", "Azul", "Verde", "Amarelo"] },

  // Beleza (8)
  { name: "Perfume Nacional 100ml", category: "beleza", priceMinCents: 8990, priceMaxCents: 24990, variations: ["Feminino Floral", "Feminino Amadeirado", "Masculino Amadeirado", "Masculino Cítrico"] },
  { name: "Shampoo Hidratante 300ml", category: "beleza", priceMinCents: 1990, priceMaxCents: 4990, variations: ["Cabelos Cacheados", "Cabelos Lisos", "Cabelos Oleosos", "Cabelos Ressecados"] },
  { name: "Protetor Solar FPS 60", category: "beleza", priceMinCents: 3490, priceMaxCents: 7990, variations: ["Rosto 50ml", "Corpo 200ml", "Corpo 400ml"] },
  { name: "Batom Matte Longa Duração", category: "beleza", priceMinCents: 1490, priceMaxCents: 3990, variations: ["Nude", "Vermelho", "Rosa", "Marrom"] },
  { name: "Creme Hidratante Facial", category: "beleza", priceMinCents: 3990, priceMaxCents: 9990, variations: ["Pele Seca", "Pele Mista", "Pele Oleosa", "Anti-idade"] },
  { name: "Máscara Facial Argila", category: "beleza", priceMinCents: 990, priceMaxCents: 2490, variations: ["Verde", "Branca", "Preta", "Rosa"] },
  { name: "Esmalte Longa Duração", category: "beleza", priceMinCents: 490, priceMaxCents: 1490, variations: ["Nude", "Vermelho", "Rosa", "Preto", "Branco"] },
  { name: "Escova de Cabelo Térmica", category: "beleza", priceMinCents: 5990, priceMaxCents: 14990, variations: ["Pequena", "Média", "Grande"] },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function skuFromName(name: string, variation: string): string {
  const base = name.split(" ").slice(0, 2).map((w) => w.substring(0, 3).toUpperCase()).join("");
  const varHash = variation.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0) & 0xffff;
  return `${base}-${varHash.toString(16).toUpperCase().padStart(4, "0")}`;
}

function generatePrice(minCents: number, maxCents: number): number {
  const cents = minCents + Math.floor(Math.random() * (maxCents - minCents + 1));
  // Preços psicológicos: quase sempre terminam em 90 ou 99
  const rounded = Math.floor(cents / 100) * 100 + (Math.random() < 0.7 ? 90 : 99);
  return rounded / 100;
}

export interface CartItem {
  sku: string;
  name: string;
  category: string;
  variation: string;
  quantity: number;
  unit_price: number;
  total: number;
}

function generateCart(): CartItem[] {
  const cartSize = 1 + Math.floor(Math.random() * 5); // 1-5 items
  const items: CartItem[] = [];
  const used = new Set<string>();

  while (items.length < cartSize) {
    const product = pickRandom(PRODUCT_CATALOG);
    const variation = pickRandom(product.variations);
    const key = `${product.name}|${variation}`;
    if (used.has(key)) continue;
    used.add(key);

    const quantity = 1 + Math.floor(Math.random() * 3); // 1-3 unidades
    const unit_price = generatePrice(product.priceMinCents, product.priceMaxCents);

    items.push({
      sku: skuFromName(product.name, variation),
      name: product.name,
      category: product.category,
      variation,
      quantity,
      unit_price,
      total: Math.round(unit_price * quantity * 100) / 100,
    });
  }

  return items;
}

interface EcomPayment {
  method: "credit_card" | "pix" | "boleto";
  credit_card?: ReturnType<typeof generateCreditCard>;
  pix_code?: string;
  boleto_linha_digitavel?: string;
}

function generatePayment(holderName: string): EcomPayment {
  const roll = Math.random();
  if (roll < 0.5) {
    return { method: "credit_card", credit_card: generateCreditCard("any", holderName) };
  } else if (roll < 0.9) {
    // Pix code é simplificado (formato EMV BR-Code real seria muito longo pra teste)
    return { method: "pix", pix_code: `00020126${randomUUID().substring(0, 8).toUpperCase()}` };
  } else {
    // Linha digitável de boleto: 47-48 dígitos em 5 grupos
    const rand = () => Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const rand5 = () => Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    return { method: "boleto", boleto_linha_digitavel: `${rand5()}.${rand5()} ${rand5()}.${rand()}00 ${rand5()}.${rand()}00 ${Math.floor(Math.random() * 10)} ${rand()}${rand()}${rand()}${rand()}${rand()}` };
  }
}

export interface EcomPresetItem {
  customer: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
  };
  shipping_address: ReturnType<typeof generateAddress>;
  billing_address: ReturnType<typeof generateAddress>;
  cart: CartItem[];
  payment: EcomPayment;
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export function generateEcomPreset(quantity: number): EcomPresetItem[] {
  const qty = Math.min(Math.max(1, quantity), 10000);
  const results: EcomPresetItem[] = [];

  for (let i = 0; i < qty; i++) {
    const person = generatePerson();
    const shipping = generateAddress();
    // 70% dos pedidos tem billing = shipping
    const billing = Math.random() < 0.7 ? shipping : generateAddress();
    const cart = generateCart();
    const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

    // Frete grátis acima de R$199, senão R$9.90-R$29.90
    const shipping_cost = subtotal >= 199 ? 0 : Math.round((9.9 + Math.random() * 20) * 100) / 100;
    const total = Math.round((subtotal + shipping_cost) * 100) / 100;

    results.push({
      customer: {
        nome: person.fullName,
        cpf: generateCPF(),
        email: generateEmail(person.firstName, person.lastName.split(" ")[0]),
        telefone: generatePhone(),
      },
      shipping_address: shipping,
      billing_address: billing,
      cart,
      payment: generatePayment(person.fullName.toUpperCase()),
      totals: {
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: shipping_cost,
        total,
      },
    });
  }

  return results;
}

// ============================================================================
// Registry
// ============================================================================

export const VERTICAL_PRESETS = {
  fintech: {
    generator: generateFintechPreset,
    description: "Cliente completo pra teste de fintech: CPF + PIX + conta bancária + cartão + score Serasa + renda coerentes",
    fields: ["customer.nome", "customer.cpf", "customer.email", "customer.telefone", "customer.endereco", "customer.renda_mensal", "customer.score_serasa", "pix_keys[]", "bank_account", "credit_card"],
  },
  ecom: {
    generator: generateEcomPreset,
    description: "Pedido completo pra teste de ecommerce: cliente + endereços + carrinho (1-5 produtos) + payment (cartão/PIX/boleto) + totais",
    fields: ["customer", "shipping_address", "billing_address", "cart[]", "payment", "totals"],
  },
} as const;

export type VerticalPresetKey = keyof typeof VERTICAL_PRESETS;

export function isVerticalPreset(key: string): key is VerticalPresetKey {
  return key in VERTICAL_PRESETS;
}
