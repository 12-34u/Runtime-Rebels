import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Clock, Languages, HardDrive, Network, Shield,
  TrendingUp, ExternalLink, ChevronDown, Search, Eye, Footprints,
  CheckCircle2
} from "lucide-react";
import anomalyData from "@/data/anomalies.json";

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  temporal: { icon: <Clock className="h-4 w-4" />, color: "text-accent", label: "Temporal" },
  linguistic: { icon: <Languages className="h-4 w-4" />, color: "text-chart-5", label: "Linguistic" },
  data: { icon: <HardDrive className="h-4 w-4" />, color: "text-destructive", label: "Data" },
  network: { icon: <Network className="h-4 w-4" />, color: "text-primary", label: "Network" },
};

const severityStyles: Record<string, string> = {
  critical: "border-destructive/40 bg-destructive/5",
  high: "border-accent/40 bg-accent/5",
  medium: "border-primary/40 bg-primary/5",
  low: "border-border bg-muted/50",
};

const severityBadge: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-accent text-accent-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-muted text-muted-foreground",
};

export default function AnomaliesPage() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);

  const filtered = anomalyData.anomalies.filter(a =>
    filterCategory === "all" ? true : a.category === filterCategory
  );

  const { riskSummary, baseline } = anomalyData;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">Proactive "Fishy" Lead Detection</h2>
        <p className="text-xs text-muted-foreground">Behavioral anomaly engine — flags deviations from established baselines</p>
      </div>

      {/* Risk Summary Bar */}
      <div className="grid grid-cols-6 gap-px border-b border-border bg-border">
        {[
          { label: "Overall Risk", value: riskSummary.overallRisk, color: "text-destructive" },
          { label: "Critical", value: riskSummary.critical, color: "text-destructive" },
          { label: "High", value: riskSummary.high, color: "text-accent" },
          { label: "Medium", value: riskSummary.medium, color: "text-primary" },
          { label: "Low", value: riskSummary.low, color: "text-muted-foreground" },
          { label: "Total", value: anomalyData.anomalies.length, color: "text-foreground" },
        ].map(item => (
          <div key={item.label} className="bg-card p-3 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className={`mt-1 text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Baseline + Filters */}
        <div className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto scrollbar-thin">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Behavioral Baseline</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                ["Active Hours", baseline.activeHours],
                ["Language", baseline.primaryLanguage],
                ["Avg Msgs/Day", baseline.avgDailyMessages],
                ["Contacts", baseline.typicalContacts],
                ["Avg Media/Day", baseline.avgMediaPerDay],
              ].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-foreground">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Filter by Type</p>
            <div className="space-y-1">
              <button
                onClick={() => setFilterCategory("all")}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  filterCategory === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" /> All Anomalies
              </button>
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    filterCategory === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-destructive mb-1">AI Recommendation</p>
              <p className="text-[11px] text-foreground leading-relaxed">{riskSummary.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Anomaly Cards */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {filtered.map((anomaly, i) => {
            const cfg = categoryConfig[anomaly.category];
            const isExpanded = expandedAnomaly === anomaly.id;
            return (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-xl border overflow-hidden ${severityStyles[anomaly.severity]}`}
              >
                {/* Card Header */}
                <button
                  onClick={() => setExpandedAnomaly(isExpanded ? null : anomaly.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="text-sm font-bold text-foreground">{anomaly.title}</h4>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${severityBadge[anomaly.severity]}`}>
                        {anomaly.severity}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-mono text-secondary-foreground uppercase">
                        {cfg.label}
                      </span>
                    </div>
                    {/* Always-visible Finding summary */}
                    <div className="flex items-start gap-2 mb-2">
                      <Search className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                      <p className="text-xs text-foreground/90 leading-relaxed">{anomaly.finding}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Detected: {new Date(anomaly.timestamp).toLocaleString()} • {anomaly.baselineDeviation}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border bg-card/60 px-5 py-4 space-y-5">
                        {/* Why Suspicious */}
                        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-accent" />
                            <p className="text-xs font-bold text-accent uppercase tracking-wider">Why This Is Suspicious</p>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">{anomaly.whySuspicious}</p>
                        </div>

                        {/* Next Steps */}
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Footprints className="h-4 w-4 text-primary" />
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Recommended Next Steps</p>
                          </div>
                          <div className="space-y-2">
                            {anomaly.nextSteps.map((step, j) => (
                              <div key={j} className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/60" />
                                <p className="text-xs text-foreground leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Evidence Sources */}
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Evidence Sources</p>
                          <div className="flex flex-wrap gap-1.5">
                            {anomaly.evidence.map((ev, j) => (
                              <span key={j} className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-mono text-primary">
                                <ExternalLink className="h-3 w-3" />
                                {ev}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
