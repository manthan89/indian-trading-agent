# Agent & Skills Infrastructure — Research Document

**Project:** Indian Trading Agent SaaS (`marketdesk-india`)
**Research date:** 2026-05-02
**Status:** Compressed into `b1`, `b2`, `b3`, `b4`

---

## Purpose

Build and maintain a production SaaS for Indian traders (NSE/BSE) using AI multi-agent pipelines. Research covers:

1. Multi-agent orchestration frameworks
2. Skill-based agent systems
3. MCP servers for trading
4. Session persistence / context continuity
5. Reference projects (same stack or same domain)

---

## Stack of This Project

| Layer | Technology | Deploy |
|-------|-----------|--------|
| Frontend | Next.js 16 + Tailwind + shadcn/ui | Vercel |
| Backend | FastAPI + WebSocket + LangGraph | Render |
| Database | Supabase (Postgres) + SQLite | Supabase |
| Auth | Supabase Auth | — |
| Payments | Razorpay | — |
| LLM | Groq (free tier) | — |
| Data | yfinance (NSE/BSE) | — |

---

## Phase 1: Immediate Wins (Copy-Paste Ready)

### context-harness
- **What:** OpenCode session persistence across CLI restarts
- **Why:** Never lose OpenCode context again — agent state, decisions, conversation history persist
- **Repo:** `github.com/co-labs-co/context-harness`
- **Status:** Low effort, high value

### opencode-mcp
- **What:** MCP server that connects OpenCode to external tools (file system, code review, task execution)
- **Why:** Allows OpenCode to delegate to external agents, run code, manage files — directly applicable to agent team workflows
- **Repos:**
  - `github.com/nosolosoft/opencode-mcp` — MCP server for OpenCode CLI
  - `github.com/jinto-ag/opencode-mcp` — production-grade with multi-agent delegation

### Vibe-Trade
- **What:** Skill-based AI agent system with Next.js frontend + FastAPI backend + Groq + yfinance
- **Why:** **Exact same stack** as this project. Could be the most directly applicable reference.
- **Repo:** `github.com/vibe-trade/vibe-trade` (see compressed notes for full path)
- **Status:** Highest relevance — study the skill framework and port patterns

### context-harness — session persistence
- **What:** Persistent context across OpenCode sessions
- **Why:** Saves research, decisions, file changes between sessions — critical for long-term projects
- **Action:** Clone, read the implementation, write a similar tool for OpenCode CLI

---

## Phase 2: Multi-Agent Architecture

### RakshaQuant — NSE + LangGraph + Groq (Most Relevant)
- **What:** 7-agent LangGraph pipeline for NSE trading with Groq + DhanHQ (paper trading API)
- **Why:** Same market (NSE), same LLM (Groq), same domain. 7 agents in a LangGraph orchestrator.
- **Agents:** Orchestrator + Technical + Fundamental + Risk + Sentiment + Strategy + Optimizer
- **Integration:** DhanHQ for live paper trading
- **Status:** Gold standard reference for this project

### portfoliomanager-pro — B2B Wealth + SEBI RAG
- **What:** B2B wealth management with Groq + Kite Connect + ChromaDB RAG for SEBI compliance
- **Why:** Indian market + SEBI compliance + RAG for regulatory knowledge + Groq
- **Stack:** Groq + Kite Connect (Zerodha) + ChromaDB + Next.js
- **Status:** Study the RAG + compliance layer for Indian market

### mohdasif2294/portfolio-copilot
- **What:** Kite MCP + LangGraph + RAG + Claude/Ollama for Indian stocks
- **Why:** Kite Connect integration (Zerodha), LangGraph pipeline, RAG for stock research
- **Status:** Kite Connect integration patterns are directly applicable

### TradingAgents (LangGraph)
- **What:** Multi-agent framework for financial analysis using LangGraph
- **Why:** Core orchestrator patterns for multi-agent pipelines
- **Repo:** `github.com/ritesh-7299/trading-agents` (see b1)
- **Status:** Study the LangGraph architecture, map to trading agent pipeline

### SuperiorAgents
- **What:** Autonomous crypto trading with multi-agent framework
- **Why:** Production-grade multi-agent patterns (multi-agent, self-correcting, real-time)
- **Repo:** `github.com/Elisa Finance/superior-agents` (see b1)

---

## Phase 3: MCP Servers

### OKX/agent-trade-kit
- **What:** MCP server with 140+ tools for crypto trading
- **Why:** MCP server patterns for trading — tool definitions, request/response schemas, streaming
- **Repo:** `github.com/okx/xCryptoagent-trade-kit`
- **Status:** Study MCP server design for trading tools

### Kite Connect MCP
- **What:** MCP server for Zerodha Kite Connect (Indian brokerage)
- **Why:** Live market data, order placement, portfolio tracking — directly applicable
- **Status:** Required for real paper/live trading integration

### DhanHQ MCP
- **What:** MCP server for Dhan (Indian trading platform, paper trading)
- **Why:** Paper trading without risking money — RakshaQuant uses this
- **Status:** Good first integration target

---

## Phase 4: Dev Workflow Agents

### PAUL (Plan-Apply-Unify Loop)
- **What:** Structured AI coding workflow: Plan → Apply → Unify
- **Why:** Enforces quality gates — plan before coding, unify after changes
- **Repo:** `github.com/ChristopherKahler/paul`
- **Status:** Copy the workflow into OpenCode agent instructions

### SEED
- **What:** Type-safe AI project incubator for Claude Code
- **Why:** Guided ideation with type-safe structure
- **Repo:** `github.com/ChristopherKahler/seed`
- **Status:** Interesting for project bootstrapping

### AI-Team-Orchestrator
- **What:** 14-sub-agent platform with FastAPI backend
- **Why:** FastAPI + multi-agent orchestration — same backend stack
- **Repo:** `github.com/khaoss85/AI-Team-Orchestrator`
- **Status:** Study the FastAPI + sub-agent pattern

---

## Phase 5: OpenCode Agent Team

### opencode-mcp (jinto-ag)
- **What:** Production MCP for OpenCode with multi-agent delegation
- **Why:** Allows spawning sub-agents that run in separate contexts — exactly what this project needs
- **Repo:** `github.com/jinto-ag/opencode-mcp`
- **Status:** Study the multi-agent delegation pattern

### context-harness (co-labs-co)
- **What:** Session continuity for OpenCode CLI
- **Why:** Research, decisions, file changes persist across restarts
- **Repo:** `github.com/co-labs-co/context-harness`
- **Status:** Clone and adapt for project context persistence

---

## Reference Projects Summary

| Project | Domain | Stack | Relevance | Priority |
|---------|--------|-------|-----------|----------|
| Vibe-Trade | AI trading agent | Next.js + FastAPI + Groq + yfinance | **EXACT** | 🔴 P0 |
| RakshaQuant | NSE trading | LangGraph + Groq + DhanHQ | **EXACT** | 🔴 P0 |
| portfoliomanager-pro | Indian wealth | Groq + Kite + ChromaDB + SEBI RAG | **HIGH** | 🔴 P0 |
| mohdasif2294/portfolio-copilot | Indian stocks | Kite MCP + LangGraph + RAG | **HIGH** | 🔴 P0 |
| OKX/agent-trade-kit | Crypto MCP | MCP + 140 tools | MEDIUM | 🟡 P1 |
| PAUL | Dev workflow | Claude Code workflow | MEDIUM | 🟡 P1 |
| AI-Team-Orchestrator | Multi-agent | FastAPI + 14 agents | MEDIUM | 🟡 P1 |
| opencode-mcp | OpenCode MCP | OpenCode + multi-agent | HIGH | 🟡 P1 |
| context-harness | Session persistence | OpenCode CLI | **HIGH** | 🟡 P1 |
| SuperiorAgents | Crypto trading | Multi-agent framework | LOW | 🟢 P2 |
| TradingAgents | Financial LangGraph | LangGraph | MEDIUM | 🟢 P2 |

---

## Top 5 Projects to Study First

1. **Vibe-Trade** — exact same stack, skill framework, trading patterns
2. **RakshaQuant** — NSE market, LangGraph, Groq, 7-agent pipeline
3. **portfoliomanager-pro** — Indian market, SEBI RAG, Groq, Kite Connect
4. **mohdasif2294/portfolio-copilot** — Kite MCP + LangGraph + RAG
5. **context-harness** — OpenCode session persistence for long-term research

---

## Immediate Next Steps

### Week 1: Infrastructure
1. Clone and study Vibe-Trade — extract skill framework patterns
2. Clone context-harness — adapt for project research persistence
3. Set up opencode-mcp — enable multi-agent delegation
4. Document extracted patterns into `docs/SKILLS.md`

### Week 2: Multi-Agent
1. Clone RakshaQuant — study 7-agent LangGraph pipeline
2. Clone portfoliomanager-pro — study SEBI RAG + Kite integration
3. Design project multi-agent architecture (Orchestrator + Analyst + Risk + Strategy + Executor)
4. Map to existing backend structure

### Week 3: Integration
1. Add Kite Connect MCP or DhanHQ integration (paper trading)
2. Build RAG pipeline for Indian market data + regulatory knowledge
3. Connect to existing FastAPI backend
4. Test with sample stocks

### Week 4: Polish
1. Add skill definitions for trading agent tasks
2. Create agent team configuration
3. Test end-to-end pipeline
4. Document for future maintenance

---

## Open Questions

1. **DhanHQ vs Kite Connect?** DhanHQ has free paper trading API — good for testing without risk
2. **Groq rate limits?** Free tier has limits — need to budget token usage across agents
3. **Multi-agent orchestration?** Should we use LangGraph (like RakshaQuant) or custom orchestrator?
4. **RAG for what?** Stock fundamentals + news + technical patterns + SEBI compliance
5. **Skills framework?** Vibe-Trade skill system — should we clone or build from scratch?

---

## Key Files in Project

| File | Purpose |
|------|---------|
| `docs/CTO_BRAIN.md` | Stack, rules, status |
| `docs/CEO_BRAIN.md` | Customer, pricing, focus |
| `agents/CTO_AGENT.md` | Think like CTO |
| `agents/CEO_AGENT.md` | Think like founder |
| `PLAN.md` | Build plan with blocking issues |
| `docs/BUGS.md` | Known bugs |
| `docs/ARCHITECTURE.md` | System architecture |
| `frontend/app/` | Next.js app routes |
| `backend/` | FastAPI + LangGraph backend |
| `render.yaml` | Render deployment config |

---

*Research conducted via web search for: AI agent frameworks, MCP trading servers, Indian stock market agents, OpenCode multi-agent setup, skill-based agent systems.*
*Compressed from full conversation — see `b1`, `b2`, `b3`, `b4` for detailed findings.*
