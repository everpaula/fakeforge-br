"use client";

import { useMemo, useState } from "react";

type Granularity = "day" | "week" | "month";

interface DailyPoint {
  day: string;
  value: number;
}

interface Props {
  data: DailyPoint[];
  title: string;
  color?: "primary" | "accent" | "success";
  emptyLabel?: string;
}

const COLOR_TEXT = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
} as const;

function isoWeekKey(d: Date): string {
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

function aggregate(daily: DailyPoint[], gran: Granularity): DailyPoint[] {
  if (gran === "day") {
    return [...daily].sort((a, b) => a.day.localeCompare(b.day));
  }
  const buckets = new Map<string, number>();
  for (const { day, value } of daily) {
    const d = new Date(day + "T12:00:00");
    const key = gran === "week" ? isoWeekKey(d) : day.slice(0, 7);
    buckets.set(key, (buckets.get(key) || 0) + value);
  }
  return Array.from(buckets.entries())
    .map(([day, value]) => ({ day, value }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

function formatBucketLabel(day: string, gran: Granularity): string {
  if (gran === "month") {
    const [y, m] = day.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
  }
  const d = new Date(day + "T12:00:00");
  if (gran === "week") {
    return `semana de ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatBucketShort(day: string, gran: Granularity): string {
  if (gran === "month") {
    const [y, m] = day.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("pt-BR", { month: "short" });
  }
  const d = new Date(day + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function TimeSeriesChart({ data, title, color = "primary", emptyLabel = "Sem dados ainda" }: Props) {
  const [gran, setGran] = useState<Granularity>("day");
  const points = useMemo(() => aggregate(data, gran), [data, gran]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const W = 600;
  const H = 220;
  const P = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = W - P.left - P.right;
  const innerH = H - P.top - P.bottom;

  const maxValue = Math.max(1, ...points.map((p) => p.value));
  const niceMax = Math.ceil(maxValue / Math.pow(10, Math.floor(Math.log10(maxValue)))) * Math.pow(10, Math.floor(Math.log10(maxValue)));
  const denom = points.length > 1 ? points.length - 1 : 1;
  const xAt = (i: number) => P.left + (i / denom) * innerW;
  const yAt = (v: number) => P.top + innerH - (v / niceMax) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(2)} ${yAt(p.value).toFixed(2)}`)
    .join(" ");
  const areaPath = points.length
    ? `${linePath} L ${xAt(points.length - 1).toFixed(2)} ${yAt(0).toFixed(2)} L ${xAt(0).toFixed(2)} ${yAt(0).toFixed(2)} Z`
    : "";

  const colorClass = COLOR_TEXT[color];
  const gradId = `chart-grad-${color}-${title.replace(/\s+/g, "")}`;

  const totalInWindow = points.reduce((s, p) => s + p.value, 0);
  const avgInWindow = points.length ? Math.round(totalInWindow / points.length) : 0;

  const xTicks = points.length > 7 ? [0, Math.floor(points.length / 3), Math.floor((points.length / 3) * 2), points.length - 1] : points.map((_, i) => i);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!points.length) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const xPx = xRatio * W - P.left;
    const idx = Math.round((xPx / innerW) * (points.length - 1));
    if (idx >= 0 && idx < points.length) setHoverIdx(idx);
  }

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>
              total: <span className="text-foreground font-medium">{totalInWindow.toLocaleString()}</span>
            </span>
            <span>
              média: <span className="text-foreground font-medium">{avgInWindow.toLocaleString()}</span>
            </span>
          </div>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-background">
            {(["day", "week", "month"] as Granularity[]).map((g) => (
              <button
                key={g}
                onClick={() => setGran(g)}
                className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                  gran === g ? "bg-card text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {g === "day" ? "Dia" : g === "week" ? "Semana" : "Mês"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {points.length === 0 ? (
        <p className="text-xs text-muted text-center py-12">{emptyLabel}</p>
      ) : (
        <div className="p-3" onMouseLeave={() => setHoverIdx(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-auto ${colorClass}`} onMouseMove={handleMouseMove}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            {yTicks.map((t) => (
              <line
                key={t}
                x1={P.left}
                x2={W - P.right}
                y1={P.top + innerH * t}
                y2={P.top + innerH * t}
                stroke="rgb(120 120 130 / 0.25)"
                strokeDasharray={t === 1 ? "0" : "2 3"}
                strokeWidth={t === 1 ? 1 : 0.5}
              />
            ))}

            {yTicks.map((t) => (
              <text
                key={t}
                x={P.left - 8}
                y={P.top + innerH * (1 - t) + 3}
                fontSize={9}
                textAnchor="end"
                fill="rgb(140 140 150)"
              >
                {Math.round(niceMax * t).toLocaleString()}
              </text>
            ))}

            {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {points.map((p, i) => (
              <circle
                key={i}
                cx={xAt(i)}
                cy={yAt(p.value)}
                r={hoverIdx === i ? 4.5 : 2.5}
                fill="currentColor"
              />
            ))}

            {xTicks.map((i) => (
              <text
                key={i}
                x={xAt(i)}
                y={H - 8}
                fontSize={9}
                textAnchor="middle"
                fill="rgb(140 140 150)"
              >
                {formatBucketShort(points[i].day, gran)}
              </text>
            ))}

            {hoverIdx !== null && (
              <g>
                <line
                  x1={xAt(hoverIdx)}
                  x2={xAt(hoverIdx)}
                  y1={P.top}
                  y2={P.top + innerH}
                  stroke="rgb(120 120 130 / 0.4)"
                  strokeDasharray="2 2"
                />
                {(() => {
                  const cx = xAt(hoverIdx);
                  const cy = yAt(points[hoverIdx].value);
                  const tooltipW = 140;
                  const tooltipH = 40;
                  const leftEdge = cx + tooltipW + 8 > W ? cx - tooltipW - 8 : cx + 8;
                  const topEdge = Math.max(P.top, Math.min(cy - tooltipH / 2, P.top + innerH - tooltipH));
                  return (
                    <g transform={`translate(${leftEdge}, ${topEdge})`}>
                      <rect
                        width={tooltipW}
                        height={tooltipH}
                        rx={6}
                        fill="rgb(20 20 25)"
                        stroke="rgb(120 120 130 / 0.4)"
                        strokeWidth={1}
                      />
                      <text x={8} y={15} fontSize={10} fill="rgb(170 170 180)">
                        {formatBucketLabel(points[hoverIdx].day, gran)}
                      </text>
                      <text x={8} y={32} fontSize={13} fill="currentColor" fontWeight={600}>
                        {points[hoverIdx].value.toLocaleString()}
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
