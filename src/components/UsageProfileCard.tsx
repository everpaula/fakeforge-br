"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

interface TopType {
  data_type: string;
  calls: number;
  items: number;
}

interface Profile {
  authenticated: boolean;
  has_signal: boolean;
  profile_tag: string;
  total_calls_30d: number;
  total_items_30d: number;
  top_types: TopType[];
}

/**
 * Card contextual de upsell que renderiza personalizando copy baseado no
 * perfil de uso real do user nos ultimos 30d. Diferente do hero upsell
 * generico, esse card DIZ NUMEROS ESPECIFICOS do comportamento do user.
 *
 * Skip se: nao autenticado, plano != free, ou has_signal=false (<5 chamadas
 * no mes ainda nao gera sinal suficiente pra personalizar).
 *
 * Renderiza no /dashboard entre QuotaMeter e Compare Plans.
 * Sprint 1 Task 3 - Movimento cirurgico Chief of Staff 13/09.
 */

const DATA_TYPE_LABEL: Record<string, string> = {
  cpf: "CPFs",
  cnpj: "CNPJs",
  cnpjAlfa: "CNPJs alfanuméricos",
  cnh: "CNHs",
  cin: "CINs",
  rg: "RGs",
  pis: "PIS/PASEPs",
  renavam: "RENAVAMs",
  tituloEleitor: "títulos de eleitor",
  placa: "placas Mercosul",
  placaAntiga: "placas antigas",
  cep: "CEPs",
  address: "endereços",
  person: "pessoas completas",
  fullName: "nomes completos",
  email: "emails",
  phone: "celulares",
  landline: "telefones fixos",
  bankAccount: "contas bancárias",
  pixKey: "chaves PIX",
  creditCard: "cartões de crédito",
  company: "empresas",
  "preset:customer": "customers completos (preset)",
  "preset:employee": "employees (preset)",
  "preset:company": "companies (preset)",
  "preset:ecommerce_order": "orders de e-commerce (preset)",
};

function labelFor(dataType: string): string {
  return DATA_TYPE_LABEL[dataType] || dataType;
}

function pickCopy(profile: Profile): { headline: string; sub: string; ref: string } {
  const { profile_tag, total_calls_30d, total_items_30d, top_types } = profile;
  const top = top_types[0];
  const topLabel = top ? labelFor(top.data_type) : "dados";
  const topItems = top ? top.items : total_items_30d;

  if (profile_tag === "preset_user") {
    return {
      headline: `Você já usa presets. No Dev libera todos os 5.`,
      sub: `Nos últimos 30 dias você gerou ${total_calls_30d} chamadas com preset. Dev inclui customer, employee, company, ecommerce_order e contact_list sem limite - 10.000 items por chamada.`,
      ref: "profile_preset",
    };
  }

  if (profile_tag.startsWith("heavy_") && top) {
    return {
      headline: `Você gerou ${topItems.toLocaleString()} ${topLabel} em 30 dias.`,
      sub: `Isso é ${top.calls} chamadas concentradas em 1 tipo. No plano Dev cabe em 1 única chamada (10.000 items) e você libera 10.000 chamadas/dia pra escalar sem quebrar CI.`,
      ref: "profile_heavy",
    };
  }

  if (profile_tag === "diverse") {
    const typesLabel = top_types.slice(0, 3).map((t) => labelFor(t.data_type)).join(", ");
    return {
      headline: `Seu uso é diverso: ${typesLabel}.`,
      sub: `${total_calls_30d} chamadas em ${top_types.length} tipos diferentes nos últimos 30 dias. Perfil de dev que integra vários endpoints — Dev libera preset customer que combina os 3 tipos que você mais usa em 1 objeto correlacionado.`,
      ref: "profile_diverse",
    };
  }

  // Occasional (5-15 chamadas, sem concentração clara)
  return {
    headline: `${total_items_30d.toLocaleString()} items gerados esse mês.`,
    sub: `Isso já mostra uso recorrente. Se você começar a integrar em CI/CD, Dev evita bloqueio na primeira semana - 10.000 chamadas/dia cobre pipelines grandes.`,
    ref: "profile_occasional",
  };
}

export default function UsageProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/user/usage-profile");
        const data = await res.json();
        if (alive) {
          setProfile(data);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!loading && profile?.has_signal && !tracked) {
      track("usage_profile_card_shown", {
        profile_tag: profile.profile_tag,
        total_calls_30d: profile.total_calls_30d,
      });
      setTracked(true);
    }
  }, [loading, profile, tracked]);

  if (loading || !profile?.authenticated || !profile.has_signal) return null;

  const copy = pickCopy(profile);

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Baseado no seu uso · últimos 30 dias
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground leading-tight">
            {copy.headline}
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {copy.sub}
          </p>

          {/* Mini stats do proprio user - reforca "isso é sobre você" */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>
              <strong className="text-foreground">{profile.total_calls_30d}</strong> chamadas
            </span>
            <span>
              <strong className="text-foreground">{profile.total_items_30d.toLocaleString()}</strong> items
            </span>
            {profile.top_types[0] && (
              <span>
                Mais usado: <strong className="text-foreground">{labelFor(profile.top_types[0].data_type)}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href={`/pricing?plan=dev&ref=${copy.ref}`}
            onClick={() => track("usage_profile_card_clicked", { profile_tag: profile.profile_tag })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
          >
            Assinar Dev · R$29/mês
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
