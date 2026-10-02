import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Preset Ecom para Teste de Checkout Ecommerce | FakeForge",
  description: "1 chamada, pedido completo: cliente + endereços shipping/billing + carrinho (1-5 produtos com variação) + payment (cartão/PIX/boleto) + totais calculados. Ideal pra teste de checkout ecom brasileiro.",
  keywords: "preset ecom testes, pedido ecommerce fake, dados checkout ecom, mock carrinho compras, teste checkout brasileiro, dados teste ecommerce, sku produto fake, carrinho compras teste",
  alternates: { canonical: "/preset-ecom" },
  openGraph: {
    title: "Preset Ecom — Pedido Completo pra Teste de Checkout",
    description: "Cliente + endereços + carrinho + payment + totais em 1 chamada. Catálogo de 40 produtos BR.",
    type: "website",
    locale: "pt_BR",
  },
};

const sampleOutput = `{
  "preset": "ecom",
  "quantity": 1,
  "data": [
    {
      "customer": {
        "nome": "Rafael Costa Silva",
        "cpf": "739.482.156-08",
        "email": "rafael.costa@outlook.com",
        "telefone": "(31) 99284-7135"
      },
      "shipping_address": {
        "cep": "30130-110",
        "logradouro": "Rua da Bahia, 1032",
        "bairro": "Centro",
        "cidade": "Belo Horizonte",
        "estado": "MG"
      },
      "billing_address": { /* mesmo que shipping em 70% dos casos */ },
      "cart": [
        {
          "sku": "TENCAS-4A2F",
          "name": "Tênis Casual Branco",
          "category": "moda",
          "variation": "41",
          "quantity": 1,
          "unit_price": 249.90,
          "total": 249.90
        },
        {
          "sku": "MOUGAM-8E1C",
          "name": "Mouse Gamer 6400 DPI",
          "category": "eletronicos",
          "variation": "Preto RGB",
          "quantity": 2,
          "unit_price": 129.90,
          "total": 259.80
        }
      ],
      "payment": {
        "method": "credit_card",
        "credit_card": {
          "number": "4532 8891 2947 6103",
          "brand": "visa",
          "cvv": "482",
          "expiry": "11/28",
          "holder_name": "RAFAEL COSTA SILVA"
        }
      },
      "totals": {
        "subtotal": 509.70,
        "shipping": 0,
        "total": 509.70
      }
    }
  ]
}`;

export default function PresetEcomPage() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-[11px] text-muted uppercase tracking-wider mb-2">Preset vertical</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Preset <span className="text-primary">Ecom</span> — pedido completo em 1 chamada
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed max-w-2xl">
          Dev de ecommerce testando checkout, cálculo de frete ou promoção precisa
          <strong className="text-foreground"> pedido completo coerente</strong>: cliente + endereços shipping/billing
          + carrinho realista (1-5 produtos com SKU, variação, preço, quantidade) + payment (cartão, PIX ou boleto)
          + totais calculados. O preset <code className="text-xs bg-card border border-border px-1.5 py-0.5 rounded font-mono">ecom</code>{" "}
          entrega tudo com 1 request.
        </p>
      </div>

      <section className="mb-8 rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">O que vem dentro</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          <li>✅ <strong className="text-foreground">Customer</strong> — nome, CPF, email, telefone</li>
          <li>✅ <strong className="text-foreground">Shipping address</strong> — CEP + logradouro real</li>
          <li>✅ <strong className="text-foreground">Billing address</strong> — 70% igual ao shipping</li>
          <li>✅ <strong className="text-foreground">Carrinho</strong> — 1-5 produtos com SKU, variação, preço</li>
          <li>✅ <strong className="text-foreground">Payment</strong> — cartão (50%), PIX (40%), boleto (10%)</li>
          <li>✅ <strong className="text-foreground">Totais</strong> — subtotal + frete (grátis acima R$199) + total</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Como chamar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">HTTP (curl)</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`curl "https://fakeforge.com.br/api/generate?preset=ecom&quantity=100"`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Node SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`import { FakeForge } from "fakeforge-br";

const ff = new FakeForge();
const pedidos = await ff.preset("ecom", 100);`}</code></pre>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Python SDK</p>
            <pre className="bg-card border border-border rounded-lg p-3 text-xs overflow-x-auto"><code>{`from fakeforge import FakeForge

ff = FakeForge()
pedidos = ff.preset("ecom", 100)`}</code></pre>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Sample output</h2>
        <pre className="bg-card border border-border rounded-lg p-4 text-xs overflow-x-auto"><code>{sampleOutput}</code></pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Catálogo de 40 produtos brasileiros</h2>
        <p className="text-sm text-muted-foreground mb-3">
          5 categorias × 8 produtos, com variações reais e preços psicológicos (terminados em .90 ou .99):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { cat: "Moda", items: "Camiseta, Calça Jeans, Tênis, Moletom, Jaqueta, Vestido, Mochila, Boné" },
            { cat: "Eletrônicos", items: "Fone Bluetooth, Mouse Gamer, Teclado Mecânico, Webcam, Cabo HDMI, Carregador USB-C, Hub USB, Mousepad" },
            { cat: "Alimentos", items: "Café 500g, Chocolate 70%, Azeite 500ml, Mel 400g, Chá Verde, Biscoito Integral, Granola, Ração Pet 15kg" },
            { cat: "Casa", items: "Edredom Queen, Panela Antiaderente, Kit Toalhas, Jogo Americano, Luminária LED, Vaso Cerâmica, Tapete, Almofada" },
            { cat: "Beleza", items: "Perfume 100ml, Shampoo, Protetor Solar, Batom, Creme Facial, Máscara Argila, Esmalte, Escova Térmica" },
          ].map(({ cat, items }) => (
            <div key={cat} className="rounded-lg bg-card border border-border p-3">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{cat}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Casos de uso reais</h2>
        <div className="space-y-3">
          {[
            { title: "Teste de cálculo de frete", body: "Distribuição realista de endereços (todas UFs brasileiras). Passe 1000 pedidos pro seu motor de frete e valide se cobra corretamente por região, se aplica frete grátis acima do threshold, se soma correto pra pedido com múltiplos itens." },
            { title: "Teste de checkout multi-payment", body: "Distribuição 50/40/10 entre cartão/PIX/boleto reflete o mercado BR real. Rode 100 pedidos e sua integração com adquirente é testada em todos os cenários." },
            { title: "Seed de banco staging", body: "Popular 10.000 pedidos com clientes, endereços, carrinhos, payments variados. Plano Dev libera em 1 chamada. Perfeito pra ambiente de dev cheio ou demo pra stakeholder." },
            { title: "Teste de promoção e cupom", body: "Cada pedido tem 1-5 itens de categorias variadas com preços realistas. Sua regra de cupom (X% em categoria Y, R$Z de desconto acima de R$W) pode ser testada contra distribuição real, não fixture artificial." },
            { title: "Fixture E2E Playwright / Cypress", body: "Cada pedido tem estrutura consistente. Setup: gera 20 pedidos no beforeAll, cada teste consome 1. Zero flakiness de dados." },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-lg bg-card border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Detalhes técnicos</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li><strong className="text-foreground">SKU</strong> derivado do nome + hash da variação (formato consistente entre chamadas pro mesmo par produto/variação).</li>
          <li><strong className="text-foreground">Variações</strong> reais por categoria: tamanhos P/M/G/GG, cores, capacidades (100g, 300ml, 15kg), configurações (RGB, sem RGB).</li>
          <li><strong className="text-foreground">Preços psicológicos</strong> — 70% terminam em .90, 30% em .99 (padrão real de retail BR).</li>
          <li><strong className="text-foreground">Frete grátis</strong> acima de R$199 (padrão de mercado); abaixo, R$9.90-R$29.90 aleatório.</li>
          <li><strong className="text-foreground">Cartão de crédito</strong> passa Luhn, brand random (Visa, Master, Elo, Hipercard, Amex), holder = customer.</li>
          <li><strong className="text-foreground">Boleto</strong> tem linha digitável no formato padrão FEBRABAN (5 grupos separados por espaço).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Próximos passos</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/docs" className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-bold hover:bg-primary-hover transition-colors">Ver documentação da API</a>
          <Link href="/preset-fintech" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver Preset Fintech</Link>
          <Link href="/docs" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Docs da API</Link>
          <Link href="/pricing" className="px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground hover:border-primary/30 transition-colors">Ver Planos</Link>
        </div>
      </section>
    </PageShell>
  );
}
