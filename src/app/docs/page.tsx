import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { DATA_TYPES } from "@/lib/generators";

export const metadata: Metadata = {
  title: "API Documentation - FakeForge BR",
  description: "Documentacao da API REST do FakeForge BR. Gere dados brasileiros ficticios via API. Sem autenticacao, gratis.",
};

export default function Docs() {
  const categories = [...new Set(DATA_TYPES.map((t) => t.category))];

  return (
    <PageShell>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">API</span> Documentation
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Gere dados brasileiros ficticios via API REST. Sem autenticacao, sem cadastro.
          Retorna JSON por padrao, ou CSV e SQL sob demanda.
        </p>
      </div>

      {/* Base URL */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">Base URL</h2>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm">
          <span className="text-muted">https://</span>
          <span className="text-foreground">seu-dominio.com</span>
          <span className="text-primary">/api/generate</span>
        </div>
      </section>

      {/* GET */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-success/15 text-success mr-2">GET</span>
          /api/generate
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Gera dados via query parameters.</p>

        <h3 className="text-sm font-medium text-foreground mb-2">Parametros</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Param</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Tipo</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Default</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Descricao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2 font-mono text-primary">type</td>
                <td className="px-4 py-2 text-muted-foreground">string</td>
                <td className="px-4 py-2 text-muted-foreground">-</td>
                <td className="px-4 py-2">Tipo de dado (ver tabela abaixo)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-primary">quantity</td>
                <td className="px-4 py-2 text-muted-foreground">number</td>
                <td className="px-4 py-2 text-muted-foreground">10</td>
                <td className="px-4 py-2">Quantidade (1 a 10.000)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-primary">formatted</td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2 text-muted-foreground">true</td>
                <td className="px-4 py-2">Incluir pontuacao (123.456.789-00 vs 12345678900)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-foreground mb-2">Exemplo</h3>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6">
          <div className="text-muted"># Gerar 5 CPFs formatados</div>
          <div>
            <span className="text-success">curl</span>
            <span className="text-foreground"> &quot;/api/generate?type=cpf&amp;quantity=5&quot;</span>
          </div>
          <div className="mt-3 text-muted"># Resposta</div>
          <pre className="text-primary/80">{`{
  "type": "cpf",
  "quantity": 5,
  "data": [
    "123.456.789-09",
    "987.654.321-00",
    ...
  ]
}`}</pre>
        </div>
      </section>

      {/* POST */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/15 text-accent mr-2">POST</span>
          /api/generate
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Gera dados via JSON body. Suporta export em CSV e SQL.</p>

        <h3 className="text-sm font-medium text-foreground mb-2">Body (JSON)</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Campo</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Tipo</th>
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Descricao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2 font-mono text-primary">type</td>
                <td className="px-4 py-2 text-muted-foreground">string</td>
                <td className="px-4 py-2">Tipo de dado</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-primary">quantity</td>
                <td className="px-4 py-2 text-muted-foreground">number</td>
                <td className="px-4 py-2">Quantidade (1 a 10.000)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-primary">formatted</td>
                <td className="px-4 py-2 text-muted-foreground">boolean</td>
                <td className="px-4 py-2">Incluir pontuacao</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-primary">format</td>
                <td className="px-4 py-2 text-muted-foreground">string</td>
                <td className="px-4 py-2">&quot;json&quot; (padrao), &quot;csv&quot;, ou &quot;sql&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-foreground mb-2">Exemplos</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6">
            <div className="text-muted"># Gerar 10 enderecos em CSV</div>
            <div><span className="text-success">curl</span> -X POST /api/generate \</div>
            <div>{"  "}-H &quot;Content-Type: application/json&quot; \</div>
            <div>{"  "}-d <span className="text-accent">{`'{"type":"address","quantity":10,"format":"csv"}'`}</span></div>
          </div>
          <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs leading-6">
            <div className="text-muted"># Gerar 100 empresas em SQL</div>
            <div><span className="text-success">curl</span> -X POST /api/generate \</div>
            <div>{"  "}-H &quot;Content-Type: application/json&quot; \</div>
            <div>{"  "}-d <span className="text-accent">{`'{"type":"company","quantity":100,"format":"sql"}'`}</span></div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">Tipos disponiveis</h2>
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-accent uppercase tracking-wider mb-2">{category}</h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {DATA_TYPES.filter((t) => t.category === category).map((type) => (
                    <tr key={type.value}>
                      <td className="px-4 py-2 font-mono text-primary w-40">{type.value}</td>
                      <td className="px-4 py-2 font-medium text-foreground w-40">{type.label}</td>
                      <td className="px-4 py-2 text-muted-foreground">{type.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Rate limits */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Limites</h2>
        <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          <p>Maximo de <strong className="text-foreground">10.000 items</strong> por request.</p>
          <p className="mt-1">A API e gratuita e aberta. Rate limiting sera implementado em breve.</p>
        </div>
      </section>
    </PageShell>
  );
}
