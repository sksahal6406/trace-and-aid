import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import {
  MapPin,
  Star,
  Clock,
  Zap,
  Hand,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch · RoadAssist" },
      { name: "description", content: "Assign nearest available technicians via auto-bid or manual dispatch." },
    ],
  }),
  component: Dispatch,
});

type Status = "available" | "busy" | "offline";
const technicians: {
  id: string;
  name: string;
  vendor: string;
  distanceKm: number;
  etaMin: number;
  rating: number;
  workload: string;
  status: Status;
  recommended?: boolean;
}[] = [
  { id: "T-101", name: "Ramesh Patil", vendor: "Mahalaxmi Towing", distanceKm: 1.8, etaMin: 9, rating: 4.9, workload: "0 jobs", status: "available", recommended: true },
  { id: "T-102", name: "Imran Sheikh", vendor: "BKC Auto Rescue", distanceKm: 2.4, etaMin: 12, rating: 4.7, workload: "0 jobs", status: "available" },
  { id: "T-103", name: "Suresh Kumar", vendor: "Mumbai Quick Tow", distanceKm: 3.1, etaMin: 16, rating: 4.6, workload: "1 job", status: "busy" },
  { id: "T-104", name: "Anil Yadav", vendor: "Western Roadside", distanceKm: 4.2, etaMin: 19, rating: 4.8, workload: "0 jobs", status: "available" },
  { id: "T-105", name: "Vijay Singh", vendor: "City Tow 24x7", distanceKm: 5.0, etaMin: 24, rating: 4.4, workload: "—", status: "offline" },
];

function Dispatch() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Dispatch · SR-2026-08421"
          description="Towing required · BKC, Mumbai · High priority"
          actions={
            <div className="flex rounded-lg border border-border bg-card p-1 text-sm">
              <button
                onClick={() => setMode("auto")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  mode === "auto" ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <Zap className="h-3.5 w-3.5" /> Auto-Bidding
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  mode === "manual" ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <Hand className="h-3.5 w-3.5" /> Manual
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — SR + mode panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-4">SR Summary</h3>
              <dl className="space-y-3 text-sm">
                <Row label="Customer" value="Priya Sharma · Gold" />
                <Row label="Vehicle" value="Hyundai Creta · MH 02 KX 4521" />
                <Row label="Service Type" value="Flatbed Towing" />
                <Row label="Pickup" value="BKC, Plot C-39, Mumbai" />
                <Row label="Drop-off" value="Hyundai Service, Andheri East" />
                <Row label="SLA Window" value="45 minutes" />
              </dl>
            </div>

            {mode === "auto" ? (
              <div className="rounded-xl border border-primary/30 bg-primary-soft p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="h-4 w-4 text-primary animate-pulse" />
                  <h3 className="text-sm font-semibold text-accent-foreground">Broadcast Active</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Request sent to nearest 3 vendors. First to accept wins the job.
                </p>
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Time remaining</span>
                    <span className="text-xs font-medium">3 vendors notified</span>
                  </div>
                  <div className="text-3xl font-semibold font-mono tracking-tight">00:42</div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[58%] bg-primary rounded-full" />
                  </div>
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ramesh Patil — viewing now
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Imran Sheikh — notified
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Anil Yadav — notified
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <h3 className="text-sm font-semibold mb-2">Manual Assignment</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Pick a technician from the list and assign directly. No bidding.
                </p>
                <button className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5">
                  Assign Selected Technician
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — technician list */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Nearby Technicians</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Sorted by recommendation score</p>
                </div>
                <span className="text-xs text-muted-foreground">{technicians.length} within 5 km</span>
              </div>
              <div className="divide-y divide-border">
                {technicians.map((t) => (
                  <TechRow key={t.id} t={t} mode={mode} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function TechRow({ t, mode }: { t: typeof technicians[number]; mode: "auto" | "manual" }) {
  const statusColor =
    t.status === "available"
      ? "bg-success"
      : t.status === "busy"
      ? "bg-warning"
      : "bg-muted-foreground/40";
  const statusLabel =
    t.status === "available" ? "Available" : t.status === "busy" ? "Busy" : "Offline";

  return (
    <div className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors ${t.recommended ? "bg-primary-soft/40" : ""}`}>
      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground shrink-0">
        {t.name.split(" ").map((n) => n[0]).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{t.name}</span>
          {t.recommended && (
            <span className="text-[10px] font-medium uppercase tracking-wide bg-primary text-primary-foreground rounded px-1.5 py-0.5">
              Recommended
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">{t.vendor}</div>
      </div>
      <Meta icon={<MapPin className="h-3 w-3" />} value={`${t.distanceKm} km`} />
      <Meta icon={<Clock className="h-3 w-3" />} value={`${t.etaMin} min`} />
      <Meta icon={<Star className="h-3 w-3 fill-warning text-warning" />} value={t.rating.toFixed(1)} />
      <div className="text-xs text-muted-foreground w-16 text-right">{t.workload}</div>
      <div className="flex items-center gap-1.5 w-24">
        <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </div>
      <button
        disabled={t.status === "offline"}
        className={`text-xs font-medium rounded-md px-3 py-1.5 ${
          t.status === "offline"
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : mode === "manual"
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "border border-border bg-background hover:bg-muted"
        }`}
      >
        {mode === "manual" ? "Assign" : "Notify"}
      </button>
    </div>
  );
}

function Meta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground w-16">
      {icon}
      {value}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}