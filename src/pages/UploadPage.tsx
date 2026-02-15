import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Shield, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function UploadPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const simulateProcessing = useCallback((name: string) => {
    setFileName(name);
    setState("uploading");
    setProgress(0);

    // Simulate upload
    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += Math.random() * 15 + 5;
      if (uploadProgress >= 100) {
        uploadProgress = 100;
        clearInterval(uploadInterval);
        setProgress(100);
        setState("processing");

        // Simulate processing steps
        let step = 0;
        const stepInterval = setInterval(() => {
          step++;
          setCurrentStep(step);
          if (step >= processingSteps.length) {
            clearInterval(stepInterval);
            setState("done");
            setTimeout(() => navigate("/dashboard"), 1200);
          }
        }, 800);
      }
      setProgress(Math.min(uploadProgress, 100));
    }, 200);
  }, [navigate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateProcessing(file.name);
  }, [simulateProcessing]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateProcessing(file.name);
  }, [simulateProcessing]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-foreground">FORENSIQ</h1>
            <p className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground">AI-POWERED UFDR ANALYSIS</p>
          </div>
        </div>
        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
          Upload a UFDR file to begin AI-driven forensic analysis. The system will extract, index, and analyze all device data automatically.
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="w-full max-w-xl px-6"
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.label
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`group flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
                dragOver ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
              }`}>
                <Upload className={`h-7 w-7 transition-colors ${dragOver ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  Drop UFDR file here or <span className="text-primary underline underline-offset-2">browse</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Supports .ufdr, .ufd, .zip, .tar — Max 10 GB</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileInput} accept=".ufdr,.ufd,.zip,.tar,.gz" />
            </motion.label>
          )}

          {(state === "uploading" || state === "processing" || state === "done") && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              {/* File name */}
              <div className="mb-5 flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">{fileName}</span>
                {state === "done" && <CheckCircle className="ml-auto h-5 w-5 text-success" />}
              </div>

              {/* Upload progress */}
              {state === "uploading" && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">Uploading…</span>
                    <span className="text-xs font-mono text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Processing steps */}
              {(state === "processing" || state === "done") && (
                <div className="space-y-2">
                  {processingSteps.map((step, i) => {
                    const isDone = i < currentStep;
                    const isCurrent = i === currentStep && state === "processing";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isDone || isCurrent ? 1 : 0.3, x: 0 }}
                        className="flex items-center gap-2.5"
                      >
                        {isDone ? (
                          <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary flex-shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-border flex-shrink-0" />
                        )}
                        <span className={`text-xs font-mono ${isDone ? "text-muted-foreground" : isCurrent ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {state === "done" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-sm font-semibold text-success"
                >
                  Analysis complete — entering dashboard…
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex items-center gap-2 text-[10px] text-muted-foreground"
      >
        <AlertCircle className="h-3 w-3" />
        <span>All data is processed locally. No information leaves your secure environment.</span>
      </motion.div>
    </div>
  );
}
