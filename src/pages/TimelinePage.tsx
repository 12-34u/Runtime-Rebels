import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, MessageSquare, DollarSign, Smartphone, CheckCircle, BookOpen, ChevronDown, Users, FileText, Shield } from "lucide-react";
import timelineData from "@/data/timeline-events.json";

const eventTypeIcons: Record<string, React.ReactNode> = {
  meeting: <MapPin className="h-5 w-5" />,
  communication: <MessageSquare className="h-5 w-5" />,
  financial: <DollarSign className="h-5 w-5" />,
  device: <Smartphone className="h-5 w-5" />,
};

const eventTypeLabels: Record<string, string> = {
  meeting: "Physical Meeting",
  communication: "Communication",
  financial: "Financial Transaction",
  device: "Device Activity",
};

const importanceBorder: Record<string, string> = {
  critical: "border-destructive",
  high: "border-accent",
  medium: "border-primary",
  low: "border-border",
};

const importanceBadge: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/15 text-accent border-accent/30",
  medium: "bg-primary/15 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const dotColors: Record<string, string> = {
  critical: "bg-destructive shadow-[0_0_12px_hsl(var(--destructive)/0.5)]",
  high: "bg-accent shadow-[0_0_12px_hsl(var(--accent)/0.5)]",
  medium: "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]",
  low: "bg-muted-foreground",
};

const narratives: Record<string, string> = {
  "storyline-a": `The investigation reveals a meticulously orchestrated financial laundering operation that spans at least three countries — India, the UAE, and the United Kingdom — involving a network of no fewer than five key participants operating under layers of digital anonymity.

The operation's genesis can be traced to December 5th, 2024, when GPS telemetry and messaging metadata placed Ravi Kumar and his associate Priya M at the Grand Hyatt hotel in Mumbai for a sustained 2.5-hour meeting. During this window, fourteen WhatsApp messages were exchanged — their content, though encrypted, aligns temporally with a subsequent cascade of financial maneuvers that would unfold over the following ten days.

Two days later, on December 7th, the network's existing hawala channel was compromised. A handler operating under the alias "Ghost_Handler" transmitted an encrypted Signal message instructing Ravi to abandon traditional hawala routes and pivot to Binance peer-to-peer cryptocurrency transactions. This pivot marks a critical inflection point: the network demonstrated not only pre-existing infrastructure but also the operational agility to rapidly switch laundering mechanisms when threatened.

By December 8th, Ravi had activated a new burner phone with a fresh SIM card, and his first outgoing call was placed to a Dubai-based number (+971-55-1234567) — a number that would recur repeatedly throughout the operation. The following day, a SWIFT transfer of INR 4,99,999 — deliberately structured just below the ₹5,00,000 reporting threshold — was credited to an account linked to Ravi. The remaining balance was promptly forwarded to a Bitcoin address (BC1q…wlh), demonstrating sophisticated knowledge of both traditional banking controls and cryptocurrency obfuscation.

The operation escalated on December 10th when 50,000 USDT was transferred to a crypto wallet (0x7a3B…f9c1) linked to the Dubai contact, confirmed via a late-night WhatsApp message. The next day, a figure known as "Dark_Phoenix_99" confirmed via Telegram that a wire transfer had cleared through HSBC Dubai, referencing a shell company used for routing funds — suggesting the network had pre-established corporate infrastructure for laundering purposes.

On December 12th, Priya confirmed that physical cash had been collected at a location in Andheri, Mumbai, converted to Tether (USDT), and deposited into a cold storage wallet — blending physical cash handling with digital asset conversion. By December 13th, a UK-based number confirmed that funds were held in escrow, pending customs clearance of an unidentified shipment at Mumbai port, hinting at a possible trade-based money laundering (TBML) component.

The narrative culminates on December 14th, when Ravi issued a final directive to his network via a Telegram group message: convert all remaining proceeds to Bitcoin and forward them to the Dubai contact. His explicit instruction — "No traces" — underscores both the premeditated nature of the operation and an acute awareness of forensic investigative capabilities.`,

  "storyline-b": `An alternative reconstruction of the evidence suggests that the financial transactions under investigation were not the product of long-term planning, but rather an opportunistic arrangement that emerged from a chance encounter at a Mumbai nightclub.

On the night of December 8th, 2024, photographic evidence recovered from Ravi Kumar's device — specifically, gallery image IMG_4419.jpg with intact EXIF metadata — places both Ravi and an individual operating under the alias "Dark_Phoenix_99" at the Trilogy nightclub in Mumbai. This represents the first confirmed physical meeting between the two subjects, and the informal, social setting suggests the encounter was unplanned.

What followed was a rapid burst of 23 WhatsApp messages exchanged between Ravi and Dark_Phoenix_99 in the early hours of December 9th, beginning at approximately 2:30 AM — immediately after the nightclub visit concluded. The velocity and timing of these messages are consistent with an impromptu negotiation or deal discussion rather than the execution of a pre-existing plan.

Under this hypothesis, the subsequent financial transactions — the SWIFT transfers, cryptocurrency conversions, and shell company wire transfers — represent a hastily assembled laundering pipeline built around an opportunistic drug trade connection forged that night. The operational security measures (burner phones, encrypted messaging, crypto wallets) may reflect standard precautions within Ravi's existing criminal toolkit rather than evidence of long-term premeditation.

This storyline carries a lower confidence rating of 62% because it fails to adequately explain several key pieces of evidence: the pre-existing relationship with Ghost_Handler, the already-established hawala channel, and the December 5th meeting with Priya M that preceded the nightclub encounter. However, it remains a viable alternative that investigators should consider, particularly if additional evidence emerges suggesting Dark_Phoenix_99 was previously unknown to the network.`
};

export default function TimelinePage() {
  const [activeStoryline, setActiveStoryline] = useState("storyline-a");
  const [activeTab, setActiveTab] = useState<"timeline" | "narrative">("timeline");

  const events = timelineData.events.filter(e => e.storyline === activeStoryline);
  const activeStory = timelineData.storylines.find(s => s.id === activeStoryline)!;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">Multi-Hypothesis Narrative Reconstruction</h2>
        <p className="text-xs text-muted-foreground">AI-generated chronological storylines — each event is source-anchored</p>
      </div>

      {/* Storyline Selector */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        {timelineData.storylines.map(story => (
          <button
            key={story.id}
            onClick={() => setActiveStoryline(story.id)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              activeStoryline === story.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {story.title}
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono">{story.confidence}% conf.</span>
          </button>
        ))}
      </div>

      {/* Description + Tab Toggle */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-2">
        <p className="text-xs text-muted-foreground flex-1 mr-4">{activeStory.description}</p>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all ${
              activeTab === "timeline" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("narrative")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all ${
              activeTab === "narrative" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3 w-3" />
            Full Story
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {activeTab === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 px-4"
            >
              {/* Centered tree timeline */}
              <div className="relative mx-auto max-w-5xl">
                {/* Central vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border" />

                <div className="space-y-8">
                  {events.map((event, i) => {
                    const isLeft = i % 2 === 0;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="relative flex items-start"
                      >
                        {/* Center node */}
                        <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-[3px] border-background ${dotColors[event.importance]}`} />
                        </div>

                        {/* Date label on the line */}
                        <div className={`absolute left-1/2 top-12 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-0.5`}>
                          <p className="text-[9px] font-mono text-muted-foreground">
                            {new Date(event.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="text-[9px] font-mono text-muted-foreground text-center">
                            {new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        {/* Branch connector */}
                        <div
                          className={`absolute top-7 h-px bg-border ${
                            isLeft ? "right-1/2 left-[calc(50%-120px)] mr-2" : "left-1/2 right-[calc(50%-120px)] ml-2"
                          }`}
                          style={{
                            left: isLeft ? undefined : "calc(50% + 8px)",
                            right: isLeft ? "calc(50% + 8px)" : undefined,
                            width: "100px",
                          }}
                        />

                        {/* Left spacer / card */}
                        {isLeft ? (
                          <>
                            <div className="w-1/2 pr-[140px]">
                              <EventCard event={event} align="right" />
                            </div>
                            <div className="w-1/2" />
                          </>
                        ) : (
                          <>
                            <div className="w-1/2" />
                            <div className="w-1/2 pl-[140px]">
                              <EventCard event={event} align="left" />
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* End cap */}
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-3 w-3 rounded-full bg-border" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="narrative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 px-4"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Narrative Reconstruction</h3>
                    <p className="text-xs text-muted-foreground">{activeStory.title} — {activeStory.confidence}% confidence</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-8">
                  {narratives[activeStoryline]?.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm leading-7 text-foreground/90 mb-5 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">Analyst Note</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This narrative was reconstructed by correlating digital forensic artifacts across {events.length} discrete evidence points.
                      Each claim is anchored to a specific source artifact. Toggle to the Timeline view to inspect individual evidence items.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Event Card Component ─── */
function EventCard({ event, align }: { event: typeof timelineData.events[0]; align: "left" | "right" }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group rounded-xl border-2 ${importanceBorder[event.importance]} bg-card transition-all hover:shadow-lg cursor-pointer ${
        expanded ? "shadow-lg" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
              {eventTypeIcons[event.type]}
            </span>
            <div>
              <h4 className="text-sm font-bold text-foreground leading-tight">{event.title}</h4>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{eventTypeLabels[event.type]}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase ${importanceBadge[event.importance]}`}>
            {event.importance}
          </span>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed">{event.description}</p>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/20">
              {/* Source */}
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Source Anchor</p>
                <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-primary">{event.source}</p>
                      <p className="text-[10px] text-muted-foreground">{event.sourceRef}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Participants</p>
                <div className="flex flex-wrap gap-1.5">
                  {event.participants.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground">
                      <Users className="h-2.5 w-2.5" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand hint */}
      <div className="flex items-center justify-center border-t border-border py-1.5">
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
    </div>
  );
}
