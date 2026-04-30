# Architecture — Indian Trading Agent SaaS

## System Overview

```
[User Browser]
     |
     v
[Vercel Frontend] --- Static/CDN/Edge Functions
  /landing (public)
  /app (auth-protected)
     |
     v
[Railway Backend] (FastAPI)
  /api/auth/*       → Supabase Auth
  /api/analysis/*   → Core analysis (tier-gated)
  /api/payments/*   → Razorpay webhooks
  /api/alerts/*     → Alert management
     |
     +-- [External APIs]
     |     yfinance, Tavily, FMP, Telegram
     |
     v
[Supabase]
  Postgres: users, subscriptions, api_keys, audit_log
  Auth: email + Google OAuth
```

## Frontend Architecture

### Route Groups
```
frontend/src/app/
├── landing/              # Public marketing page
│   ├── page.tsx          # Hero, Features, Pricing, CTA
│   └── layout.tsx        # Landing-specific layout
├── (auth)/               # Auth routes (unprotected)
│   ├── login/page.tsx
│   └── signup/page.tsx
├── app/                  # Protected app routes
│   ├── layout.tsx        # App shell (Sidebar + Header)
│   ├── page.tsx          # Dashboard
│   ├── analysis/
│   ├── scanner/
│   ├── heatmap/
│   └── ... (existing 13 pages)
└── layout.tsx            # Root layout → routes to landing/app
```

### State Management
- **Zustand store** (`frontend/src/lib/store.ts`): analysis state, theme
- **Auth state**: stored in Supabase session, hydrated via middleware
- **Tier state**: derived from subscription status in Supabase

### NavBar (Landing)
- Logo + Product name
- Features | Pricing | Docs (anchor links)
- "Login" button (→ app login)
- "Start Free" CTA button

### Sidebar (App)
- Existing config-driven nav from `Sidebar.tsx`
- **Add:** User avatar, name, tier badge
- **Add:** Settings | Billing | Logout menu

## Backend Architecture

### API Structure
```
backend/app/
├── main.py               # FastAPI app entry
├── config.py             # Settings (from env)
├── database.py           # SQLAlchemy setup
├── middleware/
│   ├── auth.py           # JWT verification, tier extraction
│   └── rate_limit.py     # Per-tier rate limiting
├── routers/
│   ├── analysis.py        # Existing — add tier check
│   ├── auth.py            # NEW: auth helpers
│   ├── payments.py        # NEW: Razorpay webhooks
│   ├── users.py           # NEW: user management
│   └── alerts.py          # NEW: alert CRUD
├── models/
│   └── subscription.py    # NEW: subscription model
├── schemas/
│   ├── auth.py            # NEW: Pydantic schemas
│   └── payments.py        # NEW: payment schemas
└── services/
    ├── razorpay.py        # NEW: Razorpay client
    └── alerts.py          # NEW: alert service
```

### Auth Flow
1. User signs up via Supabase Auth (email or Google)
2. Supabase issues JWT (`access_token` + `refresh_token`)
3. Frontend stores in `localStorage` + httpOnly cookie
4. Every API request: middleware verifies JWT via Supabase JWT secret
5. Middleware extracts `user_id` + `subscription_tier` from JWT claims
6. Tier check decorator gates endpoint access

### Subscription Flow
```
[User] → /api/payments/create-order
         → Creates Razorpay order (server-side)
         → Returns order_id to frontend
         → Frontend opens Razorpay Checkout
         → On success: Razorpay sends webhook to /api/payments/webhook
         → Backend verifies signature, updates Supabase subscription
         → User redirected to /app with updated tier
```

### Rate Limiting
| Tier | Daily Requests |
|------|---------------|
| Free | 50 |
| Pro | 500 |
| Monthly | Unlimited |

### Tier Enforcement
- **Backend middleware:** checks `subscription_tier` claim from JWT
- **Frontend:** hides/disabled UI elements for unaccessible features
- **Double enforcement:** backend always authoritative

## Database Schema (Supabase Postgres)

### users (managed by Supabase Auth — base profile extended)
```sql
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
)
```

### subscriptions
```sql
subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  tier text CHECK (tier IN ('free', 'pro', 'monthly')),
  razorpay_subscription_id text,
  razorpay_customer_id text,
  status text CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### api_keys
```sql
api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  name text,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
)
```

### audit_log
```sql
audit_log (
  id bigint PRIMARY KEY DEFAULT nextval('audit_log_id_seq'),
  user_id uuid,
  action text,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
)
```

### Row Level Security (RLS)
- `profiles`: users can read/update own row only
- `subscriptions`: users can read own row only
- `api_keys`: users can CRUD own keys only
- `audit_log`: admin only

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### Backend (.env)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
JWT_SECRET=
```

---

*Last updated: 2026-04-30*
