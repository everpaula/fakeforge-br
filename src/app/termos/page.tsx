import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Termos de Uso da API FakeForge BR e Geradores Web",
  description: "Termos de uso do FakeForge BR. Regras para uso da ferramenta web e da API REST. Limites, restrições e responsabilidade do usuário.",
  alternates: { canonical: "/termos" },
};

const updated = "01 de maio de 2026";

export default function Termos() {
  return (
    <PageShell>
      <article className="max-w-2xl prose-custom">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Termos de Uso</h1>
        <p className="text-xs text-muted">Última atualização: {updated}</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed mt-8">
          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">1. Aceitação</h2>
            <p>
              Ao usar o FakeForge BR (fakeforge.com.br) — seja pela interface web ou pela API REST —
              você concorda com estes Termos. Se não concordar, não use o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">2. Finalidade exclusiva: testes de software</h2>
            <p>
              Os dados gerados pelo FakeForge — incluindo CPF, CNPJ, CEP, números de cartão, chaves
              PIX, dados bancários, CNH, CIN e qualquer outro tipo — destinam-se <strong className="text-foreground">exclusivamente</strong> para:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Testes automatizados (Jest, Cypress, Playwright, pytest)</li>
              <li>Ambientes de desenvolvimento, homologação e staging</li>
              <li>Demonstrações de produtos sem dados reais</li>
              <li>Treinamento de modelos sem expor PII real</li>
              <li>Educação e estudo de algoritmos de validação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">3. Usos proibidos</h2>
            <p>
              É <strong className="text-foreground">expressamente proibido</strong> usar dados gerados pelo FakeForge para:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Cadastro em serviços reais com identidade falsa</li>
              <li>Fraude bancária, fiscal ou previdenciária</li>
              <li>Tentativa de aplicar golpes</li>
              <li>Falsificação de documentos</li>
              <li>Qualquer atividade que se passe por outra pessoa</li>
              <li>Burla de sistemas de KYC, AML ou compliance</li>
            </ul>
            <p>
              <strong className="text-foreground">Uso indevido constitui crime</strong> previsto nos arts. 297-299 do Código Penal
              brasileiro (falsidade documental e ideológica) e na Lei 14.155/2021 (fraude eletrônica).
              A responsabilidade pelo uso é exclusiva do usuário.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">4. Sobre os dados gerados</h2>
            <p>
              Os dados gerados são <strong className="text-foreground">algoritmicamente válidos</strong> (passam em
              validações como mod-11 e Luhn) mas <strong className="text-foreground">não correspondem a pessoas, empresas,
              contas bancárias ou cartões reais</strong>. Não existe garantia de que algum número gerado não venha
              eventualmente a ser emitido para uma pessoa real no futuro — esse é o ponto: o algoritmo
              é o mesmo, o que é fictício é a alocação.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">5. Limites de uso</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Web (interface):</strong> uso ilimitado, gratuito, sem cadastro</li>
              <li><strong>API plano Free:</strong> 100 chamadas por dia por IP</li>
              <li><strong>API plano Dev (R$29/mês):</strong> 10.000 chamadas/dia, 5 API keys</li>
              <li><strong>API plano Team (R$79/mês):</strong> 100.000 chamadas/dia, 20 API keys</li>
              <li>Cada chamada à API pode gerar até 10.000 itens (parâmetro <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">quantity</code>)</li>
            </ul>
            <p>
              Tentativas de burlar limites (rotação de IPs, múltiplas contas) podem resultar em bloqueio sem aviso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">6. Pagamentos e cancelamento</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Planos pagos cobrados mensalmente via Mercado Pago (cartão, Pix ou boleto)</li>
              <li>Sem fidelidade — cancele a qualquer momento pelo dashboard</li>
              <li>Cancelamento toma efeito ao fim do período já pago</li>
              <li>Não há reembolso de períodos já consumidos</li>
              <li>Reembolso integral em até 7 dias após primeira compra (CDC art. 49)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">7. Disponibilidade</h2>
            <p>
              Buscamos manter o serviço disponível 24/7, mas não garantimos uptime. Não há SLA contratual
              nos planos atuais. Manutenções e indisponibilidades pontuais podem ocorrer sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">8. Propriedade intelectual</h2>
            <p>
              O código-fonte, design, conteúdo do blog e marca FakeForge BR são propriedade do mantenedor.
              Os dados gerados pela ferramenta não têm proteção autoral (são apenas resultado de algoritmo
              determinístico) e podem ser usados livremente para os fins permitidos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">9. Limitação de responsabilidade</h2>
            <p>
              O FakeForge é fornecido &ldquo;como está&rdquo;. Não nos responsabilizamos por:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Uso indevido pelos usuários</li>
              <li>Lucros cessantes ou danos indiretos</li>
              <li>Indisponibilidades de serviço</li>
              <li>Conteúdo de sites de terceiros linkados (parceiros, afiliados)</li>
            </ul>
            <p>
              Nossa responsabilidade total é limitada ao valor pago pelo usuário nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">10. Mudanças</h2>
            <p>
              Estes termos podem ser atualizados. Mudanças significativas serão comunicadas por email
              a usuários ativos e destacadas nesta página por 30 dias. Continuar usando o serviço
              após atualizações implica aceite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">11. Lei aplicável</h2>
            <p>
              Estes termos são regidos pela legislação brasileira. Foro: comarca de Curitiba/PR.
              Disputas são preferencialmente resolvidas por mediação antes de qualquer ação judicial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">12. Contato</h2>
            <p>
              Dúvidas sobre estes termos: <Link href="/contato" className="text-primary hover:underline">página de contato</Link>.
            </p>
          </section>
        </div>
      </article>

      <BreadcrumbSchema items={[
        { name: "Início", url: "/" },
        { name: "Termos", url: "/termos" },
      ]} />
    </PageShell>
  );
}
