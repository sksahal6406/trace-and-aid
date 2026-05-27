import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import {
  Sparkles,
  MapPin,
  ChevronRight,
  MessageCircle,
  X,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/service-requests")({
  head: () => ({
    meta: [
      { title: "Service Requests · RoadAssist" },
      { name: "description", content: "Live queue of roadside assistance service requests." },
    ],
  }),
  component: ServiceRequests,
});

type SRStatus = "Awaiting Assignment" | "Assigned" | "En Route" | "On-site" | "Completed";

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
  status: SRStatus;
  sla: string;
  channel: "WhatsApp" | "App" | "Call";
  age: string;
  highlight?: boolean;
  isNew?: boolean;
};

const baseRows: SR[] = [
  { id: "SR-2026-08421", customer: "Priya Sharma", membership: "Gold", vehicle: "Hyundai Creta · MH 02 KX 4521", issue: "Car not starting, smoke from bonnet", triage: "Towing Required", confidence: 92, location: "BKC, Plot C-39", city: "Mumbai", status: "Awaiting Assignment", sla: "44:32", channel: "WhatsApp", age: "just now", isNew: true, highlight: true },
  { id: "SR-2026-08418", customer: "Rohan Verma", membership: "Silver", vehicle: "Maruti Swift · DL 8C AB 9921", issue: "Flat tyre near toll plaza", triage: "Flat Tyre", confidence: 88, location: "DND Flyway, Sec 38", city: "Delhi NCR", status: "En Route", sla: "21:18", channel: "App", age: "12 min" },
  { id: "SR-2026-08415", customer: "Anita Iyer", membership: "Gold", vehicle: "Tata Nexon · KA 03 MN 4412", issue: "Battery drained, car won't start", triage: "Battery Jumpstart", confidence: 95, location: "Indiranagar 100ft Rd", city: "Bengaluru", status: "On-site", sla: "08:44", channel: "WhatsApp", age: "28 min" },
  { id: "SR-2026-08410", customer: "Kabir Singh", membership: "Platinum", vehicle: "BMW 530i · MH 12 DE 7788", issue: "Engine overheating on highway", triage: "Towing Required", confidence: 90, location: "Mumbai-Pune Expy KM 42", city: "Pune", status: "Assigned", sla: "33:05", channel: "Call", age: "9 min" },
  { id: "SR-2026-08404", customer: "Meera Joshi", membership: "Silver", vehicle: "Honda City · TS 07 GH 2210", issue: "Locked out of vehicle", triage: "Locksmith", confidence: 84, location: "Banjara Hills Rd No 12", city: "Hyderabad", status: "Completed", sla: "—", channel: "App", age: "1h 12m" },
];

function ServiceRequests() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 600);
    const h = setTimeout(() => setShowToast(false), 6500);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Service Requests"
          description="Live queue · auto-triaged via WhatsApp, App & call"
          actions={
            <>
              <button className="rounded-lg border border-border bg-card text-sm font-medium px-3 py-2 flex items-center gap-1.5 text-muted-foreground">
                <Filter className="h-3.5 w-3.5" /> All cities · All statuses
              </button>
              <button className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2">
                + New SR
              </button>
            </>
          }
        />

        {/* Status strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatusChip label="Awaiting Assignment" count={1} tone="primary" pulse />
          <StatusChip label="Assigned" count={1} tone="muted" />
          <StatusChip label="En Route" count={1} tone="muted" />
          <StatusChip label="On-site" count={1} tone="muted" />
          <StatusChip label="Completed Today" count={187} tone="success" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="grid grid-cols-[1.1fr_1.4fr_1.6fr_1.2fr_0.9fr_0.7fr_36px] gap-3 px-5 py-3 border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground font-medium bg-surface">
            <div>SR ID</div>
            <div>Customer · Vehicle</div>
            <div>Issue · Auto-triage</div>
            <div>Location</div>
            <div>Status</div>
            <div className="text-right">SLA</div>
            <div />
          </div>
          {baseRows.map((r) => (
            <Link
              key={r.id}
              to="/case/$caseId"
              params={{ caseId: r.id }}
              className={`grid grid-cols-[1.1fr_1.4fr_1.6fr_1.2fr_0.9fr_0.7fr_36px] gap-3 px-5 py-4 border-b border-border last:border-b-0 items-center text-sm hover:bg-muted/40 transition-colors ${
                r.highlight ? "bg-primary-soft/50" : ""
              }`}
            >
              <div>
                <div className="font-mono font-medium">{r.id}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MessageCircle className="h-3 w-3" /> {r.channel} · {r.age}
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate flex items-center gap-1.5">
                  {r.customer}
                  <span className="text-[10px] uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                    {r.membership}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{r.vehicle}</div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-foreground">{r.issue}</div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  {r.triage}
                  <span className="text-muted-foreground/70">· {r.confidence}%</span>
                </div>
              </div>
              <div className="min-w-0 text-xs text-muted-foreground">
                <div className="flex items-center gap-1 truncate text-foreground">
                  <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{r.location}</span>
                </div>
                <div className="mt-0.5">{r.city}</div>
              </div>
              <div>
                <StatusPill status={r.status} isNew={r.isNew} />
              </div>
              <div className={`text-right font-mono text-xs ${r.sla !== "—" && parseInt(r.sla) < 15 ? "text-warning-foreground" : "text-muted-foreground"}`}>
                {r.sla}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Tip: click any service request to open the master case view.
        </p>
      </div>

      {/* Live notification toast */}
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
              <span className="font-mono text-foreground">SR-2026-08421</span> · Priya Sharma · BKC, Mumbai — auto-triaged as <span className="text-foreground">Towing</span>.
            </p>
            <Link
              to="/case/$caseId"
              params={{ caseId: "SR-2026-08421" }}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2"
            >
              Open case <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusChip({
  label,
  count,
  tone,
  pulse,
}: {
  label: string;
  count: number;
  tone: "primary" | "muted" | "success";
  pulse?: boolean;
}) {
  const t =
    tone === "primary"
      ? "bg-primary-soft text-accent-foreground border-primary/20"
      : tone === "success"
      ? "bg-success-soft text-success border-success/20"
      : "bg-card text-foreground border-border";
  return (
    <div className={`rounded-xl border p-4 ${t}`}>
      <div className="flex items-center gap-2 text-xs font-medium">
        {pulse && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1.5">{count}</div>
    </div>
  );
}

function StatusPill({ status, isNew }: { status: SRStatus; isNew?: boolean }) {
  const map: Record<SRStatus, string> = {
    "Awaiting Assignment": "bg-primary-soft text-accent-foreground",
    Assigned: "bg-warning-soft text-warning-foreground",
    "En Route": "bg-primary-soft text-accent-foreground",
    "On-site": "bg-success-soft text-success",
    Completed: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status]}`}>
      {isNew && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      {status}
    </span>
  );
}