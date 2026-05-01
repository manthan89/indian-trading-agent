export type SubscriptionTier = "free" | "pro" | "premium";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "inactive";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  subscription_ends_at: string | null;
  usage_analysis_count: number;
  usage_analysis_limit: number;
  usage_scan_count: number;
  usage_scan_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  razorpay_subscription_id: string;
  razorpay_customer_id: string | null;
  plan: "pro" | "premium";
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface RazorpayPayment {
  id: string;
  user_id: string | null;
  razorpay_payment_id: string;
  razorpay_order_id: string | null;
  razorpay_subscription_id: string | null;
  amount: number;
  currency: string;
  status: "created" | "attempted" | "captured" | "failed" | "refunded";
  plan: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const TIER_LIMITS = {
  free: {
    analysis: { limit: 5, displayName: "5 analyses/day" },
    scan: { limit: 10, displayName: "10 scans/day" },
    features: ["AI Trading Analysis", "Top Picks", "Heatmap", "Scanner", "Paper Trading"],
  },
  pro: {
    analysis: { limit: 15, displayName: "15 analyses/day" },
    scan: { limit: 50, displayName: "50 scans/day" },
    features: [
      "Everything in Free",
      "3x higher limits",
      "Priority processing",
      "Backtesting",
      "Strategy builder",
    ],
  },
  premium: {
    analysis: { limit: 999, displayName: "Unlimited analyses" },
    scan: { limit: 999, displayName: "Unlimited scans" },
    features: [
      "Everything in Pro",
      "Unlimited usage",
      "Multi-agent deep analysis",
      "Telegram alerts",
      "API access",
      "Priority support",
    ],
  },
} as const;

export const PLAN_PRICES = {
  pro: { monthly: 499, yearly: 4990 },
  premium: { monthly: 999, yearly: 9990 },
} as const;
