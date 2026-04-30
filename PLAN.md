# Indian Trading Agent — Build Plan

## Project Identity

| Field | Value |
|---|---|
| **Name** | `indian-trading-agent` |
| **Location** | `~/indian-trading-agent/` |
| **Mode** | WebUI (Next.js 16) + FastAPI backend + Paper Trading |
| **LLM** | `qwen3.5-250k:tools` via Ollama (tool-calling variant, 2x RTX 2060 12GB) |
| **Data** | Finstack MCP (95+ tools, NSE/BSE, no API key) + yfinance |
| **Broker** | Nuvama (AngelOne) — paper trading only |
| **Isolation** | Separate `.venv`, own `opencode.json` (no base MCPs) |

---

## Filesystem Structure

```
~/indian-trading-agent/
├── PLAN.md                     # This file — updated on every step
├── .gitignore
│
├── # === PRADEEP SIDDAPPA REPO (cloned directly, no fork) ===
│
├── tradingagents/              # Core AI pipeline (vendored from pradeepsiddappa)
│   ├── agents/                # 6 agents: tech/fund/sentiment/macro analysts,
│   │   ├── market_analyst.py   #   bull/bear researchers, trader, risk manager
│   │   ├── social_analyst.py   #   + portfolio manager (v0.2.4+)
│   │   ├── news_analyst.py
│   │   ├── fundamental_analyst.py
│   │   ├── bull_researcher.py
│   │   ├── bear_researcher.py
│   │   ├── trader.py
│   │   ├── risk_manager.py
│   │   └── portfolio_manager.py
│   ├── dataflows/             # Data adapters — PATCH NEEDED
│   │   ├── interface.py        # Base: route_to_vendor tool
│   │   ├── yfinance_adapter.py # Works for .NS/.BSE (no changes)
│   │   └── indian_markets.py   # CUSTOM: Finstack MCP as primary vendor
│   ├── graph/                 # LangGraph orchestration
│   │   ├── trading_graph.py   # TradingAgentsGraph — main entry
│   │   ├── state.py           # AgentState schema
│   │   ├── nodes.py
│   │   └── edges.py
│   ├── llm/                   # LLM provider factory
│   │   ├── factory.py         # create_llm_client()
│   │   └── providers/
│   │       └── ollama.py      # Ollama provider (OpenAI compat)
│   ├── default_config.py      # DEFAULT_CONFIG — CRITICAL to review
│   └── prompts/               # Custom agent prompts
│       └── india_context.py   # IST timezone, NSE/BSE holidays
│
├── backend/                   # FastAPI REST + WebSocket API
│   ├── app/
│   │   ├── main.py            # FastAPI app — startup loads finstack tools
│   │   ├── api/
│   │   │   ├── analyze.py     # POST /api/analyze → streaming
│   │   │   ├── scanner.py     # GET /api/scanner
│   │   │   ├── market.py      # GET /api/market
│   │   │   ├── watchlist.py   # CRUD watchlist
│   │   │   ├── paper_trade.py # POST /api/paper-order
│   │   │   └── history.py     # GET /api/history
│   │   ├── agents/
│   │   │   └── mcp_wrapper.py # Wraps Finstack MCP as LangGraph tool
│   │   ├── execution/
│   │   │   ├── paper_engine.py # Paper trading engine (mock fills)
│   │   │   └── nuvama_client.py # SmartAPI wrapper (paper mode)
│   │   ├── strategies/
│   │   │   ├── scanner.py     # Gap/volume/breakout
│   │   │   ├── signals.py     # Unified recommendation engine
│   │   │   └── backtest.py    # Historical backtesting
│   │   └── schemas/           # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # Next.js 16 WebUI (pradeepsiddappa)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── analysis/page.tsx
│   │   │   ├── scanner/page.tsx
│   │   │   ├── strategies/page.tsx
│   │   │   └── paper-trade/page.tsx
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui
│   │   │   ├── charts/        # TradingView charts
│   │   │   └── analysis/      # Streaming output
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── websocket.ts
│   │   │   ├── store.ts       # Zustand
│   │   │   └── types.ts
│   │   └── hooks/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local
│
│
├── # === LOCAL ADDITIONS ===
│
├── data/
│   ├── cache/market_cache/   # yfinance/finstack data per ticker
│   ├── watchlists/           # JSON watchlists
│   │   ├── default.json
│   │   └── custom/
│   ├── signals/              # Agent decisions & scores
│   └── backtests/            # Historical backtest results
│
├── outputs/                  # Agent run outputs
│   ├── logs/                 # Streaming logs per run
│   │   └── YYYYMMDD_HHMMSS/
│   ├── decisions/            # Persistent decision log (SQLite)
│   └── reports/              # Generated markdown reports
│
├── finstack_tools/           # Finstack MCP tool manifests
│   └── tools.json           # Auto-generated list of 95+ tools
│
├── notebooks/                # Jupyter notebooks
│   ├── analyze_ticker.ipynb
│   └── backtest_strategy.ipynb
│
├── scripts/
│   ├── setup.sh              # One-time setup
│   ├── start_backend.sh      # uvicorn backend
│   ├── start_frontend.sh     # npm run dev
│   ├── start_all.sh          # Backend + frontend together
│   ├── run_analysis.py       # Direct Python analysis
│   ├── test_finstack.py      # Verify MCP connectivity
│   ├── init_watchlist.py      # Create default Nifty 50 watchlist
│   └── check_gpu.sh           # Verify Ollama + VRAM
│
├── tests/
│   ├── test_tradingagents.py
│   ├── test_finstack.py
│   ├── test_paper_order.py
│   └── test_frontend.py
│
├── logs/
│   ├── backend.log
│   └── frontend.log
│
├── cli/                      # CLI mode (optional)
│   └── main.py
│
├── # === CONFIG FILES ===
│
├── .env                      # Secrets (gitignored)
├── .env.example              # Template from repo
├── opencode.json             # Isolated MCP config (finstack + ollama-bridge only)
│
└── README.md                 # Local usage guide
```

---

## Configuration

### `.env` (secrets — gitignored)
```env
# ===== LLM =====
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3.5-250k:tools
OLLAMA_API_KEY=sk-local

# ===== Broker (Nuvama / AngelOne) =====
ANGELONE_API_KEY=your_api_key_here
ANGELONE_CLIENT_ID=your_client_id
ANGELONE_PASSWORD=your_password
ANGELONE_TOTP_SECRET=your_totp_secret
BROKER_MODE=paper

# ===== App =====
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `opencode.json` (isolated)
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "finstack": {
      "command": ["python", "-m", "finstack.server"],
      "type": "local"
    },
    "ollama-bridge": {
      "command": ["ollama-mcp"],
      "type": "local"
    }
  },
  "model": "opencode/minimax-m2.5-free"
}
```

---

## Step-by-Step Build Plan

### Step 1 — Initial Setup (in progress)
- [x] Create `~/indian-trading-agent/` directory
- [ ] Clone `pradeepsiddappa/indian-trading-agent`
- [ ] Create `opencode.json` with finstack + ollama-bridge only
- [ ] Create `.gitignore`
- [ ] Save this PLAN.md

### Step 2 — Python Environment
- [ ] Create venv: `uv venv .venv`
- [ ] Install Python deps
- [ ] Verify Ollama has `qwen3.5-250k:tools` available
- [ ] Run `scripts/test_finstack.py`
- [ ] Run GPU check

### Step 3 — Core Config
- [ ] Review `default_config.py` — set model to `qwen3.5-250k:tools`
- [ ] Verify Ollama provider works with tool-calling model
- [ ] Test single-agent run

### Step 4 — Finstack Integration
- [ ] Install finstack-mcp
- [ ] Generate tools manifest
- [ ] Review key tools
- [ ] Create `mcp_wrapper.py`
- [ ] Create `indian_markets.py` dataflow

### Step 5 — Indian Market Customization
- [ ] Create `india_context.py` prompts
- [ ] Patch analyst prompts for `.NS` tickers
- [ ] Test agent pipeline with Indian ticker

### Step 6 — Paper Trading (Nuvama)
- [ ] Install smartapi-python
- [ ] Create nuvama_client.py (paper mode)
- [ ] Create paper_engine.py
- [ ] Implement paper-order endpoint

### Step 7 — Backend
- [ ] Create FastAPI app
- [ ] Implement all API endpoints
- [ ] Start backend, test endpoints

### Step 8 — Frontend
- [ ] npm install
- [ ] Start frontend
- [ ] Integration test full pipeline

### Step 9 — Polish & Docs
- [ ] Create start_all.sh
- [ ] Write README.md
- [ ] Update PLAN.md

---

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Repo | Clone directly | Ready-to-use, no fork needed |
| TradingAgents | v0.2.4 | Structured output, checkpoint resume, Qwen support |
| LLM | `qwen3.5-250k:tools` | Tool-calling variant, 250K context, runs on Ollama |
| Data MCP | Finstack | NSE/BSE native, 95+ tools, MIT, no API key |
| Broker | Nuvama paper only | Existing account, mock fills, no static IP needed |
| Frontend port | 3000 (default) | No conflicts |
| Backend port | 8000 (default) | Standard |
| Persistence | JSON + SQLite | Simple, no extra DB |

---

## Open Questions

| # | Question | Depends On |
|---|---|---|
| Q1 | Does finstack-mcp work as stdio MCP in opencode.json? | Step 2 |
| Q2 | Does TradingAgents Ollama provider work with tool-calling model? | Step 3 |
| Q3 | Does SmartAPI paper mode work without real TOTP? | Step 6 |
| Q4 | VRAM budget when frontend runs alongside Ollama? | Step 8 |

---

## ✅ IMPLEMENTED: Persistence Layer

### Status: COMPLETE (2026-04-29)
- [x] PM2 installed: `npm install -g pm2`
- [x] Ecosystem config: `/home/human/indian-trading-agent/frontend/ecosystem.config.js`
- [x] Frontend runs via PM2: `pm2 start ecosystem.config.js`
- [x] PM2 state saved: `pm2 save`
- [x] Systemd backend service created at `/etc/systemd/system/ita-backend.service`
- [x] Backend enabled and running: `sudo systemctl enable/start ita-backend`

### URLs (via Tailscale)
- **Frontend**: http://100.67.246.96:3001
- **Backend API**: http://100.67.246.96:8000
- **API Docs**: http://100.67.246.96:8000/docs

### Key Fix
The initial command failed because `pm2 start npm -- dev` didn't work. Created ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'ita-frontend',
    script: 'node_modules/.bin/next',
    args: 'dev -p 3001',
    cwd: '/home/human/indian-trading-agent/frontend',
    instances: 1,
    exec_mode: 'fork'
  }]
};
```

### Management Commands
```bash
# Frontend (PM2)
pm2 status ita-frontend
pm2 logs ita-frontend
pm2 restart ita-frontend

# Backend (systemd)
sudo systemctl status ita-backend
sudo systemctl restart ita-backend
```

---

## Service Persistence Plan (Reference)

### Problem
- Backend (uvicorn) crashes when stdin/stdout close
- Services don't auto-restart on crash
- systemd user services fail with status=216/GROUP

### Solution: PM2 + Systemd Hybrid

| Component | Tool | Reason |
|-----------|------|--------|
| Frontend (Next.js) | PM2 | Better Node.js process management |
| Backend (FastAPI) | Systemd | Better Python process management |

### Implementation

#### Frontend - PM2
```bash
# Install PM2
npm install -g pm2

# Start frontend with PM2
cd ~/indian-trading-agent/frontend
pm2 start npm --name "ita-frontend" -- dev -- -p 3001

# Persist across reboots
pm2 save
pm2 startup systemd
```

#### Backend - Systemd Service
Create `/etc/systemd/system/ita-backend.service`:
```ini
[Unit]
Description=Indian Trading Agent Backend
After=network.target

[Service]
Type=simple
User=human
WorkingDirectory=/home/human/indian-trading-agent
Environment="PATH=/home/human/indian-trading-agent/venv/bin:/usr/local/bin:/usr/bin"
ExecStart=/home/human/indian-trading-agent/venv/bin/python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ita-backend
sudo systemctl start ita-backend
```

---

## ✅ FINAL STATUS - ALL WORKING (2026-04-29)

### Access URLs (via Tailscale)
- **Frontend**: http://100.67.246.96:3001
- **Backend API**: http://100.67.246.96:8000
- **API Docs**: http://100.67.246.96:8000/docs

### Local Access (same network)
- **Frontend**: http://192.168.29.76:3001
- **Backend API**: http://192.168.29.76:8000

### Key Fixes Applied
1. **Frontend API URL** (`.env.local`): `NEXT_PUBLIC_API_URL=http://100.67.246.96:8000`
2. **Next.js CORS** (`next.config.ts`): Added `allowedDevOrigins: ["100.67.246.96", "192.168.29.76"]`
3. **Backend CORS** (`app.py`): Added Tailscale IPs to `allow_origins`
4. **Persistence**: PM2 for frontend, systemd for backend

### Running Services
```bash
pm2 status ita-frontend  # Frontend running on port 3001
sudo systemctl status ita-backend  # Backend running on port 8000
```

### Data Verified Working
- Today's Top Picks: ETERNAL, ITC, NHPC, VEDL, etc. (nifty100)
- Sector Heatmap: 3-month performance data
- Recommendations engine: Full signal analysis

### URLs (via Tailscale)
- Frontend: http://100.67.246.96:3001
- Backend API: http://100.67.246.96:8000
- API Docs: http://100.67.246.96:8000/docs

---

*Last updated: 2026-04-29*