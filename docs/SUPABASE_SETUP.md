# Supabase Setup Guide

## Project Already Linked
- **Project URL:** https://vnupihfbbtvbxsdvxzts.supabase.co
- **Project Ref:** vnupihfbbtvbxsdvxzts

## Step 1: Get JWT Secret
1. Go to: https://supabase.com/dashboard/project/vnupihfbbtvbxsdvxzts/settings/api
2. Copy **JWT Secret** (under "JWT Settings")
3. Add to `/home/human/marketdesk-india/.env`:
   ```
   SUPABASE_JWT_SECRET=your_jwt_secret_here
   ```

## Step 2: Run Database Migration
1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents of: `supabase/migrations/001_initial_schema.sql`
3. Paste and run

## Step 3: Verify Setup
The anon key is already configured in:
- `frontend/.env.local` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- `.env` (SUPABASE_SERVICE_ROLE_KEY)

## Supabase CLI (Optional)
To link project:
```bash
supabase link --project-ref vnupihfbbtvbxsdvxzts
```