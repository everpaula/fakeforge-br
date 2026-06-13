import type { Metadata } from "next";
import BrandCardLanding from "@/components/BrandCardLanding";

export const metadata: Metadata = {
  title: "Gerador de Cartão Hipercard Válido: Bandeira Itaú para Testes",
  description: "Gere cartões Hipercard fictícios válidos com prefixo 606282 e algoritmo Luhn. Bandeira do Itaú aceita em redes brasileiras. 16 dígitos. Para testes de checkout BR.",
  keywords: "gerador cartao hipercard, gerador de cartão hipercard, gerar cartão hipercard, hipercard valido, cartão hipercard valido, numero hipercard teste, cartao hipercard fictício, hipercard luhn, bandeira hipercard itau",
  alternates: { canonical: "/gerador-cartao/hipercard" },
};

export default function GeradorHipercard() {
  return (
    <BrandCardLanding config={{
      brandName: "Hipercard",
      brandSlug: "hipercard",
      generatorType: "creditCardHipercard",
      prefixDescription: "Prefixo 606282 (oficial Hipercard) +",
      cardLength: 16,
      cvvLength: 3,
      about: "Hipercard é uma bandeira brasileira controlada pelo Itaú Unibanco desde 2008. Originalmente criada pelo Bompreço/Walmart, hoje é aceita em uma boa parte do varejo brasileiro, especialmente supermercados, postos e farmácias. Para e-commerces que atendem público de classes B/C/D, suportar Hipercard pode aumentar conversão.",
      history: "Hipercard usa o BIN 606282 registrado internacionalmente. Segue ISO/IEC 7812 com 16 dígitos, último calculado por Luhn. Existe também um BIN curto (3841) usado em alguns programas — ambos são suportados pelo gerador.",
      technicalNote: "Hipercard tem aceitação limitada fora do Brasil — não conta com transações internacionais. Em sandboxes globais, pode não estar listada como bandeira válida.",
      faqs: [
        { q: "Hipercard é Mastercard ou bandeira separada?", a: "Bandeira separada. Apesar do Itaú ser parceiro Mastercard, Hipercard tem BIN próprio (606282) e roteamento independente." },
        { q: "Onde Hipercard é aceita?", a: "Maioria do varejo brasileiro: supermercados, drogarias, postos de gasolina e e-commerces nacionais. Aceitação internacional é limitada." },
        { q: "Por que devo testar Hipercard separadamente?", a: "Antifraude e regras de parcelamento da Hipercard diferem de Visa/Master. Se sua aplicação depende dessas regras, teste com Hipercard real (sandbox do gateway)." },
        { q: "O Hipercard gerado funciona em compras reais?", a: "Não. Passa só na validação Luhn. Não está vinculado a nenhuma conta. Gateways recusam." },
        { q: "Posso gerar Hipercards em massa via API?", a: "Sim. Use GET https://fakeforge.com.br/api/generate?type=creditCardHipercard&quantity=100. 100 chamadas grátis por dia." },
      ],
    }} />
  );
}
