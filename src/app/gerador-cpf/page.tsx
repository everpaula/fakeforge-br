import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SingleGenerator from "@/components/SingleGenerator";
import ValidatorCPF from "./ValidatorCPF";

export const metadata: Metadata = {
  title: "Gerador de CPF Valido - Gere CPF para Testes | FakeForge BR",
  description: "Gere CPF valido e ficticio para testes e desenvolvimento. Numeros com digitos verificadores corretos, formatados ou sem pontuacao. Gratis e sem cadastro.",
  keywords: "gerador de cpf, cpf valido, gerar cpf, cpf para testes, cpf ficticio, cpf falso valido",
  openGraph: {
    title: "Gerador de CPF Valido - FakeForge BR",
    description: "Gere CPF valido e ficticio para testes. Digitos verificadores corretos, gratis e sem cadastro.",
    type: "website",
  },
};

export default function GeradorCPF() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerador de <span className="text-primary">CPF</span> Valido
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere numeros de CPF ficticios com digitos verificadores matematicamente corretos.
          Os CPFs gerados passam na validacao do algoritmo mod-11, mas nao pertencem a nenhuma pessoa real.
          Ideal para testes de software, preenchimento de formularios em ambiente de desenvolvimento e QA.
        </p>
      </div>

      <SingleGenerator
        type="cpf"
        label="CPF"
        description="Clique em Gerar para criar CPFs validos"
      />

      <div className="mt-8">
        <ValidatorCPF />
      </div>

      {/* SEO content */}
      <div className="mt-12 space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">O que e um CPF?</h2>
          <p>
            O CPF (Cadastro de Pessoa Fisica) e o documento de identificacao fiscal de pessoas fisicas no Brasil,
            emitido pela Receita Federal. Ele possui 11 digitos no formato XXX.XXX.XXX-XX, onde os dois ultimos
            sao digitos verificadores calculados pelo algoritmo modulo 11.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Como funciona a validacao?</h2>
          <p>
            Os digitos verificadores do CPF sao calculados usando pesos multiplicadores sobre os 9 primeiros digitos.
            O primeiro digito verificador usa pesos de 10 a 2, e o segundo usa pesos de 11 a 2.
            O resultado e o resto da divisao por 11: se menor que 2, o digito e 0; caso contrario, e 11 menos o resto.
            Todos os CPFs gerados pelo FakeForge passam nessa validacao.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Para que serve um gerador de CPF?</h2>
          <p>
            Desenvolvedores precisam de CPFs validos para testar sistemas que validam esse campo — como cadastros,
            formularios de e-commerce, integracao com gateways de pagamento e testes automatizados.
            Usar um CPF real em ambiente de teste viola a LGPD. Geradores criam numeros ficticios que passam
            na validacao sem pertencer a ninguem.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
