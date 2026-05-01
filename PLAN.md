# Indian Trading Agent SaaS — Build Plan

## Project Identity

| Field | Value |
|---|---|
| **Name** | `marketdesk-india` |
| **Location** | `~/marketdesk-india/` |
| **Mode** | SaaS — Next.js frontend (Vercel) + FastAPI backend (Render) |
| **LLM** | Groq (free tier, GROQ_API_KEY) |
| **Data** | yfinance (NSE/BSE) |
| **Auth** | Supabase Auth (email + Google OAuth) |
| **Payments** | Razorpay (Phase 3) |
| **Isolation** | Separate project, independent of `~/indian-trading-agent/` |

---

## Architecture

```
frontend/ (Next.js 16 + Tailwind + shadcn/ui + Open Sans)  → Vercel
    |
backend/ (FastAPI + WebSocket)                             → Render
    |
tradingagents/ (LangGraph multi-agent pipeline)
    |
yfinance + RSS feeds (NSE/BSE data + news)
```

## What's Done ✅

### Frontend (28 routes)
- Landing page with Hero, Features, Pricing, CTA
- Auth: Login, Signup, Google OAuth, callback handler
- Pricing page (3 tiers)
- Protected app: Dashboard, Analysis, Backtest, Charts, History, Insights, News, Performance, Recommendations, Scanner, Settings, Simulation, Strategies (with S/R + Cyclical)
- Supabase auth: AuthProvider, LoginForm, SignupForm, TierGate
- Zustand stores: auth state, analysis state
- Proxy middleware for route protection

### Backend (14 routers)
- Analysis, market_data, watchlist, strategies, scanner, recommender, performance, backtest, simulation, insights, settings, news, auth, payments
- Auth middleware (JWT verify + tier check)
- SQLite persistence (watchlist, history, paper trades, settings)
- WebSocket streaming for analysis

### Deployment
- Vercel frontend: https://indian-trading-agent.vercel.app
- Render blueprint: render.yaml (ready to deploy)
- Railway backup: railway.json

### Supabase
- Project: vnupihfbbtvbxsdvxzts
- profiles table + RLS + auto-create trigger

---

## What's Pending ⚠️

### Blocking (Must Fix Before Razorpay)
1. ~~Pricing mismatch — landing page + types.ts wrong values~~ ✅ FIXED
2. ~~CTA hrefs — `upgrade=monthly` → `upgrade=premium`~~ ✅ FIXED
3. Missing schema tables — subscriptions, razorpay_payments, api_keys, audit_log
4. Webhook handler stub — doesn't update Supabase profile

### Non-Blocking
5. Missing `frontend/.env.example`
6. Backend CORS missing Vercel domain
7. Env files not gitignored
8. Vercel re-link needed

### After Blocking Fixed
9. Deploy Render backend → get URL
10. Update `NEXT_PUBLIC_API_URL` in Vercel
11. Implement Razorpay webhook handler
12. Connect landing CTAs to checkout
13. Create success/failure pages
14. Alert system, Telegram bot, admin dashboard

---

## Pricing (CORRECT — use these values)
- Free: ₹0 (50 req/day)
- Pro: ₹499/month
- Premium: ₹999/month

---

*Last updated: 2026-05-01*
