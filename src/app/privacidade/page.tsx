import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Política de Privacidade — FakeForge BR",
  description: "Política de privacidade do FakeForge BR. Como coletamos, usamos e protegemos dados de visitantes e usuários cadastrados. Conformidade com LGPD.",
  alternates: { canonical: "/privacidade" },
};

const updated = "01 de maio de 2026";

export default function Privacidade() {
  return (
    <PageShell>
      <article className="max-w-2xl prose-custom">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Política de Privacidade</h1>
        <p className="text-xs text-muted">Última atualização: {updated}</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed mt-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">1. Quem somos</h2>
            <p>
              O FakeForge BR (fakeforge.com.br) é uma ferramenta de geração de dados brasileiros
              fictícios para testes de software, mantida por Everton Paula como projeto independente.
              Esta política descreve como tratamos dados pessoais conforme a Lei Geral de Proteção
              de Dados (LGPD — Lei 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">2. Dados que coletamos</h2>
            <p>
              <strong className="text-foreground">Visitantes anônimos (não cadastrados):</strong> coletamos apenas
              hash criptográfico do endereço IP (SHA-256 com salt), tipo de gerador usado e quantidade gerada.
              Não armazenamos o IP em texto puro, nome, email ou qualquer dado pessoal.
            </p>
            <p>
              <strong className="text-foreground">Usuários cadastrados:</strong> email, ID de usuário do
              provedor de autenticação (GitHub OAuth ou link mágico via Supabase), API keys geradas, e
              estatísticas de uso da API (timestamp, tipo de dado, quantidade).
            </p>
            <p>
              <strong className="text-foreground">Pagamentos:</strong> processados pela Mercado Pago. Não
              armazenamos dados de cartão de crédito. O FakeForge recebe apenas o ID da transação,
              email do pagador e plano contratado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">3. Dados gerados pela ferramenta</h2>
            <p>
              <strong className="text-foreground">Os dados que você gera (CPF, CNPJ, etc.) são fictícios e descartados imediatamente após a resposta.</strong>
              Não armazenamos, indexamos, registramos ou compartilhamos qualquer dado fictício gerado.
              Cada geração é stateless — duas chamadas idênticas produzem resultados independentes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">4. Cookies</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Sessão de autenticação</strong> (Supabase): mantém você logado. Estritamente necessário.</li>
              <li><strong>ff_ref</strong> (programa de afiliados): se você chega via link de indicação, armazenamos o ID do indicador por 30 dias para creditar a comissão. Anonimizado no descarte.</li>
            </ul>
            <p>
              Não usamos cookies de rastreamento publicitário, fingerprinting ou perfis comportamentais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">5. Analytics</h2>
            <p>
              Usamos <a href="https://umami.is" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Umami Analytics</a>,
              uma ferramenta self-hosted privacy-friendly que <strong className="text-foreground">não usa cookies, não rastreia visitantes individualmente e
              não compartilha dados com terceiros</strong>. Coletamos apenas: páginas vistas (anônimas), referrer
              (de onde você veio), país, dispositivo (mobile/desktop) e navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">6. Terceiros</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Supabase</strong> (autenticação e banco de dados) — servidores na AWS</li>
              <li><strong>Vercel</strong> (hospedagem) — servidores nos EUA e Europa</li>
              <li><strong>Mercado Pago</strong> (processamento de pagamentos) — servidores no Brasil</li>
              <li><strong>GitHub</strong> (provedor OAuth opcional) — servidores nos EUA</li>
            </ul>
            <p>
              Nenhum desses terceiros recebe dados pessoais além do estritamente necessário para sua função.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">7. Anúncios e parceiros</h2>
            <p>
              Em alguns artigos do blog incluímos links de afiliados de parceiros (ex: hospedagem,
              cursos online). Esses links têm o atributo <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">rel=&quot;sponsored&quot;</code> e
              são marcados como recomendação remunerada. Não compartilhamos dados pessoais com
              esses parceiros — apenas você decide se clica.
            </p>
            <p>
              Caso futuramente integremos plataformas de anúncios programáticos (como Google AdSense
              ou EthicalAds), atualizaremos esta política e listaremos os terceiros envolvidos com 30 dias
              de antecedência.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">8. Seus direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Confirmação de existência de tratamento de seus dados</li>
              <li>Acesso aos dados</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Eliminação dos dados pessoais (exceto onde houver obrigação legal)</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p>
              Para exercer qualquer direito, envie email para <Link href="/contato" className="text-primary hover:underline">o canal de contato</Link>.
              Respondemos em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">9. Retenção</h2>
            <p>
              Dados de uso anônimo (hash de IP) são retidos por 90 dias e depois agregados ou deletados.
              Dados de usuários cadastrados são retidos enquanto a conta estiver ativa, e até 12 meses
              após cancelamento. Dados de pagamento são retidos pelo prazo legal de 5 anos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">10. Mudanças nesta política</h2>
            <p>
              Mudanças significativas serão comunicadas por email aos usuários cadastrados e
              destacadas no topo desta página por 30 dias. A data &ldquo;última atualização&rdquo; sempre
              reflete a versão vigente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">11. Contato</h2>
            <p>
              Dúvidas sobre privacidade ou exercício de direitos LGPD: <Link href="/contato" className="text-primary hover:underline">página de contato</Link>.
            </p>
          </section>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Privacidade", url: "/privacidade" },
      ]} />
    </PageShell>
  );
}
