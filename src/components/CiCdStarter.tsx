"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Props {
  apiKey: string | null;
}

type Platform = "github" | "gitlab" | "circleci";

const PLATFORMS: { value: Platform; label: string; available: boolean }[] = [
  { value: "github", label: "GitHub Actions", available: true },
  { value: "gitlab", label: "GitLab CI", available: false },
  { value: "circleci", label: "CircleCI", available: false },
];

/**
 * Gera snippet pronto pra colar no CI/CD do user — transforma uso pontual
 * em recurring (cada PR dispara chamada à API). Insight 07/out: avg 1.1 dias
 * distintos por user ativado. Automação via CI é o unico loop estrutural.
 */
export default function CiCdStarter({ apiKey }: Props) {
  const [platform, setPlatform] = useState<Platform>("github");
  const [copied, setCopied] = useState(false);
  const keyToUse = apiKey || "ff_sua_key_aqui";

  const githubYaml = `# .github/workflows/seed-staging-data.yml
# Gera massa de dados brasileiros validos a cada PR usando FakeForge.
# Setup: adicione o secret FAKEFORGE_API_KEY em Settings > Secrets > Actions.

name: Seed Staging Data

on:
  pull_request:
    types: [opened, synchronize]
  workflow_dispatch:

jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch 100 synthetic Brazilian customers
        run: |
          curl -sS -H "X-API-Key: \${{ secrets.FAKEFORGE_API_KEY }}" \\
            "https://fakeforge.com.br/api/generate?preset=customer&quantity=100" \\
            -o staging-customers.json

      - name: Upload as PR artifact
        uses: actions/upload-artifact@v4
        with:
          name: staging-data
          path: staging-customers.json
          retention-days: 7
`;

  const snippet = platform === "github" ? githubYaml : "";
  const platformAvailable = PLATFORMS.find((p) => p.value === platform)?.available;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    track("cicd_snippet_copied", { platform });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl bg-accent/5 border border-accent/20 p-5">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Automatize no CI/CD
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold">novo</span>
          </h3>
          <p className="text-[11px] text-muted mt-1">
            Cole no seu repo pra regenerar dados brasileiros válidos a cada PR. Zero manutenção depois do setup.
          </p>
        </div>
        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value as Platform);
            track("cicd_platform_switched", { platform: e.target.value });
          }}
          className="text-xs bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value} disabled={!p.available}>
              {p.label}{!p.available ? " (em breve)" : ""}
            </option>
          ))}
        </select>
      </div>

      {!platformAvailable ? (
        <div className="rounded-lg bg-background border border-border p-6 text-center">
          <p className="text-xs text-muted">
            {PLATFORMS.find((p) => p.value === platform)?.label} chega em breve.{" "}
            <button
              onClick={() => {
                track("cicd_platform_requested", { platform });
                alert("Pedido registrado. Vamos priorizar.");
              }}
              className="text-primary hover:underline"
            >
              Avise quando sair
            </button>.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <pre className="rounded-lg bg-background border border-border p-4 font-mono text-[11px] leading-5 overflow-x-auto max-h-80">{snippet}</pre>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                copied ? "bg-success text-white" : "bg-accent text-white hover:bg-accent/80"
              }`}
            >
              {copied ? "Copiado!" : "Copiar YAML"}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold text-foreground">Setup em 3 passos:</p>
            <ol className="text-[11px] text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>
                No seu repo, crie <code className="bg-background border border-border rounded px-1 py-0.5 text-[10px]">.github/workflows/seed-staging-data.yml</code> com o YAML acima.
              </li>
              <li>
                Em <strong>Settings → Secrets and variables → Actions</strong>, adicione secret{" "}
                <code className="bg-background border border-border rounded px-1 py-0.5 text-[10px]">FAKEFORGE_API_KEY</code> com valor:{" "}
                <code className="bg-background border border-border rounded px-1 py-0.5 text-[10px] break-all">{keyToUse}</code>
              </li>
              <li>
                Commit + push. Workflow roda em cada PR gerando massa fresca anexada como artifact.
              </li>
            </ol>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] text-muted leading-relaxed">
              <strong className="text-foreground">Por que automatizar:</strong> cada PR precisa de dados pra testar.
              Scripts manuais quebram. Fixtures congeladas viram outdated. Com FakeForge no CI, você sempre tem dados válidos — CPF mod-11,
              CNPJ 2026 alfanumérico, cartão Luhn — sem commit de dados reais no git (LGPD-safe).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
