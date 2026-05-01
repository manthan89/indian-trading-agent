# TASKS

## Phase 1: Landing Page MVP ✅
- [x] Build landing page
- [x] Deploy to Vercel

## Phase 2: Auth + Multi-tenant ✅ (2026-04-30)
- [x] Supabase project setup
- [x] Auth middleware (frontend + backend)
- [x] Login/Signup pages + Google OAuth
- [x] Protected routes (proxy.ts)
- [x] TierGate component
- [x] Auth store + Supabase lib
- [x] Backend auth endpoints
- [x] API key management UI
- [x] Deploy Render backend blueprint

## Phase 3: Payments + Alerts (IN PROGRESS)

### Before Razorpay (blocking)
- [x] Align landing page pricing (₹2,999 Monthly → ₹999 Premium) ✅ (2026-05-01)
- [x] Fix landing CTA hrefs (monthly → premium) ✅ (2026-05-01)
- [x] Create `frontend/.env.example`
- [x] Add Vercel domain to backend CORS (marketdesk-india.vercel.app → backend/app.py)
- [ ] Deploy Render backend → get URL
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel
- [ ] Create full Supabase schema (subscriptions, razorpay_payments, api_keys, audit_log)
- [ ] Implement webhook handler (update Supabase profile on success)

### Razorpay Integration
- [ ] Implement webhook handler (update Supabase profile on success)
- [ ] Connect landing pricing CTAs to checkout
- [ ] Create `/success` and `/failure` pages
- [ ] Tier-gated backend enforcement

### Post-Payments
- [ ] Alert system (email/push)
- [ ] Telegram bot (Pro+)
- [ ] Admin dashboard
- [ ] Production deployment

---

*Last updated: 2026-05-01*
