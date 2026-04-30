# Vercel Deployment — Indian Trading Agent Frontend

## Deployment Summary
- **Deployed:** 2026-04-30
- **Project Name:** marketdesk-india
- **Vercel Team:** manthans-projects-bbf5757d
- **Framework:** Next.js 16.2.3 (App Router, React 19)

## Live URL
**https://marketdesk-india-k5pjh6bb5-manthans-projects-bbf5757d.vercel.app**

Production alias: `https://marketdesk-india.vercel.app`

## Pages Deployed (19 routes)
| Route | Type |
|-------|------|
| `/` | Static (Landing page) |
| `/app` | Static (Dashboard) |
| `/app/analysis` | Static |
| `/app/analysis/[id]` | Dynamic |
| `/app/backtest` | Static |
| `/app/charts` | Static |
| `/app/history` | Static |
| `/app/insights` | Static |
| `/app/news` | Static |
| `/app/performance` | Static |
| `/app/recommendations` | Static |
| `/app/scanner` | Static |
| `/app/settings` | Static |
| `/app/simulation` | Static |
| `/app/strategies` | Static |
| `/app/strategies/cyclical` | Static |
| `/app/strategies/support-resistance` | Static |

## Files Modified for Deployment
1. **`frontend/next.config.ts`** — Removed `allowedDevOrigins` + `turbopack.root`, removed `eslint` option (not supported in Next.js 16)
2. **`frontend/src/lib/api.ts`** — Changed hardcoded `API_BASE` to use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`
3. **`frontend/.env.local`** — Updated to use `NEXT_PUBLIC_API_URL` env var
4. **`frontend/vercel.json`** — Created with framework + build settings
5. **`frontend/.vercel/`** — Linked to Vercel project (do not commit)

## Environment Variables (Vercel Dashboard)
| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://PLACEHOLDER-backend-url.vercel.app` | Production |

**Action Required:** Update `NEXT_PUBLIC_API_URL` in Vercel dashboard with actual Railway/backend URL before going live.

## Vercel CLI Setup
- Token: stored locally (do not commit)
- Project ID: `prj_EPbtVj2vPIqev740hXIHeTieMwr3`
- Team: `manthans-projects-bbf5757d`
- Command: `vercel deploy --token <token> --yes --public`

## Known Issues / Notes
- Deployment protection was enabled by default (Vercel team SSO). Disabled manually via Vercel dashboard.
- Backend is NOT yet deployed — frontend will show connection errors until Railway backend is deployed and `NEXT_PUBLIC_API_URL` is updated.
- This is a preview deployment. Production deployment: `vercel --prod`
- ESLint warnings during build — harmless, build succeeds.

## Next Steps
1. Deploy Railway backend → get production URL
2. Update `NEXT_PUBLIC_API_URL` in Vercel dashboard
3. Add Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for Phase 2 auth
4. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` for Phase 3 payments
5. Deploy to production: `vercel --prod --token <token>`

## Useful Commands
```bash
# Preview deploy
vercel deploy --token vcp_... --yes --public

# Production deploy
vercel --prod --token vcp_...

# Add env var
vercel env add NEXT_PUBLIC_API_URL production --token vcp_...

# Link project
vercel link --token vcp_... --project marketdesk-india
```
