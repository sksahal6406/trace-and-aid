import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Search,
  Bell,
  AlertTriangle,
  Clock,
  Truck,
  Navigation2,
  MessageCircle,
  Layers,
  Radio,
  Activity,
  Car,
  PauseCircle,
  Timer,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";

const navSections = [
  {
    label: "Operations",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/service-requests", label: "Service Requests", icon: FileText },
    ],
  },
  {
    label: "Dispatch & Field",
    items: [
      { to: "/dispatch", label: "Dispatch", icon: Truck },
      { to: "/tracking", label: "Live Tracking", icon: Navigation2 },
      { to: "/communication", label: "Communication", icon: MessageCircle },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
];

const slaQueueNav = [
  { key: "all",                 label: "All Open",            icon: Layers,       urgency: "normal", count: 9  },
  { key: "unassigned",          label: "Unassigned",          icon: Radio,        urgency: "pulse",  count: 1  },
  { key: "outstanding",         label: "Outstanding",         icon: Activity,     urgency: "normal", count: 1  },
  { key: "journey_not_started", label: "Journey Not Started", icon: Car,          urgency: "normal", count: 1  },
  { key: "stopped",             label: "Stopped >5 min",      icon: PauseCircle,  urgency: "amber",  count: 1  },
  { key: "approaching_sla",     label: "Approaching SLA",     icon: Timer,        urgency: "amber",  count: 1  },
  { key: "breached",            label: "SLA Breached",        icon: AlertOctagon, urgency: "red",    count: 3  },
  { key: "exceptions",          label: "Exceptions",          icon: AlertTriangle,urgency: "orange", count: 1  },
  { key: "resolved",            label: "Resolved",            icon: CheckCircle2, urgency: "normal", count: 1  },
] as const;

function useNow() {
  return "10:42 AM";
}

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const currentQueue = (location.search as Record<string, string>).queue || "all";
  const time = useNow();

  return (
    <div className="flex min-h-screen w-full bg-surface text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 px-5 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            TV
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">TVS RoadAssist</div>
            <div className="text-[11px] text-muted-foreground mt-1">CRM · Dispatch OS</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.to;
                  const isSR = item.to === "/service-requests";
                  const Icon = item.icon;
                  return (
                    <div key={item.to}>
                      <Link
                        to={item.to}
                        search={isSR ? { queue: "all" } : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-primary-soft text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {isSR && (
                          <span className="text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                            9
                          </span>
                        )}
                      </Link>
                      {isSR && (
                        <div className="ml-3 mt-0.5 pl-3 border-l border-border space-y-0.5">
                          {slaQueueNav.map((q) => {
                            const qActive = pathname === "/service-requests" && currentQueue === q.key;
                            const QIcon = q.icon;
                            const dotCls =
                              q.key    === "resolved" ? "bg-success" :
                              q.urgency === "pulse"   ? "bg-primary animate-pulse" :
                              q.urgency === "amber"   ? "bg-yellow-400" :
                              q.urgency === "red"     ? "bg-destructive" :
                              q.urgency === "orange"  ? "bg-orange-400" :
                                                        "bg-muted-foreground/40";
                            const badgeCls =
                              q.key    === "resolved" ? "bg-success/15 text-success" :
                              q.urgency === "pulse"   ? "bg-primary text-primary-foreground" :
                              q.urgency === "red"     ? "bg-destructive text-white" :
                              q.urgency === "amber"   ? "bg-yellow-100 text-yellow-800" :
                              q.urgency === "orange"  ? "bg-orange-100 text-orange-700" :
                                                        "bg-muted text-muted-foreground";
                            return (
                              <Link
                                key={q.key}
                                to="/service-requests"
                                search={{ queue: q.key }}
                                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                                  qActive
                                    ? "bg-primary-soft text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotCls}`} />
                                <QIcon className="h-3 w-3 shrink-0" />
                                <span className="flex-1 truncate">{q.label}</span>
                                {q.count > 0 && (
                                  <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 shrink-0 ${badgeCls}`}>
                                    {q.count}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-border space-y-2">
          <Link
            to="/service-requests"
            search={{ queue: "breached" }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 font-medium">SLA Breached</span>
            <span className="font-bold">3</span>
          </Link>
          <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="flex-1">System Operational</span>
            <span className="font-medium text-foreground">9 live</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center gap-4 border-b border-border bg-card px-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search SR, customer, vehicle…"
              className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="hidden lg:flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-medium text-foreground">42</span>
            <span className="text-muted-foreground">active cases</span>
          </div>
          <button className="relative inline-flex items-center gap-2 rounded-lg bg-destructive-soft px-3 py-1.5 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            3 SLA breaches
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {time}
          </div>
          <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
              AR
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium leading-none">Aarav Rao</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">L2 Agent · Mumbai</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
