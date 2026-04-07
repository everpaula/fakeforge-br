import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ValidatorCNPJ from "../gerador-cnpj/ValidatorCNPJ";
import SingleGenerator from "@/components/SingleGenerator";

export const metadata: Metadata = {
  title: "Validar CNPJ - Verifique se um CNPJ e Valido | FakeForge BR",
  description: "Valide um CNPJ online gratuitamente. Verifica se os digitos verificadores estao corretos usando o algoritmo mod-11 da Receita Federal.",
  keywords: "validar cnpj, verificar cnpj, cnpj valido, validacao cnpj online, checar cnpj",
};

export default function ValidarCNPJ() {
  return (
    <PageShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Validar <span className="text-primary">CNPJ</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Cole um CNPJ para verificar se os digitos verificadores estao corretos.
          A validacao usa o algoritmo oficial mod-11.
          Nenhum dado e armazenado ou enviado para servidores externos.
        </p>
      </div>

      <ValidatorCNPJ />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Precisa de CNPJs para teste?</h2>
        <SingleGenerator
          type="cnpj"
          label="CNPJ"
          description="Gere CNPJs validos e ficticios"
        />
      </div>
    </PageShell>
  );
}
