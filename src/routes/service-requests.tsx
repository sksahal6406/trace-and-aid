import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import {
  Sparkles,
  MapPin,
  ChevronRight,
  MessageCircle,
  X,
  Layers,
  AlertOctagon,
  AlertTriangle,
  Timer,
  Activity,
  Car,
  Radio,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";

export const Route = createFileRoute("/service-requests")({
  validateSearch: (search: Record<string, unknown>): { queue: QueueKey } => ({
    queue: (search.queue as QueueKey) || "all",
  }),
  head: () => ({
    meta: [
      { title: "Service Requests · TVS RoadAssist" },
      { name: "description", content: "SLA-queued live view of all roadside assistance service requests." },
    ],
  }),
  component: ServiceRequests,
});

type QueueKey =
  | "all"
  | "unassigned"
  | "outstanding"
  | "journey_not_started"
  | "stopped"
  | "approaching_sla"
  | "breached"
  | "exceptions";

type SR = {
  id: string;
  customer: string;
  membership: "Gold" | "Silver" | "Platinum";
  vehicle: string;
  issue: string;
  triage: string;
  confidence: number;
  location: string;
  city: string;
  status: string;
  slaMin: number;
  channel: "WhatsApp" | "App" | "Call";
  age: string;
  queue: Exclude<QueueKey, "all">;
  isNew?: boolean;
};

const allSRs: SR[] = [
  {
    id: "SR-2026-08421",
    customer: "Priya Sharma",
    membership: "Gold",
    vehicle: "Hyundai Creta · MH 02 KX 4521",
    issue: "Car not starting, smoke from bonnet",
    triage: "Towing Required",
    confidence: 92,
    location: "BKC, Plot C-39",
    city: "Mumbai",
    status: "Awaiting Assignment",
    slaMin: 44.5,
    channel: "WhatsApp",
    age: "just now",
    queue: "unassigned",
    isNew: true,
  },
  {
    id: "SR-2026-08418",
    customer: "Rohan Verma",
    membership: "Silver",
    vehicle: "Maruti Swift · DL 8C AB 9921",
    issue: "Flat tyre near toll plaza",
    triage: "Flat Tyre",
    confidence: 88,
    location: "DND Flyway, Sec 38",
    city: "Delhi NCR",
    status: "En Route",
    slaMin: 21.3,
    channel: "App",
    age: "12 min",
    queue: "outstanding",
  },
  {
    id: "SR-2026-08410",
    customer: "Kabir Singh",
    membership: "Platinum",
    vehicle: "BMW 530i · MH 12 DE 7788",
    issue: "Engine overheating on highway",
    triage: "Towing Required",
    confidence: 90,
    location: "Mumbai-Pune Expy KM 42",
    city: "Pune",
    status: "Assigned · Journey Pending",
    slaMin: 33.1,
    channel: "Call",
    age: "9 min",
    queue: "journey_not_started",
  },
  {
    id: "SR-2026-08395",
    customer: "Rahul Mehta",
    membership: "Silver",
    vehicle: "Tata Nexon · GJ 01 AB 3321",
    issue: "Car won't start — suspected battery",
    triage: "Battery Jumpstart",
    confidence: 91,
    location: "SG Highway, Near IKEA",
    city: "Ahmedabad",
    status: "En Route · Stopped",
    slaMin: 12.8,
    channel: "WhatsApp",
    age: "18 min",
    queue: "stopped",
  },
  {
    id: "SR-2026-08415",
    customer: "Anita Iyer",
    membership: "Gold",
    vehicle: "Tata Nexon · KA 03 MN 4412",
    issue: "Battery drained, car won't start",
    triage: "Battery Jumpstart",
    confidence: 95,
    location: "Indiranagar 100ft Rd",
    city: "Bengaluru",
    status: "On-site",
    slaMin: 8.7,
    channel: "WhatsApp",
    age: "28 min",
    queue: "approaching_sla",
  },
  {
    id: "SR-2026-08390",
    customer: "Sunita Patel",
    membership: "Silver",
    vehicle: "Honda Activa · MH 04 CD 7720",
    issue: "Two-wheeler flat tyre",
    triage: "Flat Tyre",
    confidence: 97,
    location: "Nariman Point",
    city: "Mumbai",
    status: "En Route",
    slaMin: -8.2,
    channel: "App",
    age: "53 min",
    queue: "breached",
  },
  {
    id: "SR-2026-08385",
    customer: "Deepak Joshi",
    membership: "Gold",
    vehicle: "Hyundai i20 · RJ 14 TC 9913",
    issue: "Locked out, key inside car",
    triage: "Locksmith",
    confidence: 89,
    location: "Sindhi Colony",
    city: "Jaipur",
    status: "En Route",
    slaMin: -15.4,
    channel: "WhatsApp",
    age: "1h 05m",
    queue: "breached",
  },
  {
    id: "SR-2026-08380",
    customer: "Kiran Shah",
    membership: "Platinum",
    vehicle: "Mercedes C-Class · MH 01 AA 5001",
    issue: "Engine failure on expressway",
    triage: "Towing Required",
    confidence: 93,
    location: "Eastern Express Hwy",
    city: "Mumbai",
    status: "Assigned",
    slaMin: -22.1,
    channel: "Call",
    age: "1h 22m",
    queue: "breached",
  },
  {
    id: "SR-2026-08370",
    customer: "Nisha Singh",
    membership: "Silver",
    vehicle: "Maruti WagonR · UP 80 DK 1123",
    issue: "Fuel empty, stranded on highway",
    triage: "Fuel Delivery",
    confidence: 99,
    location: "Lucknow-Kanpur Hwy",
    city: "Lucknow",
    status: "Exception",
    slaMin: 18.2,
    channel: "WhatsApp",
    age: "22 min",
    queue: "exceptions",
  },
  {
    id: "SR-2026-08402",
    customer: "Arjun Nair",
    membership: "Silver",
    vehicle: "Maruti Dzire · TN 07 BK 6634",
    issue: "Flat tyre repair escalated to tow — wheel hub damaged",
    triage: "Towing Required",
    confidence: 87,
    location: "Anna Nagar, 2nd Ave",
    city: "Chennai",
    status: "On-site · Escalated to Tow",
    slaMin: 14.5,
    channel: "App",
    age: "31 min",
    queue: "exceptions",
  },
];

type QueueConfig = {
  key: QueueKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  urgency: "normal" | "pulse" | "amber" | "red" | "orange";
  description: string;
};

const queueConfig: QueueConfig[] = [
  { key: "all", label: "All Open", icon: Layers, urgency: "normal", description: "All active service requests" },
  { key: "unassigned", label: "Unassigned", icon: Radio, urgency: "pulse", description: "Needs immediate dispatch" },
  { key: "outstanding", label: "Outstanding", icon: Activity, urgency: "normal", description: "Active & on track" },
  { key: "journey_not_started", label: "Journey Not Started", icon: Car, urgency: "normal", description: "Tech assigned, awaiting departure" },
  { key: "stopped", label: "Stopped >5 min", icon: PauseCircle, urgency: "amber", description: "Driver may be stuck" },
  { key: "approaching_sla", label: "Approaching SLA", icon: Timer, urgency: "amber", description: "Under 10 min to deadline" },
  { key: "breached", label: "SLA Breached", icon: AlertOctagon, urgency: "red", description: "Escalation required" },
  { key: "exceptions", label: "Exceptions", icon: AlertTriangle, urgency: "orange", description: "Manual review required" },
];

function getCount(key: QueueKey): number {
  if (key === "all") return allSRs.length;
  return allSRs.filter((sr) => sr.queue === key).length;
}

function formatSla(slaMin: number): string {
  if (slaMin < 0) return "BREACHED";
  const m = Math.floor(Math.abs(slaMin));
  const s = Math.round((Math.abs(slaMin) - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SlaCell({ slaMin }: { slaMin: number }) {
  if (slaMin < 0) {
    const mins = Math.abs(Math.ceil(slaMin));
    return (
      <div className="text-right">
        <span className="inline-block font-mono text-[11px] font-semibold bg-destructive text-white rounded px-1.5 py-0.5">
          BREACHED
        </span>
        <div className="text-[10px] text-destructive mt-0.5">+{mins}m over</div>
      </div>
    );
  }
  const display = formatSla(slaMin);
  if (slaMin < 10) {
    return (
      <div className="text-right">
        <span className="font-mono text-sm font-semibold text-destructive">{display}</span>
        <div className="text-[10px] text-destructive/70">critical</div>
      </div>
    );
  }
  if (slaMin < 20) {
    return (
      <div className="text-right">
        <span className="font-mono text-sm font-semibold text-warning-foreground">{display}</span>
        <div className="text-[10px] text-warning-foreground/70">watch</div>
      </div>
    );
  }
  return (
    <div className="text-right">
      <span className="font-mono text-sm text-muted-foreground">{display}</span>
      <div className="text-[10px] text-muted-foreground/60">on track</div>
    </div>
  );
}

function QueueItem({
  config,
  count,
  selected,
  onClick,
}: {
  config: QueueConfig;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = config.icon;

  const dotClass =
    config.urgency === "pulse"
      ? "bg-primary animate-pulse"
      : config.urgency === "amber"
      ? "bg-warning"
      : config.urgency === "red"
      ? "bg-destructive"
      : config.urgency === "orange"
      ? "bg-orange-400"
      : "bg-muted-foreground/40";

  const countClass =
    config.urgency === "pulse"
      ? "bg-primary text-primary-foreground"
      : config.urgency === "red"
      ? "bg-destructive text-white"
      : config.urgency === "amber"
      ? "bg-warning text-warning-foreground"
      : config.urgency === "orange"
      ? "bg-orange-100 text-orange-700"
      : "bg-muted text-muted-foreground";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
        selected
          ? "bg-primary-soft text-accent-foreground border border-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass}`} />
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className={`flex-1 text-xs font-medium truncate ${selected ? "text-foreground" : ""}`}>
        {config.label}
      </span>
      {count > 0 && (
        <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 shrink-0 ${countClass}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ServiceRequests() {
  const { queue: selectedQueue } = Route.useSearch();
  const navigate = useNavigate();
  const setSelectedQueue = (q: QueueKey) =>
    navigate({ to: "/service-requests", search: { queue: q }, replace: true });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 600);
    const h = setTimeout(() => setShowToast(false), 6500);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  const visibleRows =
    selectedQueue === "all" ? allSRs : allSRs.filter((r) => r.queue === selectedQueue);

  const selectedConfig = queueConfig.find((q) => q.key === selectedQueue)!;

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Service Requests"
          description="Live queue · auto-triaged via WhatsApp, App & call"
          actions={
            <button className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2">
              + New SR
            </button>
          }
        />

        <div className="flex gap-5">
          {/* ── LEFT RAIL ── */}
          <div className="w-[210px] shrink-0">
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden sticky top-6">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  SLA Queues
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {allSRs.length} open
                </span>
              </div>
              <div className="p-2 space-y-0.5">
                {queueConfig.map((q) => (
                  <QueueItem
                    key={q.key}
                    config={q}
                    count={getCount(q.key)}
                    selected={selectedQueue === q.key}
                    onClick={() => setSelectedQueue(q.key)}
                  />
                ))}
              </div>
              <div className="border-t border-border p-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    Completed Today
                  </span>
                  <span className="font-semibold text-success">187</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN TABLE ── */}
          <div className="flex-1 min-w-0">
            {/* context bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">{selectedConfig.label}</h2>
                <span className="text-xs text-muted-foreground">
                  · {visibleRows.length} {visibleRows.length === 1 ? "case" : "cases"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic">{selectedConfig.description}</p>
            </div>

            {visibleRows.length === 0 ? (
              <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] p-16 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="h-10 w-10 text-success/40" />
                <p className="text-sm font-medium text-muted-foreground">No cases in this queue</p>
                <p className="text-xs text-muted-foreground/60">All clear — nothing needs attention here.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1.3fr_1.5fr_1fr_0.9fr_80px_28px] gap-3 px-5 py-3 border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground font-medium bg-surface">
                  <div>SR ID</div>
                  <div>Customer · Vehicle</div>
                  <div>Issue · Triage</div>
                  <div>Location</div>
                  <div>Status</div>
                  <div className="text-right">SLA</div>
                  <div />
                </div>

                {visibleRows.map((r) => {
                  const isBreached = r.queue === "breached";
                  const isUrgent = r.queue === "approaching_sla" || r.queue === "stopped";
                  return (
                    <Link
                      key={r.id}
                      to="/case/$caseId"
                      params={{ caseId: r.id }}
                      className={`grid grid-cols-[1fr_1.3fr_1.5fr_1fr_0.9fr_80px_28px] gap-3 px-5 py-4 border-b border-border last:border-b-0 items-center text-sm transition-colors hover:bg-muted/40 ${
                        isBreached
                          ? "bg-destructive/5 border-l-2 border-l-destructive"
                          : isUrgent
                          ? "bg-warning/5 border-l-2 border-l-warning"
                          : r.isNew
                          ? "bg-primary-soft/40 border-l-2 border-l-primary"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="font-mono font-medium text-xs">{r.id}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MessageCircle className="h-3 w-3" /> {r.channel} · {r.age}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate flex items-center gap-1.5">
                          {r.customer}
                          <span className="text-[10px] uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                            {r.membership}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{r.vehicle}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm text-foreground">{r.issue}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {r.triage}
                          <span className="text-muted-foreground/70">· {r.confidence}%</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 truncate text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{r.location}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.city}</div>
                      </div>
                      <div>
                        <StatusPill status={r.status} queue={r.queue} isNew={r.isNew} />
                      </div>
                      <SlaCell slaMin={r.slaMin} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Click any case to open the full master view · queues update in real time
            </p>
          </div>
        </div>
      </div>

      {/* Live toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-[360px] rounded-xl border border-border bg-card shadow-[var(--shadow-pop)] p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">New Roadside Request</span>
              <span className="text-[10px] uppercase tracking-wide bg-primary-soft text-primary rounded px-1.5 py-0.5">
                Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              <span className="font-mono text-foreground">SR-2026-08421</span> · Priya Sharma · BKC, Mumbai — auto-triaged as{" "}
              <span className="text-foreground">Towing</span>. Moved to{" "}
              <span className="font-medium text-foreground">Unassigned</span> queue.
            </p>
            <Link
              to="/case/$caseId"
              params={{ caseId: "SR-2026-08421" }}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2"
            >
              Open case <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <button onClick={() => setShowToast(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusPill({
  status,
  queue,
  isNew,
}: {
  status: string;
  queue: Exclude<QueueKey, "all">;
  isNew?: boolean;
}) {
  const styleMap: Record<string, string> = {
    unassigned: "bg-primary-soft text-accent-foreground",
    outstanding: "bg-primary-soft text-accent-foreground",
    journey_not_started: "bg-muted text-muted-foreground",
    stopped: "bg-warning-soft text-warning-foreground",
    approaching_sla: "bg-warning-soft text-warning-foreground",
    breached: "bg-destructive/10 text-destructive",
    exceptions: "bg-orange-50 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ${
        styleMap[queue] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {isNew && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      {status}
    </span>
  );
}
