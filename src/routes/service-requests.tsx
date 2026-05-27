import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  MapPin,
  FileCheck2,
  Sparkles,
  Phone,
  Car,
  User,
  Wrench,
  Battery,
  Disc3,
  TowerControl,
  Timer,
} from "lucide-react";

export const Route = createFileRoute("/service-requests")({
  head: () => ({
    meta: [
      { title: "Service Requests · RoadAssist" },
      { name: "description", content: "Create and auto-triage new roadside assistance service requests." },
    ],
  }),
  component: ServiceRequests,
});

const flow = [
  { label: "WhatsApp request received", time: "10:38 AM", done: true, icon: MessageCircle },
  { label: "Customer authenticated", time: "10:38 AM", done: true, icon: ShieldCheck },
  { label: "Issue identified", time: "10:39 AM", done: true, icon: AlertCircle },
  { label: "Location captured", time: "10:39 AM", done: true, icon: MapPin },
  { label: "Auto-triage completed", time: "10:40 AM", done: true, icon: Sparkles },
  { label: "SR generated", time: "10:40 AM", done: true, icon: FileCheck2 },
];

const triageOptions = [
  { label: "Towing Required", icon: TowerControl, confidence: 92, primary: true },
  { label: "Battery Jumpstart", icon: Battery, confidence: 6 },
  { label: "Flat Tyre", icon: Disc3, confidence: 1 },
  { label: "Roadside Support", icon: Wrench, confidence: 1 },
];

function ServiceRequests() {
  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Service Request · SR-2026-08421"
          description="Created 10:40 AM · via WhatsApp Bot"
          actions={
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft text-success px-3 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
              </span>
              <button className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:opacity-90">
                Proceed to Dispatch
              </button>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — customer info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <Field label="Customer Name" value="Priya Sharma" />
                <Field
                  label="Phone Number"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      +91 98203 45678
                      <Phone className="h-3 w-3 text-primary" />
                    </span>
                  }
                />
                <Field label="Vehicle Number" value="MH 02 KX 4521" mono />
                <Field label="Vehicle Model" value="Hyundai Creta 2022" />
                <Field label="Membership" value="Gold · Active" />
                <Field label="Past Cases" value="2 in last 12 months" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                Breakdown Details
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Reported Issue</div>
                  <div className="font-medium">
                    "Car not starting after meeting. Engine cranks but doesn't turn over. Smoke from bonnet 5 mins ago."
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Location</div>
                  <div className="font-medium flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    Bandra Kurla Complex, Plot C-39, near Trident Hotel, Mumbai 400051
                  </div>
                </div>
                <div className="flex gap-6 pt-2 border-t border-border">
                  <Field label="Reported At" value="10:38 AM" />
                  <Field label="Weather" value="Clear · 31°C" />
                  <Field label="Channel" value="WhatsApp" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-4">Intake Flow</h3>
              <ol className="space-y-3">
                {flow.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {s.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{s.time}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* RIGHT — auto-triage */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Auto-Triage Result
                </h3>
                <span className="text-xs text-muted-foreground">Powered by RoadAI v3.2</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                Classification from issue text, vehicle history & location signals.
              </p>

              <div className="space-y-2">
                {triageOptions.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.label}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        t.primary
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          t.primary ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t.label}</div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-background overflow-hidden">
                          <div
                            className={`h-full rounded-full ${t.primary ? "bg-primary" : "bg-muted-foreground/30"}`}
                            style={{ width: `${t.confidence}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm font-semibold w-10 text-right">{t.confidence}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Stat label="AI Confidence" value="92%" tone="primary" />
              <Stat label="Priority" value="High" tone="warning" />
              <Stat
                label="SLA Timer"
                value="44:32"
                tone="success"
                icon={<Timer className="h-3.5 w-3.5" />}
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-sm font-semibold mb-3">Recommended Action</h3>
              <div className="rounded-lg bg-primary-soft border border-primary/20 p-4">
                <div className="text-sm font-medium text-accent-foreground">
                  Dispatch flatbed tow truck to Mumbai BKC zone
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Estimated job duration 65 mins · Recommended drop-off: Hyundai Service, Andheri East
                </p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-3 py-2">
                    Accept & Dispatch
                  </button>
                  <button className="rounded-lg border border-border bg-background text-sm font-medium px-3 py-2">
                    Override
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
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

function Stat({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "primary" | "warning" | "success";
  icon?: React.ReactNode;
}) {
  const toneClass =
    tone === "warning"
      ? "bg-warning-soft text-warning-foreground"
      : tone === "success"
      ? "bg-success-soft text-success"
      : "bg-primary-soft text-accent-foreground";
  return (
    <div className={`rounded-xl border border-border p-4 ${toneClass}`}>
      <div className="text-xs opacity-80 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="text-xl font-semibold mt-1.5 font-mono">{value}</div>
    </div>
  );
}