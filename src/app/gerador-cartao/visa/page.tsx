import type { Metadata } from "next";
import BrandCardLanding from "@/components/BrandCardLanding";

export const metadata: Metadata = {
  title: "Gerador de Cartão Visa Válido — Luhn + Prefixo 4 para Testes",
  description: "Gere cartões Visa fictícios válidos com prefixo 4 e algoritmo Luhn. 16 dígitos, CVV de 3 dígitos. Para testes de checkout, gateways de pagamento e formulários. Grátis e sem cadastro.",
  keywords: "gerador cartao visa, cartao visa valido, numero cartao visa teste, visa fictício, gerador visa luhn",
  alternates: { canonical: "/gerador-cartao/visa" },
};

export default function GeradorVisa() {
  return (
    <BrandCardLanding config={{
      brandName: "Visa",
      brandSlug: "visa",
      generatorType: "creditCardVisa",
      prefixDescription: "Prefixo 4 (oficial Visa) +",
      cardLength: 16,
      cvvLength: 3,
      about: "Visa é a maior bandeira de cartão de crédito do mundo, processando trilhões de dólares anualmente. Os números Visa começam com o dígito 4 (Bank Identification Number, BIN) — essa é a primeira coisa que validadores e gateways checam. Internacionalmente aceita em quase todos os e-commerces e POS.",
      history: "O número de cartão Visa segue o padrão ISO/IEC 7812: começa com 4, tem 16 dígitos no total, e o último é o dígito verificador calculado pelo algoritmo de Luhn (mod-10). O FakeForge gera os 15 primeiros dígitos aleatoriamente (mantendo o prefixo 4) e calcula o último para que o número passe na validação Luhn.",
      technicalNote: "Visa também emite cartões de 13 dígitos em alguns mercados (Visa Electron antigo), mas 16 é o padrão atual. O FakeForge gera apenas 16 dígitos.",
      faqs: [
        { q: "O cartão Visa gerado funciona em compras reais?", a: "Não. Os números passam na validação Luhn, mas não estão vinculados a nenhuma conta bancária. Qualquer gateway de pagamento real recusará a transação na fase de autorização (3D Secure ou diretamente)." },
        { q: "Posso usar para testar Stripe, Mercado Pago ou PagSeguro?", a: "Para validação de formulário (formato, máscara, verificação Luhn), sim. Para testar a transação ponta-a-ponta, use os cartões de teste oficiais do gateway (cada um tem números específicos para sandbox)." },
        { q: "O prefixo 4 é universal para Visa?", a: "Sim. Todo cartão Visa começa com 4. Outros prefixos comuns: 51-55 (Mastercard), 34/37 (Amex), 6 (Discover/Elo)." },
        { q: "Por que o cartão tem 16 dígitos?", a: "É o padrão ISO/IEC 7812 adotado pela maioria das bandeiras. Os primeiros 6 dígitos são o BIN (banco emissor), os 9 seguintes identificam a conta, e o último é o dígito Luhn." },
        { q: "Posso gerar cartões Visa em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCardVisa&quantity=100. São 100 chamadas grátis por dia." },
      ],
    }} />
  );
}
