import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { useState } from "react";
import { LiveMapPanel } from "@/components/LiveMapPanel";
import {
  Activity,
  Users,
  Timer,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MapPin,
  ChevronRight,
  AlertTriangle,
  UserCheck,
  BarChart2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · TVS RoadAssist" },
      { name: "description", content: "Operational overview for roadside assistance dispatch." },
    ],
  }),
  component: Dashboard,
});

type Role = "agent" | "tl" | "manager";

const roleConfig: Record<Role, { label: string; name: string; scope: string; avatar: string }> = {
  agent: { label: "L2 Agent", name: "Aarav Rao", scope: "Mumbai · My cases", avatar: "AR" },
  tl: { label: "Team Lead", name: "Priya Nair", scope: "Mumbai · Full team", avatar: "PN" },
  manager: { label: "Ops Head", name: "Rajesh Kumar", scope: "All regions · Network", avatar: "RK" },
};

const metricsByRole: Record<Role, { label: string; value: string; delta: string; up: boolean; icon: React.ComponentType<{ className?: string }>; tone: string }[]> = {
  agent: [
    { label: "My Active Cases", value: "8", delta: "+2", up: true, icon: Activity, tone: "primary" },
    { label: "My Technicians", value: "22", delta: "+3", up: true, icon: Users, tone: "success" },
    { label: "My Avg Response", value: "9m 42s", delta: "-48s", up: true, icon: Timer, tone: "primary" },
    { label: "My SLA Breaches", value: "1", delta: "0", up: true, icon: AlertOctagon, tone: "destructive" },
    { label: "My Resolved Today", value: "34", delta: "+4", up: true, icon: CheckCircle2, tone: "success" },
  ],
  tl: [
    { label: "Team Active Cases", value: "42", delta: "+6", up: true, icon: Activity, tone: "primary" },
    { label: "Team Technicians", value: "118", delta: "+12", up: true, icon: Users, tone: "success" },
    { label: "Team Avg Response", value: "11m 24s", delta: "-1m", up: true, icon: Timer, tone: "primary" },
    { label: "SLA Breaches", value: "3", delta: "+1", up: false, icon: AlertOctagon, tone: "destructive" },
    { label: "Resolved Today", value: "187", delta: "+22", up: true, icon: CheckCircle2, tone: "success" },
  ],
  manager: [
    { label: "Network Active Cases", value: "42", delta: "+6", up: true, icon: Activity, tone: "primary" },
    { label: "Logged-in Techs", value: "118", delta: "+12", up: true, icon: Users, tone: "success" },
    { label: "Network Avg Response", value: "11m 24s", delta: "-1m", up: true, icon: Timer, tone: "primary" },
    { label: "SLA Breaches", value: "3", delta: "+1", up: false, icon: AlertOctagon, tone: "destructive" },
    { label: "Resolved Today", value: "187", delta: "+22", up: true, icon: CheckCircle2, tone: "success" },
  ],
};

const regions = [
  { name: "Mumbai", active: 14, utilization: 78 },
  { name: "Pune", active: 9, utilization: 64 },
  { name: "Bengaluru", active: 11, utilization: 72 },
  { name: "Delhi NCR", active: 18, utilization: 81 },
  { name: "Hyderabad", active: 7, utilization: 55 },
];

const slaTrend = [82, 85, 88, 84, 91, 89, 93, 90, 94, 92, 95, 93];

const agentMyCases = [
  { id: "SR-2026-08421", customer: "Priya Sharma", issue: "Towing · BKC Mumbai", sla: "44:32", status: "Unassigned" },
  { id: "SR-2026-08418", customer: "Rohan Verma", issue: "Flat Tyre · Delhi NCR", sla: "21:18", status: "En Route" },
  { id: "SR-2026-08415", customer: "Anita Iyer", issue: "Battery · Bengaluru", sla: "08:44", status: "On-site" },
];

const tlAgentRows = [
  { name: "Aarav Rao", active: 8, resolved: 34, slaRate: "94.1%", breach: 1 },
  { name: "Sneha Kulkarni", active: 11, resolved: 41, slaRate: "96.3%", breach: 0 },
  { name: "Farhan Sheikh", active: 7, resolved: 38, slaRate: "91.8%", breach: 1 },
  { name: "Deepa Menon", active: 9, resolved: 44, slaRate: "97.7%", breach: 0 },
  { name: "Kartik Bose", active: 7, resolved: 30, slaRate: "89.2%", breach: 1 },
];

const managerAlerts = [
  { label: "3 SLA breaches active", urgency: "red", detail: "Mumbai (2), Jaipur (1)" },
  { label: "Driver stopped >5 min", urgency: "amber", detail: "SR-2026-08395 · Ahmedabad" },
  { label: "Bid timeout — no acceptance", urgency: "amber", detail: "SR-2026-08380 · Mumbai" },
  { label: "Exception pending review", urgency: "orange", detail: "SR-2026-08370 · Lucknow" },
];

function Dashboard() {
  const [role, setRole] = useState<Role>("agent");
  const currentRole = roleConfig[role];
  const metrics = metricsByRole[role];

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header with role switcher */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Operations Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground">
                {currentRole.avatar}
              </div>
              <p className="text-sm text-muted-foreground">
                Viewing as{" "}
                <span className="font-medium text-foreground">{currentRole.name}</span>
                {" "}·{" "}
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{currentRole.label}</span>
                {" "}·{" "}
                {currentRole.scope}
              </p>
            </div>
          </div>

          {/* Role switcher pills */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-[var(--shadow-card)]">
            {(["agent", "tl", "manager"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {r === "agent" && <UserCheck className="h-3.5 w-3.5" />}
                {r === "tl" && <Users className="h-3.5 w-3.5" />}
                {r === "manager" && <BarChart2 className="h-3.5 w-3.5" />}
                {r === "agent" ? "L2 Agent" : r === "tl" ? "Team Lead" : "Ops Head"}
              </button>
            ))}
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-1.5 h-36">
                {slaTrend.map((v, i) => {
                  const barPx = Math.round(v * 1.12); // 112px max at 100%
                  const color = v >= 93 ? "bg-emerald-500" : v >= 88 ? "bg-primary" : "bg-amber-400";
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <span className="text-[10px] font-bold tabular-nums leading-none text-foreground">{v}%</span>
                      <div
                        className={`w-full rounded-t-sm ${color} transition-colors`}
                        style={{ height: `${barPx}px` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1.5 border-t border-border pt-1">
                {slaTrend.map((_, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className="text-[10px] text-muted-foreground">{i + 1}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live field map */}
          <LiveMapPanel />
        </div>

        {/* Role-specific bottom panel */}
        {role === "agent" && (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">My Active Cases</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Cases currently assigned to you</p>
              </div>
              <Link
                to="/service-requests"
                search={{ queue: "all" }}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {agentMyCases.map((c) => (
                <Link
                  key={c.id}
                  to="/case/$caseId"
                  params={{ caseId: c.id }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                      <span className="text-sm font-medium">{c.customer}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.issue}</div>
                  </div>
                  <span className="text-xs rounded-full px-2.5 py-1 bg-muted text-muted-foreground">{c.status}</span>
                  <span className={`font-mono text-xs font-medium ${parseInt(c.sla) < 15 ? "text-warning-foreground" : "text-muted-foreground"}`}>
                    {c.sla}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {role === "tl" && (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold">Agent Productivity · Today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time case load and SLA performance per agent</p>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-4 px-6 py-2 text-[11px] uppercase tracking-wide text-muted-foreground font-medium bg-surface">
                <div>Agent</div>
                <div className="text-center">Active</div>
                <div className="text-center">Resolved</div>
                <div className="text-center">SLA Rate</div>
                <div className="text-center">Breaches</div>
              </div>
              {tlAgentRows.map((a) => (
                <div key={a.name} className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-4 px-6 py-3.5 items-center text-sm hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-medium text-accent-foreground shrink-0">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium text-sm">{a.name}</span>
                  </div>
                  <div className="text-center font-mono text-sm">{a.active}</div>
                  <div className="text-center font-mono text-sm">{a.resolved}</div>
                  <div className="text-center">
                    <span className={`text-xs font-semibold ${parseFloat(a.slaRate) >= 95 ? "text-success" : parseFloat(a.slaRate) >= 90 ? "text-warning-foreground" : "text-destructive"}`}>
                      {a.slaRate}
                    </span>
                  </div>
                  <div className="text-center">
                    {a.breach > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                        <AlertOctagon className="h-3 w-3" /> {a.breach}
                      </span>
                    ) : (
                      <span className="text-xs text-success">
                        <CheckCircle2 className="h-3.5 w-3.5 inline" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {role === "manager" && (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-semibold">Live Alerts & Escalations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Items across the network that need your attention</p>
            </div>
            <div className="divide-y divide-border">
              {managerAlerts.map((a, i) => {
                const bg =
                  a.urgency === "red" ? "border-l-destructive bg-destructive/5"
                  : a.urgency === "amber" ? "border-l-warning bg-warning/5"
                  : "border-l-orange-400 bg-orange-50/50";
                const icon =
                  a.urgency === "red" ? <AlertOctagon className="h-4 w-4 text-destructive shrink-0" />
                  : a.urgency === "amber" ? <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  : <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />;
                return (
                  <div key={i} className={`flex items-start gap-3 px-6 py-4 border-l-2 ${bg}`}>
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.detail}</div>
                    </div>
                    <Link
                      to="/service-requests"
                      search={{ queue: "all" }}
                      className="text-xs text-primary flex items-center gap-1 hover:underline whitespace-nowrap mt-1"
                    >
                      View queue <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
