import type { Metadata } from "next";
import BrandCardLanding from "@/components/BrandCardLanding";

export const metadata: Metadata = {
  title: "Gerador de Cartão Mastercard Válido (Mastercard Card Generator)",
  description: "Gere cartões Mastercard fictícios válidos com prefixos 51-55 e algoritmo Luhn. 16 dígitos, CVV 3 dígitos. Para testes de checkout e gateways. Free Mastercard card generator for testing. Grátis e sem cadastro.",
  keywords: "gerador cartao mastercard, mastercard valido, numero mastercard teste, cartao master fictício, master luhn, mastercard card generator, fake mastercard generator, mastercard credit card generator, free credit card generator, credit card generator for testing, fake card generator",
  alternates: { canonical: "/gerador-cartao/mastercard" },
};

export default function GeradorMastercard() {
  return (
    <BrandCardLanding config={{
      brandName: "Mastercard",
      brandSlug: "mastercard",
      generatorType: "creditCardMastercard",
      prefixDescription: "Prefixos 51-55 (oficial Mastercard) +",
      cardLength: 16,
      cvvLength: 3,
      about: "Mastercard é a segunda maior bandeira de cartão do mundo, atrás apenas da Visa. No Brasil é especialmente forte em cartões de débito e nas redes de bancos privados. Os números Mastercard começam com 51, 52, 53, 54 ou 55 — todos são prefixos oficialmente registrados.",
      history: "O número segue o ISO/IEC 7812: prefixo 51-55, 16 dígitos totais, último dígito calculado por Luhn. Mastercard também tem a faixa 2221-2720 (BIN expansion adotada em 2017), mas a faixa 51-55 continua sendo a mais comum em cartões emitidos no Brasil.",
      technicalNote: "Para sandboxes que diferenciam débito/crédito Mastercard, use cartões de teste oficiais do gateway. O número gerado aqui não distingue.",
      faqs: [
        { q: "O cartão Mastercard gerado funciona em compras reais?", a: "Não. Os números passam na validação Luhn, mas não estão vinculados a nenhuma conta. Gateways recusam na autorização." },
        { q: "Mastercard usa só 51-55?", a: "Esses são os prefixos clássicos. Em 2017 a Mastercard adicionou a faixa 2221-2720 (chamada de '2-series'), mas 51-55 ainda é o padrão para cartões brasileiros emitidos hoje." },
        { q: "Posso usar para testar Mercado Pago checkout?", a: "Para validação de formulário, sim. Para teste ponta-a-ponta no sandbox, use os cartões oficiais do MP (eles têm uma lista pública)." },
        { q: "O CVV de 3 dígitos é igual ao da Visa?", a: "Sim. Mastercard, Visa e Elo usam CVV/CVC de 3 dígitos. Apenas American Express usa 4 dígitos (CID)." },
        { q: "Posso gerar Mastercard em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCardMastercard&quantity=100. 100 chamadas grátis por dia." },
      ],
      englishSection: {
        headline: "Mastercard Card Generator (for testing purposes)",
        body: "Looking for a fake Mastercard generator for testing checkout flows or sandbox integrations? FakeForge generates 16-digit Mastercard numbers that pass Luhn (mod-10) validation, with prefixes in the 51-55 range (the classic Mastercard BIN). All numbers are fictitious and will fail at the gateway authorization step, so they are safe for QA and development environments only.\n\nUseful for developers integrating Stripe, Mercado Pago, PagSeguro, Adyen, Braintree sandboxes, and anyone testing credit card form validation behavior. Free, no signup required. REST API available with 100 free requests per day.",
      },
    }} />
  );
}
