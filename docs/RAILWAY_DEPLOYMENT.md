# Railway Deployment Guide

## Step 1: Install Railway CLI

```bash
# Option A: via npm
npm install -g @railway/cli

# Option B: via curl (Linux)
curl -fsSL https://railway.app/install.sh | sh
```

## Step 2: Login to Railway

```bash
railway login
```

This opens browser → authenticate → done.

## Step 3: Create Railway Project

```bash
# Navigate to project
cd ~/marketdesk-india

# Initialize Railway (connects to GitHub repo)
railway init
# Select: GitHub → marketdesk-india repo
```

Or do it via dashboard:
1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `marketdesk-india` repo
4. Select **backend** directory (if monorepo) or root

## Step 4: Configure Environment Variables

In Railway dashboard → Project → Variables:

```env
# Supabase
SUPABASE_URL=https://vnupihfbbtvbxsdvxzts.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Anthropic (for AI analysis)
ANTHROPIC_API_KEY=sk-ant-...

# Optional
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ALPHA_VANTAGE_API_KEY=...
```

## Step 5: Set Start Command

Railway already has `railway.json` with:
- Start: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- Port: 8000

## Step 6: Deploy

```bash
railway up
```

Or push to GitHub and Railway auto-deploys.

## Step 7: Get Backend URL

After deploy, Railway gives URL:
```
https://marketdesk-india.up.railway.app
```

## Step 8: Connect to Frontend

1. Go to Vercel Dashboard → marketdesk-india project
2. Settings → Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://marketdesk-india.up.railway.app
   ```
4. Redeploy frontend

---

## Quick Reference

| Item | Value |
|------|-------|
| Railway CLI | `railway login` → `railway up` |
| Backend Port | 8000 |
| Start Command | `uvicorn backend.app:app --host 0.0.0.0 --port $PORT` |
| Supabase Project | vnupihfbbtvbxsdvxzts |

## Troubleshooting

### "Cannot find app"
Make sure Railway points to `backend/app.py` or set root directory.

### CORS errors
Backend has CORS configured for all origins (dev mode). For production, restrict in `backend/app.py`.

### Environment variables not loading
Check Railway dashboard → Variables tab. Must match exact names in code.

---

**Need help?** Share Railway project URL when created.