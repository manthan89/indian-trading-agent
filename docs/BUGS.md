# BUGS

## Known Issues

### P1 — Pricing Mismatch (HIGH) ✅ FIXED (2026-05-01)
- **Severity:** HIGH — wrong pricing shown to users
- **Files:** `frontend/src/app/(landing)/page.tsx`, `frontend/src/lib/supabase/types.ts`
- **Issue:** Landing page shows ₹2,999 Monthly but correct pricing is Free₹0/Pro₹499/Premium₹999
- **types.ts PLAN_PRICES:** says ₹999/₹1999 but should be ₹499/₹999
- **payments.py:** ✅ CORRECT at ₹499/₹999
- **Fix:** Changed landing page "Monthly ₹2,999" → "Premium ₹999", types.ts PLAN_PRICES → ₹499/₹999

### P2 — CTA Href Mismatch (MEDIUM)
- **Severity:** MEDIUM — users can't upgrade
- **File:** `frontend/src/app/(landing)/page.tsx`
- **Issue:** Landing CTA buttons use `upgrade=monthly` but backend expects `upgrade=premium`
- **Fix:** Change all `/app?upgrade=monthly` → `/app?upgrade=premium`

### P3 — Missing Schema Tables (HIGH)
- **Severity:** HIGH — payments can't work
- **File:** `supabase/migrations/001_initial_schema.sql`
- **Issue:** Only `profiles` table exists. Missing: `subscriptions`, `razorpay_payments`, `api_keys`, `audit_log`
- **Fix:** Create `002_razorpay_schema.sql` migration

### P4 — Webhook Handler Stub (HIGH)
- **Severity:** HIGH — payments can't activate accounts
- **File:** `backend/routers/payments.py`
- **Issue:** `razorpay_webhook` endpoint is stub — doesn't update Supabase profile/subscription
- **Fix:** Implement actual Supabase profile update on payment success

### P5 — Missing frontend/.env.example (MEDIUM)
- **Severity:** MEDIUM — onboarding friction
- **Issue:** No `.env.example` in `frontend/` root
- **Fix:** Create `frontend/.env.example` with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_RAZORPAY_KEY_ID

### P6 — Backend CORS Missing Vercel Domain (LOW)
- **Severity:** LOW — production deployment will fail
- **File:** `backend/app.py`
- ~~**Issue:** `allow_origins` doesn't include `https://indian-trading-agent.vercel.app`~~ ✅ Fixed (backend/app.py)
- **Fix:** Add Vercel domain to CORS list

### P7 — Env Files Not Gitignored (LOW/SECURITY)
- **Severity:** LOW — no real secrets but bad practice
- **Files:** `.env.example`, `backend/.env.example`
- **Issue:** These files are NOT in `.gitignore`
- **Fix:** Add `*.example` to gitignore OR delete the files

### P8 — Vercel Re-link Needed (LOW)
- **Severity:** LOW — deployment management
- **File:** `frontend/.vercel/` directory missing
- **Issue:** Vercel project not re-linked after config changes
- **Fix:** Run `vercel link` in `frontend/` directory

---

*Last updated: 2026-05-01*
