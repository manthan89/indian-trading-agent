# Indian Trading Agent — Installation Guide

Quick start for deploying the Indian Trading Agent on Hermes (or any Linux server).

## Prerequisites

| Component | Version |
|-----------|---------|
| Server | Linux with systemd |
| Node.js | 18+ |
| Python | 3.10+ |
| Ollama | Running on port 11434 |
| Tailscale | Installed for remote access |

## Quick Install (Existing Setup)

If repo is already cloned and configured:

```bash
# Start backend
cd ~/indian-trading-agent
source venv/bin/activate
sudo systemctl start ita-backend

# Start frontend
cd ~/indian-trading-agent/frontend
pm2 start ecosystem.config.js
pm2 save
```

## Full Installation

### 1. Clone & Setup

```bash
cd ~
git clone https://github.com/pradeepsiddappa/indian-trading-agent.git
cd indian-trading-agent
```

### 2. Python Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -e .
pip install fastapi uvicorn websockets aiosqlite numpy feedparser
```

### 3. Configure LLM (Optional — defaults to free recommendations)

```bash
# Create .env file
cat > .env << 'EOF'
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3.5-250k:tools
BROKER_MODE=paper
EOF
```

### 4. Backend Service

```bash
# Create systemd service
sudo tee /etc/systemd/system/ita-backend.service > /dev/null << 'EOF'
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
EOF

sudo systemctl daemon-reload
sudo systemctl enable ita-backend
sudo systemctl start ita-backend
```

### 5. Frontend Setup

```bash
cd ~/indian-trading-agent/frontend
npm install
```

### 6. Configure API URLs

```bash
# Edit .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://100.67.246.96:8000
EOF
```

### 7. Next.js CORS Config

```bash
# Edit next.config.ts
cat > frontend/next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.67.246.96", "192.168.29.76"],
};

export default nextConfig;
EOF
```

### 8. Backend CORS (add to startup)

```bash
# Edit backend/app.py — add to allow_origins:
# "http://100.67.246.96:3001", "http://192.168.29.76:3001"
```

### 9. PM2 for Frontend

```bash
npm install -g pm2

# Create ecosystem config
cat > frontend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ita-frontend',
    script: 'node_modules/.bin/next',
    args: 'dev -p 3001',
    cwd: '/home/human/indian-trading-agent/frontend',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true
  }]
};
EOF

pm2 start frontend/ecosystem.config.js
pm2 save
```

## Access URLs

| Network | URL |
|---------|-----|
| Tailscale (remote) | http://100.67.246.96:3001 |
| Local WiFi | http://192.168.29.76:3001 |

## Management Commands

### Frontend (PM2)
```bash
pm2 status ita-frontend
pm2 logs ita-frontend
pm2 restart ita-frontend
```

### Backend (systemd)
```bash
sudo systemctl status ita-backend
sudo systemctl restart ita-backend
sudo journalctl -u ita-backend -n 50 --no-pager
```

## Troubleshooting

### "Cannot connect to backend"
1. Check backend running: `sudo systemctl status ita-backend`
2. Check CORS config in `backend/app.py` — includes your IP
3. Restart backend: `sudo systemctl restart ita-backend`

### Frontend shows "Loading..." forever
1. Check Next.js config: `allowedDevOrigins` includes your IP
2. Restart frontend: `pm2 restart ita-frontend`
3. Check logs: `pm2 logs ita-frontend --err`

### Data not loading
1. Test API directly: `curl http://localhost:8000/api/recommend/`
2. Check backend health: `curl http://localhost:8000/api/health`

## Features Working

- ✅ Today's Top Picks (nifty100 recommendations)
- ✅ Sector Heatmap (3-month performance)
- ✅ Market Scanner (Gap/Volume/Breakout)
- ✅ Support/Resistance levels
- ✅ Cyclical patterns (seasonality)
- ✅ Paper trading simulation
- ✅ Watchlist (persistent)
- ✅ Learning Insights
- ✅ Deep Analysis (requires LLM API key)

## Architecture

```
Frontend (Next.js 16)     :3001  ← PM2
        ↓ API calls
Backend (FastAPI)         :8000  ← systemd
        ↓
TradingAgents (LangGraph) ← yfinance (NSE/BSE data)
        ↓
Recommended LLM         ← Ollama (local) or cloud API
```

## Costs

| Feature | Cost |
|---------|------|
| Recommendations | FREE (yfinance) |
| Market Scanner | FREE |
| Deep Analysis | Rs.8-70 per run (depends on LLM) |