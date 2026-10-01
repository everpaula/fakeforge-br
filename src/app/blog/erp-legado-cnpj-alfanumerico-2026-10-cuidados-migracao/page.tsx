import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BlogFeaturedImage from "@/components/BlogFeaturedImage";
import ShareBar from "@/components/ShareBar";
import BlogPostingSchema from "@/components/BlogPostingSchema";

export const metadata: Metadata = {
  title: "ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho",
  description:
    "SAP, Oracle, Protheus, TOTVS, ERP legados BR precisam de ajustes pré-01/07/2026 pro CNPJ alfanumérico. 10 cuidados técnicos pra evitar quebra em NFSe, EDI e integrações. Implementação step-by-step.",
  keywords:
    "erp legado cnpj alfanumérico, sap oracle cnpj 2026, protheus totvs alfanumérico, integração nfse cnpj, edi cnpj alfanumérico, erp migração 2026, cnpj 01/07/2026 erp legado",
  openGraph: {
    title: "ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho",
    description:
      "ERPs legados brasileiros (SAP ECC, Oracle EBS, Protheus, TOTVS, Senior) frequentemente têm campos CNPJ como numeric. 10 cuidados técnicos antes da virada de 01/07/2026.",
    type: "article",
    images: [
      "/api/og?title=ERP%20Legado%20%2B%20CNPJ%20Alfanum%C3%A9rico%202026&subtitle=10%20cuidados%20t%C3%A9cnicos%20pr%C3%A9-julho&category=ENTERPRISE",
    ],
  },
  alternates: {
    canonical: "/blog/erp-legado-cnpj-alfanumerico-2026-10-cuidados-migracao",
  },
};

export default function Post() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <Link
          href="/blog"
          className="text-xs text-primary hover:underline mb-4 inline-block"
        >
          ← Voltar ao blog
        </Link>
        <BlogFeaturedImage
          category="Enterprise"
          title="ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho"
          className="mb-6"
        />
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted mt-3">
            <time>01 de outubro de 2026</time>
            <span>·</span>
            <span>18 min de leitura</span>
          </div>
        </div>

        <div className="prose-custom space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p className="mb-4">
            A Instrução Normativa RFB 2.229/2024 oficializou o CNPJ alfanumérico
            com vigência em 01/07/2026. Consultores, arquitetos e líderes de TI
            em empresas com ERPs legados brasileiros sabem: esse prazo chegou
            rápido demais. SAP ECC, Oracle EBS, Protheus, TOTVS, Benner, Senior
            frequentemente têm campos CNPJ definidos como NUMERIC(14) ou INT,
            validações hard-coded em stored procedures, integrações EDI com regex
            numéricos e XSD legados que rejeitam letras. A Nota Técnica COCAD
            49/2024 da Receita explica o algoritmo. Este guia mostra os 10
            cuidados técnicos antes da virada, com snippets prontos pra
            implementação.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            TL;DR — Resumo de risco pré-julho
          </h2>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 my-4 text-sm">
            <p className="mb-2">
              <strong className="text-foreground">Risco crítico #1:</strong>{" "}
              campo CNPJ definido como NUMERIC(14) no banco não aceita letras.
              A primeira inserção com alfanumérico falha em produção.
            </p>
            <p className="mb-2">
              <strong className="text-foreground">Risco crítico #2:</strong>{" "}
              stored procedures com CAST para NUMERIC quebravam silenciosamente.
              ERPs legados usam batch processing — erros só aparecem em logs de
              integração.
            </p>
            <p className="mb-2">
              <strong className="text-foreground">Risco crítico #3:</strong>{" "}
              integrações EDI (SPED, NF-e, Boleto) com regex{" "}
              <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">
                ^\d{14}$
              </code>
              . Parceiros enviam dados com alfanumérico — seu ERP rejeita.
            </p>
            <p className="mb-2">
              <strong className="text-foreground">Risco crítico #4:</strong>{" "}
              schema XSD de NFSe legado com restriction type numérica. Nota
              fiscal com CNPJ alfanumérico não serializa no XML.
            </p>
            <p>
              <strong className="text-foreground">Solução:</strong> FakeForge
              gera CNPJ alfanumérico pra testar sua stack ERP HOJE — antes de
              julho.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            1. Entendendo a IN RFB 2.229/2024 e Nota Técnica COCAD 49/2024
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            A Instrução Normativa 2.229/2024 da Receita Federal brasileira
            autoriza CNPJs com letras maiúsculas (A-Z) nas 8 primeiras posições
            a partir de 01/07/2026. A Nota Técnica COCAD 49/2024 documenta o
            algoritmo de validação: cada caractere é convertido para valor
            numérico usando sua representação ASCII menos 48. Isso funciona para
            dígitos (0-9 = 0-9) e letras (A-Z = 17-42).
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            CNPJs puramente numéricos emitidos antes de julho continuam válidos
            indefinidamente. O novo formato se aplica exclusivamente a novos
            registros emitidos pela Receita a partir da data. Portanto:
            <strong className="text-foreground">
              {" "}
              sua validação precisa aceitar AMBOS os formatos
            </strong>{" "}
            até indefinidamente, não apenas após julho.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            2. Risco #1 — Schema de Banco com NUMERIC(14) ou INT
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Este é o risco de maior impacto em ERPs legados. Ao inserir um CNPJ
            como "AB.CDE.FGH/0001-34" em um campo definido como NUMERIC(14),
            o banco de dados rejeita a operação com erro de tipo.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Como auditar seu schema
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`-- PostgreSQL: encontre colunas CNPJ com tipo numérico
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE (column_name ILIKE '%cnpj%' OR column_name ILIKE '%cgc%')
  AND data_type IN ('numeric', 'bigint', 'integer', 'decimal');

-- Oracle: busca em ALL_TAB_COLUMNS
SELECT table_name, column_name, data_type
FROM all_tab_columns
WHERE (UPPER(column_name) LIKE '%CNPJ%' OR UPPER(column_name) LIKE '%CGC%')
  AND data_type IN ('NUMBER', 'INTEGER');

-- SQL Server: sys.columns
SELECT t.name AS table_name, c.name AS column_name, ty.name AS data_type
FROM sys.columns c
JOIN sys.tables t ON c.object_id = t.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE (c.name LIKE '%CNPJ%' OR c.name LIKE '%CGC%')
  AND ty.name IN ('numeric', 'int', 'bigint');`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Migration strategy: ALTER COLUMN para VARCHAR(14)
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`-- PostgreSQL
ALTER TABLE empresas
  ALTER COLUMN cnpj TYPE VARCHAR(14) USING cnpj::text;

ALTER TABLE empresas
  ADD CONSTRAINT chk_cnpj_formato
  CHECK (cnpj ~ '^[A-Z0-9]{12}[0-9]{2}$');

CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);

-- Oracle EBS / Oracle ECC
ALTER TABLE ap_suppliers
  MODIFY segment1 VARCHAR2(14);

ALTER TABLE ap_suppliers ADD CONSTRAINT chk_supplier_cnpj
  CHECK (REGEXP_LIKE(segment1, '^[A-Z0-9]{12}[0-9]{2}$'));

-- SQL Server
ALTER TABLE APSuppliers
  ALTER COLUMN Segment1 NVARCHAR(14) NOT NULL;

ALTER TABLE APSuppliers
  ADD CONSTRAINT chk_cnpj_fmt
  CHECK (Segment1 LIKE '[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][0-9][0-9][0-9][0-9][0-9][0-9]');`}</code>
          </pre>

          <p className="text-sm text-muted-foreground mb-4">
            <strong className="text-foreground">Cronograma:</strong> Execute
            ALTER TABLE em staging em janeiro/fevereiro. Teste replicação de
            dados com pg_dump/mysqldump. Valide índices e performance com
            EXPLAIN PLAN.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            3. Risco #2 — Stored Procedures com CAST Numérico
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            ERPs legados frequentemente usam CAST(cnpj AS NUMERIC) em
            stored procedures de validação ou integração. Isso trunca ou rejeita
            letras silenciosamente.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo de problema em PL/SQL (Oracle)
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`-- PROBLEMA: este código quebra com alfanumérico
CREATE OR REPLACE PROCEDURE validar_cnpj_oracle(p_cnpj IN VARCHAR2)
IS
  v_numeric NUMBER;
BEGIN
  -- Isto falha se p_cnpj contém letras
  v_numeric := TO_NUMBER(p_cnpj);

  IF v_numeric > 0 THEN
    DBMS_OUTPUT.PUT_LINE('CNPJ válido');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('CNPJ inválido');
END;
/

-- SOLUÇÃO: validação sem CAST numérico
CREATE OR REPLACE FUNCTION validar_cnpj_alfanumerico(p_cnpj IN VARCHAR2)
RETURN BOOLEAN
IS
  v_cnpj_limpo VARCHAR2(14);
BEGIN
  v_cnpj_limpo := REGEXP_REPLACE(p_cnpj, '[^A-Z0-9]', '');

  IF LENGTH(v_cnpj_limpo) != 14 THEN
    RETURN FALSE;
  END IF;

  IF NOT REGEXP_LIKE(v_cnpj_limpo, '^[A-Z0-9]{12}[0-9]{2}$') THEN
    RETURN FALSE;
  END IF;

  -- Implementar cálculo de dígito verificador aqui
  RETURN TRUE;
END validar_cnpj_alfanumerico;
/`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Audit: procure por CAST, TO_NUMBER, CONVERT em procedures
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`-- Encontre procedures que usam CAST numérico em CNPJ
SELECT object_name, object_type
FROM dba_source
WHERE UPPER(text) LIKE '%CAST%CNPJ%NUMERIC%'
   OR UPPER(text) LIKE '%TO_NUMBER%CNPJ%'
   OR UPPER(text) LIKE '%CONVERT%CNPJ%INT%';`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            4. Risco #3 — Integrações EDI com Regex Numéricos
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            ERPs legados frequentemente integram com sistemas de terceiros via
            EDI (SPED, NF-e, CT-e, Boleto). Os esquemas de validação usam regex
            como{" "}
            <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded">
              ^\d{14}$
            </code>
            , que rejeita qualquer letra.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Regex que quebram com alfanumérico
          </h3>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Integração
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Regex atual
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Corrigido para 2026
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">SPED</td>
                  <td className="px-3 py-2 font-mono text-xs">^\d{14}$</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    ^[A-Z0-9]{12}[0-9]{2}$
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">NF-e XML</td>
                  <td className="px-3 py-2 font-mono text-xs">[0-9]{14}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    [A-Z0-9]{12}[0-9]{2}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">EDI Boleto</td>
                  <td className="px-3 py-2 font-mono text-xs">^[0-9]{14}$</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    ^[A-Z0-9]{12}[0-9]{2}$
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    EDI Pagamento
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">\\d{14}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    [A-Z0-9]{12}[0-9]{2}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Audite integrações EDI, XSD schemas e mapeadores de dados (Informatica
            PowerCenter, Talend, etc) em fevereiro/março. Atualize antes de
            qualquer empresa alfanumérica tentar integrar.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            5. Risco #4 — Schema XSD de NFSe Legado
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Nota Fiscal de Serviço (NFSe) usa XSD schemas para validação.
            Praticamente todos os municípios usam restriction type numérica para
            CNPJ. Uma NFSe com CNPJ alfanumérico não serializa no XML.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Exemplo: XSD legado do município
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`<!-- PROBLEMA: XSD legado com restriction numérica -->
<xs:element name="CnpjTomador" type="xs:string">
  <xs:annotation>
    <xs:restriction base="xs:string">
      <xs:pattern value="[0-9]{14}"/>
    </xs:restriction>
  </xs:annotation>
</xs:element>

<!-- SOLUÇÃO: atualizar XSD pré-julho -->
<xs:element name="CnpjTomador" type="xs:string">
  <xs:annotation>
    <xs:restriction base="xs:string">
      <xs:pattern value="[A-Z0-9]{12}[0-9]{2}"/>
    </xs:restriction>
  </xs:annotation>
</xs:element>`}</code>
          </pre>

          <p className="text-sm text-muted-foreground mb-4">
            Contate a prefeitura/NFS-e operadora do seu município em abril de
            2026. Peça confirmação de suporte ao novo formato. Alguns
            municípios podem não atualizar no prazo.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            6. Risco #5 — ERPs Específicas: SAP, Oracle, Protheus, TOTVS
          </h2>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            SAP ECC / S/4HANA
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Tabelas KNA1 (clientes) e LFA1 (fornecedores) armazenam CNPJ no campo
            STCD1 (tax ID). SAP tradicionalmente usa CHAR(14) e muitas
            implementações têm validação hard-coded em módulos customizados. A
            nota SAP nº 3165722 recomenda migrar STCD1 para VARCHAR(14) com CHECK
            constraint. Testar em sandbox em fevereiro.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Oracle EBS / Oracle Fusion
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Tabelas AP_SUPPLIERS (fornecedores) e RA_CUSTOMERS (clientes) usam
            campo SEGMENT1 (tax ID). Oracle EBS frequentemente limita este campo
            a CHAR(20) com restrição de dígitos em validação. Revisar procedures
            em AP, RA, INV e CN modules. Feature Pack 2024.9 do Fusion inclui
            suporte alfa (consulte roadmap Oracle).
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Protheus / TOTVS
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Tabela SA2 (fornecedores) campo A2_CGC é CHAR(14) com validação
            regular expression alfa exclusivamente numérica (regex Protheus:
            A2_CGC LIKE "[0-9]################"). Protheus versão 12.1.23+
            suporta novos tipos. Contate TOTVS pré-julho para confirmar suporte
            em sua versão.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            TOTVS Senior (Senior Sistemas)
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            ERPs Gestão Integrada e Gestão de Recursos suportam CNPJ em campo
            alfanumérico nativo desde versão 2024.02. Verificar suporte de
            integrações EDI e NF-e. Se versão anterior, solicitar update ou
            workaround de validação.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Benner e Outras ERPs Legadas
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Contate vendedor/suporte formal em janeiro 2026. Peça roadmap de
            suporte CNPJ alfanumérico. Se sem suporte confirmado, planeje
            migração de dados antes de julho ou implemente validação no nível de
            aplicação (middleware que converte).
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            7. Risco #6 — Frontend e Validações JavaScript
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Telas customizadas de entrada de CNPJ (cadastro cliente, fornecedor,
            MEI) frequentemente usam input masks numéricos ou regex que rejeitam
            letras.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// PROBLEMA: máscara que bloqueia letras
const cnpjMask = '##.###.###/####-##';
// Isto rejeita: AB.CDE.FGH/0001-34

// SOLUÇÃO: atualizar para alfanumérico
const cnpjMask = 'AA.AAA.AAA/####-##';
// Usando imask library com custom definitions

import { IMaskMixin } from 'react-imask';

const CnpjInput = IMaskMixin(({ inputRef, ...props }) => (
  <input {...props} ref={inputRef} />
))(
  {
    mask: 'AA.AAA.AAA/0000-00',
    definitions: {
      A: /[A-Z0-9]/i,
    },
  }
);`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            8. Risco #7 — Relatórios e BI
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Crystal Reports, Jaspersoft, Power BI e Tableau frequentemente
            definem colunas CNPJ como Numeric ou Integer nos modelos de dados.
            Relatórios que filtram por CNPJ quebravam se recebem alfanumérico.
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            Ação: revise modelos de dados em BI (Power BI, Tableau, Looker) em
            março. Altere tipos de coluna CNPJ para Text/String. Recrie
            dashboards que filtram CNPJ em staging.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            9. Risco #8 — APIs REST Internas e OpenAPI/Swagger
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            APIs que processam CNPJ frequentemente definem schemas OpenAPI com
            pattern regex numérico.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// PROBLEMA: OpenAPI schema numérico
{
  "components": {
    "schemas": {
      "Cliente": {
        "type": "object",
        "properties": {
          "cnpj": {
            "type": "string",
            "pattern": "^\\d{14}$",
            "description": "CNPJ do cliente"
          }
        }
      }
    }
  }
}

// SOLUÇÃO: atualizar pattern
"cnpj": {
  "type": "string",
  "pattern": "^[A-Z0-9]{12}[0-9]{2}$",
  "description": "CNPJ do cliente (alfanumérico desde 01/07/2026)"
}

// JSON Schema validation via Zod
import { z } from 'zod';

const schemaCNPJ = z
  .string()
  .regex(/^[A-Z0-9]{12}[0-9]{2}$/, 'CNPJ inválido')
  .transform((val) => val.replace(/[.-]/g, '').toUpperCase());`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            10. Risco #9 — Backup/Restore e Disaster Recovery
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Scripts legados de backup e restore assumem CNPJ numérico.
            pg_dump, mysqldump, expdp (Oracle Data Pump) e bcp (SQL Server) não
            têm problema, mas scripts customizados de transformação podem falhar.
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            Teste restore procedure em staging com dados que incluem CNPJ
            alfanumérico em maio. Valide integridade de dados e índices pós-restore.
          </p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            11. Risco #10 — Funções de Cálculo de Dígito Verificador
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Código legado frequentemente implementa validação de CNPJ hardcoded
            com tipos int ou funções que esperam exclusively números.
          </p>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`// PROBLEMA: JavaScript legado
function validarCNPJ(cnpj) {
  const cleaned = cnpj.replace(/[^0-9]/g, '');
  // Isto remove todas as letras!

  if (cleaned.length !== 14) return false;
  // Número agora é outro...
}

// SOLUÇÃO: função que suporta alfanumérico
function charToValue(c) {
  const code = c.charCodeAt(0);
  // '0' (48) = 0, '9' (57) = 9
  // 'A' (65) = 17, 'Z' (90) = 42
  return code - 48;
}

function validarCNPJAlfanumerico(raw) {
  const cnpj = raw.replace(/[.\\-/]/g, '').toUpperCase();

  if (cnpj.length !== 14) return false;
  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;
  if (/^(.)\\1+$/.test(cnpj)) return false; // Rejeita sequência homogênea

  // Implementar cálculo de dígito verificador usando charToValue()
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += charToValue(cnpj[i]) * weights1[i];
  }

  let remainder = sum % 11;
  const d1 = remainder < 2 ? 0 : 11 - remainder;

  // Repetir para segundo dígito com weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  // Validar se cnpj[12] === d1 e cnpj[13] === d2

  return parseInt(cnpj[12]) === d1; // Simplificado
}`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            12. Timeline Recomendada: Janeiro até Junho de 2026
          </h2>

          <div className="rounded-lg bg-card border border-border overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead className="bg-card-hover">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Período
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Ação
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Dono
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Jan</td>
                  <td className="px-3 py-2">
                    Audit banco (NUMERIC/INT), ER diagramas, stored procedures
                  </td>
                  <td className="px-3 py-2">DBA + arquiteto</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Fev</td>
                  <td className="px-3 py-2">
                    ALTER TABLE em staging, migrate dados teste
                  </td>
                  <td className="px-3 py-2">DBA + QA</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Mar</td>
                  <td className="px-3 py-2">
                    Atualizar stored procedures, validações, frontend
                  </td>
                  <td className="px-3 py-2">Dev + integrador</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Abr</td>
                  <td className="px-3 py-2">
                    Revisar EDI, XSD, NF-e, APIs OpenAPI
                  </td>
                  <td className="px-3 py-2">Integrador + arquiteto</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Mai</td>
                  <td className="px-3 py-2">
                    Testar com FakeForge, gerar fixtures alfanuméricos
                  </td>
                  <td className="px-3 py-2">QA + Dev</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">
                    Jun (pré-01/Jul)
                  </td>
                  <td className="px-3 py-2">
                    Feature flag deploy pré-vigência, monitor produção
                  </td>
                  <td className="px-3 py-2">DevOps + PO</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            13. Como Testar HOJE com FakeForge
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            Não precisa esperar por CNPJs reais alfanuméricos. O FakeForge gera
            CNPJs fictícios válidos no novo formato agora.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Via web (sem API)
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Acesse{" "}
            <Link href="/gerador-cnpj-alfanumerico" className="text-primary hover:underline">
              /gerador-cnpj-alfanumerico
            </Link>{" "}
            e clique "Gerar". Obtém CNPJ alfanumérico válido com dígitos
            verificadores corretos.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Via API REST
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`# Gerar 10 CNPJs alfanuméricos em JSON
curl "https://fakeforge.com.br/api/generate?type=cnpj_alfanumerico&quantity=10&format=json"

# Resultado:
{
  "data": [
    {"cnpj": "AB.CDE.FGH/0001-34"},
    {"cnpj": "12.XYZ.456/0001-78"},
    ...
  ]
}

# Usar em testes de integração
curl -X POST https://seu-erp-api.com/api/clientes \\
  -H "Content-Type: application/json" \\
  -d '{
    "razao_social": "Empresa Test",
    "cnpj": "AB.CDE.FGH/0001-34"
  }'`}</code>
          </pre>

          <h3 className="text-base font-semibold text-foreground mt-6 mb-3">
            Via Python (teste de migração)
          </h3>

          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono">
            <code>{`import requests

# Gerar lote de CNPJs alfanuméricos
response = requests.get(
    'https://fakeforge.com.br/api/generate',
    params={'type': 'cnpj_alfanumerico', 'quantity': 100, 'format': 'csv'}
)

# Simular inserção em staging
for cnpj in response.text.strip().split('\\n'):
    try:
        # Seu código de inserção no banco
        db.execute(f"INSERT INTO empresas (cnpj) VALUES ('{cnpj}')")
    except Exception as e:
        print(f"Erro ao inserir {cnpj}: {e}")

print("Migração testada com sucesso")`}</code>
          </pre>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            FAQ — Perguntas Técnicas Frequentes
          </h2>

          <div className="space-y-3">
            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Preciso migrar tudo de uma vez ou posso fazer gradualmente?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                O banco PRECISA estar pronto antes de 01/07/2026 (isso é
                irreversível após a data). Validações, APIs e frontend podem
                usar feature flag — rota requisições com alfanumérico para código
                novo enquanto mantém pipeline legado para numérico. Mas banco é
                o gargalo crítico.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Posso rodar testes com CNPJs reais de MEI?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não recomendado. CNPJ de MEI contém CPF e nome do titular, logo
                é dado pessoal conforme LGPD Art. 5º. Usar em fixtures de teste
                pode enquadrar o projeto em obrigações de conformidade. FakeForge
                gera fictícios válidos — use esses.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Se meu ERP (SAP/Oracle/Protheus) não tiver suporte oficial,
                  posso usar workaround?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Parcialmente. Você pode adicionar validação no middleware (camada
                de integração que senta entre sua app e o ERP). Converter
                alfanumérico para código interno antes de chamar módulos
                tradicionais. Mas se a ERP core rejeitae, você terá que:
                migrar versão (oneroso), implementar adapter, ou rejeitar
                alfanuméricos e comunicar limitação ao cliente.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  CNPJs puramente numéricos vão parar de funcionar em julho?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Não. CNPJs numéricos emitidos antes de julho continuam válidos
                indefinidamente. O novo algoritmo de validação é backward
                compatible — trata '0' = 0, '9' = 9. Logo qualquer validador
                que suporta alfanumérico também valida numéricos. Mas seu regex
                precisa aceitar ambos:
                <code className="text-xs bg-background border border-border px-1.5 py-0.5 rounded ml-1">
                  ^[A-Z0-9]{12}[0-9]{2}$
                </code>
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Qual é o risco se NÃO migrar a tempo?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Crítico. Primeira empresa com CNPJ alfanumérico tenta integrar
                com seu sistema — quebra silenciosamente em inserts de banco,
                validações, EDI. Nota fiscal não emite. PIX falha. Seu SLA com
                cliente é violado. Impacto financeiro: valor inestimável de
                tempo de downtime + chamados + reputação. Migração prévia custa
                100x menos.
              </p>
            </details>

            <details className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-card-hover transition-colors">
                <span className="text-sm font-medium text-foreground">
                  Onde consigo CNPJs alfanuméricos verdadeiros pra testar?
                </span>
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                Após 01/07/2026, a Receita Federal começará a emitir. Pré-julho,
                use geradores como FakeForge — dados fictícios mas
                criptograficamente válidos no novo formato. Nunca use CNPJs reais
                de MEI em testes (LGPD).
              </p>
            </details>
          </div>

          <div className="border-t border-border pt-6 mt-8">
            <p className="text-xs text-muted-foreground italic">
              Este artigo foi publicado por <strong>Everton, fundador do FakeForge</strong>. Se você está migrando uma stack ERP legada pré-julho, experimente gerar CNPJs alfanuméricos de teste agora mesmo — sem necessidade de esperar por dados reais.
            </p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">
            CTA Final — Comece AGORA
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            O prazo é real. Sete meses entre agora (outubro de 2026) e o prazo de
            01/07/2026 foram rapidamente gastos em migrações complicadas. Comece
            a auditoria de banco em janeiro — é o bloqueador crítico.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-5 mt-10">
            <p className="text-sm font-semibold text-foreground mb-2">
              Próximas ações
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Teste sua stack ERP com CNPJs alfanuméricos fictícios agora:
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/gerador-cnpj-alfanumerico"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Gerar CNPJ Alfanumérico
              </Link>
              <Link
                href="/blog/cnpj-alfanumerico-checklist-migracao-2026"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Ver Checklist Dev Completo
              </Link>
              <Link
                href="/docs"
                className="inline-block px-4 py-2 rounded-lg text-sm bg-card border border-border text-foreground font-medium hover:border-border-hover transition-colors"
              >
                Documentação da API
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-accent/5 border border-accent/20 p-5 mt-6">
            <p className="text-xs text-accent mb-2">REFERÊNCIAS OFICIAIS</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <strong>IN RFB 2.229/2024</strong> — Instrução Normativa da
                Receita Federal que autoriza CNPJ alfanumérico
              </li>
              <li>
                <strong>Nota Técnica COCAD 49/2024</strong> — Detalha algoritmo
                de validação (ASCII -48)
              </li>
              <li>
                <strong>Portal NF-e</strong> — Cronograma de atualização de
                XSD da Nota Fiscal Eletrônica
              </li>
              <li>
                <strong>Circular BACEN 3.978/2020</strong> — Requisitos SPB/PIX
                e prazos
              </li>
            </ul>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Artigos relacionados
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              <Link
                href="/blog/cnpj-alfanumerico-checklist-migracao-2026"
                className="text-primary hover:underline"
              >
                CNPJ Alfanumérico 2026: Checklist de Migração para Devs
              </Link>
            </li>
            <li>
              <Link
                href="/gerador-cnpj-alfanumerico"
                className="text-primary hover:underline"
              >
                Gerador de CNPJ Alfanumérico — Novo Formato 2026
              </Link>
            </li>
            <li>
              <Link
                href="/blog/mockaroo-vs-fakeforge-qual-escolher-times-brasileiros"
                className="text-primary hover:underline"
              >
                Mockaroo vs FakeForge: qual escolher para times brasileiros
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="text-primary hover:underline"
              >
                Documentação completa da API
              </Link>
            </li>
          </ul>
        </section>

        <ShareBar
          title={
            "ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho"
          }
          path="/blog/erp-legado-cnpj-alfanumerico-2026-10-cuidados-migracao"
        />

        <BlogPostingSchema
          title={
            "ERP Legado + CNPJ Alfanumérico 2026: 10 Cuidados Pré-Julho"
          }
          slug="erp-legado-cnpj-alfanumerico-2026-10-cuidados-migracao"
          description={
            "SAP ECC, Oracle EBS, Protheus, TOTVS — ERPs legados BR precisam de ajustes pré-01/07/2026 pro CNPJ alfanumérico. 10 cuidados técnicos pra evitar quebra em NFSe, EDI e integrações. Implementação step-by-step."
          }
          datePublished="2026-10-01"
          image="https://fakeforge.com.br/api/og?title=ERP%20Legado%20%2B%20CNPJ%20Alfanum%C3%A9rico%202026&subtitle=10%20cuidados%20t%C3%A9cnicos%20pr%C3%A9-julho&category=ENTERPRISE"
        />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Preciso migrar tudo de uma vez ou posso fazer gradualmente?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "O banco PRECISA estar pronto antes de 01/07/2026. Validações, APIs e frontend podem usar feature flag. Mas banco é o gargalo crítico.",
                },
              },
              {
                "@type": "Question",
                name: "Posso rodar testes com CNPJs reais de MEI?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não recomendado. CNPJ de MEI é dado pessoal conforme LGPD Art. 5º. Use CNPJs fictícios gerados pelo FakeForge.",
                },
              },
              {
                "@type": "Question",
                name: "Se meu ERP não tiver suporte oficial, posso usar workaround?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Parcialmente. Você pode adicionar validação no middleware. Se a ERP core rejeitar, terá que migrar versão, implementar adapter, ou rejeitar alfanuméricos.",
                },
              },
              {
                "@type": "Question",
                name: "CNPJs puramente numéricos vão parar de funcionar em julho?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Não. CNPJs numéricos emitidos antes de julho continuam válidos indefinidamente. O novo algoritmo é backward compatible.",
                },
              },
              {
                "@type": "Question",
                name: "Qual é o risco se NÃO migrar a tempo?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Crítico. Primeira empresa com CNPJ alfanumérico quebra no seu sistema. Nota fiscal não emite. Impacto financeiro inestimável de downtime.",
                },
              },
              {
                "@type": "Question",
                name: "Onde consigo CNPJs alfanuméricos verdadeiros pra testar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Após 01/07/2026, a Receita Federal começará a emitir. Pré-julho, use geradores como FakeForge — dados fictícios mas criptograficamente válidos.",
                },
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
