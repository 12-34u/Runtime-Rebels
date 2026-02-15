import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Eye, Users } from "lucide-react";
import entityData from "@/data/entities.json";

const nodeTypeStyles: Record<string, { bg: string; border: string; text: string }> = {
  suspect: { bg: "fill-destructive/20", border: "stroke-destructive", text: "text-destructive" },
  associate: { bg: "fill-accent/20", border: "stroke-accent", text: "text-accent" },
  foreign: { bg: "fill-chart-5/20", border: "stroke-chart-5", text: "text-chart-5" },
  financial: { bg: "fill-primary/20", border: "stroke-primary", text: "text-primary" },
  hidden_link: { bg: "fill-success/20", border: "stroke-success", text: "text-success" },
};

const edgeTypeColors: Record<string, string> = {
  frequent: "stroke-muted-foreground",
  suspicious: "stroke-destructive",
  international: "stroke-chart-5",
  financial: "stroke-primary",
  hidden: "stroke-success",
};

export default function RelationshipPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const selectedEntity = entityData.nodes.find(n => n.id === selectedNode);
  const connectedEdges = entityData.edges.filter(e => e.source === selectedNode || e.target === selectedNode);

  return (
    <div className="flex h-full">
      {/* Graph Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Dynamic Relationship & Entity Map</h2>
            <p className="text-xs text-muted-foreground">{entityData.nodes.length} entities — {entityData.edges.length} connections detected</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="rounded-md bg-secondary p-2 text-secondary-foreground hover:bg-secondary/80">
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="rounded-md bg-secondary p-2 text-secondary-foreground hover:bg-secondary/80">
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 border-b border-border px-6 py-2">
          {Object.entries(nodeTypeStyles).map(([type, styles]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded-full border-2 ${styles.border.replace("stroke-", "border-")} ${styles.bg.replace("fill-", "bg-")}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{type.replace("_", " ")}</span>
            </div>
          ))}
        </div>

        {/* SVG Graph */}
        <div className="flex-1 relative overflow-hidden bg-background">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 500"
            className="absolute inset-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            {/* Edges */}
            {entityData.edges.map((edge, i) => {
              const source = entityData.nodes.find(n => n.id === edge.source)!;
              const target = entityData.nodes.find(n => n.id === edge.target)!;
              const isHighlighted = selectedNode === edge.source || selectedNode === edge.target;
              return (
                <g key={i}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={edgeTypeColors[edge.type]}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeOpacity={selectedNode ? (isHighlighted ? 0.8 : 0.1) : 0.35}
                    strokeDasharray={edge.type === "hidden" ? "4 4" : undefined}
                  />
                  {isHighlighted && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 6}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[9px] font-mono"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {entityData.nodes.map(node => {
              const styles = nodeTypeStyles[node.type] || nodeTypeStyles.associate;
              const isSelected = selectedNode === node.id;
              const isConnected = connectedEdges.some(e => e.source === node.id || e.target === node.id);
              const dimmed = selectedNode && !isSelected && !isConnected;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  opacity={dimmed ? 0.2 : 1}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 28 : 22}
                    className={`${styles.bg} ${styles.border}`}
                    strokeWidth={isSelected ? 3 : 2}
                    style={isSelected ? { filter: `drop-shadow(0 0 8px currentColor)` } : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    className={`${styles.text} text-[10px] font-semibold`}
                    style={{ fontFamily: "Inter" }}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-bold font-mono"
                  >
                    {node.riskScore}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-72 border-l border-border bg-card overflow-y-auto scrollbar-thin">
        {selectedEntity ? (
          <motion.div
            key={selectedEntity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Entity Profile</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Name / ID</p>
                <p className="text-sm font-semibold text-foreground">{selectedEntity.label}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Type</p>
                <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${nodeTypeStyles[selectedEntity.type]?.text} bg-secondary`}>
                  {selectedEntity.type.replace("_", " ")}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Phone</p>
                <p className="text-sm font-mono text-foreground">{selectedEntity.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Messages</p>
                <p className="text-sm font-mono text-foreground">{selectedEntity.messageCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Risk Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${selectedEntity.riskScore > 80 ? "bg-destructive" : selectedEntity.riskScore > 50 ? "bg-accent" : "bg-primary"}`}
                      style={{ width: `${selectedEntity.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-foreground">{selectedEntity.riskScore}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Connections ({connectedEdges.length})</p>
                <div className="space-y-1.5">
                  {connectedEdges.map((edge, i) => {
                    const otherNodeId = edge.source === selectedNode ? edge.target : edge.source;
                    const other = entityData.nodes.find(n => n.id === otherNodeId)!;
                    return (
                      <div key={i} className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5">
                        <span className="text-xs text-foreground">{other.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{edge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-5 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Click a node to inspect</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Entity details and connections will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
