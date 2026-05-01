# PRODUCT

## Indian Trading Agent SaaS

AI-powered multi-agent trading decision system for Indian markets (NSE/BSE).

### Current State (2026-04-30)
Full working product with 13 app pages + auth system. Being converted to SaaS with tiered subscriptions.

### Stack
- **Frontend:** Next.js 16 + Tailwind + shadcn/ui → Vercel
- **Backend:** FastAPI + WebSocket → Render
- **Database:** Supabase (Postgres) + SQLite (local cache)
- **Auth:** Supabase Auth (email + Google OAuth)
- **Payments:** Razorpay (Phase 3)
- **LLM:** Groq (free tier)

### Pricing (CORRECT)
| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | Dashboard, Top Picks, Heatmap, Charts, 50 req/day |
| Pro | ₹499/mo | All Free + Scanner, Deep Analysis, Strategies, 500 req/day |
| Premium | ₹999/mo | All Pro + Alerts, Telegram Bot, Priority |

### Live URLs
- **Frontend:** https://indian-trading-agent.vercel.app
- **Backend:** NOT YET DEPLOYED (blocking)

---

*Last updated: 2026-05-01*
