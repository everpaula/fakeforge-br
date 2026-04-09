import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ValidatorCPF from "../gerador-cpf/ValidatorCPF";
import SingleGenerator from "@/components/SingleGenerator";
import ApiCtaBanner from "@/components/ApiCtaBanner";

export const metadata: Metadata = {
  title: "Validar CPF - Verifique se um CPF é Válido | FakeForge BR",
  description: "Valide um CPF online gratuitamente. Verifica se os dígitos verificadores estão corretos usando o algoritmo mod-11 da Receita Federal.",
  keywords: "validar cpf, verificar cpf, cpf válido, validação cpf online, checar cpf",
};

export default function ValidarCPF() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">CPF</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cole um CPF para verificar se os dígitos verificadores estão corretos.
          A validação usa o algoritmo oficial mod-11 da Receita Federal.
          Nenhum dado é armazenado ou enviado para servidores externos.
        </p>
      </div>

      <ValidatorCPF />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Precisa de CPFs para teste?</h2>
        <SingleGenerator
          type="cpf"
          label="CPF"
          description="Gere CPFs válidos e fictícios"
        />
      </div>
      <ApiCtaBanner dataType="CPFs" />
    </PageShell>
  );
}
