# CTO_BRAIN

## Stack
- Frontend: Next.js 16 + Tailwind + shadcn/ui → Vercel
- Backend: FastAPI + WebSocket → Render
- Database: Supabase (Postgres) + SQLite (local cache)
- Auth: Supabase Auth (email + Google OAuth)
- Payments: Razorpay
- LLM: Groq (free tier)
- Data: yfinance (NSE/BSE)

## Rules
1. Keep monorepo (root: frontend/, backend/, tradingagents/)
2. Avoid complexity — additive only, never touch working code
3. Fast deploy — test incrementally, Vercel + Render
4. Never commit secrets — .env gitignored, examples OK

## Status (2026-05-01)
- Frontend: 28 routes + auth ✅
- Backend: 14 routers + auth middleware ✅
- Vercel: deployed ✅
- Render: blueprint ready ⏳
- Payments: stub ⚠️
- Schema: incomplete ⚠️

## Next
Deploy Render → Fix pricing → Complete schema → Implement webhook → Ship payments
