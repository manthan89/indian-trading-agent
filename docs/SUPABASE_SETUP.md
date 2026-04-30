# Supabase Setup Guide

## Step 1: Get Project Credentials
1. Go to: https://supabase.com/dashboard
2. Select project: `vnupihfbbtvbxsdvxzts`
3. Go to **Settings → API**
4. Copy:
   - **Project URL** (e.g., `https://vnupihfbbtvbxsdvxzts.supabase.co`)
   - **Project API keys → anon public** key

## Step 2: Run Database Migration
1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of: `supabase/migrations/001_initial_schema.sql`
3. Paste and run

## Step 3: Configure Frontend
Add to `/home/human/marketdesk-india/frontend/.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vnupihfbbtvbxsdvxzts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Configure Backend
Add to `/home/human/marketdesk-india/.env`:
```bash
SUPABASE_URL=https://vnupihfbbtvbxsdvxzts.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

Get JWT_SECRET from: Settings → API → JWT Secret