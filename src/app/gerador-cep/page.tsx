import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";

export const metadata: Metadata = {
  title: "Gerador de CEP e Endereco - Gere Enderecos Brasileiros | FakeForge BR",
  description: "Gere CEP e enderecos brasileiros ficticios e completos para testes. Rua, bairro, cidade e estado coerentes. Gratis e sem cadastro.",
  keywords: "gerador de cep, gerar endereco, endereco ficticio, cep para testes, endereco brasileiro falso",
};

export default function GeradorCEP() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CEP</span> e Endereco
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere enderecos brasileiros completos e coerentes para testes.
          Cada endereco inclui rua, numero, bairro, cidade, estado e CEP — todos consistentes entre si.
          Os dados cobrem 10 estados brasileiros com bairros reais.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Endereco Completo</h2>
          <SingleGenerator
            type="address"
            label="Endereco"
            description="Endereco completo com rua, bairro, cidade, estado e CEP"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Somente CEP</h2>
          <SingleGenerator
            type="cep"
            label="CEP"
            description="Apenas o codigo de endereçamento postal"
          />
        </div>
      </div>

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que e um CEP?</h2>
          <p>
            O CEP (Codigo de Endereçamento Postal) e o sistema brasileiro de codigos postais,
            com 8 digitos no formato XXXXX-XXX. Os dois primeiros digitos identificam a regiao
            e o estado, e os demais especificam a localidade e o logradouro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como os enderecos sao gerados?</h2>
          <p>
            O FakeForge gera enderecos coerentes: o prefixo do CEP corresponde a cidade correta,
            o bairro existe naquela cidade, e o estado bate com tudo.
            Isso e importante porque sistemas que validam endereco por CEP rejeitam dados inconsistentes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Estados cobertos</h2>
          <p>
            SP, RJ, MG, RS, PR, BA, PE, CE, DF e SC — cobrindo as maiores capitais e cidades do Brasil.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
