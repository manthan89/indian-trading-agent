export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIER_LIMITS, PLAN_PRICES } from "@/lib/supabase/types";
import Link from "next/link";
import { PricingCheckoutButton } from "@/components/pricing/PricingCheckoutButton";

const tiers = [
  {
    key: "free" as const,
    name: "Free",
    price: 0,
    description: "Get started with AI trading",
    features: TIER_LIMITS.free.features,
    limitDisplay: `${TIER_LIMITS.free.analysis.displayName} · ${TIER_LIMITS.free.scan.displayName}`,
    cta: "Get Started Free",
    popular: false,
  },
  {
    key: "pro" as const,
    name: "Pro",
    price: PLAN_PRICES.pro.monthly,
    description: "For serious traders",
    features: TIER_LIMITS.pro.features,
    limitDisplay: `${TIER_LIMITS.pro.analysis.displayName} · ${TIER_LIMITS.pro.scan.displayName}`,
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    key: "premium" as const,
    name: "Premium",
    price: PLAN_PRICES.premium.monthly,
    description: "Maximum power for full-time traders",
    features: TIER_LIMITS.premium.features,
    limitDisplay: `${TIER_LIMITS.premium.analysis.displayName} · ${TIER_LIMITS.premium.scan.displayName}`,
    cta: "Go Premium",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.key}
              className={tier.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}
            >
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.popular && (
                    <Badge variant="default">Popular</Badge>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">
                    ₹{tier.price === 0 ? "0" : tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  {tier.limitDisplay}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg
                        className="h-4 w-4 text-green-600 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {tier.key === "free" ? (
                  <Link
                    href="/signup"
                    className="block w-full rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <PricingCheckoutButton
                    plan={tier.key as "pro" | "premium"}
                    price={tier.price}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Secure payments powered by Razorpay.
            <br />
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
