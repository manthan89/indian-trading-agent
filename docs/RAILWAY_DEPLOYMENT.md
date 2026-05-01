# Backend Deployment — Render

**Primary deployment target.** Railway (`railway.json`) is backup.

## Prerequisites
- GitHub account connected to this repo
- Render account (free tier works)

## Step 1: Create Render Project

1. Go to https://render.com → **New** → **Blueprint**
2. Connect GitHub → select `marketdesk-india` repo
3. Render auto-detects `render.yaml` → click **Apply**

## Step 2: Configure Environment Variables

In Render dashboard → Service → **Environment** tab:

```env
# LLM Provider (Groq — free, no credit card)
GROQ_API_KEY=your_groq_api_key

# Supabase
SUPABASE_URL=https://vnupihfbbtvbxsdvxzts.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Razorpay (Phase 3)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# App
TRADINGAGENTS_HOME=/var/data/tradingagents
```

## Step 3: Deploy

Render auto-builds from `render.yaml`:
- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- **Health check:** `GET /api/health`
- **Runtime:** Python 3.12
- **Region:** Singapore (closest to India)

Manual deploy: `git push` to main branch.

## Step 4: Get Backend URL

After deploy, Render gives URL like:
```
https://indian-trading-agent.onrender.com
```

## Step 5: Connect to Frontend

1. **Vercel dashboard** → marketdesk-india project → **Settings** → **Environment Variables**
2. Update:
   ```
   NEXT_PUBLIC_API_URL=https://indian-trading-agent.onrender.com
   ```
3. **Redeploy** frontend (trigger via git push or Vercel dashboard)

---

## Quick Reference

| Item | Value |
|------|-------|
| Blueprint file | `render.yaml` (root) |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn backend.app:app --host 0.0.0.0 --port $PORT` |
| Port | $PORT (Render sets this) |
| Health check | `/api/health` |
| Supabase Project | `vnupihfbbtvbxsdvxzts` |
| LLM | Groq (GROQ_API_KEY) |

## Backup: Railway Deployment

If Render doesn't work, use Railway:
```bash
railway login
cd ~/marketdesk-india
railway init
railway up
```
Then set same env vars in Railway dashboard.

Railway gives URL like: `https://marketdesk-india.up.railway.app`

---

## Troubleshooting

### "Cannot find app"
Ensure Render points to root directory (not `backend/` subdirectory). The `render.yaml` is at root and references `backend.app:app`.

### CORS errors
Backend `app.py` has CORS for `http://localhost:3000`. Add your Render backend URL to `allow_origins` in `backend/app.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://marketdesk-india.vercel.app",
    "https://indian-trading-agent.onrender.com",  # Add this
]
```

### Environment variables not loading
Double-check exact names in Render dashboard match code references. Case-sensitive.

---

*Last updated: 2026-05-01*
