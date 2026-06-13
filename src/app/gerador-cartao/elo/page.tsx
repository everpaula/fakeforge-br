import type { Metadata } from "next";
import BrandCardLanding from "@/components/BrandCardLanding";

export const metadata: Metadata = {
  title: "Gerador de Cartão Elo Válido: Bandeira Brasileira para Testes",
  description: "Gere cartões Elo fictícios válidos com prefixos brasileiros oficiais (636368, 438935, 504175...) e Luhn. 16 dígitos. Para testes de checkout em e-commerces brasileiros.",
  keywords: "gerador cartao elo, gerador de cartão elo, gerar cartão elo, elo valido, cartão elo gerador, numero elo teste, cartao elo fictício, elo luhn brasil, bandeira elo brasileira",
  alternates: { canonical: "/gerador-cartao/elo" },
};

export default function GeradorElo() {
  return (
    <BrandCardLanding config={{
      brandName: "Elo",
      brandSlug: "elo",
      generatorType: "creditCardElo",
      prefixDescription: "Prefixos brasileiros oficiais (636368, 438935, 504175, 451416, 509048) +",
      cardLength: 16,
      cvvLength: 3,
      about: "Elo é uma bandeira 100% brasileira criada em 2011 pela parceria entre Banco do Brasil, Bradesco e Caixa. É amplamente aceita em e-commerces nacionais (especialmente Mercado Livre, Magazine Luiza, Americanas) e tem penetração forte em cartões cobranded de varejistas. Devs que testam checkout para o mercado brasileiro precisam suportar Elo.",
      history: "Elo usa BINs (Bank Identification Numbers) específicos registrados internacionalmente: 636368, 438935, 504175, 451416, 509048 (entre outros). Como qualquer bandeira moderna, segue ISO/IEC 7812 e o último dígito é calculado por Luhn. O FakeForge escolhe um BIN aleatório da lista oficial e completa os 16 dígitos.",
      technicalNote: "Por ser bandeira brasileira, alguns gateways internacionais não aceitam Elo. Sempre teste com gateway BR (Mercado Pago, PagSeguro, Cielo, Stone) se Elo for relevante.",
      faqs: [
        { q: "Por que devo testar com Elo se já testo com Visa/Master?", a: "Porque a Elo tem regras de roteamento próprias no Brasil — a maioria dos gateways trata Elo separadamente. Testar só com Visa/Master pode mascarar bugs específicos da Elo (especialmente em parcelamento e antifraude)." },
        { q: "Os BINs gerados são reais?", a: "Sim. Os 6 primeiros dígitos correspondem a BINs Elo oficialmente registrados. Os 10 dígitos seguintes são aleatórios + 1 dígito Luhn." },
        { q: "Elo aceita CVV de 3 ou 4 dígitos?", a: "3 dígitos, igual a Visa e Mastercard. Apenas Amex usa 4 dígitos." },
        { q: "Posso usar para testar Cielo / Rede / Stone?", a: "Para validação de formulário, sim. Para sandbox de transação, use os cartões oficiais do adquirente." },
        { q: "Posso gerar cartões Elo em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCardElo&quantity=100. 100 chamadas grátis por dia." },
      ],
    }} />
  );
}
