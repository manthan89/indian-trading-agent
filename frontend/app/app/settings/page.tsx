"use client";

import { useEffect, useState } from "react";
import { getConfig } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApiKeysManager } from "@/components/settings/ApiKeysManager";
import { LLMSettings } from "@/components/settings/LLMSettings";

export default function SettingsPage() {
  const [config, setConfig] = useState<Record<string, any> | null>(null);

  useEffect(() => { getConfig().then((data: any) => setConfig(data)).catch(() => {}); }, []);

  if (!config) return <div className="p-6"><p className="text-muted-foreground">Loading settings...</p></div>;

  const sections = [
    { title: "LLM Configuration", items: [{ label: "Provider", value: config.llm_provider, badge: true }, { label: "Deep Think Model", value: config.deep_think_llm }, { label: "Quick Think Model", value: config.quick_think_llm }] },
    { title: "Market Settings", items: [{ label: "Market", value: config.market, badge: true }, { label: "Exchange", value: config.default_exchange }, { label: "Trading Style", value: config.trading_style, badge: true }] },
    { title: "Analysis Settings", items: [{ label: "Max Debate Rounds", value: config.max_debate_rounds }, { label: "Max Risk Discussion Rounds", value: config.max_risk_discuss_rounds }] },
    { title: "Safety & Risk", items: [{ label: "Dry Run", value: config.dry_run ? "Enabled" : "Disabled", badge: true }, { label: "Order Execution", value: config.order_execution_enabled ? "Enabled" : "Disabled", badge: true }, { label: "Max Position Value", value: `₹${config.max_position_value?.toLocaleString()}` }, { label: "Max Loss Per Trade", value: `₹${config.max_loss_per_trade?.toLocaleString()}` }, { label: "Max Daily Loss", value: `₹${config.max_daily_loss?.toLocaleString()}` }, { label: "Max Open Positions", value: config.max_open_positions }] },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage API keys, LLM provider, and view current configuration</p>
      </div>
      <ApiKeysManager />
      <LLMSettings />
      <div>
        <h2 className="text-lg font-semibold">System Configuration</h2>
        <p className="text-xs text-muted-foreground">Runtime settings loaded from default_config.py</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3"><CardTitle className="text-lg">{section.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  {item.badge ? <Badge variant="outline">{String(item.value)}</Badge> : <span className="text-sm font-medium font-sans">{String(item.value)}</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-lg">API Cost Guide</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Each AI analysis runs ~15-17 LLM calls. The cost depends on which models you use.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200"><p className="text-xs font-medium text-green-800">FREE Features</p><ul className="text-xs text-green-700 mt-1 space-y-0.5"><li>Support/Resistance levels</li><li>Pivot Points</li><li>Monthly Seasonality</li><li>Day-of-Week patterns</li><li>Sector Rotation</li><li>Seasonal Backtest</li><li>Market Scanner</li><li>Charts</li></ul></div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200"><p className="text-xs font-medium text-yellow-800">Paid Features</p><ul className="text-xs text-yellow-700 mt-1 space-y-0.5"><li>AI Analysis (~Rs.15-25 each)</li><li>AI Backtest (~Rs.15-25 per date)</li></ul></div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200"><p className="text-xs font-medium text-blue-800">How to Switch Provider</p><p className="text-xs text-blue-700 mt-1">Edit <code className="bg-blue-100 px-1 rounded">tradingagents/default_config.py</code> and change <code className="bg-blue-100 px-1 rounded">llm_provider</code> to &quot;openai&quot; or &quot;google&quot;.</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}