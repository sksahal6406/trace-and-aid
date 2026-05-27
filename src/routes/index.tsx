import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import {
  Activity,
  Users,
  Timer,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · RoadAssist" },
      { name: "description", content: "Operational overview for roadside assistance dispatch." },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  { label: "Active Cases", value: "42", delta: "+6", up: true, icon: Activity, tone: "primary" },
  { label: "Technicians Online", value: "118", delta: "+12", up: true, icon: Users, tone: "success" },
  { label: "Avg Response Time", value: "11m 24s", delta: "-1m", up: true, icon: Timer, tone: "primary" },
  { label: "SLA Breaches", value: "3", delta: "+1", up: false, icon: AlertOctagon, tone: "destructive" },
  { label: "Resolved Today", value: "187", delta: "+22", up: true, icon: CheckCircle2, tone: "success" },
];

const regions = [
  { name: "Mumbai", active: 14, utilization: 78 },
  { name: "Pune", active: 9, utilization: 64 },
  { name: "Bengaluru", active: 11, utilization: 72 },
  { name: "Delhi NCR", active: 18, utilization: 81 },
  { name: "Hyderabad", active: 7, utilization: 55 },
];

const slaTrend = [82, 85, 88, 84, 91, 89, 93, 90, 94, 92, 95, 93];

function Dashboard() {
  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Operations Dashboard"
          description="Live overview · Wednesday, 27 May 2026"
        />

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            const toneBg =
              m.tone === "success"
                ? "bg-success-soft text-success"
                : m.tone === "destructive"
                ? "bg-destructive-soft text-destructive"
                : "bg-primary-soft text-accent-foreground";
            return (
              <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${m.up ? "text-success" : "text-destructive"}`}>
                    {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {m.delta}
                  </div>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SLA trend */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold">SLA Compliance · last 12 hours</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Percentage of cases resolved within SLA window</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">93.2%</div>
                <div className="text-xs text-success">+2.1% vs yesterday</div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {slaTrend.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${v}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{i + 1}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active regions */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold mb-1">Active Regions</h3>
            <p className="text-xs text-muted-foreground mb-4">Technician utilization across hubs</p>
            <div className="space-y-4">
              {regions.map((r) => (
                <div key={r.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{r.name}</span>
                      <span className="text-xs text-muted-foreground">· {r.active} active</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{r.utilization}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${r.utilization > 75 ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${r.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
