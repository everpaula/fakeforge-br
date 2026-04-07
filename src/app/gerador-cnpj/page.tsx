import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ValidatorCNPJ from "./ValidatorCNPJ";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Valido - Gere CNPJ para Testes | FakeForge BR",
  description: "Gere CNPJ valido e ficticio para testes e desenvolvimento. Numeros com digitos verificadores corretos, formatados ou sem pontuacao. Gratis e sem cadastro.",
  keywords: "gerador de cnpj, cnpj valido, gerar cnpj, cnpj para testes, cnpj ficticio",
};

export default function GeradorCNPJ() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ</span> Valido
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere numeros de CNPJ ficticios com digitos verificadores matematicamente corretos.
          Os CNPJs gerados usam o sufixo /0001 (matriz) e passam na validacao do algoritmo mod-11.
          Nao pertencem a nenhuma empresa real.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ"
        description="Clique em Gerar para criar CNPJs validos"
      />

      <div className="mt-8">
        <ValidatorCNPJ />
      </div>

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que e um CNPJ?</h2>
          <p>
            O CNPJ (Cadastro Nacional da Pessoa Juridica) e o registro de empresas na Receita Federal do Brasil.
            Possui 14 digitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa,
            os 4 seguintes identificam a filial (0001 para matriz), e os 2 ultimos sao digitos verificadores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validacao?</h2>
          <p>
            Semelhante ao CPF, os digitos verificadores sao calculados com pesos multiplicadores e modulo 11.
            O primeiro digito usa pesos 5,4,3,2,9,8,7,6,5,4,3,2 e o segundo usa 6,5,4,3,2,9,8,7,6,5,4,3,2.
            Todos os CNPJs gerados pelo FakeForge passam nessa validacao.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar?</h2>
          <p>
            Testes de cadastro de empresas, integracao com APIs de consulta CNPJ,
            sistemas de emissao de nota fiscal em homologacao, e populacao de bancos de dados
            de desenvolvimento e staging.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
