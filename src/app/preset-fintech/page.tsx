import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Preset Fintech — Cliente Completo pra Teste de Checkout (2026)",
  description: "1 chamada, cliente coerente: CPF + PIX (4 chaves) + conta bancária + cartão + score Serasa + renda. Zero desalinhamento entre campos. Ideal pra teste de checkout PIX, antifraude e credit engine.",
  keywords: "preset fintech testes, dados fintech coerentes, cpf pix conta correlacionado, teste checkout pix, teste antifraude brasil, mock fintech, dados teste credit engine, score serasa fake, renda mensal ficticia",
  alternates: { canonical: "/preset-fintech" },
  openGraph: {
    title: "Preset Fintech — Cliente Completo pra Teste de Checkout",
    description: "Bundle CPF + PIX + conta + cartão + score + renda em 1 chamada. Correlação garantida.",
    type: "website",
    locale: "pt_BR",
  },
};

const sampleOutput = `{
  "preset": "fintech",
  "quantity": 1,
  "data": [
    {
      "customer": {
        "nome": "Marina Souza Oliveira",
        "cpf": "428.153.792-04",
        "email": "marina.souza@gmail.com",
        "telefone": "(11) 98432-7156",
        "endereco": {
          "cep": "04552-030",
          "logradouro": "Rua Funchal, 375",
          "bairro": "Vila Olímpia",
          "cidade": "São Paulo",
          "estado": "SP"
        },
        "renda_mensal": 6800,
        "score_serasa": 742
      },
      "pix_keys": [
        { "type": "cpf", "value": "42815379204" },
        { "type": "email", "value": "marina.souza@gmail.com" },
        { "type": "phone", "value": "+5511984327156" },
        { "type": "aleatoria", "value": "8f4e2c91-a3b7-4d5e-9f2a-1c8b6d0e5a3f" }
      ],
      "bank_account": {
        "bank": "260 - Nu Pagamentos (Nubank)",
        "agency": "0001",
        "account": "6284591-3",
        "type": "corrente"
      },
      "credit_card": {
        "number": "5234 8891 2947 6103",
        "brand": "mastercard",
        "cvv": "428",
        "expiry": "07/29",
        "holder_name": "MARINA SOUZA OLIVEIRA"
      }
    }
  ]
}`;

export default function PresetFintechPage() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Preset vertical</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Preset <span className="text-primary">Fintech</span> — cliente completo em 1 chamada
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Dev fintech tá testando checkout PIX, credit engine, KYC ou antifraude. Precisa CPF, PIX,
          conta bancária, cartão de crédito, score Serasa e renda mensal <strong className="text-foreground">coerentes entre si</strong>.
          O preset <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">fintech</code>{" "}
          resolve com 1 request. Sem correlacionar campo por campo depois.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">O que vem dentro</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>✅ <strong className="text-foreground">Customer</strong> — nome, CPF, email, telefone, endereço</li>
          <li>✅ <strong className="text-foreground">Renda mensal</strong> — log-normal, mediana R$3.500</li>
          <li>✅ <strong className="text-foreground">Score Serasa</strong> — 300-1000, normal ponderada</li>
          <li>✅ <strong className="text-foreground">PIX keys</strong> — 3-4 chaves (CPF, email, phone, aleatória)</li>
          <li>✅ <strong className="text-foreground">Conta bancária</strong> — 17 bancos brasileiros, DV real</li>
          <li>✅ <strong className="text-foreground">Cartão de crédito</strong> — Luhn válido, brand random, holder = customer</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Como chamar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">HTTP (curl)</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?preset=fintech&quantity=100"`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Node SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br";

const ff = new FakeForge();
const clientes = await ff.preset("fintech", 100);`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Python SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()
clientes = ff.preset("fintech", 100)`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Sample output</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{sampleOutput}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Casos de uso reais</h2>
        <div className="space-y-3">
          {[
            { title: "Teste de checkout PIX", body: "Chave PIX bate com CPF do customer, banco emissor é um dos 17 do arranjo Pix, telefone tem DDD do estado do endereço. Antifraude não dispara falso positivo por dados incoerentes." },
            { title: "Credit engine calibration", body: "Distribuição normal ponderada do score (300-1000, média 650) reproduz proporção real do brasileiro. Rode 10.000 clientes e teste que seu motor aprova ~40%, rejeita ~15%, revisa ~45% — se ficar fora, tem viés." },
            { title: "KYC e onboarding automatizado", body: "CPF válido pela Receita, endereço com UF real, renda dentro do range brasileiro. Ideal pra teste de decisões automáticas de account opening." },
            { title: "Load test de gateway de pagamento", body: "Plano Dev libera 10.000 clientes em 1 chamada. Cada um vem com cartão único (Luhn), CPF único, email único. Perfeito pra encher fila de checkout em teste de stress." },
            { title: "Fixture pra pytest / vitest", body: "Gera 100 clientes uma vez, salva como JSON, reutiliza entre testes. Deterministic (se você seedar) ou fresh a cada run." },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-lg bg-card border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Detalhes técnicos que importam</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li><strong className="text-foreground">CPF</strong> passa mod-11 da Receita Federal (não é apenas 11 dígitos aleatórios).</li>
          <li><strong className="text-foreground">Cartão de crédito</strong> passa algoritmo de Luhn (aceito por qualquer gateway de teste).</li>
          <li><strong className="text-foreground">Conta bancária</strong> tem DV calculado pela regra específica do banco (17 bancos suportados: Nubank, Itaú, Bradesco, Santander, BB, Caixa, Inter, C6, PicPay, PagSeguro, etc).</li>
          <li><strong className="text-foreground">Score Serasa</strong> segue distribuição normal (Box-Muller) com média 650 e stddev 150, clampado em [300, 1000] — reproduz curva real do brasileiro.</li>
          <li><strong className="text-foreground">Renda mensal</strong> segue distribuição log-normal com mediana R$3.500 e cauda até R$25k — reflete a realidade da população economicamente ativa.</li>
          <li><strong className="text-foreground">PIX keys</strong> incluem sempre CPF + email + phone; 60% dos clientes também têm chave aleatória (padrão BACEN 2024).</li>
        </ul>
      </section>

      <section className="mb-8 rounded-xl bg-card border-l-4 border-accent p-4">
        <p className="text-sm font-semibold text-foreground mb-2">💡 Combinação recomendada</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Se sua stack é fintech BR, combine o preset <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">fintech</code>{" "}
          (gera clientes válidos) + <Link href="/algoritmo-luhn" className="text-primary hover:underline">validate-docbr</Link> ou{" "}
          <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">python-brasilidades</code> (valida input de user real no runtime).
          Uma popula seed, a outra protege a rota de produção.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/api/generate?preset=fintech&quantity=3" target="_blank" rel="noopener" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Testar API agora</a>
          <Link href="/preset-ecom" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver Preset Ecom</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
          <Link href="/pricing" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver Planos</Link>
        </div>
      </section>
    </PageShell>
  );
}
