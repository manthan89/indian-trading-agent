# Phase Plan — Indian Trading Agent SaaS

## Context
Existing codebase: `~/indian-trading-agent/` — working product with 13 pages, 12 backend routers, live at 100.67.246.96:3001/8000.
Goal: Convert to SaaS with Auth + Payments + Multi-tenant. Never break existing working code.

**This file describes the PLANNED architecture. For actual implementation status, see CHECKPOINT_PHASE2.md.**

---

## Architecture Decisions

### Stack
- **Frontend:** Next.js 16.2.3 (App Router) + React 19 + Zustand + shadcn/ui + Tailwind v4 → Vercel
- **Backend:** FastAPI + SQLAlchemy + Pydantic → Render (primary) / Railway (backup)
- **Database:** Supabase (Postgres) — local scaffold, user provides keys
- **Auth:** Supabase Auth (email + Google OAuth)
- **Payments:** Razorpay (Free₹0/Pro₹499/Premium₹999)
- **Deploy:** Vercel (frontend), Render (backend)
- **LLM:** Groq (GROQ_API_KEY) — free tier, no credit card

### Pricing
| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | Dashboard, Top Picks, Heatmap, Charts, 50 req/day |
| Pro | ₹499/mo | All Free + Scanner, Deep Analysis, Strategies, 500 req/day |
| Premium | ₹999/mo | All Pro + Alerts, Telegram Bot, Priority |

---

## 3-Phase Roadmap

### Phase 1: Landing Page MVP ✅
- [x] Audit existing codebase
- [x] Write PHASE_PLAN.md + ARCHITECTURE.md
- [x] Build landing page (Hero, Features, Pricing, CTA)
- [x] Create landing layout + NavBar
- [x] Deploy to Vercel
- [x] Checkpoint session

### Phase 2: Auth + Multi-tenant ✅ (2026-04-30)
- [x] Supabase project setup (project: `vnupihfbbtvbxsdvxzts`)
- [x] Middleware: JWT auth, tier enforcement
- [x] Login/Signup pages with Google OAuth
- [x] Protected routes wrapper (proxy.ts)
- [x] Auth store with tier helpers
- [x] Supabase client lib (client/server/types/index)
- [x] TierGate component
- [x] Database schema: profiles table + RLS + auto-create trigger
- [x] Backend auth middleware (auth_middleware.py)
- [x] Auth router (auth_.py: /me, /verify, /limits, /upgrade, /usage)
- [x] API key management UI
- [x] Deploy to Vercel (frontend live)
- [x] Deploy to Render (backend ready)

### Phase 3: Payments + Alerts (IN PROGRESS)
- [ ] Razorpay integration (checkout, webhooks, status sync)
- [ ] Upgrade flow in UI (connect landing CTAs to checkout)
- [ ] Tier-gated feature enforcement on backend
- [ ] Alert system (email/push)
- [ ] Telegram bot (Pro+)
- [ ] Admin dashboard
- [ ] Full production deploy

---

## Key Files — What Exists Now

### Frontend (`frontend/src/`)
| Path | Status | Description |
|------|--------|-------------|
| `proxy.ts` | ✅ | Auth middleware, route protection, public route handling |
| `lib/store-auth.ts` | ✅ | Zustand auth store, tier helpers |
| `lib/supabase/{client,server,types,index}.ts` | ✅ | Full Supabase lib |
| `components/auth/{AuthProvider,LoginForm,SignupForm,TierGate}` | ✅ | All auth components |
| `app/auth/callback/page.tsx` | ✅ | OAuth redirect handler |
| `app/login/page.tsx` | ✅ | Login page |
| `app/signup/page.tsx` | ✅ | Signup page |
| `app/pricing/page.tsx` | ✅ | Pricing page |
| `app/app/` (13 pages) | ✅ | All protected app pages |
| `components/pricing/PricingCheckoutButton.tsx` | ✅ | Razorpay button |

### Backend (`backend/`)
| Path | Status | Description |
|------|--------|-------------|
| `app.py` | ✅ | FastAPI + CORS + Supabase startup |
| `auth_middleware.py` | ✅ | JWT verify + tier check |
| `routers/auth_.py` | ✅ | /me, /verify, /limits, /upgrade, /usage |
| `routers/payments.py` | ✅ | create-order, webhook (stub), plans, status |
| `routers/` (11 others) | ✅ | Analysis, market_data, scanner, etc. |

### Deployment
| File | Status | Description |
|------|--------|-------------|
| `render.yaml` | ✅ | Render Blueprint (Python 3.12, Singapore) |
| `railway.json` | ✅ | Railway backup config |
| Vercel deploy | ✅ | `marketdesk-india.vercel.app` |
| `docs/DEPLOYMENT.md` | ✅ | Vercel deployment guide |
| `docs/RAILWAY_DEPLOYMENT.md` | ✅ | Railway deployment guide |

### Supabase
| Item | Status |
|------|--------|
| Project | ✅ `vnupihfbbtvbxsdvxzts` |
| profiles table | ✅ (minimal — only 1 table) |
| RLS policies | ✅ |
| Auto-create trigger | ✅ |
| subscriptions table | ❌ MISSING |
| razorpay_payments table | ❌ MISSING |
| api_keys table | ❌ MISSING |
| audit_log table | ❌ MISSING |

---

## Pending Issues (Before Razorpay)

1. **[MEDIUM] Pricing mismatch** — Landing page shows ₹2,999 Monthly, types.ts PLAN_PRICES says ₹999/₹1999, payments.py correct at ₹499/₹999. CTA hrefs use `upgrade=monthly` instead of `upgrade=premium`
2. **[MEDIUM] Missing `frontend/.env.example`** — not created
3. **[MEDIUM] Backend CORS** — app.py missing Vercel production domain
4. **[LOW] `.env.example` and `backend/.env.example` NOT gitignored** — contain example placeholders but should be clear
5. **[LOW] `.vercel/` directory missing** — Vercel re-link needed

---

## Key Files to Modify (Phase 3)
- `frontend/src/app/(landing)/page.tsx` — Connect pricing CTAs to checkout
- `backend/routers/payments.py` — Implement webhook handler (update Supabase profile)
- `supabase/migrations/` — Create razorpay_payments, subscriptions, api_keys, audit_log tables
- `backend/app.py` — Add Vercel production CORS domain

## Key Files to Create (Phase 3)
- `frontend/src/app/success/page.tsx` — Post-payment success page
- `frontend/src/app/failure/page.tsx` — Payment failure page
- `supabase/migrations/002_razorpay_schema.sql` — Payment tables

---

## Build Rules
1. Never touch working code — additive only
2. Checkpoint every session to docs/CHECKPOINT_PHASE2.md
3. Deploy incrementally — Vercel (frontend) + Render (backend)
4. User provides Supabase/Razorpay keys

---

*Last updated: 2026-05-01*
