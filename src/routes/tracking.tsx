import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import {
  Navigation,
  Phone,
  MessageSquare,
  Timer,
  AlertTriangle,
  Car,
  MapPin,
  CheckCircle2,
  Circle,
} from "lucide-react";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live Tracking · RoadAssist" },
      { name: "description", content: "Live driver tracking, ETA and SLA monitoring." },
    ],
  }),
  component: Tracking,
});

const stages = [
  { label: "Assigned", time: "10:42 AM", done: true },
  { label: "Journey Started", time: "10:44 AM", done: true },
  { label: "Near Customer", time: "10:51 AM", done: true, current: true },
  { label: "Arrived", time: "—", done: false },
  { label: "Service In Progress", time: "—", done: false },
  { label: "Completed", time: "—", done: false },
];

function Tracking() {
  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Live Tracking · SR-2026-08421"
          description="Ramesh Patil → Priya Sharma · Flatbed Tow"
          actions={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft text-success px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
            <MapPanel />
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                  RP
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Ramesh Patil</div>
                  <div className="text-xs text-muted-foreground">Mahalaxmi Towing · TN-09-FB-2210</div>
                </div>
                <div className="flex gap-1">
                  <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="h-9 w-9 rounded-lg border border-border flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatBox icon={<Navigation className="h-3.5 w-3.5" />} label="ETA" value="4 min" tone="primary" />
              <StatBox icon={<MapPin className="h-3.5 w-3.5" />} label="Distance" value="0.6 km" tone="muted" />
              <StatBox icon={<Timer className="h-3.5 w-3.5" />} label="SLA Timer" value="38:14" tone="success" />
              <StatBox icon={<Car className="h-3.5 w-3.5" />} label="Avg Speed" value="22 km/h" tone="muted" />
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-4">Journey Status</h3>
              <ol className="space-y-3">
                {stages.map((s, i) => (
                  <li key={s.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {s.done ? (
                        <CheckCircle2 className={`h-4 w-4 ${s.current ? "text-primary" : "text-success"}`} />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                      {i < stages.length - 1 && (
                        <div className={`w-px h-5 mt-1 ${s.done ? "bg-success/40" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="flex-1 -mt-0.5 flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          s.current ? "font-semibold text-foreground" : s.done ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.time}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-warning/30 bg-warning-soft p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-warning-foreground">
                <AlertTriangle className="h-4 w-4" />
                Exception Alert
              </div>
              <p className="text-xs text-warning-foreground/80 mt-1.5">
                Driver stopped for 4 min on Western Express Hwy · Possible traffic. SLA still on track.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "muted";
}) {
  const t =
    tone === "primary"
      ? "bg-primary-soft text-accent-foreground"
      : tone === "success"
      ? "bg-success-soft text-success"
      : "bg-card border border-border";
  return (
    <div className={`rounded-xl p-3 ${t}`}>
      <div className="text-[11px] opacity-80 flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold font-mono mt-1">{value}</div>
    </div>
  );
}

function MapPanel() {
  // Stylized SVG "map" — clean, light, no real tile provider needed for a prototype.
  return (
    <div className="relative h-[560px] bg-[oklch(0.97_0.01_240)]">
      <svg viewBox="0 0 800 560" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="oklch(0.93 0.01 250)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="560" fill="url(#grid)" />
        {/* park */}
        <rect x="80" y="320" width="180" height="120" rx="14" fill="oklch(0.94 0.05 155)" />
        {/* water */}
        <path d="M600 0 L800 0 L800 200 Q700 220 600 180 Z" fill="oklch(0.92 0.05 230)" />
        {/* roads */}
        <path d="M0 280 L800 280" stroke="white" strokeWidth="22" />
        <path d="M0 280 L800 280" stroke="oklch(0.88 0.01 250)" strokeWidth="1" strokeDasharray="6 8" />
        <path d="M400 0 L400 560" stroke="white" strokeWidth="22" />
        <path d="M400 0 L400 560" stroke="oklch(0.88 0.01 250)" strokeWidth="1" strokeDasharray="6 8" />
        <path d="M150 0 L150 560" stroke="white" strokeWidth="14" />
        <path d="M650 0 L650 560" stroke="white" strokeWidth="14" />
        <path d="M0 100 L800 100" stroke="white" strokeWidth="14" />
        <path d="M0 450 L800 450" stroke="white" strokeWidth="14" />
        {/* route */}
        <path
          d="M120 480 Q200 420 200 360 T 360 280 T 540 250"
          stroke="oklch(0.58 0.17 252)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="0"
        />
        <path
          d="M540 250 Q 600 230 640 200"
          stroke="oklch(0.58 0.17 252)"
          strokeWidth="4"
          strokeDasharray="6 6"
          fill="none"
          strokeLinecap="round"
        />
        {/* customer pin */}
        <g transform="translate(640,200)">
          <circle r="22" fill="oklch(0.58 0.17 252 / 0.18)" />
          <circle r="10" fill="oklch(0.58 0.17 252)" stroke="white" strokeWidth="3" />
        </g>
        {/* driver */}
        <g transform="translate(540,250)">
          <circle r="18" fill="white" stroke="oklch(0.58 0.17 252)" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fontSize="14" fill="oklch(0.58 0.17 252)" fontWeight="700">
            🛻
          </text>
        </g>
        {/* origin */}
        <g transform="translate(120,480)">
          <circle r="6" fill="oklch(0.62 0.16 155)" stroke="white" strokeWidth="2" />
        </g>
      </svg>

      {/* Floating labels */}
      <div className="absolute top-4 left-4 rounded-lg bg-card shadow-[var(--shadow-pop)] border border-border px-3 py-2 text-xs">
        <div className="text-muted-foreground">ETA</div>
        <div className="font-semibold text-sm">4 min · 0.6 km</div>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Legend dot="oklch(0.62 0.16 155)" label="Start" />
        <Legend dot="oklch(0.58 0.17 252)" label="Driver" />
        <Legend dot="oklch(0.58 0.17 252)" label="Customer" ring />
      </div>
    </div>
  );
}

function Legend({ dot, label, ring }: { dot: string; label: string; ring?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md bg-card border border-border px-2 py-1 text-[11px] text-muted-foreground shadow-sm">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: dot, boxShadow: ring ? `0 0 0 3px ${dot}33` : undefined }}
      />
      {label}
    </div>
  );
}