/**
 * Disclaimer discreto pra topo de páginas de gerador que possam gatilhar
 * fraud filter automático (cartão, CPF, CNPJ, bancárias).
 *
 * Motivação (2026-09-22): AdSense rejeitou site com "policy violations"
 * genérico. Palpite forte: robô interpretou "cartão fake / falso" como
 * facilitação de fraude. Este disclaimer contextualiza uso legítimo
 * de forma visível pro crawler (e pro user).
 */

interface Props {
  /** Tipo de dado gerado. Personaliza texto do disclaimer. */
  dataType?: "cartão de crédito" | "CPF" | "CNPJ" | "conta bancária" | "PIX" | "documentos brasileiros";
  className?: string;
}

export default function DevOnlyDisclaimer({ dataType = "documentos brasileiros", className = "" }: Props) {
  return (
    <div
      className={`rounded-lg border border-border/60 bg-card/40 px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground ${className}`}
      role="note"
      aria-label="Aviso de uso"
    >
      <span className="font-semibold text-foreground">Ferramenta para desenvolvedores.</span>{" "}
      Os {dataType} gerados são <strong className="text-foreground">sintéticos e não pertencem a nenhuma pessoa real</strong>.
      Uso restrito a testes de software, seed de banco de dados de desenvolvimento e fixtures de QA.
      Usar em cadastro real ou apresentar como documento verdadeiro configura falsidade ideológica (art. 299 CP).
    </div>
  );
}
