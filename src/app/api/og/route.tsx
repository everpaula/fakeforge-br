import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const NAVY = "#1e40af";
const NAVY_DARK = "#1e3a8a";
const ORANGE = "#f97316";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "FakeForge").slice(0, 120);
  const subtitle = (searchParams.get("subtitle") || "Dados brasileiros válidos para testes").slice(0, 160);
  const category = (searchParams.get("category") || "").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 480,
            height: 480,
            background: `radial-gradient(circle, ${ORANGE}33 0%, transparent 70%)`,
            transform: "translate(40%, -40%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: ORANGE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            FF
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "white", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
              FakeForge
            </span>
            <span style={{ color: ORANGE, fontSize: 18, fontWeight: 600, letterSpacing: 2, marginTop: 4 }}>
              BR
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", marginTop: 24 }}>
          {category && (
            <span
              style={{
                color: ORANGE,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {category}
            </span>
          )}
          <h1
            style={{
              color: "white",
              fontSize: title.length > 60 ? 56 : 68,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "rgba(255, 255, 255, 0.75)",
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.35,
                marginTop: 28,
                maxWidth: 960,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <span style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 22, fontWeight: 500 }}>
            fakeforge.com.br
          </span>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 20 }}>CPF</span>
            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 20 }}>CNPJ</span>
            <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 20 }}>PIX</span>
            <span style={{ color: ORANGE, fontSize: 20, fontWeight: 700 }}>API REST</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
