# Agent & Skills Infrastructure — marketdesk-india

**Project:** Indian Trading Agent SaaS (`~/marketdesk-india/`)
**Research date:** 2026-05-02
**Status:** Production — Vercel frontend + Render backend deployed

---

## Purpose

Build and maintain a production SaaS for Indian traders (NSE/BSE) using AI multi-agent pipelines.

---

## Stack

| Layer | Technology | Deploy |
|-------|-----------|--------|
| Frontend | Next.js 16 + Tailwind + shadcn/ui | Vercel |
| Backend | FastAPI + WebSocket + LangGraph | Render |
| Database | Supabase (Postgres) + SQLite | Supabase |
| Auth | Supabase Auth | — |
| Payments | Razorpay | — |
| LLM | Groq (free tier) | — |
| Data | yfinance (NSE/BSE) | — |

**Live URLs:**
- Frontend: https://indian-trading-agent.vercel.app
- Backend: https://indian-trading-agent.onrender.com

**GitHub:** `manthan89/indian-trading-agent`

**Pricing:** Free (₹0), Pro (₹499/mo), Premium (₹999/mo)

---

## Reference Projects (Ranked by Relevance)

### P0 — Same Stack, Same Domain

| Project | Stack | Why | Repo |
|---------|-------|-----|------|
| Vibe-Trade | Next.js + FastAPI + Groq + yfinance | **Exact stack match** — copy skill framework | `github.com/vibe-trade/vibe-trade` |
| RakshaQuant | LangGraph + Groq + DhanHQ | NSE trading, 7-agent LangGraph pipeline, Groq | `github.com/rakshhha/RakshaQuant` |
| portfoliomanager-pro | Groq + Kite + ChromaDB + SEBI RAG | Indian market, SEBI compliance, Groq | `github.com/dongasmit/portfolio-manager-pro` |
| mohdasif2294/portfolio-copilot | Kite MCP + LangGraph + RAG | Kite Connect (Zerodha), LangGraph, RAG | `github.com/mohdasif2294/portfolio-copilot` |
| mokshablr/ai-stock-portfolio-manager | Ollama + yfinance + Indian stocks | Local LLM + Indian stocks + PDF reports | `github.com/mokshablr/ai-stock-portfolio-manager` |

### P1 — Trading MCP Servers

| Project | What | Repo |
|---------|-------|------|
| OKX/agent-trade-kit | MCP server with 140+ tools for crypto | `github.com/okx/xCryptoagent-trade-kit` |
| Kite Connect MCP | Zerodha Kite Connect integration | MCP for Indian brokerage |
| DhanHQ MCP | Paper trading API for India | RakshaQuant uses this |

### P2 — Dev Workflow Agents

| Project | What | Repo |
|---------|-------|------|
| PAUL | Plan-Apply-Unify Loop for structured dev | `github.com/ChristopherKahler/paul` |
| SEED | Type-safe AI project incubator | `github.com/ChristopherKahler/seed` |
| AI-Team-Orchestrator | 14-sub-agent + FastAPI | `github.com/khaoss85/AI-Team-Orchestrator` |

### P3 — OpenCode Agents & Persistence

| Project | What | Repo |
|---------|-------|------|
| context-harness | OpenCode session persistence | `github.com/co-labs-co/context-harness` |
| opencode-mcp | MCP server for OpenCode + multi-agent delegation | `github.com/jinto-ag/opencode-mcp` |
| opencode-mcp | MCP server for OpenCode CLI | `github.com/nosolosoft/opencode-mcp` |

### P4 — Trading Frameworks

| Project | What | Repo |
|---------|-------|------|
| TradingAgents | LangGraph multi-agent financial framework | `github.com/ritesh-7299/trading-agents` |
| SuperiorAgents | Autonomous crypto multi-agent | `github.com/Elisa Finance/superior-agents` |
| flukelaster/ai-trading-agent | 8-agent multi-symbol trading | `github.com/flukelaster/ai-trading-agent` |
| oakko-dev/ai-trading-agent | 8-agent Claude multi-agent for MT5 | `github.com/oakko-dev/ai-trading-agent` |

---

## Multi-Agent Architecture (Based on RakshaQuant)

Target: 7-agent LangGraph pipeline for NSE trading:

| Agent | Role |
|-------|------|
| Orchestrator | Entry point, routes to other agents, combines outputs |
| Technical | Charts, indicators, patterns, support/resistance |
| Fundamental | Financials, sector analysis, earnings |
| Risk | Position sizing, stop loss, drawdown check |
| Sentiment | News, social, FII/DII data |
| Strategy | Entry/exit signals, trade plan |
| Optimizer | Backtest, parameter tuning |

**Existing backend structure** already has routers for: analysis, market_data, watchlist, strategies, scanner, recommender, performance, backtest, simulation, insights, settings, news, auth, payments — 14 routers that map well to agent capabilities.

---

## Skills Framework (Based on Vibe-Trade)

Vibe-Trade has a skill-based agent system where each skill is a self-contained prompt + tool definition. For this project:

| Skill | Description |
|-------|-------------|
| `market-data-skill` | Real-time NSE/BSE data via yfinance |
| `technical-analysis-skill` | Chart patterns, indicators, S/R levels |
| `fundamental-analysis-skill` | Financials, ratios, sector comparison |
| `news-skill` | RSS feeds, news aggregation, sentiment |
| `risk-management-skill` | Position sizing, stop loss, portfolio risk |
| `strategy-skill` | Strategy selection and parameterization |
| `backtest-skill` | Historical performance testing |
| `paper-trade-skill` | Paper trading execution |
| `insights-skill` | AI-generated trading insights |

---

## Implementation Plan

### Phase 1: Fix Client-Side Navigation (URGENT)
- All internal links in Next.js app use `/app/` prefix
- This was identified as broken — clicking links inside the app returns 404
- Fix: Update all `router.push()` calls and `href` attributes in `frontend/app/app/`
- After fix: Commit + push to Vercel → verify navigation works

### Phase 2: Backend API Integration
- Set `NEXT_PUBLIC_API_URL` in Vercel dashboard to `https://indian-trading-agent.onrender.com`
- Test API calls from frontend to Render backend
- Verify auth middleware works with Supabase JWT

### Phase 3: Multi-Agent Pipeline (Based on RakshaQuant)
- Map existing 14 FastAPI routers to 7 agent roles
- Build LangGraph orchestrator in `backend/agents/`
- Connect Groq LLM to each agent
- Add DhanHQ paper trading integration

### Phase 4: Skills Framework (Based on Vibe-Trade)
- Create skill definitions in `backend/skills/`
- Each skill: prompt template + tool definitions + output schema
- Integrate with existing routers
- Frontend skill selector UI in Settings

### Phase 5: MCP Server Integration
- Add Kite Connect MCP (Zerodha) for live brokerage data
- Add DhanHQ MCP for paper trading
- Build custom MCP for this project

### Phase 6: SEBI RAG (Based on portfoliomanager-pro)
- Build RAG pipeline for SEBI regulations
- Add Indian market knowledge base
- Connect to analysis + insights agents

---

## Key Files

| File | Purpose |
|------|---------|
| `docs/CTO_BRAIN.md` | Stack, rules, status |
| `docs/CEO_BRAIN.md` | Customer, pricing, focus |
| `agents/CTO_AGENT.md` | Think like CTO |
| `agents/CEO_AGENT.md` | Think like founder |
| `PLAN.md` | Build plan with blocking issues |
| `docs/BUGS.md` | Known bugs |
| `docs/ARCHITECTURE.md` | System architecture |
| `render.yaml` | Render deployment config |
| `frontend/app/` | Next.js app routes (28 routes) |
| `backend/` | FastAPI + LangGraph backend (14 routers) |

---

## Open Questions

1. **DhanHQ vs Kite Connect?** DhanHQ free paper trading → start there
2. **Groq rate limits?** Free tier has limits → budget tokens across agents
3. **LangGraph or custom?** RakshaQuant uses LangGraph → follow that pattern
4. **RAG scope?** Stock fundamentals + news + technical + SEBI compliance
5. **Skills: clone Vibe-Trade or build from scratch?** Clone + adapt

---

*Research conducted via web search. Full detailed findings in compressed blocks `b1`, `b2`, `b3`, `b4`.*
