import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FakeForge vs. validate-docbr: Gerar × Validar",
  description: "Comparação direta entre FakeForge e validate-docbr. Uma gera documentos brasileiros válidos (CPF, CNPJ), outra só valida input do user. Complementam em vez de competir - saiba quando usar cada.",
  keywords: "fakeforge vs validate-docbr, alternativa validate-docbr, gerador cpf cnpj node, validar cpf cnpj typescript, biblioteca javascript documentos brasileiros",
  alternates: { canonical: "/comparacao/fakeforge-vs-validate-docbr" },
  openGraph: {
    title: "FakeForge vs. validate-docbr - Gerar × Validar",
    description: "Não competem: uma gera, outra valida. Guia de quando usar cada.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function FakeForgeVsValidateDocbr() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Comparação de ferramentas</p>
        <h1 className="text-3xl font-bold tracking-tight">
          FakeForge vs. <span className="text-primary">validate-docbr</span>
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          As duas ferramentas <strong className="text-foreground">não competem</strong>. validate-docbr
          é uma biblioteca npm que só valida input do usuário (CPF, CNPJ, CNH, etc). FakeForge gera
          documentos válidos pra popular seu ambiente de teste. Use as duas juntas.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-card border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">validate-docbr:</strong> instala como dep Node, chama{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded font-mono">cpf.isValid(input)</code>{" "}
            no seu backend/frontend pra checar se o CPF que o user digitou é válido. Zero geração.
          </li>
          <li>
            <strong className="text-foreground">FakeForge:</strong> gera CPFs, CNPJs, endereços, cartões,
            PIX válidos pra popular seed de banco, fixture de teste ou mock de checkout. Zero validação
            de input (pra isso use validate-docbr ou o /validar-cpf da API).
          </li>
          <li>
            <strong className="text-foreground">Combinação natural:</strong> validate-docbr no runtime pra validar
            o que o user digita + FakeForge no CI/staging pra popular banco com dados válidos.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Uso combinado (padrão profissional)</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// No teu backend Express/Fastify em produção:
import { cpf } from "@fnando/validate-docbr";

app.post("/signup", (req, res) => {
  if (!cpf.isValid(req.body.cpf)) {
    return res.status(400).json({ error: "CPF inválido" });
  }
  // continua signup...
});

// Nos teus testes E2E ou seed de staging:
import { FakeForge } from "fakeforge";

const ff = new FakeForge();
const cpfs = await ff.cpf(1000);  // 1000 CPFs válidos

for (const cpf of cpfs) {
  await request(app).post("/signup").send({ cpf, ...});
}
// Todos os CPFs passam na validação porque foram gerados válidos.`}</code></pre>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          As duas bibliotecas funcionam juntas sem overlap. validate-docbr protege a rota real,
          FakeForge popula o teste.
        </p>
      </section>

      <section className="mb-8 rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Comparação lado a lado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center px-3 py-2 text-primary font-medium">FakeForge</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">validate-docbr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Gera CPFs válidos", "✅", "❌"],
                ["Gera CNPJs válidos", "✅", "❌"],
                ["Gera CNPJ alfanumérico 2026", "✅", "❌"],
                ["Gera cartão com Luhn", "✅", "❌"],
                ["Gera chave PIX BACEN", "✅", "❌"],
                ["Gera pessoa correlacionada", "✅", "❌"],
                ["Valida CPF de input", "🔵 (endpoint /validar-cpf)", "✅"],
                ["Valida CNPJ de input", "🔵 (endpoint /validar-cnpj)", "✅"],
                ["Valida CNH, RG, PIS, título", "❌", "✅"],
                ["Instala como dep npm", "✅ (fakeforge)", "✅"],
                ["Zero deps runtime", "✅", "✅"],
                ["TypeScript nativo", "✅", "✅"],
                ["Uso via API HTTP (sem dep)", "✅", "❌"],
                ["Free tier grátis", "✅ (50/dia)", "✅ (MIT)"],
              ].map(([recurso, ff, docbr], i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-muted-foreground">{recurso}</td>
                  <td className="px-3 py-2 text-center text-foreground font-medium">{ff}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{docbr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Quando escolher cada</h2>

        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use validate-docbr se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Você só precisa VALIDAR input do usuário no runtime (formulário de cadastro, checkout)</li>
            <li>Já usa Node.js/TypeScript e quer instalar como dep local sem chamar API externa</li>
            <li>Precisa validar tipos que FakeForge não gera (CNH, RG, PIS, título de eleitor)</li>
          </ul>
        </div>

        <div className="rounded-lg border-l-4 border-accent bg-accent/5 p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use FakeForge se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Você precisa GERAR dados válidos pra popular teste, staging, CI/CD ou mock</li>
            <li>Precisa de correlação entre campos (email deriva do nome, DDD × UF)</li>
            <li>Precisa de CNPJ alfanumérico 2026 ou PIX BACEN completo</li>
            <li>Tem stack polyglot (Node + Python + Go + PHP) e não quer instalar dep em cada linguagem</li>
            <li>Precisa de presets correlacionados (customer, employee, ecommerce_order)</li>
          </ul>
        </div>

        <div className="rounded-lg border-l-4 border-success bg-success/5 p-4">
          <p className="text-sm font-semibold text-foreground mb-1">Use as duas juntas se:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Backend Node com signup real: validate-docbr no runtime + FakeForge no CI</li>
            <li>App fullstack Node com testes E2E: validate-docbr no client-side + FakeForge no Playwright/Cypress fixture</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Como migrar ou combinar</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Você <strong className="text-foreground">não migra</strong> de uma pra outra - você usa as duas.
          Instalação típica:
        </p>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# Adiciona as duas ao projeto
npm install @fnando/validate-docbr fakeforge

# validate-docbr no código de produção (backend/frontend)
# fakeforge nos testes e seeds

# tests/setup.ts
import { FakeForge } from "fakeforge";
export const ff = new FakeForge();

# tests/checkout.test.ts
import { cpf } from "@fnando/validate-docbr";
import { ff } from "./setup";

test("checkout aceita CPFs válidos", async () => {
  const [pessoa] = await ff.preset("customer", 1);

  // Sanity: FakeForge deve gerar CPF que validate-docbr aprove
  expect(cpf.isValid(pessoa.cpf)).toBe(true);

  // Fluxo real do checkout
  const res = await request(app).post("/checkout").send(pessoa);
  expect(res.status).toBe(200);
});`}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Outras comparações relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/comparacoes" className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Todas as comparações</Link>
          <Link href="/comparacao/fakeforge-vs-fakerjs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. Faker.js</Link>
          <Link href="/comparacao/fakeforge-vs-python-brasilidades" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. python-brasilidades</Link>
          <Link href="/comparacao/fakeforge-vs-4devs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">FakeForge vs. 4devs</Link>
        </div>
      </section>
    </PageShell>
  );
}
