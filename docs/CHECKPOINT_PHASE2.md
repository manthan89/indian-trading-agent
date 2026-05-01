# Phase 2 Checkpoint — Auth & SaaS Scaffolding
**Date:** 2026-04-30
**Status:** Phase 2 Complete ✅ (auth), Partially Complete (schema)

---

## What Was Built

### Frontend Auth System
- `frontend/src/proxy.ts` — Auth middleware (route protection, redirect logic, public route handling)
- `frontend/src/components/auth/AuthProvider.tsx` — Client-side auth context
- `frontend/src/components/auth/LoginForm.tsx` — Email + Google OAuth login
- `frontend/src/components/auth/SignupForm.tsx` — Email + Google OAuth signup
- `frontend/src/components/auth/TierGate.tsx` — Subscription tier access gate
- `frontend/src/app/auth/callback/page.tsx` — OAuth redirect handler
- `frontend/src/app/login/page.tsx` — Login page
- `frontend/src/app/signup/page.tsx` — Signup page
- `frontend/src/app/pricing/page.tsx` — Pricing page (3 tiers)
- `frontend/src/lib/store-auth.ts` — Zustand auth store with tier helpers (selectCanUseAnalysis, selectCanUseScan)
- `frontend/src/lib/supabase/types.ts` — TypeScript types + TIER_LIMITS + PLAN_PRICES
- `frontend/src/lib/supabase/client.ts` — Browser Supabase client
- `frontend/src/lib/supabase/server.ts` — Server Supabase client with SSR cookie handling
- `frontend/src/lib/supabase/index.ts` — Barrel export
- `frontend/src/hooks/useAnalysis.ts` — Analysis state hook

### Backend Auth System
- `backend/auth_middleware.py` — Supabase JWT verification + tier enforcement
- `backend/routers/auth_.py` — /me, /verify, /limits, /upgrade, /usage endpoints
- `backend/routers/payments.py` — Razorpay: create-order, webhook (stub), plans, status

### Supabase Infrastructure
- Supabase project: `vnupihfbbtvbxsdvxzts`
- `supabase/migrations/001_initial_schema.sql` — **MINIMAL** schema: profiles table + RLS + auto-create trigger
  - ⚠️ MISSING: subscriptions, razorpay_payments, api_keys, audit_log tables

### Deployment
- Vercel frontend: `https://indian-trading-agent.vercel.app` ✅
- Render backend: `render.yaml` ready (not yet deployed) ✅
- Railway backup: `railway.json` ready ✅

### Env Files
- `frontend/.env.local` — Supabase anon key, NEXT_PUBLIC_API_URL
- `backend/.env.example` — SUPABASE vars, RAZORPAY vars, CORS_ORIGINS
- `root .env` — SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY (gitignored)
- `root .env.example` — ❌ NOT gitignored (SECURITY: no real secrets but should be gitignored)

### Package Changes
- `frontend/package.json` — Added @supabase/supabase-js, @supabase/ssr

### Root Layout Changes
- `frontend/src/app/layout.tsx` — Added AuthProvider + Toaster

---

## What Was NOT Built (Audit Discrepancies)

| CHECKPOINT Claims | Actual Status |
|---|---|
| `supabase/migrations/001_initial_schema.sql` has full schema (5 tables) | ❌ Only has 1 table: `profiles`. subscriptions/razorpay_payments/api_keys/audit_log MISSING |
| `frontend/.env.example` created | ❌ File does NOT exist |
| `frontend/next.config.ts` turbopack config | ✅ File exists but empty `{}` |
| `backend/routers/payments.py` webhook handler | ⚠️ Stub only — does NOT update Supabase profile |
| Backend CORS includes Vercel production domain | ❌ Only has localhost + Render placeholder |

---

## Build Status
- 28 frontend routes, 14 backend routers ✅
- Build: not verified during audit
- Auth flow: end-to-end not tested

---

## Frontend File Count (Actual)

| Category | Count |
|----------|-------|
| App routes (landing + auth + app + 13 pages) | ~28 |
| Components (auth + layout + landing + dashboard + analysis + settings + ui) | 35+ |
| Lib files (api, store, types, help-contents, utils, store-auth, supabase/*) | 9 |
| Hooks | 1 |

---

## Backend File Count (Actual)

| Category | Count |
|----------|-------|
| Core modules (app, db, models, ws, auth_middleware, settings_manager, stats_callback, scanner, recommender, performance, cyclical, news_sources, backtest_engine, simulation, insights, stock_list) | 17 |
| Routers | 14 |
| Total | 31 |

---

## Pending Before Razorpay

### HIGH Priority
1. **[SCHEMA]** Create full Supabase migration: subscriptions, razorpay_payments, api_keys, audit_log tables
2. ~~**[PRICING]** Align landing page pricing: ₹2,999 Monthly → ₹999 Premium, CTA hrefs fix~~ ✅ FIXED (2026-05-01)
3. **[PAYMENTS]** Implement Razorpay webhook handler in `payments.py` (update Supabase profile on payment success)

### MEDIUM Priority
4. **[ENV]** Create `frontend/.env.example`
5. **[CORS]** Add Vercel production domain to backend/app.py CORS
6. **[ENV-SECURITY]** Gitignore `.env.example` and `backend/.env.example`

### LOW Priority
7. **[VERCEL]** Re-link Vercel project (`.vercel/` directory missing)
8. **[DEPLOY]** Deploy Render backend → get URL → update `NEXT_PUBLIC_API_URL` in Vercel

---

## How to Deploy Backend (Render)

1. Push to GitHub
2. Connect repo at https://render.com
3. Import `render.yaml` blueprint
4. Set env vars: GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET, RAZORPAY_*
5. Get deployed URL → update Vercel `NEXT_PUBLIC_API_URL`

---

## Phase 3 Preview (What Comes Next)
- Backend auth middleware (verify Supabase JWT on each API call) ✅ **DONE**
- Subscription-protected API endpoints ✅ **DONE**
- Razorpay checkout integration (partial — webhook stub) ⚠️
- Landing → checkout → success flow
- Telegram alert integration
- Alert system (email/push)

---

*Last updated: 2026-05-01*
