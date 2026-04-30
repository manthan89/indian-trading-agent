-- ================================================
-- Indian Trading Agent - Supabase Schema Migration
-- Run in Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. profiles: extends auth.users
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'free' 
        CHECK (subscription_tier IN ('free', 'pro', 'premium')),
    subscription_status TEXT DEFAULT 'active' 
        CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
    razorpay_customer_id TEXT UNIQUE,
    razorpay_subscription_id TEXT UNIQUE,
    subscription_ends_at TIMESTAMPTZ,
    usage_analysis_count INTEGER DEFAULT 0,
    usage_analysis_limit INTEGER DEFAULT 5,
    usage_scan_count INTEGER DEFAULT 0,
    usage_scan_limit INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 2. subscriptions: Razorpay subscription records
-- ================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    razorpay_subscription_id TEXT UNIQUE NOT NULL,
    razorpay_customer_id TEXT,
    plan TEXT NOT NULL CHECK (plan IN ('pro', 'premium')),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. razorpay_payments: payment history
-- ================================================
CREATE TABLE IF NOT EXISTS public.razorpay_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT UNIQUE,
    razorpay_subscription_id TEXT,
    amount INTEGER NOT NULL,  -- in paise
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL
        CHECK (status IN ('created', 'attempted', 'captured', 'failed', 'refunded')),
    plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 4. api_keys: user API keys for data access
-- ================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT NOT NULL,  -- hashed version, never show full key
    key_prefix TEXT NOT NULL,  -- first 8 chars for identification
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_key_name UNIQUE (user_id, key_name)
);

-- ================================================
-- 5. audit_log: security & billing audit trail
-- ================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Row Level Security (RLS)
-- ================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- profiles: users can read/update own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- subscriptions: users manage own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- razorpay_payments: users view own
CREATE POLICY "Users can view own payments" ON public.razorpay_payments
    FOR SELECT USING (auth.uid() = user_id);

-- api_keys: users manage own
CREATE POLICY "Users can manage own api keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- audit_log: users view own, service role inserts
CREATE POLICY "Users can view own audit logs" ON public.audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- ================================================
-- Usage tracking function (called by backend)
-- ================================================
CREATE OR REPLACE FUNCTION public.increment_usage(
    p_user_id UUID,
    p_usage_type TEXT  -- 'analysis' | 'scan'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_tier TEXT;
    v_limit INTEGER;
    v_count INTEGER;
    v_current_count INTEGER;
BEGIN
    SELECT subscription_tier INTO v_tier FROM profiles WHERE id = p_user_id;
    
    -- Free tier limits
    SELECT 
        CASE p_usage_type
            WHEN 'analysis' THEN usage_analysis_limit
            WHEN 'scan' THEN usage_scan_limit
            ELSE NULL
        END INTO v_limit,
        CASE p_usage_type
            WHEN 'analysis' THEN usage_analysis_count
            WHEN 'scan' THEN usage_scan_count
            ELSE NULL
        END INTO v_current_count
    FROM profiles WHERE id = p_user_id;
    
    -- Pro: 3x, Premium: unlimited
    IF v_tier = 'pro' THEN v_limit := v_limit * 3;
    ELSIF v_tier = 'premium' THEN RETURN TRUE;
    END IF;
    
    IF v_current_count >= v_limit THEN
        RETURN FALSE;
    END IF;
    
    EXECUTE format(
        'UPDATE profiles SET usage_%I_count = usage_%I_count + 1 WHERE id = $1',
        p_usage_type, p_usage_type
    ) USING p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Indexes
-- ================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_id ON public.subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_payments_user_id ON public.razorpay_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- ================================================
-- Razorpay Webhook Handler Function
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_razorpay_webhook()
RETURNS TRIGGER AS $$
DECLARE
    v_event JSONB := NEW.payload;
    v_event_type TEXT := NEW.event;
BEGIN
    -- Log all webhook events
    INSERT INTO audit_log (event_type, event_data)
    VALUES ('razorpay_webhook', v_event);
    
    -- Handle subscription activated
    IF v_event_type = 'subscription.activated' THEN
        UPDATE profiles 
        SET subscription_status = 'active',
            razorpay_subscription_id = v_event->>'id',
            subscription_ends_at = (v_event->'current_period_end')::timestamptz,
            updated_at = NOW()
        WHERE razorpay_subscription_id = v_event->>'id';
    END IF;
    
    -- Handle subscription canceled
    IF v_event_type = 'subscription.canceled' THEN
        UPDATE profiles 
        SET subscription_status = 'canceled',
            updated_at = NOW()
        WHERE razorpay_subscription_id = v_event->>'id';
    END IF;
    
    -- Handle payment failed
    IF v_event_type = 'payment.failed' THEN
        UPDATE profiles 
        SET subscription_status = 'past_due',
            updated_at = NOW()
        WHERE razorpay_subscription_id = v_event->'subscription'->>'id';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Create the razorpay_webhooks table for this trigger
-- Or use Supabase Edge Functions for webhook handling instead
