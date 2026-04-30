# Phase Plan — Indian Trading Agent SaaS

## Context
Existing codebase: ~/indian-trading-agent/ — working product with 13 pages, 12 backend routers, live at 100.67.246.96:3001/8000.
Goal: Convert to SaaS with Auth + Payments + Multi-tenant. Never break existing working code.

---

## Architecture Decisions

### Stack
- **Frontend:** Next.js 16.2.3 (App Router) + React 19 + Zustand + shadcn/ui + Tailwind v4 → Vercel
- **Backend:** FastAPI + SQLAlchemy + Pydantic → Railway
- **Database:** Supabase (Postgres) — local scaffold, user provides keys
- **Auth:** Supabase Auth (email + Google OAuth)
- **Payments:** Razorpay (Free₹0/Pro₹499/Monthly₹2999)
- **Deploy:** Vercel (frontend preview), Railway (backend)

### Pricing
| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | Dashboard, Top Picks, Heatmap, Charts, 50 req/day |
| Pro | ₹499/mo | All Free + Scanner, Deep Analysis, Strategies, 500 req/day |
| Monthly | ₹2999/mo | All Pro + Alerts, Telegram Bot, Priority |

---

## 3-Phase Roadmap

### Phase 1: Landing Page MVP (THIS SESSION)
- [x] Audit existing codebase ✓
- [ ] Write PHASE_PLAN.md + ARCHITECTURE.md
- [ ] Build `/app/landing/page.tsx` — Hero, Features, Pricing, CTA
- [ ] Create landing layout + NavBar
- [ ] Root layout.tsx routing (landing vs app)
- [ ] Deploy to Vercel
- [ ] Checkpoint session

### Phase 2: Auth + Multi-tenant
- [ ] Supabase project setup (local scaffold, user fills in keys)
- [ ] Middleware: JWT auth, tier enforcement, tenant isolation
- [ ] Login/Signup pages with Google OAuth
- [ ] Protected routes wrapper
- [ ] User menu in Sidebar with tier badge
- [ ] Database schema migration (users, subscriptions, api_keys)
- [ ] API key management page
- [ ] Deploy to Vercel (production) + Railway

### Phase 3: Payments + Alerts
- [ ] Razorpay integration (checkout, webhooks, status sync)
- [ ] Upgrade flow in UI
- [ ] Tier-gated feature enforcement on backend
- [ ] Alert system (email/push)
- [ ] Telegram bot (Pro+)
- [ ] Admin dashboard
- [ ] Full production deploy

---

## Key Files to Modify
- `frontend/src/app/layout.tsx` — route between landing/app layouts
- `frontend/src/components/layout/Sidebar.tsx` — user menu + tier badge
- `frontend/src/lib/store.ts` — auth state + tier state
- `frontend/src/app/(auth)/` — login/signup pages
- `frontend/src/app/landing/` — landing page
- `backend/app/` — Supabase middleware, tier decorators, webhook handlers
- `backend/app/routers/auth.py` — new auth router
- `backend/app/routers/payments.py` — new payments router

## Key Files to Create
- `frontend/src/app/landing/page.tsx`
- `frontend/src/app/landing/layout.tsx`
- `frontend/src/components/landing/NavBar.tsx`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/signup/page.tsx`
- `backend/app/middleware/auth.py`
- `backend/app/routers/auth.py`
- `backend/app/routers/payments.py`

---

## Build Rules
1. Never touch working code — additive only
2. Build landing page first (highest ROI)
3. Checkpoint every 10 messages to docs/CHECKPOINT.md
4. Deploy to Vercel preview after landing page
5. User provides Supabase/Razorpay keys

---

*Last updated: 2026-04-30*
