"use client";

import { useState, useEffect } from "react";
import { runAnalysis, getAnalysisResult } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TickerSearch } from "@/components/TickerSearch";
import { DecisionCard } from "@/components/analysis/DecisionCard";
import { ReportPanel } from "@/components/analysis/ReportPanel";
import { DebateView } from "@/components/analysis/DebateView";
import { Loader2, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { NextStep } from "@/components/NextStep";
import { useAuthStore } from "@/lib/store-auth";
import { UpgradePrompt } from "@/components/auth/TierGate";
import type { AnalysisResult } from "@/lib/types";
import { History } from "lucide-react";
import Link from "next/link";

function AnalysisPageInner() {
  const { profile } = useAuthStore();
  const userTier = profile?.subscription_tier ?? "free";
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("ticker");
      if (t) setTicker(t);
    }
  }, []);

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;
    const poll = async () => {
      let attempts = 0;
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const data: any = await getAnalysisResult(taskId);
          if (!cancelled && data && data.signal) {
            setResult(data);
            setLoading(false);
            setTaskId(null);
            return;
          }
        } catch {}
        attempts++;
        if (attempts > 60) break;
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [taskId]);

  const handleRun = async () => {
    if (!ticker.trim()) return;
    setLoading(true);
    setResult(null);
    setLogs(["Starting analysis..."]);
    setProgress("Initializing agents...");

    try {
      const res: any = await runAnalysis({ ticker: ticker.trim(), trade_date: new Date().toISOString().split("T")[0] });
      const id = res.task_id || res.id;
      setTaskId(id);
      setLogs((l) => [...l, `Task started: ${id}`]);
      setProgress("Agents analyzing...");
      toast.success("Analysis started! Results will appear shortly.");
    } catch (e: any) {
      setLoading(false);
      toast.error(e.message || "Failed to start analysis");
      setLogs((l) => [...l, `Error: ${e.message}`]);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    setTaskId(null);
    setProgress("");
    toast.info("Analysis cancelled");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6" /> Deep Analysis
        </h1>
        <p className="text-sm text-muted-foreground">
          Multi-agent debate with entry, stop-loss, target, and position size
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-end">
            <div className="w-64">
              <label className="text-xs text-muted-foreground mb-1 block">Stock Ticker</label>
              <TickerSearch value={ticker} onChange={setTicker} placeholder="e.g., RELIANCE" />
            </div>
            {loading ? (
              <Button variant="outline" onClick={handleCancel}>
                <AlertCircle className="h-4 w-4 mr-2" /> Cancel
              </Button>
            ) : (
              <Button onClick={handleRun} disabled={!ticker.trim()}>
                <Target className="h-4 w-4 mr-2" /> Analyze
              </Button>
            )}
          </div>

          {loading && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                <span className="text-xs text-blue-600">{progress}</span>
              </div>
              {logs.map((log, i) => (
                <p key={i} className="text-xs text-muted-foreground pl-5">{log}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {result && result.signal && (
        <>
          <DecisionCard signal={result.signal} ticker={result.ticker} duration={result.duration_seconds} />

          <ReportPanel
            reports={{
              ...(result.market_report && { market_report: result.market_report }),
              ...(result.sentiment_report && { sentiment_report: result.sentiment_report }),
              ...(result.news_report && { news_report: result.news_report }),
              ...(result.fundamentals_report && { fundamentals_report: result.fundamentals_report }),
              ...(result.investment_plan && { investment_plan: result.investment_plan }),
              ...(result.trader_investment_plan && { trader_investment_plan: result.trader_investment_plan }),
              ...(result.final_trade_decision && { final_trade_decision: result.final_trade_decision }),
            }}
          />

          <DebateView
            bull={result.bull_history || ""}
            bear={result.bear_history || ""}
            riskAggressive={result.risk_aggressive_history}
            riskConservative={result.risk_conservative_history}
            riskNeutral={result.risk_neutral_history}
          />

          <NextStep
            title="Track this trade in paper mode"
            description="Open a paper trade to monitor how this recommendation plays out in real-time prices"
            href="/app/simulation"
            buttonText="Open Paper Trade"
            icon={History}
          />
        </>
      )}

      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Target className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Enter a ticker and click Analyze to run the multi-agent pipeline.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Uses Claude Haiku + Sonnet via Anthropic API. Cost: ~Rs.15-25 per analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  return <AnalysisPageInner />;
}