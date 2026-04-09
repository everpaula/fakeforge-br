import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";

export const metadata: Metadata = {
  title: "Gerador de CEP e Endereço - Gere Endereços Brasileiros | FakeForge BR",
  description: "Gere CEP e endereços brasileiros fictícios e completos para testes. Rua, bairro, cidade e estado coerentes. Grátis e sem cadastro.",
  keywords: "gerador de cep, gerar endereço, endereço fictício, cep para testes, endereço brasileiro falso",
};

export default function GeradorCEP() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CEP</span> e Endereço
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere endereços brasileiros completos e coerentes para testes.
          Cada endereço inclui rua, número, bairro, cidade, estado e CEP — todos consistentes entre si.
          Os dados cobrem 10 estados brasileiros com bairros reais.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Endereço Completo</h2>
          <SingleGenerator
            type="address"
            label="Endereço"
            description="Endereço completo com rua, bairro, cidade, estado e CEP"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Somente CEP</h2>
          <SingleGenerator
            type="cep"
            label="CEP"
            description="Apenas o código de endereçamento postal"
          />
        </div>
      </div>

      <ApiCtaBanner dataType="endereços" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CEP?</h2>
          <p>
            O CEP (Código de Endereçamento Postal) é o sistema brasileiro de códigos postais,
            com 8 dígitos no formato XXXXX-XXX. Os dois primeiros dígitos identificam a região
            e o estado, e os demais especificam a localidade e o logradouro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como os endereços são gerados?</h2>
          <p>
            O FakeForge gera endereços coerentes: o prefixo do CEP corresponde a cidade correta,
            o bairro existe naquela cidade, e o estado bate com tudo.
            Isso é importante porque sistemas que validam endereço por CEP rejeitam dados inconsistentes.
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
