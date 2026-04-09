import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ValidatorCNPJ from "./ValidatorCNPJ";

export const metadata: Metadata = {
  title: "Gerador de CNPJ Válido - Gere CNPJ para Testes | FakeForge BR",
  description: "Gere CNPJ válido e fictício para testes e desenvolvimento. Números com dígitos verificadores corretos, formatados ou sem pontuação. Grátis e sem cadastro.",
  keywords: "gerador de cnpj, cnpj válido, gerar cnpj, cnpj para testes, cnpj fictício",
};

export default function GeradorCNPJ() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CNPJ</span> Válido
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números de CNPJ fictícios com dígitos verificadores matematicamente corretos.
          Os CNPJs gerados usam o sufixo /0001 (matriz) e passam na validação do algoritmo mod-11.
          Não pertencem a nenhuma empresa real.
        </p>
      </div>

      <SingleGenerator
        type="cnpj"
        label="CNPJ"
        description="Clique em Gerar para criar CNPJs válidos"
      />

      <div className="mt-8">
        <ValidatorCNPJ />
      </div>

      <ApiCtaBanner dataType="CNPJs" />

      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CNPJ?</h2>
          <p>
            O CNPJ (Cadastro Nacional da Pessoa Jurídica) é o registro de empresas na Receita Federal do Brasil.
            Possui 14 dígitos no formato XX.XXX.XXX/XXXX-XX. Os 8 primeiros identificam a empresa,
            os 4 seguintes identificam a filial (0001 para matriz), e os 2 últimos são dígitos verificadores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validação?</h2>
          <p>
            Semelhante ao CPF, os dígitos verificadores são calculados com pesos multiplicadores e módulo 11.
            O primeiro dígito usa pesos 5,4,3,2,9,8,7,6,5,4,3,2 e o segundo usa 6,5,4,3,2,9,8,7,6,5,4,3,2.
            Todos os CNPJs gerados pelo FakeForge passam nessa validação.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que usar?</h2>
          <p>
            Testes de cadastro de empresas, integração com APIs de consulta CNPJ,
            sistemas de emissão de nota fiscal em homologação, e população de bancos de dados
            de desenvolvimento e staging.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
