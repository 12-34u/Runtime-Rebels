import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Shield, FileText, CheckCircle, Loader2, AlertCircle, LogOut, Sun, Moon, FolderOpen, Clock, AlertTriangle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";

type UploadState = "idle" | "uploading" | "processing" | "done";

const processingSteps = [
  "Extracting device metadata…",
  "Parsing chat databases (WhatsApp, Telegram, Signal, SMS)…",
  "Indexing call logs & contacts…",
  "Building vector embeddings for semantic search…",
  "Constructing entity relationship graph…",
  "Running anomaly detection baselines…",
  "Generating multi-hypothesis timelines…",
  "Finalizing evidence index…",
];

const pastCases = [
  { id: "MH/2024/7891", title: "Financial Fraud — Mumbai", status: "Active", date: "2024-12-10", devices: 3, entities: 47, risk: "critical", summary: "Multi-crore hawala network involving 3 seized devices. 47 entities mapped with cross-border links to Dubai." },
  { id: "DL/2024/3204", title: "Narcotics Network — Delhi", status: "Closed", date: "2024-11-02", devices: 5, entities: 112, risk: "high", summary: "Dark web procurement chain. 112 entities identified across Telegram and Signal. 5 devices analyzed." },
  { id: "KA/2024/9917", title: "Corporate Espionage — Bangalore", status: "Under Review", date: "2024-10-18", devices: 2, entities: 23, risk: "medium", summary: "Insider data exfiltration via encrypted USB. 23 entities, 2 devices with deleted file recovery." },
  { id: "TN/2024/5540", title: "Human Trafficking Ring — Chennai", status: "Active", date: "2024-09-25", devices: 7, entities: 89, risk: "critical", summary: "Multi-state trafficking operation. 89 entities with geographic clustering across 4 states." },
];

const riskBadge: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/15 text-accent border-accent/30",
  medium: "bg-primary/15 text-primary border-primary/30",
};

const statusBadge: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Closed: "bg-muted text-muted-foreground",
  "Under Review": "bg-accent/15 text-accent",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const simulateProcessing = useCallback((name: string) => {
    setFileName(name);
    setUploadState("uploading");
    setProgress(0);

    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += Math.random() * 15 + 5;
      if (uploadProgress >= 100) {
        uploadProgress = 100;
        clearInterval(uploadInterval);
        setProgress(100);
        setUploadState("processing");

        let step = 0;
        const stepInterval = setInterval(() => {
          step++;
          setCurrentStep(step);
          if (step >= processingSteps.length) {
            clearInterval(stepInterval);
            setUploadState("done");
            setTimeout(() => navigate("/dashboard"), 1200);
          }
        }, 800);
      }
      setProgress(Math.min(uploadProgress, 100));
    }, 200);
  }, [navigate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) simulateProcessing(file.name);
  }, [simulateProcessing]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateProcessing(file.name);
  }, [simulateProcessing]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-foreground">FORENSIQ</h1>
            <p className="text-[10px] font-mono tracking-widest text-muted-foreground">COMMAND CENTER</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
              {user?.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-xl font-bold text-foreground">Welcome, {user?.name?.split(" ").pop()}</h2>
            <p className="text-sm text-muted-foreground">{user?.department} • {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Cases", value: pastCases.length, icon: FolderOpen, color: "text-primary" },
              { label: "Active Cases", value: pastCases.filter(c => c.status === "Active").length, icon: Clock, color: "text-success" },
              { label: "Entities Mapped", value: pastCases.reduce((a, c) => a + c.entities, 0), icon: Users, color: "text-accent" },
              { label: "Critical Risks", value: pastCases.filter(c => c.risk === "critical").length, icon: AlertTriangle, color: "text-destructive" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Upload section */}
            <div className="col-span-1">
              <h3 className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">New Case — Upload UFDR</h3>
              <AnimatePresence mode="wait">
                {uploadState === "idle" ? (
                  <motion.label
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        Drop file or <span className="text-primary underline underline-offset-2">browse</span>
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">.ufdr, .ufd, .zip — Max 10 GB</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileInput} accept=".ufdr,.ufd,.zip,.tar,.gz" />
                  </motion.label>
                ) : (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground truncate">{fileName}</span>
                      {uploadState === "done" && <CheckCircle className="ml-auto h-4 w-4 text-success" />}
                    </div>

                    {uploadState === "uploading" && (
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-[10px] font-mono text-muted-foreground">Uploading…</span>
                          <span className="text-[10px] font-mono text-primary">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {(uploadState === "processing" || uploadState === "done") && (
                      <div className="space-y-1.5">
                        {processingSteps.map((step, i) => {
                          const isDone = i < currentStep;
                          const isCurrent = i === currentStep && uploadState === "processing";
                          return (
                            <div key={i} className="flex items-center gap-2">
                              {isDone ? <CheckCircle className="h-3 w-3 text-success flex-shrink-0" /> : isCurrent ? <Loader2 className="h-3 w-3 animate-spin text-primary flex-shrink-0" /> : <div className="h-3 w-3 rounded-full border border-border flex-shrink-0" />}
                              <span className={`text-[10px] font-mono ${isDone ? "text-muted-foreground" : isCurrent ? "text-foreground" : "text-muted-foreground/40"}`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {uploadState === "done" && (
                      <p className="mt-3 text-center text-xs font-semibold text-success">Entering case dashboard…</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Past cases */}
            <div className="col-span-2">
              <h3 className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">Investigation History</h3>
              <div className="space-y-3">
                {pastCases.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate("/dashboard")}
                    className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${statusBadge[c.status]}`}>{c.status}</span>
                          <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${riskBadge[c.risk]}`}>{c.risk.toUpperCase()}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{c.summary}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                      <span>{c.devices} devices</span>
                      <span>{c.entities} entities</span>
                      <span className="ml-auto">{new Date(c.date).toLocaleDateString("en-IN")}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
