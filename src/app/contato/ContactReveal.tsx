"use client";

import { useState } from "react";

interface Props {
  kind: "contact" | "lgpd" | "press";
}

// Obfuscated emails — assembled at runtime to avoid scraping
const PARTS = {
  contact: ["c", "o", "n", "t", "a", "t", "o"],
  lgpd: ["l", "g", "p", "d"],
  press: ["i", "m", "p", "r", "e", "n", "s", "a"],
};

const DOMAIN = ["fakeforge", ".", "com", ".", "br"];

function reveal(kind: Props["kind"]) {
  return PARTS[kind].join("") + "@" + DOMAIN.join("");
}

export default function ContactReveal({ kind }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = reveal(kind);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
      >
        Mostrar email →
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={`mailto:${email}`}
        className="text-sm font-mono text-primary hover:underline"
      >
        {email}
      </a>
      <button
        onClick={handleCopy}
        className={`text-xs px-2 py-1 rounded transition-colors ${
          copied ? "bg-success text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
