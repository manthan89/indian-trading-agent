"use client";

import { useEffect, useState } from "react";
import { getLearningInsights } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpSection } from "@/components/HelpSection";
import { Brain, Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, RefreshCw, Sparkles, MinusCircle } from "lucide-react";
import { toast } from "sonner";

const insightsHelp = [
  { question: "What is this page?", answer: "This analyzes your PAST trades to surface patterns you wouldn't spot yourself. It answers: Which signals actually work? Which stocks do you consistently win/lose on? Minimum 3 closed trades needed." },
  { question: "Does the AI train itself?", answer: "Not exactly. The LLM never changes its weights. What happens: You log P&L with 'Teach the agent' checked. The Reflector writes a text reflection stored in BM25 memory. Next analysis retrieves past reflections. The agent 'remembers' via context." },
  { question: "How to use these insights?", answer: "1. Check SUMMARY card — key findings first. 2. Look at STRENGTHS — where you have edge. 3. Look at WEAKNESSES — where you lose money, avoid or fade. 4. Adjust Recommendations + Scanner based on what works." },
];

const categoryIcons: Record<string, any> = { "Signal Type": Sparkles, "Confidence Level": CheckCircle2, "Strategy": Brain, "Ticker": TrendingUp, "Direction": TrendingUp, "Seasonality": Info };
const typeStyles: Record<string, { bg: string; border: string; text: string; icon: any }> = {
  strength: { bg: "bg-green-50", border: "border-green-300", text: "text-green-800", icon: CheckCircle2 },
  positive: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: TrendingUp },
  neutral: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: MinusCircle },
  caution: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800", icon: AlertTriangle },
  weakness: { bg: "bg-red-50", border: "border-red-300", text: "text-red-800", icon: TrendingDown },
};

function InsightCard({ insight }: { insight: any }) {
  const style = typeStyles[insight.type] || typeStyles.neutral;
  const CategoryIcon = categoryIcons[insight.category] || Info;
  const TypeIcon = style.icon;
  const winRateColor = insight.stats.win_rate >= 55 ? "text-green-700" : insight.stats.win_rate < 45 ? "text-red-700" : "";
  const avgColor = insight.stats.avg_return >= 0 ? "text-green-700" : "text-red-700";

  return (
    <Card className={style.border + " " + style.bg}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white"><CategoryIcon className="h-4 w-4 text-muted-foreground" /></div>
            <div>
              <p className="text-xs text-muted-foreground">{insight.category}</p>
              <p className="font-semibold">{insight.name}</p>
            </div>
          </div>
          <Badge variant="outline" className={style.text + " " + style.border + " text-xs flex items-center gap-1"}>
            <TypeIcon className="h-3 w-3" />{insight.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center p-2 rounded bg-white/50">
            <p className="text-[10px] text-muted-foreground uppercase">Trades</p>
            <p className="font-semibold text-sm">{insight.stats.count}</p>
          </div>
          <div className="text-center p-2 rounded bg-white/50">
            <p className="text-[10px] text-muted-foreground uppercase">Win Rate</p>
            <p className={"font-semibold text-sm " + winRateColor}>{insight.stats.win_rate}%</p>
          </div>
          <div className="text-center p-2 rounded bg-white/50">
            <p className="text-[10px] text-muted-foreground uppercase">Avg</p>
            <p className={"font-semibold text-sm " + avgColor}>{insight.stats.avg_return >= 0 ? "+" : ""}{insight.stats.avg_return}%</p>
          </div>
          <div className="text-center p-2 rounded bg-white/50">
            <p className="text-[10px] text-muted-foreground uppercase">Best / Worst</p>
            <p className="font-semibold text-xs"><span className="text-green-700">+{insight.stats.best}%</span> / <span className="text-red-700">{insight.stats.worst}%</span></p>
          </div>
        </div>
        <div className={"p-3 rounded-lg border text-sm " + style.bg + " " + style.border}>
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">{insight.actionable_tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("strengths");

  const load = async () => {
    setLoading(true);
    try {
      const result: any = await getLearningInsights();
      setData(result);
    } catch (e: any) {
      toast.error(e.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-3">Analyzing your trade history...</p>
        </div>
      </div>
    );
  }

  if (!data?.ok) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="h-6 w-6" /> Learning Insights</h1>
          <p className="text-sm text-muted-foreground">Pattern analysis of your trading history</p>
        </div>
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-8 text-center">
            <Info className="h-8 w-8 mx-auto text-blue-600 mb-3" />
            <p className="text-sm font-medium mb-2">{data?.message || "Need more trade data"}</p>
            <p className="text-xs text-muted-foreground mb-4">You have {data?.total_trades || 0} closed trades so far. Aim for 10-20 to start seeing patterns.</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/app/recommendations"}>Open Top Picks</Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/app/simulation"}>View Paper Trades</Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/app/history"}>Log P&L</Button>
            </div>
          </CardContent>
        </Card>
        <HelpSection title="About Learning Insights" items={insightsHelp} />
      </div>
    );
  }

  const strengths = data.insights.filter((i: any) => i.type === "strength" || i.type === "positive");
  const weaknesses = data.insights.filter((i: any) => i.type === "weakness" || i.type === "caution");
  const neutral = data.insights.filter((i: any) => i.type === "neutral");

  const wrColor = data.overall.win_rate >= 55 ? "text-green-600" : data.overall.win_rate < 45 ? "text-red-600" : "";
  const arColor = data.overall.avg_return >= 0 ? "text-green-600" : "text-red-600";
  const wrBorder = data.overall.win_rate >= 55 ? "border-green-200" : data.overall.win_rate < 45 ? "border-red-200" : "";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="h-6 w-6" /> Learning Insights</h1>
          <p className="text-sm text-muted-foreground">Pattern analysis of your {data.total_trades} closed trades</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-3 w-3 mr-1" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Total Trades</p><p className="text-2xl font-bold">{data.total_trades}</p></CardContent></Card>
        <Card className={wrBorder}><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Win Rate</p><p className={"text-2xl font-bold " + wrColor}>{data.overall.win_rate}%</p><p className="text-xs text-muted-foreground">{data.overall.wins}W / {data.overall.losses}L</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Avg Return</p><p className={"text-2xl font-bold " + arColor}>{data.overall.avg_return >= 0 ? "+" : ""}{data.overall.avg_return}%</p></CardContent></Card>
        <Card className="border-green-200"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Strengths Found</p><p className="text-2xl font-bold text-green-600">{data.summary.strength_count}</p></CardContent></Card>
        <Card className="border-red-200"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Weaknesses</p><p className="text-2xl font-bold text-red-600">{data.summary.weakness_count}</p></CardContent></Card>
      </div>

      {data.summary.key_findings.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-600" /> Key Findings</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.summary.key_findings.map((f: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm"><span className="text-blue-600 mt-0.5">•</span><span>{f}</span></div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="strengths"><CheckCircle2 className="h-3 w-3 mr-1 text-green-600" /> Strengths ({strengths.length})</TabsTrigger>
          <TabsTrigger value="weaknesses"><AlertTriangle className="h-3 w-3 mr-1 text-red-600" /> Weaknesses ({weaknesses.length})</TabsTrigger>
          <TabsTrigger value="neutral"><MinusCircle className="h-3 w-3 mr-1" /> Neutral ({neutral.length})</TabsTrigger>
          <TabsTrigger value="all">All ({data.insights.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="strengths" className="space-y-3 mt-4">
          {strengths.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No clear strengths yet.</CardContent></Card>
          ) : (
            strengths.map((i: any, idx: number) => <InsightCard key={idx} insight={i} />)
          )}
        </TabsContent>
        <TabsContent value="weaknesses" className="space-y-3 mt-4">
          {weaknesses.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No clear weaknesses detected!</CardContent></Card>
          ) : (
            weaknesses.map((i: any, idx: number) => <InsightCard key={idx} insight={i} />)
          )}
        </TabsContent>
        <TabsContent value="neutral" className="space-y-3 mt-4">
          {neutral.map((i: any, idx: number) => <InsightCard key={idx} insight={i} />)}
        </TabsContent>
        <TabsContent value="all" className="space-y-3 mt-4">
          {data.insights.map((i: any, idx: number) => <InsightCard key={idx} insight={i} />)}
        </TabsContent>
      </Tabs>

      <HelpSection title="About Learning Insights" items={insightsHelp} />
    </div>
  );
}
