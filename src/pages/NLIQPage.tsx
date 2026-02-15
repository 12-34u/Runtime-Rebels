import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ExternalLink, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import nliqData from "@/data/nliq-results.json";

// Types
interface Citation {
  id: string;
  source: string;
  sender: string;
  receiver: string;
  timestamp: string;
  content: string;
  relevanceScore: number;
  riskLevel: string;
  language: string;
  flaggedEntities: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  summary?: string;
  riskBreakdown?: Record<string, number>;
  timestamp: Date;
}

const riskColors: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/15 text-accent border-accent/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const riskIcons: Record<string, React.ReactNode> = {
  critical: <AlertCircle className="h-3 w-3" />,
  high: <AlertTriangle className="h-3 w-3" />,
  medium: <Info className="h-3 w-3" />,
  low: <Info className="h-3 w-3" />,
};

const sourceColors: Record<string, string> = {
  WhatsApp: "bg-success/15 text-success",
  Telegram: "bg-primary/15 text-primary",
  SMS: "bg-accent/15 text-accent",
  Signal: "bg-chart-5/15 text-chart-5",
};

const suggestedQueries = [
  "Find mentions of international bank transfers or crypto wallets",
  "Show communications with foreign numbers",
  "List all messages with anti-forensic intent",
  "Find hawala or cash pickup references",
];

function buildMockResponse(query: string): Omit<ChatMessage, "id" | "timestamp"> {
  // Filter results based on rough keyword matching to simulate intelligence
  const q = query.toLowerCase();
  let matched = nliqData.results;
  if (q.includes("crypto") || q.includes("wallet") || q.includes("bitcoin") || q.includes("btc")) {
    matched = nliqData.results.filter(r => r.flaggedEntities.some(e => /crypto|wallet|btc|usdt|tether|binance/i.test(e)));
  } else if (q.includes("foreign") || q.includes("international") || q.includes("dubai")) {
    matched = nliqData.results.filter(r => /dubai|\+971|\+44|international/i.test(r.content + r.sender + r.receiver + r.flaggedEntities.join(" ")));
  } else if (q.includes("hawala") || q.includes("cash")) {
    matched = nliqData.results.filter(r => /hawala|cash/i.test(r.content));
  } else if (q.includes("forensic") || q.includes("deletion") || q.includes("anti")) {
    matched = nliqData.results.filter(r => r.flaggedEntities.some(e => /anti-forensic|burner|no traces/i.test(e)));
  }
  if (matched.length === 0) matched = nliqData.results.slice(0, 3);

  const riskBreakdown: Record<string, number> = {};
  matched.forEach(r => { riskBreakdown[r.riskLevel] = (riskBreakdown[r.riskLevel] || 0) + 1; });

  const summary = `Found **${matched.length} relevant records** across ${[...new Set(matched.map(r => r.source))].join(", ")}. ` +
    `${riskBreakdown.critical ? `**${riskBreakdown.critical} critical-risk** items detected. ` : ""}` +
    `The results span from ${new Date(Math.min(...matched.map(r => new Date(r.timestamp).getTime()))).toLocaleDateString()} to ${new Date(Math.max(...matched.map(r => new Date(r.timestamp).getTime()))).toLocaleDateString()}. ` +
    `Key entities include: ${[...new Set(matched.flatMap(r => r.flaggedEntities))].slice(0, 5).join(", ")}.`;

  const content = `Based on semantic analysis of the ingested device data, here is what I found:\n\n` +
    `### Summary\n${summary}\n\n` +
    `### Risk Assessment\n` +
    Object.entries(riskBreakdown).map(([level, count]) => `- **${level.toUpperCase()}**: ${count} record${count > 1 ? "s" : ""}`).join("\n") +
    `\n\n### Evidence Records\nI found ${matched.length} communications matching your query. Each is cited below with source attribution ↓`;

  return {
    role: "assistant",
    content,
    citations: matched as Citation[],
    summary,
    riskBreakdown,
  };
}

export default function NLIQPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = buildMockResponse(text);
      const assistantMsg: ChatMessage = { ...response, id: `a-${Date.now()}`, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">NLIQ — Investigative Chat</h2>
        <p className="text-xs text-muted-foreground">Ask questions in natural language. AI retrieves evidence with source citations.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
        {messages.length === 0 && !isThinking && (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Ask me anything about the case evidence</p>
              <p className="mt-1 text-xs text-muted-foreground">I understand natural language and search across all ingested device data</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestedQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                  <div className={`rounded-xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="space-y-2 text-foreground">
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("### ")) return <h3 key={i} className="mt-3 mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{line.replace("### ", "")}</h3>;
                          if (line.startsWith("- **")) {
                            const parts = line.match(/- \*\*(.+?)\*\*: (.+)/);
                            if (parts) return <div key={i} className="flex items-center gap-2 text-xs"><span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${riskColors[parts[1].toLowerCase()] || "bg-muted"}`}>{parts[1]}</span><span className="text-muted-foreground">{parts[2]}</span></div>;
                          }
                          // Parse bold
                          const rendered = line.split(/(\*\*.+?\*\*)/).map((seg, j) =>
                            seg.startsWith("**") && seg.endsWith("**")
                              ? <strong key={j} className="font-semibold text-foreground">{seg.slice(2, -2)}</strong>
                              : <span key={j}>{seg}</span>
                          );
                          return line.trim() ? <p key={i} className="text-xs leading-relaxed text-muted-foreground">{rendered}</p> : null;
                        })}
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.citations.map((cite, idx) => (
                        <div key={cite.id} className="rounded-lg border border-border bg-card overflow-hidden">
                          <button
                            onClick={() => setExpandedCitation(expandedCitation === cite.id ? null : cite.id)}
                            className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary font-mono">{idx + 1}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${sourceColors[cite.source] || "bg-muted"}`}>{cite.source}</span>
                            <span className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold ${riskColors[cite.riskLevel]}`}>
                              {riskIcons[cite.riskLevel]} {cite.riskLevel.toUpperCase()}
                            </span>
                            <span className="flex-1 truncate text-[11px] text-muted-foreground">{cite.content}</span>
                            <span className="text-[10px] font-mono text-primary">{Math.round(cite.relevanceScore * 100)}%</span>
                          </button>

                          <AnimatePresence>
                            {expandedCitation === cite.id && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-border bg-muted/30 px-3 py-2.5 space-y-2">
                                  <p className="text-xs text-foreground leading-relaxed">{cite.content}</p>
                                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                                    <span>{cite.sender}</span>
                                    <span>→</span>
                                    <span>{cite.receiver}</span>
                                    <span className="ml-auto">{new Date(cite.timestamp).toLocaleString()}</span>
                                    <span className="text-muted-foreground/60">({cite.language})</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {cite.flaggedEntities.map((ent, j) => (
                                      <span key={j} className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                                        <ExternalLink className="h-2.5 w-2.5" />
                                        {ent}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-1 text-[9px] font-mono text-muted-foreground/50 px-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {msg.role === "user" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 mt-0.5">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3 rounded-bl-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  Searching across device data…
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask: 'Show me all crypto wallet references' or 'Who communicated with Dubai numbers?'"
            className="w-full rounded-xl border border-border bg-card py-3 pl-4 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
