"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { fetchBlogPosts, type BlogPost } from "@/lib/blog-api";
import config from "@/config";

declare global {
  interface Window {
    onSubmit: (token: string) => void;
  }
}

const SimplePDFViewer = dynamic(
  () =>
    import("@/components/simple-pdf-viewer").then((mod) => ({
      default: mod.SimplePDFViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85">
        <div className="text-sm text-white">Loading resume...</div>
      </div>
    ),
  }
);

type ShowcasePalette = {
  base: string;
  accent: string;
  glow: string;
  stroke: string;
};

type ShowcaseItem = {
  id: string;
  name: string;
  label: string;
  domain: string;
  href?: string;
  repo?: string;
  tagline: string;
  summary: string;
  detail: string;
  stack: string[];
  highlights: string[];
  palette: ShowcasePalette;
};

const products: ShowcaseItem[] = [
  {
    id: "taskai",
    name: "TaskAI",
    label: "Product",
    domain: "taskai.cc",
    href: "https://taskai.cc",
    repo: "https://github.com/anchoo2kewl/taskai",
    tagline: "AI-native project management for small teams that want clean execution.",
    summary: "A lightweight project management system built for focused delivery instead of process drag.",
    detail:
      "TaskAI combines tasks, projects, search, auth, and deployment into one small, production-grade system. It reflects how I like software to feel: direct, fast, and operationally boring in the best way.",
    stack: ["Go", "React", "TypeScript", "SQLite"],
    highlights: [
      "Project and task management with strong search and filtering.",
      "Small-stack architecture that is easy to self-host and evolve.",
      "Built around shipping clean increments instead of bloated workflows.",
    ],
    palette: {
      base: "#071a1f",
      accent: "#2dd4bf",
      glow: "#155e75",
      stroke: "#7dd3fc",
    },
  },
  {
    id: "tickrapi",
    name: "TickrAPI",
    label: "Product",
    domain: "tickrapi.com",
    href: "https://tickrapi.com",
    tagline: "A clean market data API for people who just want reliable ticker data.",
    summary:
      "A market data service built with a friend, aimed at making ticker and price data straightforward to consume without wrestling with vendor quirks.",
    detail:
      "Every project I build that touches markets runs into the same wall: market data is either expensive, awkwardly shaped, adjusted in ways that quietly break your analysis, or wrapped in an API that fights you. TickrAPI is our attempt at the version we keep wishing existed — predictable endpoints, sane defaults, and data you can reason about. It is an active collaboration rather than a finished product.",
    stack: ["Go", "Market data", "REST API"],
    highlights: [
      "Ticker and historical price data behind a consistent, predictable API.",
      "Built from the recurring pain of integrating vendor market-data feeds.",
      "A collaboration project, currently in active development.",
    ],
    palette: {
      base: "#0c1322",
      accent: "#f59e0b",
      glow: "#78350f",
      stroke: "#fcd34d",
    },
  },
  {
    id: "pingrly",
    name: "Pingrly",
    label: "Product",
    domain: "pingrly.com",
    href: "https://pingrly.com",
    tagline: "Uptime monitoring and status visibility without SaaS bulk.",
    summary: "A lean monitoring system for HTTP, TCP, and heartbeat checks with alerting and public status pages.",
    detail:
      "Pingrly is my take on infrastructure monitoring when the common workflows matter more than a giant feature matrix. It focuses on fast setup, useful notifications, and predictable operation.",
    stack: ["Go", "React", "SQLite", "Webhooks"],
    highlights: [
      "HTTP, TCP, and heartbeat monitor support.",
      "Slack, email, and webhook notifications with incident tracking.",
      "Import path for teams migrating from Freshping-style setups.",
    ],
    palette: {
      base: "#111827",
      accent: "#f59e0b",
      glow: "#7c2d12",
      stroke: "#fdba74",
    },
  },
  {
    id: "flagtgl",
    name: "FlagTGL",
    label: "Product",
    domain: "flagtgl.com",
    href: "https://flagtgl.com",
    tagline: "Feature flags with LaunchDarkly compatibility and self-hosting control.",
    summary: "A LaunchDarkly-compatible platform for teams that want protocol compatibility without vendor lock-in.",
    detail:
      "FlagTGL is built around compatibility, real-time updates, and straightforward ownership. It exists for teams that want modern feature rollout workflows while keeping infrastructure choices open.",
    stack: ["Go", "React", "PostgreSQL", "SSE"],
    highlights: [
      "Drop-in compatibility for common LaunchDarkly workflows.",
      "Real-time flag delivery with streaming support.",
      "Built for self-hosting, evaluation speed, and operator clarity.",
    ],
    palette: {
      base: "#120d27",
      accent: "#8b5cf6",
      glow: "#312e81",
      stroke: "#c4b5fd",
    },
  },
  {
    id: "folioworth",
    name: "Folioworth",
    label: "Product",
    domain: "folioworth.com",
    href: "https://folioworth.com",
    repo: "https://github.com/anchoo2kewl/folioworth",
    tagline: "Net worth, investing, budgeting, and household finance in one platform.",
    summary: "A multi-tenant personal finance platform for net worth tracking, investment accounting, budgeting, and financial reporting.",
    detail:
      "FolioWorth combines household-aware finance tracking, Canadian ACB investment calculations, reporting, and budgeting into one system. It is built for people who want a clearer operating picture of their money without splitting the workflow across several tools.",
    stack: ["Go", "React", "PostgreSQL", "Financial Analytics"],
    highlights: [
      "Multi-tenant household model with row-level security in PostgreSQL.",
      "Net worth tracking, budgeting, reports, and transaction categorization.",
      "Investment support with Canadian tax-compliant ACB calculations.",
    ],
    palette: {
      base: "#0f172a",
      accent: "#22c55e",
      glow: "#14532d",
      stroke: "#86efac",
    },
  },
  {
    id: "blog",
    name: "anshumanbiswas.com",
    label: "Product",
    domain: "anshumanbiswas.com",
    href: "/blog",
    repo: "https://github.com/anchoo2kewl/blog",
    tagline: "My writing and publishing system, built in Go and tuned for speed.",
    summary: "A custom blog platform for technical writing, slide publishing, analytics, and editorial control.",
    detail:
      "I wanted a writing system that felt like software I would want to maintain: fast, secure, embedded, and flexible enough for posts, slides, and experiments. This site is both a product and a workshop.",
    stack: ["Go", "PostgreSQL", "Tailwind", "Markdown"],
    highlights: [
      "Custom publishing workflow with slides, analytics, and RBAC.",
      "Embedded templates and assets for low-friction deployment.",
      "A place to write about systems, AI, and software design in public.",
    ],
    palette: {
      base: "#1c1917",
      accent: "#f97316",
      glow: "#7c2d12",
      stroke: "#fdba74",
    },
  },
  {
    id: "ai-agent-lens",
    name: "AI Agent Lens",
    label: "Product",
    domain: "aiagentlens.com",
    href: "https://aiagentlens.com",
    tagline: "Runtime security and compliance governance for the AI agent era.",
    summary: "A governance platform for agentic systems that scans, enforces, audits, and maps controls to real frameworks.",
    detail:
      "AI Agent Lens is where my infrastructure background and current AI focus meet. It is built for organizations that want usable security controls around agents in development and production.",
    stack: ["Go", "SQLite", "Security Rules", "Compliance"],
    highlights: [
      "Runtime security decisions with audit-ready reporting.",
      "Coverage for frameworks such as OWASP LLM Top 10 and NIST AI RMF.",
      "Designed for both developer tooling and production agent systems.",
    ],
    palette: {
      base: "#111827",
      accent: "#38bdf8",
      glow: "#0f766e",
      stroke: "#67e8f9",
    },
  },
];

const libraries: ShowcaseItem[] = [
  {
    id: "go-wiki",
    name: "go-wiki",
    label: "Library",
    domain: "github.com/anchoo2kewl/go-wiki",
    href: "https://github.com/anchoo2kewl/go-wiki",
    tagline: "Embeddable markdown editing for Go applications.",
    summary: "A wiki editor with split preview, markdown tooling, and zero frontend build requirements.",
    detail:
      "go-wiki gives Go applications a capable editing surface without dragging in a heavy frontend stack. It powers parts of my blog platform and reflects my bias toward reusable infrastructure.",
    stack: ["Go", "embed.FS", "Markdown"],
    highlights: [
      "Fullscreen split editor and live preview.",
      "Lightbox image galleries, embeds, diagrams, and rich markdown filters.",
      "No npm dependency chain required to ship it.",
    ],
    palette: {
      base: "#082f49",
      accent: "#38bdf8",
      glow: "#164e63",
      stroke: "#bae6fd",
    },
  },
  {
    id: "go-draw",
    name: "go-draw",
    label: "Library",
    domain: "draw.biswas.me",
    href: "https://draw.biswas.me",
    repo: "https://github.com/anchoo2kewl/go-draw",
    tagline: "Embeddable canvas drawing for Go apps.",
    summary: "A lightweight drawing editor and viewer built for embedding into blogs, docs, and internal tools.",
    detail:
      "go-draw exists because diagrams should be native to the product, not exported from somewhere else. It is intentionally dependency-light and easy to drop into a Go application.",
    stack: ["Go", "Canvas", "Vanilla JS"],
    highlights: [
      "Editor and read-only viewer modes.",
      "Resizing, fullscreen, undo, redo, and pan/zoom.",
      "Designed to pair cleanly with go-wiki and other Go apps.",
    ],
    palette: {
      base: "#172554",
      accent: "#60a5fa",
      glow: "#1d4ed8",
      stroke: "#bfdbfe",
    },
  },
  {
    id: "go-blog",
    name: "go-blog",
    label: "Library",
    domain: "github.com/anchoo2kewl/go-blog",
    href: "https://github.com/anchoo2kewl/go-blog",
    tagline: "Embeddable blog engine for Go applications.",
    summary: "A self-contained blog module that adds posts, markdown rendering, and feeds to any Go web app.",
    detail:
      "go-blog lets me add a full blog to any product without external CMS dependencies. Posts are authored in markdown and served through Go templates with built-in syntax highlighting and RSS feeds.",
    stack: ["Go", "Markdown", "embed.FS"],
    highlights: [
      "Drop-in blog engine with post management and markdown rendering.",
      "Embeds into existing Go servers — no separate CMS required.",
      "Pairs with go-wiki and go-draw for rich content authoring.",
    ],
    palette: {
      base: "#1a1a2e",
      accent: "#e94560",
      glow: "#16213e",
      stroke: "#fca5a5",
    },
  },
  {
    id: "go-email",
    name: "go-email",
    label: "Service",
    domain: "email.biswas.me",
    href: "https://email.biswas.me",
    repo: "https://github.com/anchoo2kewl/go-email",
    tagline: "Self-hosted transactional email gateway.",
    summary: "A multi-tenant HTTP email service that relays through your own SMTP server with per-org API keys and rate limits.",
    detail:
      "go-email replaces third-party transactional email providers with something I control. Organizations verify domains via DNS TXT records, create API keys with daily and monthly limits, and send email through POST /v1/emails. All activity is searchable and tagged.",
    stack: ["Go", "SQLite", "SMTP", "DKIM"],
    highlights: [
      "Multi-tenant orgs with verified sending domains (SPF, DKIM, DMARC).",
      "Per-key daily and monthly rate limits with full send log.",
      "Searchable email history with tags and filtering.",
    ],
    palette: {
      base: "#0c1222",
      accent: "#3b82f6",
      glow: "#1e3a5f",
      stroke: "#93c5fd",
    },
  },
  {
    id: "go-backup",
    name: "go-backup",
    label: "Library",
    domain: "github.com/anchoo2kewl/go-backup",
    href: "https://github.com/anchoo2kewl/go-backup",
    tagline: "Scheduled database backup workflows for Go services.",
    summary: "An embeddable backup module that adds scheduled database dumps and storage integration to Go applications.",
    detail:
      "go-backup is the kind of boring infrastructure component I like to have ready before I need it. It packages backup orchestration, history, and pluggable providers into something small and reusable.",
    stack: ["Go", "PostgreSQL", "Scheduling"],
    highlights: [
      "Scheduled and manual backup runs.",
      "Storage-provider abstraction and backup history tracking.",
      "Built to be embedded instead of run as a separate platform.",
    ],
    palette: {
      base: "#1f2937",
      accent: "#34d399",
      glow: "#065f46",
      stroke: "#a7f3d0",
    },
  },
  {
    id: "go-login",
    name: "go-login",
    label: "Library",
    domain: "github.com/anchoo2kewl/go-login",
    href: "https://github.com/anchoo2kewl/go-login",
    tagline: "OAuth login flows for Go products without auth sprawl.",
    summary: "A reusable auth package for Google and GitHub OAuth, invite-aware onboarding, and JWT handoff.",
    detail:
      "go-login turns a repeated product problem into a composable building block. I use it when I want a clean login layer without rebuilding the same OAuth flow over and over.",
    stack: ["Go", "OAuth", "JWT"],
    highlights: [
      "Google and GitHub OAuth support.",
      "Invite-aware signup and account linking flows.",
      "Designed to plug into existing product backends cleanly.",
    ],
    palette: {
      base: "#111827",
      accent: "#f472b6",
      glow: "#831843",
      stroke: "#fbcfe8",
    },
  },
  {
    id: "me-framework",
    name: "me",
    label: "Tooling",
    domain: "project runner framework",
    repo: "https://github.com/anchoo2kewl/me",
    tagline: "A generic project runner for managing many codebases the same way.",
    summary: "A zero-knowledge CLI framework that discovers projects via `.me.sh` adapters and runs them across local, Docker, and remote environments.",
    detail:
      "The `me` framework gives me one operational interface for many repositories without hard-coding project specifics into the runner. Each project provides a small `.me.sh` adapter, and the framework handles discovery, dispatch, and environment targeting.",
    stack: ["Shell", "CLI", "Multi-Project Ops"],
    highlights: [
      "Unified commands across local, Docker, staging, UAT, and production.",
      "Auto-discovers projects and dispatches through per-project adapters.",
      "Lets very different codebases share one repeatable operator workflow.",
    ],
    palette: {
      base: "#18181b",
      accent: "#eab308",
      glow: "#713f12",
      stroke: "#fde68a",
    },
  },
  {
    id: "buildme",
    name: "BuildMe",
    label: "Tooling",
    domain: "build.biswas.me",
    href: "https://build.biswas.me",
    repo: "https://github.com/anchoo2kewl/buildme",
    tagline: "A unified build monitor for CI/CD pipelines.",
    summary: "A self-hosted dashboard for tracking builds across GitHub Actions, Travis CI, and CircleCI.",
    detail:
      "BuildMe pulls build state into one place so teams can see failures, notifications, and pipeline drift without bouncing between providers. It is another example of preferring focused software over fragmented tooling.",
    stack: ["Go", "Qwik", "SQLite", "WebSocket"],
    highlights: [
      "Real-time build status across multiple CI providers.",
      "Notifications, collaboration roles, and self-hosting support.",
      "Very fast frontend delivery with a small runtime footprint.",
    ],
    palette: {
      base: "#0f172a",
      accent: "#fb7185",
      glow: "#881337",
      stroke: "#fecdd3",
    },
  },
  {
    id: "openclaw-manager",
    name: "OpenClaw Manager",
    label: "Tooling",
    domain: "claw.biswas.me",
    href: "https://claw.biswas.me",
    tagline: "Self-hosted coding agent control plane.",
    summary: "A minimal operator console over chat, sessions, a workspace, and a handful of integrations — backed by a disposable agent container.",
    detail:
      "OpenClaw Manager is a small, auditable control plane for running a coding agent on your own box. It pairs a password-protected management console with an embedded upstream gateway, runs the agent inside a scoped container, and is reproducible from a single Ansible playbook.",
    stack: ["Go", "Ansible", "Docker", "nginx"],
    highlights: [
      "Pure Go standard library — no framework sprawl, no runtime dependencies.",
      "Disposable agent container with a scoped workspace volume and no host access.",
      "Ansible playbook provisions nginx, Docker, bot container, and gateway on any Ubuntu host.",
    ],
    palette: {
      base: "#0a0c10",
      accent: "#6366f1",
      glow: "#4338ca",
      stroke: "#c7d2fe",
    },
  },
];

const financial: ShowcaseItem[] = [
  {
    id: "trading-pod",
    name: "Trading Pod",
    label: "Trading system",
    domain: "trade.folioworth.com",
    href: "https://trade.folioworth.com",
    tagline: "A regime-following trading system for leveraged index ETFs, built to be verified before it is trusted.",
    summary:
      "An automated system that trades TQQQ against a Nasdaq trend-regime model through Interactive Brokers, with the risk controls and evidence standards written into the code.",
    detail:
      "Leveraged ETFs compound well in sustained uptrends and destroy capital in choppy or falling markets, so the system does not predict prices — it classifies the regime and only accepts leverage when conditions justify it. It holds TQQQ when QQQ is above a rising 200-day average with realised volatility under a gate, and sits in cash otherwise. Position size scales inversely with volatility, exposure is capped well below full deployment, and a portfolio drawdown breaker flattens everything and halts until a human resumes. What I care about most is the verification loop: parameters are validated walk-forward — tuned on a rolling window, scored only on data the optimiser never saw — and the running system continuously compares its live results against a shadow backtest, so divergence surfaces while it is still cheap.",
    stack: ["Go", "SQLite", "IBKR API", "Docker", "Ansible"],
    highlights: [
      "Walk-forward validated: every out-of-sample window positive, tested across 2008, 2020, and 2022 regimes.",
      "Live-vs-backtest drift analysis runs nightly, so the simulation is checked against reality rather than assumed.",
      "Full control plane: strategy and risk parameters are versioned, auditable, and changeable at runtime without a deploy.",
      "Risk pipeline vetoes every order — no margin, capped exposure, drawdown breaker, and an audited kill switch.",
    ],
    palette: {
      base: "#0b0e14",
      accent: "#2dd4a0",
      glow: "#134e4a",
      stroke: "#5eead4",
    },
  },
  {
    id: "questrade-reserve",
    name: "Questrade Reserve",
    label: "Trading system",
    domain: "questrade.folioworth.com",
    href: "https://questrade.folioworth.com",
    tagline: "Disciplined, unattended dollar-cost averaging across a family of registered accounts.",
    summary:
      "A scheduler that places a planned sequence of small ETF purchases across RRSP, LIRA, RESP, and cash accounts, keeping a long-term accumulation plan on track without daily attention.",
    detail:
      "The hard part of dollar-cost averaging is not the strategy, it is doing it consistently for years. This system holds the plan — per-account cash floors, per-symbol order sizes, daily and per-session caps — and works through it automatically, catching up when sessions are missed and stopping when cash floors would be breached. Every order still goes through Questrade's own per-order Push Approval, so the software proposes and the human disposes; the authorisation boundary stays with the broker rather than with my code. A ledger records what was placed, filled, and owed, and a one-way Telegram channel reports each session.",
    stack: ["Go", "Questrade API", "SQLite", "Telegram"],
    highlights: [
      "Plans and tracks accumulation across six accounts with per-account cash floors.",
      "Every trade requires the broker's own Push Approval — nothing executes unattended.",
      "Catch-up logic keeps the long-term plan on schedule after missed sessions.",
      "Durable ledger plus one-way notifications: it can report, never act on a message.",
    ],
    palette: {
      base: "#0f172a",
      accent: "#60a5fa",
      glow: "#1e3a8a",
      stroke: "#bfdbfe",
    },
  },
];

const motivationPoints = [
  "AI is finally useful at the workflow layer. I want software that helps teams think, decide, and ship faster without giving up rigor.",
  "Small, focused systems still win. I keep building alternatives to bloated tools when the underlying workflow can be made clearer.",
  "My writing, products, and libraries all point in the same direction: practical software with strong operational foundations.",
];

const operatingPrinciples = [
  { label: "Speed", text: "Fast interfaces, low operational drag." },
  { label: "Accuracy", text: "Precise execution, fewer avoidable mistakes." },
  { label: "Security", text: "Secure by default, audit-ready always." },
  { label: "AI First", text: "Applied everywhere with guardrails." },
];

function isExternalLink(href?: string) {
  return Boolean(href && /^https?:\/\//.test(href));
}

function handleLinkProps(href?: string) {
  return isExternalLink(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

function ProjectArtwork({
  item,
  className = "",
}: {
  item: ShowcaseItem;
  className?: string;
}) {
  const gradientId = `gradient-${item.id}`;
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
      aria-label={`${item.name} preview`}
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
      <rect x="58" y="284" width="524" height="24" rx="12" fill="#020617" fillOpacity="0.18" />
      <text x="82" y="301" fill="#f8fafc" fontSize="18" fontWeight="700" fontFamily="sans-serif">
        {item.name}
      </text>
      <text x="214" y="301" fill="#cbd5e1" fontSize="14" fontWeight="500" fontFamily="sans-serif">
        {item.domain}
      </text>
      <text x="506" y="301" fill={item.palette.stroke} fontSize="13" fontWeight="700" fontFamily="sans-serif">
        {item.label.toUpperCase()}
      </text>
    </svg>
  );
}

function ShowcaseModal({
  item,
  onClose,
}: {
  item: ShowcaseItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#f8fafc] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-[#f8fafc]/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              {item.label}
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">{item.name}</h3>
          </div>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
              <ProjectArtwork item={item} className="h-auto w-full" />
            </div>

            <div className="space-y-4">
              <p className="text-lg font-medium text-slate-900">{item.tagline}</p>
              <p className="leading-7 text-slate-700">{item.detail}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Highlights
              </h4>
              <ul className="space-y-3">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-slate-700">
                    <span className="mt-2 h-2 w-2 rounded-full bg-slate-900" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Snapshot
              </p>
              <p className="mt-3 leading-7 text-slate-700">{item.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((entry) => (
                  <span
                    key={entry}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Links
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {item.href && (
                  <Link
                    href={item.href}
                    {...handleLinkProps(item.href)}
                    className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>Visit {item.domain}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                {item.repo && (
                  <Link
                    href={item.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span>View source</span>
                    <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowcaseSection({
  id,
  eyebrow,
  title,
  description,
  items,
  onSelect,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: ShowcaseItem[];
  onSelect: (item: ShowcaseItem) => void;
}) {
  return (
    <section id={id} className="border-t border-slate-200/70">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl text-slate-950 md:text-5xl">{title}</h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.45)]"
            >
              <div className="border-b border-slate-200 bg-slate-950/95 p-4">
                <ProjectArtwork item={item} className="h-auto w-full" />
              </div>

              <div className="space-y-5 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {item.label}
                    </span>
                    <span className="text-sm text-slate-500">{item.domain}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">{item.name}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{item.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.stack.slice(0, 3).map((entry) => (
                    <span
                      key={entry}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {entry}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                  >
                    Open details
                  </Button>
                  {item.href && (
                    <Button variant="outline" asChild>
                      <Link href={item.href} {...handleLinkProps(item.href)}>
                        Visit
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  const { RECAPTCHA_SITE_KEY, API_URL } = config;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#resume") {
      setShowPDF(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBlogPosts = async () => {
      setBlogLoading(true);
      try {
        const posts = await fetchBlogPosts();
        if (!cancelled) {
          setBlogPosts(posts.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        if (!cancelled) {
          setBlogLoading(false);
        }
      }
    };

    loadBlogPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.onSubmit = function onSubmit(token) {
      const name = document.getElementById("name") as HTMLInputElement | null;
      const email = document.getElementById("email") as HTMLInputElement | null;
      const message = document.getElementById("message") as HTMLTextAreaElement | null;

      if (!name?.value || !email?.value || !message?.value) {
        setStatus("Please fill in all fields before submitting.");
        return;
      }

      setStatus("Sending...");

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          message: message.value,
          "g-recaptcha-response": token,
        }),
      })
        .then((response) => {
          if (response.type === "opaqueredirect") {
            throw new Error("Received redirect from server");
          }

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            setStatus("Message sent successfully.");
            setFormData({ name: "", email: "", message: "" });
            name.value = "";
            email.value = "";
            message.value = "";
            return;
          }

          setStatus(data.error_message || "Failed to send message.");
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          setStatus("There was an error sending your message. Please email me directly.");
        });
    };
  }, [API_URL]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleSmoothScroll = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    event.preventDefault();
    const element = document.getElementById(targetId.replace("#", ""));

    if (!element) {
      return;
    }

    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />

      <main className="min-h-screen">
        <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f7f5ef]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
            <Link href="/" className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/15">
                AB
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-slate-950 uppercase">
                  Anshuman Biswas
                </p>
                <p className="text-xs text-slate-500">Products, systems, and writing</p>
              </div>
            </Link>

            <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              {[
                ["Description", "#description"],
                ["Work", "#work"],
                ["Products", "#products"],
                ["Financial", "#financial"],
                ["Libraries", "#libraries"],
                ["Writing", "#writing"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={(event) => handleSmoothScroll(event, href)}
                  className="transition hover:text-slate-950"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(20,184,166,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-10 pt-20 md:grid-cols-[1.15fr_0.85fr] md:px-6 md:pb-12 md:pt-24">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  VP of Engineering · Elastio
                </p>
                <h1 className="font-display max-w-4xl text-5xl leading-none text-slate-950 md:text-7xl">
                  I build enterprise software
                </h1>
                <p className="max-w-2xl text-xl leading-8 text-slate-600">
                I&apos;m the VP of Engineering at Elastio, a cybersecurity startup focused on cloud
                data protection and recovery. I build security-focused products, reusable Go
                libraries, and lightweight systems that keep me close to the craft.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => setShowPDF(true)}
                  className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View PDF resume
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/resume">Open HTML resume</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/AnshumanBiswas.pdf" download="Anshuman_Biswas_Resume.pdf">
                    Download PDF
                  </a>
                </Button>
              </div>

              <div className="grid gap-6 border-y border-slate-200/80 py-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-slate-200/80">
                <div className="pr-0 sm:px-5 sm:first:pl-0">
                  <p className="text-3xl font-semibold text-slate-950">~20</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Years building enterprise software, cloud systems, and engineering teams.</p>
                </div>
                <div className="pr-0 sm:px-5">
                  <p className="text-3xl font-semibold text-slate-950">VP</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Engineering leadership at Elastio, building cybersecurity software.</p>
                </div>
                <div className="pr-0 sm:px-5 sm:last:pr-0">
                  <p className="text-3xl font-semibold text-slate-950">20+</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Products, libraries, and tools that extend how I build software.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <Link
                  href="https://github.com/anchoo2kewl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-slate-950"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
                <Link
                  href="https://www.linkedin.com/in/anshuman-biswas-phd-613b0145/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-slate-950"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
                <Link
                  href="mailto:anshuman@biswas.me"
                  className="inline-flex items-center gap-2 transition hover:text-slate-950"
                >
                  <Mail className="h-4 w-4" />
                  anshuman@biswas.me
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l border-slate-200 pl-6 text-slate-900 md:pl-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Now shipping
                  </span>
                  <span className="text-sm text-slate-500">Toronto / Remote</span>
                </div>
                <div className="mt-5 flex items-center gap-5">
                  <img
                    src="/profile-cutout.png"
                    alt="Anshuman Biswas"
                    className="h-32 w-28 object-contain object-bottom"
                  />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-slate-950">Enterprise work first. Builder energy always.</h2>
                    <p className="text-sm leading-6 text-slate-600">
                      Cybersecurity, cloud resilience, and enterprise platform work at Elastio,
                      product experiments and reusable tools.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700">
                  {[
                    ["Elastio", "https://elastio.com"],
                    ["AI Agent Lens", "https://aiagentlens.com"],
                    ["TaskAI", "https://taskai.cc"],
                    ["FlagTGL", "https://flagtgl.com"],
                  ].map(([entry, href]) => (
                    <a
                      key={entry}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-b border-transparent pb-1 text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                    >
                      <span>{entry}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Design bias
                </p>
                <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                  {operatingPrinciples.map((principle, index) => (
                    <div
                      key={principle.label}
                      className="py-4"
                    >
                      <div className="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 md:text-xs">
                        <span>0{index + 1}</span>
                        <span className="text-slate-500">{principle.label}</span>
                      </div>
                      <p className="mt-2 text-[15px] leading-7 text-slate-700 md:text-base">
                        {principle.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="description" className="border-t border-slate-200/70">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-14">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Description
              </p>
              <h2 className="font-display text-4xl text-slate-950 md:text-5xl">
                Enterprise Software operator, product builder, and writer.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                Most of my career has been in enterprise software. I care most about enterprise
                security, durable systems, strong teams, and software that can handle real
                workload. That perspective shapes both my work at Elastio and the systems I keep
                building.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Why I&apos;m building now
              </p>
              <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                {motivationPoints.map((point, index) => (
                  <div
                    key={point}
                    className="py-5"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        0{index + 1}
                      </span>
                      <p className="text-base leading-8 text-slate-700">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Work
              </p>
              <h2 className="font-display text-4xl text-slate-950 md:text-5xl">Career journey</h2>
              <p className="text-lg leading-8 text-slate-600">
                Nearly twenty years across enterprise software, cloud infrastructure, AI-powered
                systems, security, and startup product work.
              </p>
            </div>
            <div className="mt-12">
              <InteractiveTimeline />
            </div>
          </div>
        </section>

        <ShowcaseSection
          id="products"
          eyebrow="Play Projects"
          title="Products I keep building"
          description="Public products across project management, monitoring, feature flags, finance, publishing, and AI agent security."
          items={products}
          onSelect={setSelectedItem}
        />

        <ShowcaseSection
          id="financial"
          eyebrow="Financial Systems"
          title="Money, automated carefully"
          description="Trading and investing systems I run on my own capital. Both are built on the same conviction: automation in markets is only worth having if the risk controls and the evidence are stronger than the strategy."
          items={financial}
          onSelect={setSelectedItem}
        />

        <ShowcaseSection
          id="libraries"
          eyebrow="Libraries"
          title="Libraries and tools I reuse"
          description="The lower-level building blocks behind my apps: editors, drawing surfaces, auth, backup workflows, shell tooling, and build visibility."
          items={libraries}
          onSelect={setSelectedItem}
        />

        <section id="writing" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Writing
              </p>
              <h2 className="font-display text-4xl text-slate-950 md:text-5xl">Recent writing</h2>
              <p className="text-lg leading-8 text-slate-600">
                Essays and technical notes on systems, AI workflows, cloud engineering, and the
                way software should feel when it is built well.
              </p>
            </div>

            <div className="mt-10">
              {blogLoading ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)]"
                    >
                      <div className="aspect-[16/10] animate-pulse bg-slate-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
                        <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {blogPosts.map((post) => (
                    <article
                      key={post.link}
                      className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.45)]"
                    >
                      <Link
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="aspect-[16/10] w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-[16/10] w-full bg-[linear-gradient(135deg,#082f49,#0f172a_45%,#164e63)]" />
                        )}
                        <div className="space-y-4 p-6">
                          <div className="flex items-center justify-between gap-4">
                            {post.categories[0] ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                {post.categories[0]}
                              </span>
                            ) : (
                              <span />
                            )}
                            <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-slate-950 transition group-hover:text-slate-700">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="line-clamp-4 text-sm leading-7 text-slate-600">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {post.date}
                            </span>
                            <span>{post.read_time}</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-6 text-slate-500">
                  No blog posts available at the moment.
                </div>
              )}

              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  View all posts
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Contact
                  </p>
                  <h2 className="font-display text-4xl text-slate-950 md:text-5xl">Let’s talk.</h2>
                  <p className="text-lg leading-8 text-slate-600">
                    If you want to talk about product engineering, AI systems, cloud platforms,
                    or one of the projects above, send a note.
                  </p>
                </div>

                <div className="space-y-3 rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
                  <Link
                    href="mailto:anshuman@biswas.me"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      anshuman@biswas.me
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://github.com/anchoo2kewl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Github className="h-4 w-4" />
                      github.com/anchoo2kewl
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/anshuman-biswas-phd-613b0145/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-3">
                      <Linkedin className="h-4 w-4" />
                      linkedin.com/in/anshuman-biswas-phd
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your name"
                      required
                      onChange={handleChange}
                      value={formData.name}
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:border-slate-400 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      required
                      onChange={handleChange}
                      value={formData.email}
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:border-slate-400 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      id="message"
                      placeholder="What are you building?"
                      rows={5}
                      required
                      onChange={handleChange}
                      value={formData.message}
                      className="rounded-2xl border-slate-200 bg-slate-50 focus:border-slate-400 focus:ring-0"
                    />
                  </div>

                  <Button
                    className="g-recaptcha h-12 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
                    data-sitekey={RECAPTCHA_SITE_KEY}
                    data-callback="onSubmit"
                    data-action="submit"
                    type="submit"
                  >
                    Send message
                  </Button>

                  {status && (
                    <p
                      className={`text-sm ${
                        status.includes("success") ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {status}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <span className="font-semibold text-slate-800">Anshuman Biswas</span>
              <span className="mx-2">·</span>
              <span>Products, libraries, writing, and systems work</span>
            </div>
            <div>© 2026 Anshuman Biswas. All rights reserved.</div>
          </div>
        </footer>

        {showPDF && (
          <SimplePDFViewer
            isOpen={showPDF}
            onClose={() => {
              setShowPDF(false);
              if (typeof window !== "undefined" && window.location.hash === "#resume") {
                history.replaceState("", document.title, window.location.pathname + window.location.search);
              }
            }}
            pdfUrl="/AnshumanBiswas.pdf"
          />
        )}

        <ShowcaseModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </main>
    </>
  );
}
