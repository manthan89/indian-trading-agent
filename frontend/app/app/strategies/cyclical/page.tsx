"use client";

import { useState } from "react";
import { getMonthlySeasonality, getDayOfWeek, getSectorRotation, backtestSeasonal } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TickerSearch } from "@/components/TickerSearch";
import { HelpSection } from "@/components/HelpSection";
import { Loader2, BarChart3, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function generateInsight(data: any): string {
  if (!data || !data.months || data.months.length === 0) return "";
  const ticker = data.ticker || "This stock";
  const best = data.best_months || [];
  const worst = data.worst_months || [];
  const current = data.current_month;
  const currentMonthName = current?.month_name || "";
  const bullishMonths = data.months.filter((m: any) => m.signal === "BULLISH");
  const bearishMonths = data.months.filter((m: any) => m.signal === "BEARISH");
  let lines: string[] = [];
  if (best.length > 0) lines.push(`Historically strongest months: ${best.map((m: any) => `${m.month_name} (avg +${m.avg_return_pct}%, ${m.win_rate}% win rate)`).join(", ")}.`);
  if (worst.length > 0) lines.push(`Weakest months: ${worst.map((m: any) => `${m.month_name} (avg ${m.avg_return_pct}%)`).join(", ")}. Avoid fresh entries or consider hedging during these periods.`);
  if (bullishMonths.length > 0) lines.push(`${bullishMonths.length} out of 12 months show a bullish pattern (avg return >1% and win rate >60%).`);
  if (bearishMonths.length > 0) lines.push(`${bearishMonths.length} months show a bearish pattern — historically negative returns with <40% win rate.`);
  if (current) {
    if (current.signal === "BULLISH") lines.push(`Current month (${currentMonthName}): BULLISH — historically averages +${current.avg_return_pct}% with ${current.win_rate}% win rate. This is a good time to be invested.`);
    else if (current.signal === "BEARISH") lines.push(`Current month (${currentMonthName}): BEARISH — historically averages ${current.avg_return_pct}%. Consider waiting for a better entry or tightening stop-losses.`);
    else lines.push(`Current month (${currentMonthName}): NEUTRAL — avg ${current.avg_return_pct}%, ${current.win_rate}% win rate. No strong seasonal edge this month.`);
  }
  return lines.join("\n\n");
}

const signalColors: Record<string, string> = {
  BULLISH: "bg-green-50 text-green-700 border-green-200",
  BEARISH: "bg-red-50 text-red-700 border-red-200",
  NEUTRAL: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function CyclicalPage() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [dowData, setDowData] = useState<any>(null);
  const [sectorData, setSectorData] = useState<any>(null);
  const [sectorLoading, setSectorLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any>(null);
  const [buyMonths, setBuyMonths] = useState("");
  const [sellMonths, setSellMonths] = useState("");

  const handleAnalyze = async () => {
    if (!ticker.trim()) return;
    setLoading(true);
    setMonthlyData(null);
    setDowData(null);
    setBacktestResult(null);
    try {
      const [monthly, dow]: any[] = await Promise.all([getMonthlySeasonality(ticker.trim()), getDayOfWeek(ticker.trim())]);
      setMonthlyData(monthly);
      setDowData(dow);
      if (monthly.best_months?.length > 0) setBuyMonths(monthly.best_months.map((m: any) => m.month).join(","));
      if (monthly.worst_months?.length > 0) setSellMonths(monthly.worst_months.map((m: any) => m.month).join(","));
    } catch (e: any) { toast.error(e.message || "Failed to analyze"); }
    finally { setLoading(false); }
  };

  const handleSectorScan = async () => {
    setSectorLoading(true);
    try { const data: any = await getSectorRotation(3); setSectorData(data); }
    catch (e: any) { toast.error(e.message || "Failed to load sectors"); }
    finally { setSectorLoading(false); }
  };

  const handleBacktest = async () => {
    if (!ticker.trim() || !buyMonths || !sellMonths) { toast.error("Enter ticker, buy months, and sell months"); return; }
    try { const result: any = await backtestSeasonal(ticker.trim(), buyMonths, sellMonths); setBacktestResult(result); }
    catch (e: any) { toast.error(e.message || "Backtest failed"); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/app/strategies"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Strategies</Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Cyclical Patterns</h1>
          <p className="text-sm text-muted-foreground">Monthly seasonality, day-of-week patterns, and sector rotation. All FREE.</p>
        </div>
      </div>

      <Tabs defaultValue="stock">
        <TabsList><TabsTrigger value="stock">Stock Seasonality</TabsTrigger><TabsTrigger value="sectors">Sector Rotation</TabsTrigger></TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3 items-end">
                <div className="w-64">
                  <label className="text-xs text-muted-foreground mb-1 block">Ticker Symbol</label>
                  <TickerSearch value={ticker} onChange={setTicker} placeholder="Search stock (e.g., Infosys)" />
                </div>
                <Button onClick={handleAnalyze} disabled={loading || !ticker.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BarChart3 className="h-4 w-4 mr-2" />}
                  Analyze Patterns
                </Button>
              </div>
            </CardContent>
          </Card>

          {monthlyData && !monthlyData.error && (
            <>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center justify-between">Monthly Seasonality — {monthlyData.ticker}<Badge variant="outline">{monthlyData.years_analyzed} years of data</Badge></CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-12 gap-1 mb-4">
                    {(monthlyData.months || []).map((m: any) => {
                      const maxAbs = Math.max(...monthlyData.months.map((x: any) => Math.abs(x.avg_return_pct)), 1);
                      const height = Math.max(20, Math.abs(m.avg_return_pct) / maxAbs * 80);
                      const isPositive = m.avg_return_pct >= 0;
                      return (
                        <div key={m.month} className="flex flex-col items-center">
                          <div className="h-24 flex items-end justify-center w-full">
                            <div className={`w-full rounded-t ${isPositive ? "bg-green-400" : "bg-red-400"}`} style={{ height: `${height}%` }} title={`${m.month_name}: ${m.avg_return_pct}% avg, ${m.win_rate}% win rate`} />
                          </div>
                          <span className="text-xs mt-1 font-medium">{m.month_name}</span>
                          <span className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>{isPositive ? "+" : ""}{m.avg_return_pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                  {generateInsight(monthlyData) && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
                      <p className="text-sm font-semibold text-blue-800 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Pattern Insight</p>
                      {generateInsight(monthlyData).split("\n\n").map((line, i) => <p key={i} className="text-sm text-blue-700 leading-relaxed">{line}</p>)}
                    </div>
                  )}
                  <Table>
                    <TableHeader><TableRow><TableHead>Month</TableHead><TableHead className="text-right">Avg Return</TableHead><TableHead className="text-right">Win Rate</TableHead><TableHead className="text-right">Best</TableHead><TableHead className="text-right">Worst</TableHead><TableHead>Signal</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {(monthlyData.months || []).map((m: any) => (
                        <TableRow key={m.month} className={m.month === new Date().getMonth() + 1 ? "bg-blue-50" : ""}>
                          <TableCell className="font-medium">{m.month_name}{m.month === new Date().getMonth() + 1 && <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Current</Badge>}</TableCell>
                          <TableCell className={`text-right ${m.avg_return_pct >= 0 ? "text-green-600" : "text-red-600"}`}>{m.avg_return_pct >= 0 ? "+" : ""}{m.avg_return_pct}%</TableCell>
                          <TableCell className="text-right">{m.win_rate}%</TableCell>
                          <TableCell className="text-right text-green-600">+{m.best_return}%</TableCell>
                          <TableCell className="text-right text-red-600">{m.worst_return}%</TableCell>
                          <TableCell><Badge variant="outline" className={signalColors[m.signal] || ""}>{m.signal}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {dowData && !dowData.error && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Day-of-Week Pattern — {dowData.ticker}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-3">
                      {(dowData.days || []).map((d: any) => (
                        <Card key={d.day} className={d.avg_return_pct >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                          <CardContent className="p-3 text-center">
                            <p className="font-medium text-sm">{d.day_name}</p>
                            <p className={`text-lg font-bold ${d.avg_return_pct >= 0 ? "text-green-600" : "text-red-600"}`}>{d.avg_return_pct >= 0 ? "+" : ""}{d.avg_return_pct}%</p>
                            <p className="text-xs text-muted-foreground">Win: {d.win_rate}% ({d.sample_size} days)</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {monthlyData && !monthlyData.error && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Seasonal Backtest (FREE)</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3 items-end">
                      <div><label className="text-xs text-muted-foreground mb-1 block">Buy Months (1-12, comma sep)</label><Input value={buyMonths} onChange={(e) => setBuyMonths(e.target.value)} placeholder="e.g., 1,10" className="w-40" /></div>
                      <div><label className="text-xs text-muted-foreground mb-1 block">Sell Months</label><Input value={sellMonths} onChange={(e) => setSellMonths(e.target.value)} placeholder="e.g., 3,12" className="w-40" /></div>
                      <Button onClick={handleBacktest} variant="outline">Backtest Strategy</Button>
                    </div>
                    {backtestResult && !backtestResult.error && (
                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">Total Return</p><p className={`text-xl font-bold ${backtestResult.total_return_pct >= 0 ? "text-green-600" : "text-red-600"}`}>{backtestResult.total_return_pct >= 0 ? "+" : ""}{backtestResult.total_return_pct}%</p></div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">Win Rate</p><p className="text-xl font-bold">{backtestResult.win_rate}%</p></div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">Trades</p><p className="text-xl font-bold">{backtestResult.total_trades}</p></div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">Avg Per Trade</p><p className={`text-xl font-bold ${backtestResult.avg_return_per_trade >= 0 ? "text-green-600" : "text-red-600"}`}>{backtestResult.avg_return_per_trade >= 0 ? "+" : ""}{backtestResult.avg_return_per_trade}%</p></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card><CardContent className="p-4"><Button onClick={handleSectorScan} disabled={sectorLoading}>{sectorLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}Scan Sector Performance (3 months)</Button></CardContent></Card>
          {sectorData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(sectorData.sectors || []).map((s: any, i: number) => (
                <Card key={s.sector} className={i < 3 ? "border-green-200" : i >= sectorData.sectors.length - 3 ? "border-red-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{s.sector}</h3><Badge variant="outline" className={signalColors[s.signal] || ""}>{s.signal}</Badge></div>
                    <p className={`text-2xl font-bold ${s.avg_return_pct >= 0 ? "text-green-600" : "text-red-600"}`}>{s.avg_return_pct >= 0 ? "+" : ""}{s.avg_return_pct}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Top stocks: {s.top_stocks.join(", ")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}