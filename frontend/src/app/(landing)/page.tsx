"use client";

import Link from "next/link";
import {
  TrendingUp,
  Brain,
  Radar,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Radar,
    title: "Market Scanner",
    description: "Find gap-ups, high volume breakouts, and sector rotations across NSE/BSE in seconds.",
  },
  {
    icon: Brain,
    title: "AI Deep Analysis",
    description: "Multi-agent debate between bull and bear analysts. Risk assessment included.",
  },
  {
    icon: BarChart3,
    title: "Strategy Backtest",
    description: "Test support/resistance and cyclical patterns on historical data before risking capital.",
  },
  {
    icon: Sparkles,
    title: "Top Picks",
    description: "AI-curated daily recommendations with entry, exit, and stop-loss levels.",
  },
  {
    icon: Shield,
    title: "Performance Tracking",
    description: "See real win rates per strategy and learn what actually works for your style.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by Claude + LangGraph. Get research-grade analysis in minutes, not hours.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for exploring the platform.",
    features: [
      "Dashboard + Top Picks",
      "Sector Heatmap",
      "Interactive Charts",
      "50 analysis requests/day",
      "Basic market scanner",
    ],
    cta: "Start Free",
    href: "/app",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per month",
    description: "For active traders who need daily edge.",
    features: [
      "Everything in Free",
      "Deep AI Analysis (new)",
      "Strategy Backtesting (new)",
      "500 analysis requests/day",
      "Priority processing",
    ],
    cta: "Get Pro",
    href: "/app?upgrade=pro",
    highlight: true,
  },
  {
    name: "Monthly",
    price: "₹2,999",
    period: "per month",
    description: "Full power for serious traders and investors.",
    features: [
      "Everything in Pro",
      "Unlimited requests",
      "Telegram alerts (new)",
      "Email alerts (new)",
      "Dedicated support",
    ],
    cta: "Go Monthly",
    href: "/app?upgrade=monthly",
    highlight: false,
  },
];

const steps = [
  {
    step: "01",
    title: "Scan the Market",
    description: "Use the AI scanner to find stocks with gap-ups, breakouts, or unusual volume. Filter by sector, market cap, or price range.",
  },
  {
    step: "02",
    title: "Get AI Analysis",
    description: "Select any stock and get a multi-agent debate — bull vs bear case with risk assessment and entry/exit levels.",
  },
  {
    step: "03",
    title: "Validate with Backtest",
    description: "Run your strategy on 2+ years of historical data. See win rate, avg return, and max drawdown before you trade.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-green-500/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-green-500/10 text-green-600 text-xs font-medium mb-6">
            <TrendingUp className="h-3.5 w-3.5" />
            Built for Indian Market (NSE/BSE)
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Trading decisions<br className="hidden sm:block" />
            <span className="text-green-500"> powered by AI</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop spending hours on research. Get AI-powered market scans, multi-agent stock analysis, and strategy backtests — built for busy Indian traders.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="h-12 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-base flex items-center gap-2 transition-colors"
            >
              Start Free — No Credit Card <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="h-12 px-6 rounded-xl border border-border hover:bg-accent text-foreground font-medium text-base flex items-center gap-2 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Works with your existing Zerodha, Angel One, or Upstox account
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            How it works — 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-bold text-green-500/20 mb-4">{s.step}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Everything you need to trade smarter
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            From scanning to analysis to backtesting — all in one platform, no complex setup.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="p-5 rounded-xl border border-border bg-background">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Start free, upgrade when you need more power. Cancel anytime.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-6 rounded-2xl border ${
                  tier.highlight
                    ? "border-green-500 bg-green-500/5 shadow-lg shadow-green-500/10"
                    : "border-border bg-background"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-3 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">/{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    tier.highlight
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-foreground hover:opacity-90 text-background"
                  }`}
                >
                  {tier.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-500">NSE+BSE</div>
              <div className="text-sm text-muted-foreground mt-1">Stocks Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">2+ Years</div>
              <div className="text-sm text-muted-foreground mt-1">Historical Data</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">Multi-Agent</div>
              <div className="text-sm text-muted-foreground mt-1">AI Analysis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">Free</div>
              <div className="text-sm text-muted-foreground mt-1">To Get Started</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to trade smarter?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join traders using AI to cut research time and make better decisions.
          </p>
          <Link
            href="/app"
            className="inline-flex h-12 px-8 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-base items-center gap-2 transition-colors"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-sm">Indian Trading Agent</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Indian Trading Agent. For informational purposes only — not SEBI registered investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
