"use client";

import { useId } from "react";

// Original portfolio artwork restored from f7d9521. Reused, not generated product screenshots.
export type ArtworkItem = { id: string; name: string; label: string; domain: string; palette: { base: string; accent: string; glow: string; stroke: string } };

const artworkCatalog: Record<string, ArtworkItem> = {
  "TaskAI": {
    "id": "taskai",
    "name": "TaskAI",
    "label": "Product",
    "domain": "taskai.cc",
    "palette": {
      "base": "#071a1f",
      "accent": "#2dd4bf",
      "glow": "#155e75",
      "stroke": "#7dd3fc"
    }
  },
  "TickrAPI": {
    "id": "tickrapi",
    "name": "TickrAPI",
    "label": "Product",
    "domain": "tickrapi.com",
    "palette": {
      "base": "#0c1322",
      "accent": "#f59e0b",
      "glow": "#78350f",
      "stroke": "#fcd34d"
    }
  },
  "Pingrly": {
    "id": "pingrly",
    "name": "Pingrly",
    "label": "Product",
    "domain": "pingrly.com",
    "palette": {
      "base": "#111827",
      "accent": "#f59e0b",
      "glow": "#7c2d12",
      "stroke": "#fdba74"
    }
  },
  "FlagTGL": {
    "id": "flagtgl",
    "name": "FlagTGL",
    "label": "Product",
    "domain": "flagtgl.com",
    "palette": {
      "base": "#120d27",
      "accent": "#8b5cf6",
      "glow": "#312e81",
      "stroke": "#c4b5fd"
    }
  },
  "Folioworth": {
    "id": "folioworth",
    "name": "Folioworth",
    "label": "Product",
    "domain": "folioworth.com",
    "palette": {
      "base": "#0f172a",
      "accent": "#22c55e",
      "glow": "#14532d",
      "stroke": "#86efac"
    }
  },
  "anshumanbiswas.com": {
    "id": "blog",
    "name": "anshumanbiswas.com",
    "label": "Product",
    "domain": "anshumanbiswas.com",
    "palette": {
      "base": "#1c1917",
      "accent": "#f97316",
      "glow": "#7c2d12",
      "stroke": "#fdba74"
    }
  },
  "AI Agent Lens": {
    "id": "ai-agent-lens",
    "name": "AI Agent Lens",
    "label": "Product",
    "domain": "aiagentlens.com",
    "palette": {
      "base": "#111827",
      "accent": "#38bdf8",
      "glow": "#0f766e",
      "stroke": "#67e8f9"
    }
  },
  "75 Hard": {
    "id": "75hard",
    "name": "75 Hard",
    "label": "Lifestyle",
    "domain": "75hard.biswas.me",
    "palette": {
      "base": "#1a0b05",
      "accent": "#ff6b35",
      "glow": "#7c2d12",
      "stroke": "#fed7aa"
    }
  },
  "Pool": {
    "id": "pool",
    "name": "Pool",
    "label": "Lifestyle",
    "domain": "pool.biswas.me",
    "palette": {
      "base": "#04141c",
      "accent": "#38bdf8",
      "glow": "#075985",
      "stroke": "#bae6fd"
    }
  },
  "Learn": {
    "id": "learn",
    "name": "Learn",
    "label": "Lifestyle",
    "domain": "learn.biswas.me",
    "palette": {
      "base": "#0f0a1a",
      "accent": "#a78bfa",
      "glow": "#4c1d95",
      "stroke": "#ddd6fe"
    }
  },
  "go-wiki": {
    "id": "go-wiki",
    "name": "go-wiki",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-wiki",
    "palette": {
      "base": "#082f49",
      "accent": "#38bdf8",
      "glow": "#164e63",
      "stroke": "#bae6fd"
    }
  },
  "go-draw": {
    "id": "go-draw",
    "name": "go-draw",
    "label": "Library",
    "domain": "draw.biswas.me",
    "palette": {
      "base": "#172554",
      "accent": "#60a5fa",
      "glow": "#1d4ed8",
      "stroke": "#bfdbfe"
    }
  },
  "go-blog": {
    "id": "go-blog",
    "name": "go-blog",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-blog",
    "palette": {
      "base": "#1a1a2e",
      "accent": "#e94560",
      "glow": "#16213e",
      "stroke": "#fca5a5"
    }
  },
  "go-email": {
    "id": "go-email",
    "name": "go-email",
    "label": "Service",
    "domain": "email.biswas.me",
    "palette": {
      "base": "#0c1222",
      "accent": "#3b82f6",
      "glow": "#1e3a5f",
      "stroke": "#93c5fd"
    }
  },
  "go-backup": {
    "id": "go-backup",
    "name": "go-backup",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-backup",
    "palette": {
      "base": "#1f2937",
      "accent": "#34d399",
      "glow": "#065f46",
      "stroke": "#a7f3d0"
    }
  },
  "go-login": {
    "id": "go-login",
    "name": "go-login",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-login",
    "palette": {
      "base": "#111827",
      "accent": "#f472b6",
      "glow": "#831843",
      "stroke": "#fbcfe8"
    }
  },
  "go-ai": {
    "id": "go-ai",
    "name": "go-ai",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-ai",
    "palette": {
      "base": "#0b1120",
      "accent": "#a78bfa",
      "glow": "#4c1d95",
      "stroke": "#ddd6fe"
    }
  },
  "go-photo": {
    "id": "go-photo",
    "name": "go-photo",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-photo",
    "palette": {
      "base": "#0a1512",
      "accent": "#34d399",
      "glow": "#065f46",
      "stroke": "#a7f3d0"
    }
  },
  "go-api": {
    "id": "go-api",
    "name": "go-api",
    "label": "Library",
    "domain": "github.com/anchoo2kewl/go-api",
    "palette": {
      "base": "#141019",
      "accent": "#f472b6",
      "glow": "#831843",
      "stroke": "#fbcfe8"
    }
  },
  "me": {
    "id": "me",
    "name": "me",
    "label": "Tooling",
    "domain": "project runner framework",
    "palette": {
      "base": "#18181b",
      "accent": "#eab308",
      "glow": "#713f12",
      "stroke": "#fde68a"
    }
  },
  "BuildMe": {
    "id": "buildme",
    "name": "BuildMe",
    "label": "Tooling",
    "domain": "build.biswas.me",
    "palette": {
      "base": "#0f172a",
      "accent": "#fb7185",
      "glow": "#881337",
      "stroke": "#fecdd3"
    }
  },
  "OpenClaw Manager": {
    "id": "openclaw-manager",
    "name": "OpenClaw Manager",
    "label": "Tooling",
    "domain": "claw.biswas.me",
    "palette": {
      "base": "#0a0c10",
      "accent": "#6366f1",
      "glow": "#4338ca",
      "stroke": "#c7d2fe"
    }
  },
  "Trading Pod": {
    "id": "trading-pod",
    "name": "Trading Pod",
    "label": "Trading system",
    "domain": "trade.folioworth.com",
    "palette": {
      "base": "#0b0e14",
      "accent": "#2dd4a0",
      "glow": "#134e4a",
      "stroke": "#5eead4"
    }
  },
  "Questrade Reserve": {
    "id": "questrade-reserve",
    "name": "Questrade Reserve",
    "label": "Trading system",
    "domain": "questrade.folioworth.com",
    "palette": {
      "base": "#0f172a",
      "accent": "#60a5fa",
      "glow": "#1e3a8a",
      "stroke": "#bfdbfe"
    }
  }
};

export function getArtwork(name: string, url: string, category: string): ArtworkItem {
  return artworkCatalog[name] || { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, domain: url.replace(/^https?:\/\//, ""), label: category, palette: { base: "#0c2824", accent: "#8db897", glow: "#2d5946", stroke: "#c8dbc0" } };
}

export function ProjectArtwork({
  item,
  className = "",
}: {
  item: ArtworkItem;
  className?: string;
}) {
  const gradientId = `art-${useId().replace(/:/g, "")}`;
  const stroke = item.palette.stroke;
  const accent = item.palette.accent;

  const renderPreview = () => {
    switch (item.id) {
      case "taskai":
        return (
          <>
            <rect x="28" y="28" width="584" height="304" rx="30" fill="#12131a" fillOpacity="0.92" />
            <rect x="28" y="28" width="584" height="44" rx="30" fill="#1c1d24" />
            <circle cx="48" cy="50" r="6" fill="#ef4444" fillOpacity="0.8" />
            <circle cx="66" cy="50" r="6" fill="#f59e0b" fillOpacity="0.8" />
            <circle cx="84" cy="50" r="6" fill="#22c55e" fillOpacity="0.8" />
            <rect x="248" y="38" width="144" height="24" rx="8" fill="#23242c" stroke="#31323a" />
            <text x="278" y="54" fill="#6b7280" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              taskai.cc/app/projects/1
            </text>

            <rect x="28" y="72" width="112" height="260" fill="#1a1b22" />
            <rect x="44" y="96" width="14" height="14" rx="4" fill={accent} fillOpacity="0.18" stroke={accent} />
            <text x="68" y="107" fill="#f3f4f6" fontSize="12" fontWeight="700" fontFamily="sans-serif">
              My workspace
            </text>
            <rect x="40" y="122" width="88" height="28" rx="8" fill="#232538" />
            <circle cx="52" cy="136" r="3" fill="#818cf8" />
            <text x="64" y="140" fill="#a5b4fc" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              Board
            </text>
            {["Wiki", "Sprints", "Graph", "Assets"].map((label, idx) => (
              <g key={label}>
                <circle cx="52" cy={166 + idx * 22} r="3" fill="#2f3138" />
                <text
                  x="64"
                  y={170 + idx * 22}
                  fill="#6b7280"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {label}
                </text>
              </g>
            ))}
            <path d="M40 246 H128" stroke="#2b2d34" strokeWidth="1.5" />
            <text x="40" y="268" fill="#52525b" fontSize="9" fontWeight="700" fontFamily="sans-serif">
              PROJECTS
            </text>
            {["AI Dashboard", "Mobile App", "API v2"].map((label, idx) => (
              <g key={label}>
                <circle cx="52" cy={286 + idx * 18} r="3" fill="#4f46e5" fillOpacity="0.55" />
                <text
                  x="64"
                  y={290 + idx * 18}
                  fill="#9ca3af"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {label}
                </text>
              </g>
            ))}

            <text x="160" y="108" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily="sans-serif">
              Sprint 3 · AI Dashboard
            </text>
            <rect x="538" y="92" width="58" height="18" rx="9" fill="#1d2340" stroke="#3730a3" />
            <text x="548" y="104" fill="#a5b4fc" fontSize="8" fontWeight="700" fontFamily="sans-serif">
              MCP connected
            </text>

            <text x="160" y="134" fill="#9ca3af" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              Todo
            </text>
            <text x="320" y="134" fill="#eab308" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              In Progress
            </text>
            <text x="480" y="134" fill="#22c55e" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              Done
            </text>

            {[
              {
                x: 160,
                y: 148,
                title: "Set up auth flow",
                tag: "backend",
                tagFill: "#14532d",
                tagText: "#4ade80",
                priority: "high",
                priorityFill: "#f87171",
              },
              {
                x: 160,
                y: 214,
                title: "Design system tokens",
                tag: "frontend",
                tagFill: "#27272a",
                tagText: "#71717a",
                priority: "medium",
                priorityFill: "#eab308",
              },
              {
                x: 320,
                y: 148,
                title: "MCP server integration",
                tag: "ai",
                tagFill: "#312e81",
                tagText: "#a5b4fc",
                priority: "high",
                priorityFill: "#f87171",
              },
              {
                x: 320,
                y: 214,
                title: "Kanban drag-and-drop",
                tag: "frontend",
                tagFill: "#27272a",
                tagText: "#71717a",
                priority: "medium",
                priorityFill: "#eab308",
              },
              {
                x: 480,
                y: 148,
                title: "GitHub sync setup",
                tag: "backend",
                tagFill: "#14532d",
                tagText: "#4ade80",
                priority: "low",
                priorityFill: "#6b7280",
              },
              {
                x: 480,
                y: 214,
                title: "Wiki collaborative editor",
                tag: "docs",
                tagFill: "#1e3a8a",
                tagText: "#60a5fa",
                priority: "medium",
                priorityFill: "#eab308",
              },
            ].map((card) => (
              <g key={`${card.x}-${card.y}`}>
                <rect x={card.x} y={card.y} width="140" height="50" rx="8" fill="#16171d" stroke="#2a2b31" />
                <text
                  x={card.x + 10}
                  y={card.y + 16}
                  fill="#f3f4f6"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {card.title}
                </text>
                <rect x={card.x + 10} y={card.y + 30} width="34" height="13" rx="4" fill={card.tagFill} />
                <text
                  x={card.x + 14}
                  y={card.y + 39}
                  fill={card.tagText}
                  fontSize="7.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {card.tag}
                </text>
                <text
                  x={card.x + 116}
                  y={card.y + 39}
                  fill={card.priorityFill}
                  fontSize="7.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {card.priority}
                </text>
              </g>
            ))}
          </>
        );
      case "pingrly":
        return (
          <>
            <rect x="28" y="28" width="584" height="304" rx="30" fill="#09111f" fillOpacity="0.96" />
            <rect x="28" y="28" width="584" height="38" rx="30" fill="#0d1727" />
            <text x="272" y="52" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              PUBLIC STATUS
            </text>

            <rect x="52" y="84" width="536" height="54" rx="18" fill="#0b3b35" fillOpacity="0.78" stroke="#0f766e" />
            <circle cx="72" cy="111" r="7" fill="#10b981" />
            <text x="88" y="108" fill="#f8fafc" fontSize="16" fontWeight="700" fontFamily="sans-serif">
              All Systems Operational
            </text>
            <text x="88" y="124" fill="#a7f3d0" fontSize="9" fontWeight="600" fontFamily="sans-serif">
              Monitoring 12 services
            </text>

            {[
              {
                y: 156,
                name: "API Gateway",
                method: "HTTP",
                uptime: "99.98%",
                bars: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              },
              {
                y: 212,
                name: "Worker Fleet",
                method: "TCP",
                uptime: "99.95%",
                bars: [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
              },
              {
                y: 268,
                name: "Webhook Ingest",
                method: "PING",
                uptime: "99.91%",
                bars: [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
              },
            ].map((service) => (
              <g key={service.name}>
                <rect x="52" y={service.y} width="536" height="44" rx="14" fill="#0f1b2f" stroke="#24364f" />
                <text
                  x="68"
                  y={service.y + 16}
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {service.name}
                </text>
                <rect x="68" y={service.y + 22} width="28" height="12" rx="6" fill="#13243b" stroke="#334155" />
                <text
                  x="75"
                  y={service.y + 31}
                  fill="#cbd5e1"
                  fontSize="7"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {service.method}
                </text>
                {service.bars.map((ok, idx) => (
                  <rect
                    key={`${service.name}-${idx}`}
                    x={144 + idx * 18}
                    y={service.y + 21}
                    width="15"
                    height="14"
                    rx="3"
                    fill={ok ? "#10b981" : "#f97316"}
                  />
                ))}
                <text
                  x="536"
                  y={service.y + 18}
                  fill="#34d399"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  {service.uptime}
                </text>
                <text
                  x="533"
                  y={service.y + 31}
                  fill="#64748b"
                  fontSize="6.5"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  30D UPTIME
                </text>
              </g>
            ))}
          </>
        );
      case "flagtgl":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#130f24" fillOpacity="0.64" />
            <rect x="58" y="60" width="524" height="54" rx="18" fill="#0f172a" fillOpacity="0.86" />
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx}>
                <rect x="58" y={136 + idx * 42} width="524" height="28" rx="14" fill="#0f172a" fillOpacity="0.9" />
                <rect x="78" y={146 + idx * 42} width="140" height="8" rx="4" fill={stroke} fillOpacity="0.88" />
                <rect x="292" y={144 + idx * 42} width="64" height="12" rx="6" fill="#1f2937" />
                <rect x="452" y={140 + idx * 42} width="90" height="20" rx="10" fill={idx % 2 === 0 ? accent : "#334155"} />
                <circle cx={idx % 2 === 0 ? 526 : 470} cy={150 + idx * 42} r="8" fill="#f8fafc" />
              </g>
            ))}
            <rect x="58" y="304" width="160" height="0" opacity="0" />
          </>
        );
      case "folioworth":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#09121f" fillOpacity="0.58" />
            <rect x="58" y="60" width="264" height="240" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <rect x="344" y="60" width="238" height="112" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <rect x="344" y="188" width="238" height="112" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <circle cx="186" cy="180" r="70" fill="none" stroke="#1f2937" strokeWidth="28" />
            <circle cx="186" cy="180" r="70" fill="none" stroke={accent} strokeWidth="28" strokeDasharray="260 180" strokeLinecap="round" transform="rotate(-90 186 180)" />
            <circle cx="186" cy="180" r="38" fill="#08111f" />
            <text x="140" y="186" fill="#dcfce7" fontSize="24" fontWeight="700" fontFamily="sans-serif">$2.4M</text>
            <polyline points="372,138 404,126 432,132 466,110 492,118 548,92" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx}>
                <rect x="370" y={214 + idx * 18} width="114" height="8" rx="4" fill="#334155" />
                <rect x="370" y={214 + idx * 18} width={44 + idx * 26} height="8" rx="4" fill={idx === 1 ? stroke : accent} fillOpacity="0.85" />
              </g>
            ))}
          </>
        );
      case "blog":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#171210" fillOpacity="0.62" />
            <rect x="58" y="60" width="524" height="54" rx="18" fill="#1c1917" fillOpacity="0.9" />
            <rect x="58" y="132" width="220" height="168" rx="22" fill="#2b1b13" />
            <rect x="298" y="132" width="284" height="168" rx="22" fill="#1c1917" fillOpacity="0.92" />
            <rect x="82" y="154" width="172" height="92" rx="18" fill="#7c2d12" fillOpacity="0.55" />
            <rect x="320" y="154" width="160" height="10" rx="5" fill={stroke} fillOpacity="0.9" />
            <rect x="320" y="176" width="206" height="10" rx="5" fill="#e7e5e4" fillOpacity="0.8" />
            <rect x="320" y="206" width="228" height="8" rx="4" fill="#78716c" fillOpacity="0.85" />
            <rect x="320" y="224" width="228" height="8" rx="4" fill="#78716c" fillOpacity="0.75" />
            <rect x="320" y="242" width="196" height="8" rx="4" fill="#78716c" fillOpacity="0.65" />
            <rect x="320" y="270" width="88" height="16" rx="8" fill={accent} fillOpacity="0.7" />
          </>
        );
      case "ai-agent-lens":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#08131c" fillOpacity="0.62" />
            <rect x="58" y="60" width="524" height="54" rx="18" fill="#08111f" fillOpacity="0.88" />
            <rect x="58" y="132" width="252" height="168" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <rect x="332" y="132" width="250" height="78" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <rect x="332" y="222" width="250" height="78" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <path d="M184 154 L240 180 L240 222 C240 252 214 274 184 286 C154 274 128 252 128 222 L128 180 Z" fill={accent} fillOpacity="0.22" stroke={accent} strokeWidth="6" />
            <path d="M162 212 L178 228 L210 190" fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {[["OWASP LLM", "#f59e0b"], ["NIST AI RMF", "#38bdf8"], ["Policy Pack", "#34d399"]].map(([label, color], idx) => (
              <g key={label}>
                <rect x="352" y={152 + idx * 18} width="112" height="10" rx="5" fill={color} fillOpacity="0.9" />
                <rect x="476" y={152 + idx * 18} width="72" height="10" rx="5" fill="#334155" />
              </g>
            ))}
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx}>
                <rect x={352 + idx * 48} y="246" width="28" height={18 + idx * 10} rx="10" fill={idx === 3 ? "#fb7185" : accent} fillOpacity={0.3 + idx * 0.15} />
              </g>
            ))}
          </>
        );
      case "go-wiki":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#08203a" fillOpacity="0.62" />
            <rect x="58" y="60" width="524" height="46" rx="16" fill="#08111f" fillOpacity="0.84" />
            <rect x="58" y="126" width="244" height="174" rx="22" fill="#f8fafc" fillOpacity="0.94" />
            <rect x="318" y="126" width="264" height="174" rx="22" fill="#0f172a" fillOpacity="0.9" />
            {[0, 1, 2, 3, 4].map((idx) => (
              <rect key={idx} x="82" y={154 + idx * 24} width={idx === 1 ? 120 : idx === 3 ? 168 : 186} height="8" rx="4" fill={idx === 0 ? "#0f172a" : "#64748b"} fillOpacity="0.85" />
            ))}
            <rect x="82" y="210" width="82" height="54" rx="14" fill="#e2e8f0" />
            <rect x="182" y="210" width="94" height="54" rx="14" fill="#cbd5e1" />
            <path d="M344 160 h100 l24 26 h78" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M352 220 h80 m-80 24 h140 m-140 24 h104" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case "go-draw":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#0f1b45" fillOpacity="0.62" />
            <rect x="58" y="60" width="68" height="240" rx="22" fill="#08111f" fillOpacity="0.84" />
            <rect x="144" y="60" width="438" height="240" rx="22" fill="#f8fafc" fillOpacity="0.94" />
            {[0, 1, 2, 3, 4].map((idx) => (
              <circle key={idx} cx="92" cy={92 + idx * 38} r="10" fill={idx === 2 ? accent : "#94a3b8"} />
            ))}
            <rect x="184" y="100" width="132" height="76" rx="20" fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="6" />
            <circle cx="384" cy="132" r="36" fill="none" stroke="#60a5fa" strokeWidth="8" />
            <path d="M466 106 L528 158 L454 190 Z" fill={stroke} fillOpacity="0.8" />
            <path d="M194 230 C242 176, 304 262, 350 210 S456 224, 530 184" fill="none" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
          </>
        );
      case "go-blog":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#1a1a2e" fillOpacity="0.64" />
            {/* Blog post cards stacked */}
            {[0, 1, 2].map((idx) => (
              <g key={idx}>
                <rect x="58" y={60 + idx * 88} width="524" height="72" rx="18" fill="#111827" fillOpacity="0.92" />
                <rect x="82" y={76 + idx * 88} width="48" height="40" rx="10" fill={idx === 0 ? accent : "#1f2937"} fillOpacity={idx === 0 ? 0.3 : 0.85} />
                <rect x="148" y={76 + idx * 88} width={180 - idx * 30} height="12" rx="6" fill={stroke} fillOpacity="0.9" />
                <rect x="148" y={96 + idx * 88} width={260 - idx * 40} height="8" rx="4" fill="#64748b" fillOpacity="0.7" />
                <rect x="148" y={112 + idx * 88} width="56" height="8" rx="4" fill={accent} fillOpacity="0.5" />
                {idx === 0 && <circle cx="540" cy={96 + idx * 88} r="6" fill={accent} fillOpacity="0.85" />}
              </g>
            ))}
          </>
        );
      case "go-email":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#0c1222" fillOpacity="0.68" />
            {/* Search bar */}
            <rect x="58" y="56" width="404" height="40" rx="14" fill="#111827" fillOpacity="0.92" />
            <circle cx="82" cy="76" r="9" fill="none" stroke="#64748b" strokeWidth="2" />
            <rect x="100" y="72" width="120" height="8" rx="4" fill="#334155" />
            {/* Filter pills */}
            {[["Sent", "#34d399"], ["test", accent], ["weekly", "#f59e0b"]].map(([label, color], idx) => (
              <rect key={label} x={482 + (idx > 0 ? 0 : 0)} y={56 + idx * 16} width="64" height="14" rx="7" fill={color} fillOpacity="0.25" />
            ))}
            {/* Email log rows */}
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx}>
                <rect x="58" y={112 + idx * 46} width="524" height="34" rx="12" fill="#111827" fillOpacity={idx === 0 ? 0.95 : 0.8} />
                <rect x="78" y={122 + idx * 46} width="68" height="8" rx="4" fill="#64748b" fillOpacity="0.8" />
                <rect x="166" y={122 + idx * 46} width="100" height="8" rx="4" fill={stroke} fillOpacity="0.7" />
                <rect x="286" y={122 + idx * 46} width="140" height="8" rx="4" fill="#94a3b8" fillOpacity="0.6" />
                <rect x="456" y={120 + idx * 46} width="36" height="14" rx="7" fill={idx === 2 ? "#ef4444" : "#34d399"} fillOpacity="0.85" />
                {idx < 2 && <rect x="506" y={120 + idx * 46} width="32" height="14" rx="7" fill={accent} fillOpacity="0.3" />}
              </g>
            ))}
          </>
        );
      case "go-backup":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#0f172a" fillOpacity="0.64" />
            <rect x="58" y="60" width="524" height="62" rx="20" fill="#08111f" fillOpacity="0.85" />
            <rect x="58" y="146" width="524" height="154" rx="24" fill="#0f172a" fillOpacity="0.9" />
            {[0, 1, 2].map((idx) => (
              <g key={idx}>
                <rect x={96 + idx * 152} y="180" width="112" height="74" rx="18" fill="#111827" />
                <rect x={110 + idx * 152} y="198" width="54" height="10" rx="5" fill={idx === 2 ? "#34d399" : stroke} fillOpacity="0.85" />
                <rect x={110 + idx * 152} y="220" width="76" height="8" rx="4" fill="#64748b" fillOpacity="0.85" />
                <rect x={110 + idx * 152} y="238" width="42" height="8" rx="4" fill="#64748b" fillOpacity="0.65" />
              </g>
            ))}
            <path d="M120 108 H520" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            {[120, 260, 400, 520].map((x, idx) => (
              <g key={x}>
                <circle cx={x} cy="108" r="10" fill={idx === 3 ? "#34d399" : accent} />
                {idx < 3 && <path d={`M${x + 12} 108 H${x + 128}`} fill="none" stroke={accent} strokeWidth="4" strokeDasharray="6 8" />}
              </g>
            ))}
          </>
        );
      case "go-login":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#141025" fillOpacity="0.64" />
            <rect x="92" y="64" width="196" height="232" rx="28" fill="#111827" fillOpacity="0.9" />
            <rect x="320" y="64" width="228" height="232" rx="28" fill="#0f172a" fillOpacity="0.88" />
            <circle cx="190" cy="112" r="28" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="6" />
            <rect x="124" y="164" width="132" height="18" rx="9" fill="#1f2937" />
            <rect x="124" y="194" width="132" height="18" rx="9" fill="#1f2937" />
            <rect x="124" y="234" width="132" height="24" rx="12" fill={accent} fillOpacity="0.85" />
            {[0, 1, 2].map((idx) => (
              <g key={idx}>
                <rect x="348" y={104 + idx * 52} width="172" height="34" rx="17" fill="#111827" />
                <circle cx="374" cy={121 + idx * 52} r="8" fill={idx === 0 ? "#34d399" : idx === 1 ? "#f59e0b" : "#38bdf8"} />
                <rect x="392" y={116 + idx * 52} width="86" height="8" rx="4" fill={stroke} fillOpacity="0.88" />
              </g>
            ))}
          </>
        );
      case "go-ai":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#0b1120" fillOpacity="0.7" />
            {/* One request entering the chain. */}
            <rect x="62" y="158" width="104" height="44" rx="14" fill="#111827" fillOpacity="0.94" stroke="#312e81" />
            <rect x="82" y="172" width="64" height="7" rx="3.5" fill={stroke} fillOpacity="0.85" />
            <rect x="82" y="186" width="40" height="6" rx="3" fill="#64748b" fillOpacity="0.7" />

            {/* Primary, then two backups — the primary is the one that answers. */}
            {[0, 1, 2].map((idx) => {
              const y = 74 + idx * 92;
              const live = idx === 0;
              return (
                <g key={idx}>
                  <path
                    d={`M166 180 C 226 180, 236 ${y + 26}, 296 ${y + 26}`}
                    fill="none"
                    stroke={live ? accent : "#334155"}
                    strokeWidth={live ? 6 : 3}
                    strokeLinecap="round"
                    strokeDasharray={live ? undefined : "8 10"}
                  />
                  <rect
                    x="296"
                    y={y}
                    width="220"
                    height="52"
                    rx="16"
                    fill={live ? "#1e1b4b" : "#0f172a"}
                    fillOpacity="0.95"
                    stroke={live ? accent : "#1e293b"}
                    strokeWidth={live ? 4 : 2}
                  />
                  <circle cx="324" cy={y + 26} r="9" fill={live ? accent : "#334155"} />
                  <rect x="344" y={y + 15} width={live ? 118 : 92} height="9" rx="4.5" fill={stroke} fillOpacity={live ? 0.95 : 0.42} />
                  <rect x="344" y={y + 32} width={live ? 74 : 56} height="7" rx="3.5" fill="#64748b" fillOpacity={live ? 0.8 : 0.4} />
                </g>
              );
            })}

            {/* The answer coming back from whichever rung served it. */}
            <path d="M516 100 C 560 100, 566 176, 540 180" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" />
            <circle cx="540" cy="180" r="12" fill={accent} fillOpacity="0.28" stroke={accent} strokeWidth="4" />
          </>
        );
      case "75hard":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#1a0b05" fillOpacity="0.72" />
            {/* Day header with its completion ring. */}
            <rect x="60" y="60" width="240" height="20" rx="10" fill="#7c2d12" fillOpacity="0.5" />
            <rect x="60" y="90" width="150" height="30" rx="10" fill={stroke} fillOpacity="0.9" />
            <circle cx="536" cy="92" r="30" fill="none" stroke="#3f1d0b" strokeWidth="8" />
            <circle
              cx="536"
              cy="92"
              r="30"
              fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="188.5"
              strokeDashoffset="47"
              transform="rotate(-90 536 92)"
            />

            {/* The activity grid: a cell per day, five rows of fifteen. */}
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((col) => {
                const n = row * 15 + col;
                // A believable run: mostly done early, thinning out, then unstarted.
                const done = n < 34 && n % 9 !== 4 && n % 13 !== 7;
                const partial = !done && n < 34 && n % 9 === 4;
                const future = n >= 36;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={62 + col * 35}
                    y={148 + row * 35}
                    width="27"
                    height="27"
                    rx="6"
                    fill={done ? accent : partial ? accent : future ? "#ffffff" : "#ef4444"}
                    fillOpacity={done ? 0.95 : partial ? 0.4 : future ? 0.05 : 0.16}
                    stroke={partial ? accent : future ? "none" : "none"}
                    strokeWidth={partial ? 2 : 0}
                  />
                );
              }),
            )}
          </>
        );
      case "me":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#08111f" fillOpacity="0.68" />
            <rect x="58" y="60" width="524" height="50" rx="18" fill="#020617" fillOpacity="0.92" />
            <rect x="58" y="128" width="330" height="172" rx="22" fill="#020617" fillOpacity="0.9" />
            <rect x="408" y="128" width="174" height="172" rx="22" fill="#0f172a" fillOpacity="0.9" />
            <text x="84" y="164" fill="#34d399" fontSize="20" fontWeight="700" fontFamily="monospace">$ me up taskai dev</text>
            <text x="84" y="198" fill="#cbd5e1" fontSize="18" fontFamily="monospace">docker compose up -d</text>
            <text x="84" y="228" fill="#94a3b8" fontSize="18" fontFamily="monospace">proxy ready on :3000</text>
            <text x="84" y="258" fill="#94a3b8" fontSize="18" fontFamily="monospace">logs streaming...</text>
            {[["local", "#38bdf8"], ["staging", "#f59e0b"], ["prod", "#34d399"]].map(([label, color], idx) => (
              <g key={label}>
                <rect x="432" y={156 + idx * 42} width="126" height="26" rx="13" fill="#111827" />
                <circle cx="454" cy={169 + idx * 42} r="8" fill={color} />
                <text x="474" y={174 + idx * 42} fill="#e2e8f0" fontSize="15" fontWeight="700" fontFamily="sans-serif">{label}</text>
              </g>
            ))}
          </>
        );
      case "buildme":
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#111827" fillOpacity="0.66" />
            <rect x="58" y="60" width="524" height="54" rx="18" fill="#08111f" fillOpacity="0.88" />
            <rect x="58" y="132" width="524" height="168" rx="24" fill="#0f172a" fillOpacity="0.9" />
            {[0, 1, 2].map((idx) => (
              <g key={idx}>
                <rect x="82" y={158 + idx * 42} width="478" height="26" rx="13" fill="#111827" />
                <rect x="100" y={166 + idx * 42} width="92" height="10" rx="5" fill={stroke} fillOpacity="0.88" />
                <rect x="256" y={164 + idx * 42} width="72" height="14" rx="7" fill={idx === 1 ? "#fb7185" : "#34d399"} fillOpacity="0.85" />
                <rect x="414" y={162 + idx * 42} width={34 + idx * 18} height="18" rx="9" fill={idx === 2 ? accent : "#334155"} />
              </g>
            ))}
            {[0, 1, 2, 3].map((idx) => (
              <rect key={idx} x={362 + idx * 38} y="84" width="22" height="10" rx="5" fill={idx === 3 ? accent : "#475569"} />
            ))}
          </>
        );
      case "openclaw-manager":
        return (
          <>
            {/* Base console frame */}
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#0a0c10" fillOpacity="0.92" />
            {/* Title bar */}
            <rect x="58" y="60" width="524" height="46" rx="16" fill="#12161f" />
            <circle cx="80" cy="83" r="6" fill="#ef4444" fillOpacity="0.85" />
            <circle cx="98" cy="83" r="6" fill="#f59e0b" fillOpacity="0.85" />
            <circle cx="116" cy="83" r="6" fill="#34d399" fillOpacity="0.85" />
            <rect x="232" y="72" width="180" height="22" rx="11" fill="#0a0c10" stroke="#1f2632" />
            <text x="252" y="87" fill="#6b7589" fontSize="11" fontWeight="600" fontFamily="monospace">claw.biswas.me/console</text>
            <circle cx="542" cy="83" r="5" fill="#34d399" />
            <text x="552" y="87" fill="#8b94a8" fontSize="10" fontWeight="700" fontFamily="sans-serif">LIVE</text>

            {/* Sessions sidebar */}
            <rect x="58" y="122" width="172" height="178" rx="18" fill="#12161f" />
            <text x="76" y="146" fill="#8b94a8" fontSize="10" fontWeight="700" fontFamily="sans-serif">SESSIONS</text>
            <rect x="76" y="154" width="28" height="8" rx="4" fill="#2a3444" />
            {[
              { label: "deploy-bot", status: accent, active: true },
              { label: "refactor-api", status: "#34d399", active: false },
              { label: "test-runner", status: "#f59e0b", active: false },
              { label: "lint-fixer", status: "#34d399", active: false },
            ].map((s, idx) => (
              <g key={s.label}>
                <rect
                  x="74"
                  y={170 + idx * 30}
                  width="140"
                  height="24"
                  rx="10"
                  fill={s.active ? "#1f2632" : "#0f131a"}
                  stroke={s.active ? accent : "transparent"}
                  strokeWidth="1.5"
                />
                <circle cx="86" cy={182 + idx * 30} r="4" fill={s.status} />
                <rect x="98" y={178 + idx * 30} width={70 - idx * 6} height="8" rx="4" fill={s.active ? stroke : "#6b7589"} fillOpacity="0.85" />
                <rect x="176" y={178 + idx * 30} width="28" height="8" rx="4" fill={s.active ? accent : "#2a3444"} fillOpacity="0.75" />
              </g>
            ))}

            {/* Chat / stream panel */}
            <rect x="244" y="122" width="338" height="124" rx="18" fill="#12161f" />
            <text x="262" y="146" fill="#8b94a8" fontSize="10" fontWeight="700" fontFamily="sans-serif">AGENT STREAM</text>
            <rect x="326" y="138" width="32" height="12" rx="6" fill={accent} fillOpacity="0.25" />
            <text x="332" y="147" fill={stroke} fontSize="8" fontWeight="700" fontFamily="sans-serif">GPT-5</text>

            {/* Chat message - user */}
            <rect x="262" y="160" width="222" height="22" rx="11" fill="#1f2632" />
            <circle cx="274" cy="171" r="4" fill="#8b5cf6" />
            <rect x="284" y="167" width="188" height="8" rx="4" fill="#c8d0dd" fillOpacity="0.85" />

            {/* Chat message - agent (streaming) */}
            <rect x="262" y="190" width="302" height="46" rx="11" fill="#0f131a" stroke="#1f2632" />
            <circle cx="274" cy="202" r="4" fill={accent} />
            <rect x="284" y="198" width="252" height="6" rx="3" fill={stroke} fillOpacity="0.85" />
            <rect x="284" y="210" width="212" height="6" rx="3" fill={stroke} fillOpacity="0.7" />
            <rect x="284" y="222" width="168" height="6" rx="3" fill={stroke} fillOpacity="0.55" />
            {/* Blinking cursor hint */}
            <rect x="456" y="220" width="8" height="10" rx="2" fill={accent} />

            {/* Status strip */}
            <rect x="244" y="258" width="338" height="42" rx="16" fill="#12161f" />
            {[
              { label: "GATEWAY", value: "200", color: "#34d399" },
              { label: "CONTAINER", value: "UP", color: "#34d399" },
              { label: "WORKSPACE", value: "42 MB", color: accent },
              { label: "QUEUE", value: "3", color: "#f59e0b" },
            ].map((pill, idx) => (
              <g key={pill.label}>
                <rect
                  x={260 + idx * 82}
                  y={270}
                  width="72"
                  height="20"
                  rx="10"
                  fill="#0a0c10"
                  stroke="#1f2632"
                />
                <circle cx={270 + idx * 82} cy={280} r="3.5" fill={pill.color} />
                <text x={278 + idx * 82} y={278} fill="#6b7589" fontSize="7" fontWeight="700" fontFamily="sans-serif">
                  {pill.label}
                </text>
                <text x={278 + idx * 82} y={288} fill={stroke} fontSize="9" fontWeight="700" fontFamily="monospace">
                  {pill.value}
                </text>
              </g>
            ))}
          </>
        );
      default:
        return (
          <>
            <rect x="36" y="36" width="568" height="288" rx="28" fill="#08111f" fillOpacity="0.58" />
            <rect x="58" y="60" width="524" height="52" rx="18" fill="#0f172a" fillOpacity="0.88" />
            <rect x="58" y="132" width="240" height="168" rx="22" fill="#0f172a" fillOpacity="0.88" />
            <rect x="318" y="132" width="264" height="76" rx="22" fill="#0f172a" fillOpacity="0.88" />
            <rect x="318" y="224" width="264" height="76" rx="22" fill="#0f172a" fillOpacity="0.88" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 640 360"
      className={className}
      role="img"
      aria-label={`${item.name} interface illustration`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={item.palette.base} />
          <stop offset="100%" stopColor={item.palette.glow} />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="32" fill={`url(#${gradientId})`} />
      <circle cx="520" cy="82" r="76" fill={item.palette.accent} fillOpacity="0.12" />
      <circle cx="110" cy="300" r="88" fill="#ffffff" fillOpacity="0.05" />
      {renderPreview()}
    </svg>
  );
}

