# Vercel Deployment — Indian Trading Agent Frontend

## Deployment Summary
- **Deployed:** 2026-04-30
- **Project Name:** marketdesk-india
- **Vercel Team:** manthans-projects-bbf5757d
- **Framework:** Next.js 16.2.3 (App Router, React 19)

## Live URL
**https://indian-trading-agent.vercel.app**

## Pages Deployed (19 routes)
| Route | Type |
|-------|------|
| `/` | Landing page |
| `/login` | Auth |
| `/signup` | Auth |
| `/pricing` | Pricing |
| `/app` | Dashboard |
| `/app/analysis` | Protected |
| `/app/analysis/[id]` | Protected |
| `/app/backtest` | Protected |
| `/app/charts` | Protected |
| `/app/history` | Protected |
| `/app/insights` | Protected |
| `/app/news` | Protected |
| `/app/performance` | Protected |
| `/app/recommendations` | Protected |
| `/app/scanner` | Protected |
| `/app/settings` | Protected |
| `/app/simulation` | Protected |
| `/app/strategies` | Protected |
| `/app/strategies/cyclical` | Protected |
| `/app/strategies/support-resistance` | Protected |

## Environment Variables (Vercel Dashboard)
| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | ⚠️ Set to placeholder — needs backend URL |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ Set |

## Files Modified for Deployment
1. `frontend/next.config.ts` — Removed turbopack/dev origins config
2. `frontend/src/lib/api.ts` — Uses `NEXT_PUBLIC_API_URL` env var
3. `frontend/.env.local` — API + Supabase + Razorpay vars
4. `frontend/vercel.json` — Framework settings

## Known Issues
- Backend NOT yet deployed — `NEXT_PUBLIC_API_URL` needs actual Render backend URL
- Landing page pricing shows ₹2,999 Monthly (should be ₹999 Premium) — pending fix
- Landing CTA buttons link to `/app?upgrade=monthly` (should be `/app?upgrade=premium`) — pending fix

## Next Steps
1. Deploy Render backend → get URL
2. Update `NEXT_PUBLIC_API_URL` in Vercel dashboard
3. Fix pricing alignment (landing page + types.ts)
4. Deploy to production: `vercel --prod`

---

*Last updated: 2026-05-01*
