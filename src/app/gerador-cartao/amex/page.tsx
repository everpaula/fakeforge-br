import type { Metadata } from "next";
import BrandCardLanding from "@/components/BrandCardLanding";

export const metadata: Metadata = {
  title: "Gerador de Cartão Amex Válido (15 Dígitos + CID)",
  description: "Gere cartões Amex fictícios válidos com prefixo 34 ou 37, 15 dígitos e CID de 4 dígitos. Algoritmo Luhn. Para testes de checkout que precisam diferenciar Amex de outras bandeiras.",
  keywords: "gerador cartao amex, american express valido, numero amex teste, cartao amex fictício, amex luhn 15 digitos",
  alternates: { canonical: "/gerador-cartao/amex" },
};

export default function GeradorAmex() {
  return (
    <BrandCardLanding config={{
      brandName: "American Express",
      brandSlug: "amex",
      generatorType: "creditCardAmex",
      prefixDescription: "Prefixos 34 ou 37 (oficial Amex) +",
      cardLength: 15,
      cvvLength: 4,
      about: "American Express (Amex) é uma bandeira premium com forte presença em viagens, hospitalidade e alto poder aquisitivo. No Brasil tem aceitação menor que Visa/Master/Elo, mas é estratégica para fintechs B2B, viagens corporativas e e-commerces premium. Cartões Amex têm formato distinto — 15 dígitos em vez de 16.",
      history: "Amex usa BINs 34 e 37 (1º e 2º dígitos). O cartão tem 15 dígitos (não 16 como Visa/Master), formatados em grupos 4-6-5. O CVV — chamado CID na Amex — tem 4 dígitos em vez de 3. O algoritmo de validação ainda é Luhn (mod-10), mesmo com tamanho diferente.",
      technicalNote: "Cuidado ao validar Amex no frontend: máscaras e regex precisam aceitar 15 dígitos com agrupamento 4-6-5. Forms que assumem 16 dígitos rejeitam Amex válida.",
      faqs: [
        { q: "Por que Amex tem 15 dígitos em vez de 16?", a: "Decisão histórica da própria American Express, que precedeu o ISO/IEC 7812. Outras bandeiras adotaram 16 como padrão; Amex manteve 15 por compatibilidade com seu sistema legado." },
        { q: "O CVV da Amex é diferente?", a: "Sim. Amex chama de CID (Card Identification Number) e tem 4 dígitos, impressos na frente do cartão (não atrás como Visa/Master/Elo). Sua validação no frontend precisa lidar com isso." },
        { q: "Posso testar Amex no sandbox do Mercado Pago?", a: "Mercado Pago aceita Amex, mas com cartões de teste específicos. Para validação de formulário no seu site, use os cartões gerados aqui. Para teste de transação, consulte a doc do gateway." },
        { q: "Quais formulários comumente quebram com Amex?", a: "Os que assumem 16 dígitos (regex /\\d{16}/), os que esperam CVV de 3 dígitos (CID Amex tem 4), e os que aplicam máscara 4-4-4-4 em vez de 4-6-5." },
        { q: "Posso gerar Amex em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCardAmex&quantity=100. 100 chamadas grátis por dia." },
      ],
    }} />
  );
}
