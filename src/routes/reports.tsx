import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Download } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · RoadAssist" },
      { name: "description", content: "Operational reports and analytics." },
    ],
  }),
  component: Reports,
});

const slaByCity = [
  { city: "Mumbai", value: 94 },
  { city: "Pune", value: 91 },
  { city: "Bengaluru", value: 96 },
  { city: "Delhi NCR", value: 88 },
  { city: "Hyderabad", value: 93 },
];

const caseMix = [
  { label: "Towing", value: 42, color: "oklch(0.58 0.17 252)" },
  { label: "Battery", value: 28, color: "oklch(0.62 0.16 155)" },
  { label: "Flat Tyre", value: 18, color: "oklch(0.78 0.15 75)" },
  { label: "Other", value: 12, color: "oklch(0.7 0.04 250)" },
];

function Reports() {
  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Reports"
          description="Last 7 days · 21 May – 27 May 2026"
          actions={
            <button className="rounded-lg border border-border bg-card text-sm font-medium px-3 py-2 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Kpi label="Total Cases" value="1,284" />
          <Kpi label="SLA Compliance" value="93.2%" />
          <Kpi label="Avg Resolution" value="38m" />
          <Kpi label="Customer CSAT" value="4.7 / 5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold mb-1">SLA Compliance by City</h3>
            <p className="text-xs text-muted-foreground mb-6">% of cases meeting SLA window</p>
            <div className="space-y-4">
              {slaByCity.map((c) => (
                <div key={c.city}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{c.city}</span>
                    <span className="text-muted-foreground">{c.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold mb-1">Case Mix</h3>
            <p className="text-xs text-muted-foreground mb-6">Distribution by service type</p>
            <Donut data={caseMix} />
            <div className="mt-6 space-y-2">
              {caseMix.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                    {c.label}
                  </span>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1.5 tracking-tight">{value}</div>
    </div>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const C = 2 * Math.PI * 52;
  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        {data.map((d) => {
          const len = (d.value / total) * C;
          const seg = (
            <circle
              key={d.label}
              cx="70"
              cy="70"
              r="52"
              fill="none"
              stroke={d.color}
              strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold">1,284</div>
        <div className="text-xs text-muted-foreground">total cases</div>
      </div>
    </div>
  );
}