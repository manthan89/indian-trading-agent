"use client";

import { useEffect, useState } from "react";
import { listPaperTrades, refreshPaperTrades, getPaperTradingStats, deletePaperTrade, closePaperTrade, runRecommenderBacktest, listRecommenderBacktests, getRecommenderBacktestResult } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpSection } from "@/components/HelpSection";
import { FlaskConical, Loader2, RefreshCw, TrendingUp, TrendingDown, Trash2, X, Play, BarChart3, Sparkles, Radar, Brain, Target } from "lucide-react";
import { toast } from "sonner";

const sourceConfig: Record<string, { label: string; icon: any; color: string }> = {
  recommendation: { label: "Recommendations", icon: Sparkles, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  scanner: { label: "Scanner", icon: Radar, color: "bg-orange-50 text-orange-700 border-orange-200" },
  ai_analysis: { label: "AI Analysis", icon: Brain, color: "bg-purple-50 text-purple-700 border-purple-200" },
  manual: { label: "Manual", icon: Target, color: "bg-gray-50 text-gray-700 border-gray-200" },
  test: { label: "Test", icon: Target, color: "bg-blue-50 text-blue-700 border-blue-200" },
};

function PnLCell({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-muted-foreground text-xs">—</span>;
  return <span className={`font-semibold ${value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-muted-foreground"}`}>{value >= 0 ? "+" : ""}{value}%</span>;
}

function PaperTradeRow({ t, onClose, onDelete }: { t: any; onClose: (id: number) => void; onDelete: (id: number) => void }) {
  const src = sourceConfig[t.source] || sourceConfig.manual;
  const SrcIcon = src.icon;
  return (
    <TableRow>
      <TableCell className="font-medium">{t.ticker}</TableCell>
      <TableCell className="text-xs">{t.entry_date}</TableCell>
      <TableCell><span className={t.direction === "LONG" ? "text-green-600" : "text-red-600"}>{t.direction === "LONG" ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}</span></TableCell>
      <TableCell className="text-right text-sm font-sans">₹{t.entry_price}</TableCell>
      <TableCell className="text-right text-sm"><PnLCell value={t.pnl_1d_pct} /></TableCell>
      <TableCell className="text-right text-sm"><PnLCell value={t.pnl_3d_pct} /></TableCell>
      <TableCell className="text-right text-sm"><PnLCell value={t.pnl_5d_pct} /></TableCell>
      <TableCell className="text-right text-sm"><PnLCell value={t.pnl_10d_pct} /></TableCell>
      <TableCell><Badge variant="outline" className="text-xs">{t.status}</Badge></TableCell>
      <TableCell>
        <div className="flex gap-1">
          {t.status === "active" && <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onClose(t.id)} title="Close"><X className="h-3 w-3" /></Button>}
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600" onClick={() => onDelete(t.id)} title="Delete"><Trash2 className="h-3 w-3" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function SimulationPage() {
  const [tab, setTab] = useState("paper");
  const [trades, setTrades] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bt_universe, setBtUniverse] = useState("nifty50");
  const [bt_interval, setBtInterval] = useState(5);
  const [bt_running, setBtRunning] = useState(false);
  const [bt_result, setBtResult] = useState<any>(null);
  const [bt_history, setBtHistory] = useState<any[]>([]);

  const loadPaperData = async () => { setLoading(true); try { const [tradesRes, statsRes]: any[] = await Promise.all([listPaperTrades(), getPaperTradingStats()]); setTrades(tradesRes.trades || []); setStats(statsRes); } catch { toast.error("Failed to load paper trades"); } finally { setLoading(false); } };
  const loadBacktestHistory = async () => { try { const data: any = await listRecommenderBacktests(); setBtHistory(Array.isArray(data) ? data : []); } catch {} };
  useEffect(() => { loadPaperData(); loadBacktestHistory(); }, []);

  const handleRefresh = async () => { setRefreshing(true); try { const r: any = await refreshPaperTrades(); toast.success(`Refreshed ${r.updated} trades`); await loadPaperData(); } catch (e: any) { toast.error(e.message || "Refresh failed"); } finally { setRefreshing(false); } };
  const handleDelete = async (id: number) => { if (!confirm("Delete this paper trade?")) return; await deletePaperTrade(id); toast.success("Deleted"); loadPaperData(); };
  const handleClose = async (id: number) => { try { const result: any = await closePaperTrade(id); if (result.ok) { const pnl = result.pnl_pct; toast.success(`Closed ${result.ticker} at Rs.${result.close_price} — ${pnl >= 0 ? "+" : ""}${pnl}% P&L`); } else toast.success("Trade closed"); } catch { toast.success("Trade closed"); } loadPaperData(); };

  const handleRunBacktest = async () => { setBtRunning(true); setBtResult(null); try { const result: any = await runRecommenderBacktest({ universe: bt_universe, interval_days: bt_interval }); setBtResult(result); toast.success(`Backtest complete: ${result.total_signals} signals, ${result.win_rate_5d}% win rate at 5d`); loadBacktestHistory(); } catch (e: any) { toast.error(e.message || "Backtest failed"); } finally { setBtRunning(false); } };

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><FlaskConical className="h-6 w-6" /> Simulation</h1><p className="text-sm text-muted-foreground">Paper trading + historical backtest. Validate without risking real money.</p></div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="paper">Paper Trades ({trades.length})</TabsTrigger><TabsTrigger value="historical">Historical Backtest</TabsTrigger></TabsList>

        <TabsContent value="paper" className="space-y-4">
          {stats && <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Total Trades</p><p className="text-2xl font-bold">{stats.total_trades}</p><p className="text-xs text-muted-foreground">{stats.active} active</p></CardContent></Card>
            {["1d", "3d", "5d", "10d"].map((h) => { const s = stats[`horizon_${h}`]; return <Card key={h} className={s.count > 0 && s.win_rate >= 55 ? "border-green-200" : ""}><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground uppercase">{h} horizon</p><p className="text-lg font-bold">{s.win_rate}% win</p><p className={`text-xs ${s.avg_return >= 0 ? "text-green-600" : "text-red-600"}`}>avg {s.avg_return >= 0 ? "+" : ""}{s.avg_return}%</p><p className="text-[10px] text-muted-foreground">{s.count} closed</p></CardContent></Card>; })}
          </div>}
          <Card><CardContent className="p-4 space-y-2"><div className="flex items-center justify-between flex-wrap gap-3"><div className="text-sm text-muted-foreground">Open trades from <a href="/app/recommendations" className="text-primary hover:underline">Top Picks</a> or <a href="/app" className="text-primary hover:underline">Dashboard</a>.</div><Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">{refreshing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}Refresh Prices</Button></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm">All Paper Trades</CardTitle></CardHeader><CardContent className="p-0"><ScrollArea className="max-h-[500px]"><Table><TableHeader><TableRow><TableHead>Ticker</TableHead><TableHead>Entry Date</TableHead><TableHead>Dir</TableHead><TableHead className="text-right">Entry</TableHead><TableHead className="text-right">+1d</TableHead><TableHead className="text-right">+3d</TableHead><TableHead className="text-right">+5d</TableHead><TableHead className="text-right">+10d</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={10} className="text-center py-6 text-muted-foreground">Loading...</TableCell></TableRow> : trades.length === 0 ? <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No paper trades yet.</TableCell></TableRow> : trades.map((t: any) => <PaperTradeRow key={t.id} t={t} onClose={handleClose} onDelete={handleDelete} />)}</TableBody></Table></ScrollArea></CardContent></Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card><CardContent className="p-4 space-y-3"><div><p className="text-sm font-medium mb-1">Run Historical Backtest</p><p className="text-xs text-muted-foreground">Replays the recommendation engine on past dates. FREE (~30-120 sec).</p></div>
            <div className="flex gap-3 items-end flex-wrap">
              <div><label className="text-xs text-muted-foreground mb-1 block">Universe</label><div className="flex gap-1">{[{ v: "nifty50", l: "NIFTY 50" }, { v: "nifty100", l: "NIFTY 100" }, { v: "bse250", l: "BSE 250" }].map((u) => <Button key={u.v} size="sm" variant={bt_universe === u.v ? "default" : "outline"} onClick={() => setBtUniverse(u.v)} disabled={bt_running}>{u.l}</Button>)}</div></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Interval (days)</label><Input type="number" value={bt_interval} onChange={(e) => setBtInterval(Number(e.target.value))} className="w-24" disabled={bt_running} /></div>
              <Button onClick={handleRunBacktest} disabled={bt_running}>{bt_running ? <><Loader2 className="h-3 w-3 animate-spin mr-1" />Running...</> : <><Play className="h-3 w-3 mr-1" />Run Backtest</>}</Button>
            </div>
          </CardContent></Card>

          {bt_result && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={bt_result.win_rate_5d >= 55 ? "border-green-200" : "border-red-200"}><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Win Rate (5d)</p><p className={`text-2xl font-bold ${bt_result.win_rate_5d >= 55 ? "text-green-600" : "text-red-600"}`}>{bt_result.win_rate_5d}%</p><p className="text-xs text-muted-foreground">{bt_result.wins_5d}W / {bt_result.losses_5d}L</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Avg Return (5d)</p><p className={`text-2xl font-bold ${bt_result.avg_return_5d >= 0 ? "text-green-600" : "text-red-600"}`}>{bt_result.avg_return_5d >= 0 ? "+" : ""}{bt_result.avg_return_5d}%</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Total Signals</p><p className="text-2xl font-bold">{bt_result.total_signals}</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Run ID</p><p className="text-sm font-mono">{bt_result.run_id}</p></CardContent></Card>
          </div>}
        </TabsContent>
      </Tabs>
    </div>
  );
}