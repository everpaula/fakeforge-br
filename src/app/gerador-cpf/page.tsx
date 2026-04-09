import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";
import ValidatorCPF from "./ValidatorCPF";

export const metadata: Metadata = {
  title: "Gerador de CPF Válido - Gere CPF para Testes | FakeForge BR",
  description: "Gere CPF válido e fictício para testes e desenvolvimento. Números com dígitos verificadores corretos, formatados ou sem pontuação. Grátis e sem cadastro.",
  keywords: "gerador de cpf, cpf válido, gerar cpf, cpf para testes, cpf fictício, cpf falso válido",
  openGraph: {
    title: "Gerador de CPF Válido - FakeForge BR",
    description: "Gere CPF válido e fictício para testes. Dígitos verificadores corretos, grátis e sem cadastro.",
    type: "website",
  },
};

export default function GeradorCPF() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF</span> Válido
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere números de CPF fictícios com dígitos verificadores matematicamente corretos.
          Os CPFs gerados passam na validação do algoritmo mod-11, mas não pertencem a nenhuma pessoa real.
          Ideal para testes de software, preenchimento de formulários em ambiente de desenvolvimento e QA.
        </p>
      </div>

      <SingleGenerator
        type="cpf"
        label="CPF"
        description="Clique em Gerar para criar CPFs válidos"
      />

      <div className="mt-8">
        <ValidatorCPF />
      </div>

      <ApiCtaBanner dataType="CPFs" />

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que é um CPF?</h2>
          <p>
            O CPF (Cadastro de Pessoa Física) é o documento de identificação fiscal de pessoas físicas no Brasil,
            emitido pela Receita Federal. Ele possui 11 dígitos no formato XXX.XXX.XXX-XX, onde os dois últimos
            são dígitos verificadores calculados pelo algoritmo módulo 11.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validação?</h2>
          <p>
            Os dígitos verificadores do CPF são calculados usando pesos multiplicadores sobre os 9 primeiros dígitos.
            O primeiro dígito verificador usa pesos de 10 a 2, e o segundo usa pesos de 11 a 2.
            O resultado é o resto da divisão por 11: se menor que 2, o dígito é 0; caso contrário, é 11 menos o resto.
            Todos os CPFs gerados pelo FakeForge passam nessa validação.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que serve um gerador de CPF?</h2>
          <p>
            Desenvolvedores precisam de CPFs válidos para testar sistemas que validam esse campo — como cadastros,
            formulários de e-commerce, integração com gateways de pagamento e testes automatizados.
            Usar um CPF real em ambiente de teste viola a LGPD. Geradores criam números fictícios que passam
            na validação sem pertencer a ninguém.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
