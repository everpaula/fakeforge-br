import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "5 fluxos que exigem a API do FakeForge (não só a UI web)",
  description: "Dev que só usa a UI web do FakeForge perde 90% do produto. 5 fluxos reais que exigem API: seed de banco em staging, CI/CD determinístico, QR Code PIX pra checkout E2E, load test com cache, CNPJ alfanumérico 2026.",
  keywords: "api fakeforge, seed banco staging, ci/cd pipeline dados teste, qr code pix dinamico, cnpj alfanumerico 2026, load test dados brasileiros, fakeforge python nodejs, fluxos api rest dev tool",
  alternates: { canonical: "/blog/5-fluxos-que-exigem-api-fakeforge" },
  openGraph: {
    title: "5 fluxos que exigem a API do FakeForge (não só a UI web)",
    description: "Casos reais onde o gerador web não resolve mas a API resolve em 1 chamada. Seed de banco, CI/CD, PIX dinâmico, load test, CNPJ 2026.",
    type: "article",
    locale: "pt_BR",
    images: ["/api/og?title=5%20fluxos%20que%20exigem%20a%20API%20do%20FakeForge&subtitle=Casos%20reais%20onde%20o%20gerador%20web%20nao%20resolve&category=GUIAS"],
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-primary hover:underline mb-4 inline-block">
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage
          category="Guias"
          title="5 fluxos que exigem a API do FakeForge"
          className="mb-6"
        />

        <h1 className="text-3xl font-bold tracking-tight mb-3">
          5 fluxos que exigem a API do FakeForge (não só a UI web)
        </h1>
        <p className="text-xs text-muted mb-6">7 min de leitura</p>

        <ShareBar title="5 fluxos que exigem a API do FakeForge" path="/blog/5-fluxos-que-exigem-api-fakeforge" />

        <div className="prose prose-sm max-w-none text-foreground mt-8 space-y-6 leading-relaxed">
          <p>
            A UI web do FakeForge resolve o 20% dos casos: dev abre, gera 1 CPF, copia, cola em formulário, segue a vida. Mas 80% do que o produto faz exige <strong>API REST</strong>. Esses são os 5 fluxos onde a UI não serve e a API resolve em 1 chamada.
          </p>

          <p className="text-sm">
            <strong>Todos funcionam no Free (50 chamadas/dia).</strong> Nenhum pede upgrade pro Dev. Alguns ficam melhores com Dev por volume, mas o fluxo em si é universal.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">1. Seed de banco em staging com 1000 registros em 1 chamada</h2>

          <p className="text-sm">
            A UI web gera 1 item por vez. A API aceita <code>quantity=1000</code> no Free (10.000 no Dev). Com script Node de 5 linhas, você popula tabela customers com dados válidos antes do primeiro teste rodar.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// prisma/seed.ts (Node + Prisma)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=customer&quantity=1000"
  );
  const { data } = await res.json();

  await prisma.customer.createMany({
    data: data.map((c: any) => ({
      cpf: c.cpf,
      name: c.name,
      email: c.email,
      phone: c.phone,
    })),
  });

  console.log(\`✓ \${data.length} customers inseridos\`);
}

main();`}</code></pre>

          <p className="text-sm">
            Roda com <code>npx tsx prisma/seed.ts</code>. 1 chamada API = 1000 customers. Pra Django/Rails/Laravel, mesma lógica, varia só o ORM.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">2. CI/CD determinístico com fixtures</h2>

          <p className="text-sm">
            Teste flaky é teste que falha às vezes sem motivo visível. Causa comum: dado gerado aleatório. Fix: usar <code>seed</code> determinístico. Mesmo seed, mesma saída.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`# .github/workflows/test.yml
- name: Fixtures determinísticas
  run: |
    curl -s "https://fakeforge.com.br/api/generate?preset=customer&quantity=100&seed=pr-\${{ github.event.number }}" \\
      > tests/fixtures/customers.json

- name: pytest
  run: pytest tests/ -v`}</code></pre>

          <p className="text-sm">
            Cada PR número N tem seed <code>pr-N</code>. Fixtures reproduzíveis. Flaky test some. Debug fica fácil: você consegue regenerar os dados exatos que quebraram no CI.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">3. Checkout PIX com QR Code dinâmico pra teste E2E</h2>

          <p className="text-sm">
            Testar fluxo de pagamento PIX exige QR Code válido no padrão EMV BR Code com CRC16 correto. Fazer isso manualmente é 50 linhas de código. A API devolve pronto.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// Playwright E2E
import { test, expect } from "@playwright/test";

test("checkout PIX dinâmico", async ({ page }) => {
  const res = await fetch(
    "https://fakeforge.com.br/api/generate?preset=pix_dynamic&amount=99.90"
  );
  const { data: [pix] } = await res.json();
  // pix.key, pix.qrcode_payload, pix.qrcode_crc16, pix.amount

  await page.goto("/checkout");
  await page.fill("#pix-key", pix.key);
  await page.click("#pay-with-pix");
  await expect(page.locator("[data-testid=qrcode-img]")).toBeVisible();
});`}</code></pre>

          <p className="text-sm">
            Preset <code>pix_dynamic</code> devolve chave BACEN + payload EMV + CRC16 em uma chamada. Zero mock manual.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">4. Load test com 100K payloads sem gastar quota</h2>

          <p className="text-sm">
            K6/Locust rodando load test precisa de dados realistas pra cada request. Chamar a API em cada iteração = esgota quota em minutos. Fix: cache local no primeiro run.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`// k6-script.js
import http from "k6/http";
import { SharedArray } from "k6/data";

const customers = new SharedArray("customers", function () {
  // Baixa 1000 customers na primeira execução. Cache em disco.
  const res = http.get("https://fakeforge.com.br/api/generate?preset=customer&quantity=1000");
  return JSON.parse(res.body).data;
});

export const options = { vus: 100, duration: "5m" };

export default function () {
  const c = customers[Math.floor(Math.random() * customers.length)];
  http.post("https://meu-app.com/api/signup", JSON.stringify(c));
}`}</code></pre>

          <p className="text-sm">
            1 chamada ao FakeForge, 100K requests ao seu app. Load test realista com <strong>1 unidade da quota Free</strong>.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">5. CNPJ alfanumérico pra migrar antes de 01/07/2026</h2>

          <p className="text-sm">
            A Instrução Normativa RFB 2.229/2024 autoriza CNPJs com letras A-Z nas 12 primeiras posições a partir de 01/07/2026. Dois dígitos verificadores continuam numéricos mas o cálculo mod-11 agora processa letras pelo código ASCII menos 48.
          </p>

          <p className="text-sm">
            <strong>Nenhuma outra lib brasileira que testei gera com DV correto.</strong> Testei <code>brutils-py</code>, <code>pycpfcnpj</code>, <code>validation-br</code> no npm: todos ou retornam formato antigo ou DV errado no novo. O FakeForge devolve correto.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?type=cnpj&format=alpha&quantity=10"

# Resposta:
{
  "data": [
    "12.ABC.345/0001-67",
    "AB.123.CDE/0001-89",
    ...
  ]
}`}</code></pre>

          <p className="text-sm">
            Teste seu validador de CNPJ com esses dados agora. Em julho de 2026, cnpjs novos vão aparecer em cadastros. Se sua validação ainda espera só dígitos, cadastro vai falhar silenciosamente.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4">Resumo em 1 tabela</h2>

          <div className="overflow-x-auto rounded-lg bg-card border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-muted">Fluxo</th>
                  <th className="text-center px-3 py-2 text-muted">UI resolve?</th>
                  <th className="text-center px-3 py-2 text-muted">Chamadas Free</th>
                  <th className="text-center px-3 py-2 text-muted">Preset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Seed banco 1000+ registros", "❌", "1", "customer"],
                  ["CI/CD determinístico", "❌", "1 por PR", "seed=N"],
                  ["Checkout PIX E2E", "❌", "1 por teste", "pix_dynamic"],
                  ["Load test 100K payloads", "❌", "1 (cache)", "customer"],
                  ["CNPJ alfanumérico 2026", "⚠️ só UI simples", "1", "cnpj format=alpha"],
                ].map(([a, b, c, d]) => (
                  <tr key={a}>
                    <td className="px-3 py-2 text-foreground">{a}</td>
                    <td className="px-3 py-2 text-center">{b}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{c}</td>
                    <td className="px-3 py-2 text-center font-mono text-[11px] text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold mt-10 mb-4">Como começar</h2>

          <p className="text-sm">
            1. Pega sua API key em <Link href="/dashboard" className="text-primary hover:underline">fakeforge.com.br/dashboard</Link>. Grátis, sem cadastro de cartão.
          </p>
          <p className="text-sm">
            2. Instala o SDK se quiser: <code>npm install fakeforge-br</code> ou <code>pip install fakeforge-br</code>. Ou chama direto via curl, qualquer linguagem.
          </p>
          <p className="text-sm">
            3. Começa pelo fluxo que mais dói pra você. Seed de banco é o mais comum. CI/CD determinístico é o que mais dá dor de cabeça. CNPJ alfanumérico é o único com data de vigência real.
          </p>

          <p className="text-sm italic text-muted-foreground mt-6">
            Se travar em algum fluxo, responde esse email ou abre issue no <a href="https://github.com/everpaula/fakeforge-br/issues" className="text-primary hover:underline">GitHub</a>. Eu respondo pessoalmente.
          </p>

          <section className="mt-10 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">Ver também</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/docs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Docs completa</Link>
              <Link href="/blog/popular-postgresql-dados-brasileiros-staging" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Seed PostgreSQL</Link>
              <Link href="/blog/qr-code-pix-dinamico-emv-br-code-nodejs" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">QR Code PIX dinâmico</Link>
              <Link href="/blog/cnpj-alfanumerico-checklist-migracao-2026" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">CNPJ alfanumérico 2026</Link>
              <Link href="/pricing" className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors">Planos (Free, Dev, Team)</Link>
            </div>
          </section>
        </div>
      </article>

      <BlogPostingSchema
        title="5 fluxos que exigem a API do FakeForge (não só a UI web)"
        description="Dev que só usa a UI web perde 90% do produto. 5 fluxos reais que exigem API: seed de banco, CI/CD determinístico, QR Code PIX, load test, CNPJ alfanumérico 2026."
        datePublished="2026-10-07"
        slug="5-fluxos-que-exigem-api-fakeforge"
      />
    </PageShell>
  );
}
