import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Phone,
  MessageSquare,
  Timer,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Navigation,
  Car,
  User,
  Send,
  Paperclip,
  CheckCheck,
  Star,
  Clock,
  Zap,
  TowerControl,
  ShieldCheck,
  ChevronRight,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/case/$caseId")({
  head: () => ({
    meta: [
      { title: "Case · RoadAssist" },
      { name: "description", content: "Master view for a roadside assistance case." },
    ],
  }),
  component: CaseDetail,
});

type Phase = "triage" | "assigning" | "assigned" | "tracking" | "delayed" | "onsite";
type Tab = "overview" | "assignment" | "tracking" | "communication";

const technicians: {
  id: string;
  name: string;
  vendor: string;
  distanceKm: number;
  etaMin: number;
  rating: number;
  jobs: number;
  status: "available" | "busy";
  recommended?: boolean;
}[] = [
  { id: "T-101", name: "Ramesh Patil", vendor: "Mahalaxmi Towing", distanceKm: 1.8, etaMin: 9, rating: 4.9, jobs: 0, status: "available", recommended: true },
  { id: "T-102", name: "Imran Sheikh", vendor: "BKC Auto Rescue", distanceKm: 2.4, etaMin: 12, rating: 4.7, jobs: 0, status: "available" },
  { id: "T-104", name: "Anil Yadav", vendor: "Western Roadside", distanceKm: 4.2, etaMin: 19, rating: 4.8, jobs: 0, status: "available" },
  { id: "T-103", name: "Suresh Kumar", vendor: "Mumbai Quick Tow", distanceKm: 3.1, etaMin: 16, rating: 4.6, jobs: 1, status: "busy" },
];

function CaseDetail() {
  const { caseId } = Route.useParams();
  const [phase, setPhase] = useState<Phase>("triage");
  const [tab, setTab] = useState<Tab>("overview");

  // Demo helper: when entering tracking phase, simulate a delay after 4s
  useEffect(() => {
    if (phase === "tracking") {
      const t = setTimeout(() => setPhase("delayed"), 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const phaseMeta = getPhaseMeta(phase);

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Breadcrumb + back */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/service-requests" className="hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Service Requests
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono text-foreground">{caseId}</span>
        </div>

        {/* Case header */}
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-6 mb-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight">Priya Sharma · Hyundai Creta</h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${phaseMeta.statusClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${phaseMeta.dotClass} ${phase !== "onsite" ? "animate-pulse" : ""}`} />
                  {phaseMeta.statusLabel}
                </span>
                <span className="text-[10px] uppercase tracking-wide bg-warning-soft text-warning-foreground rounded px-1.5 py-0.5 font-medium">
                  High Priority
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                <span className="font-mono">{caseId}</span> · created 10:40 AM via WhatsApp · BKC, Mumbai
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 justify-end">
                  <Timer className="h-3 w-3" /> SLA Remaining
                </div>
                <div className={`text-2xl font-mono font-semibold ${phase === "delayed" ? "text-warning-foreground" : "text-success"}`}>
                  {phaseMeta.slaTimer}
                </div>
              </div>
              <DemoStepper phase={phase} setPhase={setPhase} setTab={setTab} />
            </div>
          </div>

          {/* Journey progress */}
          <JourneyBar phase={phase} />

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-border -mx-6 px-6">
            {(["overview", "assignment", "tracking", "communication"] as Tab[]).map((t) => {
              const active = tab === t;
              const enabled = isTabEnabled(t, phase);
              return (
                <button
                  key={t}
                  onClick={() => enabled && setTab(t)}
                  disabled={!enabled}
                  className={`relative px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                    active
                      ? "text-primary"
                      : enabled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  {t}
                  {active && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {tab === "overview" && <OverviewTab phase={phase} />}
            {tab === "assignment" && <AssignmentTab phase={phase} onAssign={() => setPhase("assigned")} />}
            {tab === "tracking" && <TrackingTab phase={phase} />}
            {tab === "communication" && <CommunicationTab phase={phase} />}
          </div>

          {/* Side timeline always visible */}
          <ActivityTimeline phase={phase} />
        </div>
      </div>
    </AppLayout>
  );
}

/* ───────────────────────────── helpers / sub-components ─────────────────────────── */

function getPhaseMeta(phase: Phase) {
  switch (phase) {
    case "triage":
      return { statusLabel: "Awaiting Assignment", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: "44:32" };
    case "assigning":
      return { statusLabel: "Broadcasting", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: "43:50" };
    case "assigned":
      return { statusLabel: "Assigned", statusClass: "bg-warning-soft text-warning-foreground", dotClass: "bg-warning", slaTimer: "42:10" };
    case "tracking":
      return { statusLabel: "En Route", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: "38:14" };
    case "delayed":
      return { statusLabel: "En Route · Delayed", statusClass: "bg-warning-soft text-warning-foreground", dotClass: "bg-warning", slaTimer: "29:42" };
    case "onsite":
      return { statusLabel: "On-site", statusClass: "bg-success-soft text-success", dotClass: "bg-success", slaTimer: "24:18" };
  }
}

function isTabEnabled(tab: Tab, phase: Phase) {
  if (tab === "overview" || tab === "assignment") return true;
  if (tab === "tracking" || tab === "communication") {
    return phase !== "triage" && phase !== "assigning";
  }
  return true;
}

function DemoStepper({
  phase,
  setPhase,
  setTab,
}: {
  phase: Phase;
  setPhase: (p: Phase) => void;
  setTab: (t: Tab) => void;
}) {
  const next = () => {
    if (phase === "triage") {
      setPhase("assigning");
      setTab("assignment");
    } else if (phase === "assigning") {
      setPhase("assigned");
      setTab("assignment");
    } else if (phase === "assigned") {
      setPhase("tracking");
      setTab("tracking");
    } else if (phase === "tracking" || phase === "delayed") {
      setPhase("onsite");
      setTab("tracking");
    } else {
      setPhase("triage");
      setTab("overview");
    }
  };

  const label =
    phase === "triage" ? "Start: Assign Technician"
    : phase === "assigning" ? "Confirm Recommended"
    : phase === "assigned" ? "Start Live Tracking"
    : phase === "tracking" || phase === "delayed" ? "Mark On-site"
    : "Restart Demo";

  return (
    <button
      onClick={next}
      className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 hover:opacity-90 inline-flex items-center gap-2"
    >
      {label} <ChevronRight className="h-4 w-4" />
    </button>
  );
}

function JourneyBar({ phase }: { phase: Phase }) {
  const steps = [
    { key: "triage", label: "Triaged" },
    { key: "assigning", label: "Assigning" },
    { key: "assigned", label: "Assigned" },
    { key: "tracking", label: "En Route" },
    { key: "onsite", label: "On-site" },
  ] as const;
  const order: Phase[] = ["triage", "assigning", "assigned", "tracking", "delayed", "onsite"];
  const idx = order.indexOf(phase);
  const currentStepIdx =
    phase === "delayed" ? 3 : steps.findIndex((s) => s.key === phase);

  return (
    <div className="mt-6 flex items-center">
      {steps.map((s, i) => {
        const done = i < currentStepIdx;
        const current = i === currentStepIdx;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  done
                    ? "bg-success text-success-foreground"
                    : current
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[11px] ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 ${i < currentStepIdx ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
      {/* avoid unused var lint */}
      <span className="hidden">{idx}</span>
    </div>
  );
}

/* ───────────────────────────── OVERVIEW ─────────────────────────── */

function OverviewTab({ phase }: { phase: Phase }) {
  return (
    <>
      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" /> Customer
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <Field label="Name" value="Priya Sharma" />
          <Field label="Phone" value="+91 98203 45678" />
          <Field label="Membership" value="Gold · Active" />
          <Field label="Past cases" value="2 in last 12 months" />
          <Field label="Vehicle" value="Hyundai Creta 2022" />
          <Field label="Reg No." value="MH 02 KX 4521" mono />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" /> Breakdown details
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Reported issue</div>
            <p className="leading-relaxed">
              "Car not starting after meeting. Engine cranks but doesn't turn over. Smoke from bonnet 5 mins ago."
            </p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Location</div>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <span>Bandra Kurla Complex, Plot C-39, near Trident Hotel, Mumbai 400051</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Auto-triage result
          </h3>
          <span className="text-xs text-muted-foreground">RoadAI v3.2</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary-soft p-3">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <TowerControl className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Towing Required · Flatbed</div>
            <div className="text-xs text-muted-foreground">Suspected engine failure · recommended drop: Hyundai Service, Andheri East</div>
          </div>
          <div className="text-lg font-semibold">92%</div>
        </div>
        {phase === "triage" && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> Recommended action ready — proceed to assignment.
          </p>
        )}
      </div>
    </>
  );
}

/* ───────────────────────────── ASSIGNMENT ─────────────────────────── */

function AssignmentTab({ phase, onAssign }: { phase: Phase; onAssign: () => void }) {
  const assigned = phase === "assigned" || phase === "tracking" || phase === "delayed" || phase === "onsite";

  return (
    <>
      {phase === "assigning" && (
        <div className="rounded-xl border border-primary/30 bg-primary-soft p-5">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="text-sm font-semibold text-accent-foreground">Auto-bidding in progress</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Broadcast sent to 3 nearest vendors. First to accept wins.
          </p>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Time remaining</span>
            <span className="font-mono font-medium">00:42</span>
          </div>
          <div className="h-1.5 rounded-full bg-card/80 overflow-hidden">
            <div className="h-full w-[58%] bg-primary rounded-full" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Ramesh Patil — viewing now
          </div>
        </div>
      )}

      {assigned && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-success">Ramesh Patil assigned</div>
            <div className="text-xs text-success/80">Mahalaxmi Towing · Flatbed TN-09-FB-2210 · ETA 9 min</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Nearby technicians</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ranked by ETA, rating & availability</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Zap className="h-3.5 w-3.5" /> Auto-bid recommended
          </div>
        </div>
        <div className="divide-y divide-border">
          {technicians.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-5 py-3.5 ${
                t.recommended && !assigned ? "bg-primary-soft/40" : ""
              } ${assigned && !t.recommended ? "opacity-50" : ""}`}
            >
              <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{t.name}</span>
                  {t.recommended && (
                    <span className="text-[10px] font-medium uppercase tracking-wide bg-primary text-primary-foreground rounded px-1.5 py-0.5">
                      Best match
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{t.vendor}</div>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.distanceKm} km</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.etaMin} min</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {t.rating}</span>
              </div>
              {assigned && t.recommended ? (
                <span className="text-xs font-medium text-success inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Assigned
                </span>
              ) : (
                <button
                  onClick={t.recommended ? onAssign : undefined}
                  disabled={assigned || t.status === "busy"}
                  className={`text-xs font-medium rounded-md px-3 py-1.5 ${
                    t.recommended && !assigned
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border bg-background text-muted-foreground"
                  }`}
                >
                  {t.recommended ? "Assign" : "Notify"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ───────────────────────────── TRACKING ─────────────────────────── */

function TrackingTab({ phase }: { phase: Phase }) {
  const onsite = phase === "onsite";
  const delayed = phase === "delayed";
  const stages = [
    { label: "Assigned", time: "10:42 AM", done: true },
    { label: "Journey Started", time: "10:44 AM", done: true },
    { label: delayed ? "Delayed at Bandra Flyover" : "Near Customer", time: "10:51 AM", done: true, current: !onsite, alert: delayed },
    { label: "Arrived", time: onsite ? "10:58 AM" : "—", done: onsite, current: onsite },
    { label: "Service In Progress", time: "—", done: false },
    { label: "Completed", time: "—", done: false },
  ];
  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
        <MapPanel phase={phase} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox icon={<Navigation className="h-3.5 w-3.5" />} label="ETA" value={onsite ? "Arrived" : delayed ? "9 min" : "4 min"} tone={delayed ? "warning" : "primary"} />
        <StatBox icon={<MapPin className="h-3.5 w-3.5" />} label="Distance" value={onsite ? "0 m" : "0.6 km"} tone="muted" />
        <StatBox icon={<Timer className="h-3.5 w-3.5" />} label="SLA Timer" value={delayed ? "29:42" : onsite ? "24:18" : "38:14"} tone={delayed ? "warning" : "success"} />
        <StatBox icon={<Car className="h-3.5 w-3.5" />} label="Avg Speed" value={delayed ? "6 km/h" : "22 km/h"} tone="muted" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4">Journey status</h3>
        <ol className="space-y-3">
          {stages.map((s, i) => (
            <li key={s.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {s.done ? (
                  <CheckCircle2 className={`h-4 w-4 ${s.alert ? "text-warning" : s.current ? "text-primary" : "text-success"}`} />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
                {i < stages.length - 1 && (
                  <div className={`w-px h-5 mt-1 ${s.done ? "bg-success/40" : "bg-border"}`} />
                )}
              </div>
              <div className="flex-1 -mt-0.5 flex items-center justify-between">
                <span className={`text-sm ${s.current ? "font-semibold text-foreground" : s.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                <span className="text-xs text-muted-foreground">{s.time}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {delayed && (
        <div className="rounded-xl border border-warning/40 bg-warning-soft p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-warning-foreground">SLA risk · driver delayed</div>
            <p className="text-xs text-warning-foreground/80 mt-0.5">
              Ramesh stationary for 4 min on Western Express Hwy (heavy traffic at Bandra flyover). ETA pushed by 5 min — SLA still on track.
            </p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs font-medium rounded-md bg-warning text-warning-foreground px-3 py-1.5">
                Escalate to backup
              </button>
              <button className="text-xs font-medium rounded-md border border-warning/40 bg-card px-3 py-1.5">
                Notify customer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MapPanel({ phase }: { phase: Phase }) {
  const onsite = phase === "onsite";
  // Driver position varies by phase
  const pos =
    phase === "assigned" ? { x: 250, y: 460 }
    : phase === "delayed" ? { x: 420, y: 280 }
    : onsite ? { x: 640, y: 200 }
    : { x: 540, y: 250 };
  return (
    <div className="relative h-[420px] bg-[oklch(0.97_0.01_240)]">
      <svg viewBox="0 0 800 480" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="oklch(0.93 0.01 250)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="480" fill="url(#grid2)" />
        <rect x="80" y="300" width="180" height="100" rx="14" fill="oklch(0.94 0.05 155)" />
        <path d="M600 0 L800 0 L800 180 Q700 200 600 160 Z" fill="oklch(0.92 0.05 230)" />
        <path d="M0 280 L800 280" stroke="white" strokeWidth="22" />
        <path d="M400 0 L400 480" stroke="white" strokeWidth="22" />
        <path d="M150 0 L150 480" stroke="white" strokeWidth="14" />
        <path d="M650 0 L650 480" stroke="white" strokeWidth="14" />
        <path d="M0 100 L800 100" stroke="white" strokeWidth="14" />
        <path d="M0 430 L800 430" stroke="white" strokeWidth="14" />
        {/* Route done */}
        <path
          d={`M120 460 Q200 400 200 340 T 360 280 T ${pos.x} ${pos.y}`}
          stroke="oklch(0.58 0.17 252)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Route remaining */}
        {!onsite && (
          <path
            d={`M${pos.x} ${pos.y} Q ${(pos.x + 640) / 2} ${(pos.y + 200) / 2 - 20} 640 200`}
            stroke="oklch(0.58 0.17 252)"
            strokeWidth="4"
            strokeDasharray="6 6"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {/* Customer */}
        <g transform="translate(640,200)">
          <circle r="22" fill="oklch(0.58 0.17 252 / 0.18)" />
          <circle r="10" fill="oklch(0.58 0.17 252)" stroke="white" strokeWidth="3" />
        </g>
        {/* Driver */}
        <g transform={`translate(${pos.x},${pos.y})`}>
          <circle r="20" fill={phase === "delayed" ? "oklch(0.97 0.05 85)" : "white"} stroke={phase === "delayed" ? "oklch(0.78 0.15 75)" : "oklch(0.58 0.17 252)"} strokeWidth="2" />
          <text x="0" y="6" textAnchor="middle" fontSize="16">🛻</text>
        </g>
        {/* Origin */}
        <g transform="translate(120,460)">
          <circle r="6" fill="oklch(0.62 0.16 155)" stroke="white" strokeWidth="2" />
        </g>
      </svg>
      <div className="absolute top-4 left-4 rounded-lg bg-card shadow-[var(--shadow-pop)] border border-border px-3 py-2 text-xs">
        <div className="text-muted-foreground">{onsite ? "Arrived" : "ETA"}</div>
        <div className="font-semibold text-sm">
          {onsite ? "On location" : phase === "delayed" ? "9 min · delayed" : "4 min · 0.6 km"}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
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

function StatBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning" | "muted";
}) {
  const t =
    tone === "primary" ? "bg-primary-soft text-accent-foreground"
    : tone === "success" ? "bg-success-soft text-success"
    : tone === "warning" ? "bg-warning-soft text-warning-foreground"
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

/* ───────────────────────────── COMMUNICATION ─────────────────────────── */

type Msg = { from: "driver" | "dispatcher"; text: string; time: string; read?: boolean; alert?: boolean };

function CommunicationTab({ phase }: { phase: Phase }) {
  const base: Msg[] = [
    { from: "dispatcher", text: "Hi Ramesh, SR-2026-08421 assigned. Customer Priya at BKC, Hyundai Creta.", time: "10:42", read: true },
    { from: "driver", text: "Got it. Leaving Mahalaxmi now.", time: "10:44" },
    { from: "driver", text: "On Western Express Hwy. Traffic moderate.", time: "10:47" },
  ];
  const delayed: Msg[] = [
    { from: "driver", text: "Heavy traffic at Bandra flyover, ETA +5 mins.", time: "10:49", alert: true },
    { from: "dispatcher", text: "Acknowledged. I'll inform the customer.", time: "10:49", read: true },
  ];
  const onsite: Msg[] = [
    { from: "driver", text: "Reached customer location 📍", time: "10:58" },
  ];
  const msgs: Msg[] = [
    ...base,
    ...(phase === "delayed" || phase === "onsite" ? delayed : []),
    ...(phase === "onsite" ? onsite : []),
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden flex flex-col h-[640px]">
      <header className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
            RP
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Ramesh Patil
              <span className="text-[10px] font-medium uppercase tracking-wide bg-success-soft text-success rounded px-1.5 py-0.5">
                On Job
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Mahalaxmi Towing · synced with WhatsApp</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-9 w-9 rounded-lg border border-border flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-surface">
        {msgs.map((m, i) => <Bubble key={i} m={m} />)}
      </div>

      <div className="border-t border-border p-3 shrink-0">
        <div className="flex gap-1.5 mb-2 overflow-x-auto">
          {["Share live ETA", "Customer informed", "Need backup?", "Confirm drop-off"].map((q) => (
            <button key={q} className="text-xs rounded-full border border-border bg-background px-3 py-1.5 whitespace-nowrap hover:bg-muted">
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            placeholder="Message Ramesh…"
            className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm"
          />
          <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
            Send <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isDispatcher = m.from === "dispatcher";
  return (
    <div className={`flex ${isDispatcher ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
        isDispatcher
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : m.alert
          ? "bg-warning-soft text-warning-foreground border border-warning/30 rounded-bl-sm"
          : "bg-card border border-border rounded-bl-sm"
      }`}>
        <div>{m.text}</div>
        <div className={`mt-1 text-[10px] flex items-center gap-1 justify-end ${isDispatcher ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {m.time}
          {isDispatcher && <CheckCheck className={`h-3 w-3 ${m.read ? "" : "opacity-50"}`} />}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── ACTIVITY TIMELINE (sidebar) ─────────────────────────── */

function ActivityTimeline({ phase }: { phase: Phase }) {
  const events: { time: string; label: string; tone: "primary" | "success" | "warning" }[] = [
    { time: "10:38", label: "WhatsApp request received from Priya", tone: "primary" },
    { time: "10:39", label: "Location & vehicle captured", tone: "primary" },
    { time: "10:40", label: "Auto-triaged · Towing (92%)", tone: "primary" },
    { time: "10:40", label: "SR created · awaiting assignment", tone: "success" },
  ];
  if (phase !== "triage") {
    events.push(
      { time: "10:41", label: "Auto-bid broadcast to 3 vendors", tone: "primary" },
    );
  }
  if (phase === "assigned" || phase === "tracking" || phase === "delayed" || phase === "onsite") {
    events.push({ time: "10:42", label: "Ramesh Patil accepted job", tone: "success" });
  }
  if (phase === "tracking" || phase === "delayed" || phase === "onsite") {
    events.push({ time: "10:44", label: "Driver journey started", tone: "primary" });
  }
  if (phase === "delayed" || phase === "onsite") {
    events.push({ time: "10:49", label: "SLA risk · traffic delay flagged", tone: "warning" });
  }
  if (phase === "onsite") {
    events.push({ time: "10:58", label: "Technician arrived on-site", tone: "success" });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4">Activity timeline</h3>
        <ol className="space-y-3">
          {[...events].reverse().map((e, i) => {
            const dot =
              e.tone === "success" ? "bg-success" : e.tone === "warning" ? "bg-warning" : "bg-primary";
            return (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  {i < events.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="text-sm">{e.label}</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{e.time} AM</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-3">SLA</h3>
        <div className="text-xs text-muted-foreground mb-2">Target resolution within 45 min</div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
          <div
            className={`h-full rounded-full ${phase === "delayed" ? "bg-warning" : "bg-success"}`}
            style={{ width: phase === "onsite" ? "62%" : phase === "delayed" ? "44%" : phase === "tracking" ? "30%" : "12%" }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Elapsed</span>
          <span className="font-mono font-medium">
            {phase === "onsite" ? "20:42" : phase === "delayed" ? "15:18" : phase === "tracking" ? "06:46" : "04:28"}
          </span>
        </div>
      </div>

      {phase === "onsite" && (
        <Link
          to="/"
          className="block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-primary/40 transition-colors"
        >
          <div className="text-sm font-semibold flex items-center justify-between">
            Case nearing completion
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            View operations dashboard to see this case roll up into city-wide metrics.
          </p>
        </Link>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-sm font-medium ${mono ? "font-mono tracking-tight" : ""}`}>{value}</div>
    </div>
  );
}