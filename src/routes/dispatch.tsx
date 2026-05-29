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
  Eye,
  XCircle,
  UserCheck,
  RefreshCw,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch · RoadAssist" },
      { name: "description", content: "Assign nearest available technicians via auto-bid or manual dispatch." },
    ],
  }),
  component: Dispatch,
});

type AvailColor = "green" | "amber" | "grey" | "red";
type BidStatus = "idle" | "notified" | "viewing" | "accepted" | "declined";
type VendorFilter = "all" | "COCO" | "ASP";

const allTechnicians: {
  id: string;
  name: string;
  vendor: string;
  vendorType: "COCO" | "ASP";
  distanceKm: number;
  etaMin: number;
  rating: number;
  workload: string;
  availColor: AvailColor;
  busyUntil?: string;
  recommended?: boolean;
  bidDelayMs?: number; // simulated delay before they accept
}[] = [
  { id: "T-101", name: "Ramesh Patil",    vendor: "Mahalaxmi Towing",  vendorType: "COCO", distanceKm: 1.8, etaMin: 9,  rating: 4.9, workload: "0 jobs", availColor: "green", recommended: true, bidDelayMs: 7000 },
  { id: "T-102", name: "Imran Sheikh",    vendor: "BKC Auto Rescue",   vendorType: "COCO", distanceKm: 2.4, etaMin: 12, rating: 4.7, workload: "0 jobs", availColor: "green", bidDelayMs: 18000 },
  { id: "T-103", name: "Suresh Kumar",    vendor: "Mumbai Quick Tow",  vendorType: "ASP",  distanceKm: 3.1, etaMin: 16, rating: 4.6, workload: "1 job",  availColor: "amber", busyUntil: "~11:05 AM" },
  { id: "T-104", name: "Anil Yadav",      vendor: "Western Roadside",  vendorType: "ASP",  distanceKm: 4.2, etaMin: 19, rating: 4.8, workload: "0 jobs", availColor: "green", bidDelayMs: 28000 },
  { id: "T-105", name: "Vijay Singh",     vendor: "City Tow 24x7",     vendorType: "COCO", distanceKm: 5.0, etaMin: 24, rating: 4.4, workload: "—",      availColor: "grey" },
  { id: "T-106", name: "Deepak Nair",     vendor: "Rapid Rescue ASP",  vendorType: "ASP",  distanceKm: 5.6, etaMin: 26, rating: 4.5, workload: "0 jobs", availColor: "green", bidDelayMs: 35000 },
];

const TIMER_DURATION = 45;
const SLA_WINDOW_SECONDS = 45 * 60; // 45-minute SLA

function Dispatch() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [vendorFilter, setVendorFilter] = useState<VendorFilter>("all");
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [bidStatuses, setBidStatuses] = useState<Record<string, BidStatus>>({});
  const [assignedId, setAssignedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const bidTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [slaSecondsLeft, setSlaSecondsLeft] = useState(SLA_WINDOW_SECONDS);

  const filteredTechnicians = allTechnicians.filter((t) =>
    vendorFilter === "all" ? true : t.vendorType === vendorFilter
  );

  const notifiedIds = allTechnicians
    .filter((t) => t.availColor === "green" && t.bidDelayMs !== undefined)
    .slice(0, 3)
    .map((t) => t.id);

  const acceptedTechs = allTechnicians.filter((t) => bidStatuses[t.id] === "accepted");
  const firstAcceptor = acceptedTechs[0] ?? null;

  // SLA countdown — always ticking
  useEffect(() => {
    if (slaSecondsLeft <= 0) return;
    const id = setInterval(() => setSlaSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [slaSecondsLeft]);

  // bid countdown tick
  useEffect(() => {
    if (!timerRunning) return;
    if (secondsLeft <= 0) {
      setTimerRunning(false);
      setTimerExpired(true);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          setTimerExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, secondsLeft]);

  function startBidding() {
    setSecondsLeft(TIMER_DURATION);
    setTimerExpired(false);
    setTimerRunning(true);
    setAssignedId(null);
    setBidStatuses({});

    // clear any previous timeouts
    bidTimeoutsRef.current.forEach(clearTimeout);
    bidTimeoutsRef.current = [];

    // simulate notified → viewing → accepted for each eligible tech
    notifiedIds.forEach((id) => {
      const tech = allTechnicians.find((t) => t.id === id)!;

      // notify immediately
      setBidStatuses((prev) => ({ ...prev, [id]: "notified" }));

      // viewing after 2s
      const t1 = setTimeout(() => {
        setBidStatuses((prev) => ({ ...prev, [id]: "viewing" }));
      }, 2000);

      // accepted at their individual delay
      if (tech.bidDelayMs !== undefined && tech.bidDelayMs < TIMER_DURATION * 1000) {
        const t2 = setTimeout(() => {
          setBidStatuses((prev) => ({ ...prev, [id]: "accepted" }));
        }, tech.bidDelayMs);
        bidTimeoutsRef.current.push(t2);
      }

      bidTimeoutsRef.current.push(t1);
    });
  }

  function resetTimer() {
    bidTimeoutsRef.current.forEach(clearTimeout);
    bidTimeoutsRef.current = [];
    setSecondsLeft(TIMER_DURATION);
    setTimerRunning(false);
    setTimerExpired(false);
    setBidStatuses({});
    setAssignedId(null);
    setSelectedId(null);
  }

  function acceptBid(techId: string) {
    setAssignedId(techId);
    setTimerRunning(false);
    bidTimeoutsRef.current.forEach(clearTimeout);
  }

  function manualAssign() {
    if (!selectedId) return;
    setAssignedId(selectedId);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((TIMER_DURATION - secondsLeft) / TIMER_DURATION) * 100;

  const timerColor =
    secondsLeft > 20 ? "bg-primary" : secondsLeft > 10 ? "bg-amber-500" : "bg-destructive";

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Dispatch · SR-2026-08421"
          description="Towing required · BKC, Mumbai · High priority"
          actions={
            <div className="flex rounded-lg border border-border bg-card p-1 text-sm">
              <button
                onClick={() => { setMode("auto"); resetTimer(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  mode === "auto" ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <Zap className="h-3.5 w-3.5" /> Auto-Bidding
              </button>
              <button
                onClick={() => { setMode("manual"); resetTimer(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  mode === "manual" ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <Hand className="h-3.5 w-3.5" /> Manual
              </button>
            </div>
          }
        />

        {/* Assigned banner */}
        {assignedId && (
          <div className="mb-6 rounded-xl border border-success/40 bg-success/10 px-6 py-4 flex items-center gap-4">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-success">
                Assigned — {allTechnicians.find((t) => t.id === assignedId)?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {allTechnicians.find((t) => t.id === assignedId)?.vendor} · ETA {allTechnicians.find((t) => t.id === assignedId)?.etaMin} min
              </p>
            </div>
            <button onClick={resetTimer} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" /> Re-dispatch
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* SR Summary */}
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

              {/* Live SLA countdown */}
              <div className={`mt-5 rounded-lg border p-3 ${
                slaSecondsLeft === 0
                  ? "border-destructive/40 bg-destructive/10"
                  : slaSecondsLeft < 300
                  ? "border-destructive/30 bg-destructive/5"
                  : slaSecondsLeft < 600
                  ? "border-amber-400/40 bg-amber-50/40 dark:bg-amber-900/10"
                  : "border-border bg-muted/30"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {slaSecondsLeft < 600 && slaSecondsLeft > 0 ? (
                      <AlertTriangle className={`h-3.5 w-3.5 ${slaSecondsLeft < 300 ? "text-destructive" : "text-amber-500"}`} />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground">SLA Remaining</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    slaSecondsLeft === 0
                      ? "bg-destructive text-white"
                      : slaSecondsLeft < 300
                      ? "bg-destructive/20 text-destructive"
                      : slaSecondsLeft < 600
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {slaSecondsLeft === 0 ? "BREACHED" : slaSecondsLeft < 300 ? "CRITICAL" : slaSecondsLeft < 600 ? "WARNING" : "ON TRACK"}
                  </span>
                </div>
                <div className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
                  slaSecondsLeft === 0 ? "text-destructive"
                  : slaSecondsLeft < 300 ? "text-destructive"
                  : slaSecondsLeft < 600 ? "text-amber-500"
                  : "text-foreground"
                }`}>
                  {String(Math.floor(slaSecondsLeft / 60)).padStart(2, "0")}:{String(slaSecondsLeft % 60).padStart(2, "0")}
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      slaSecondsLeft < 300 ? "bg-destructive" : slaSecondsLeft < 600 ? "bg-amber-400" : "bg-success"
                    }`}
                    style={{ width: `${(slaSecondsLeft / SLA_WINDOW_SECONDS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Auto-bid panel */}
            {mode === "auto" && (
              <div className="rounded-xl border border-primary/30 bg-primary-soft p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className={`h-4 w-4 text-primary ${timerRunning ? "animate-pulse" : ""}`} />
                    <h3 className="text-sm font-semibold text-accent-foreground">
                      {assignedId ? "Job Assigned" : timerExpired ? "Bid Expired" : timerRunning ? "Broadcast Active" : "Auto-Bidding"}
                    </h3>
                  </div>
                  {(timerRunning || timerExpired) && !assignedId && (
                    <button onClick={resetTimer} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Reset
                    </button>
                  )}
                </div>

                {/* Timer card */}
                {!assignedId && (
                  <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {timerExpired ? "Time expired" : timerRunning ? "Time remaining" : "Duration"}
                      </span>
                      <span className="text-xs font-medium">{notifiedIds.length} vendors notified</span>
                    </div>

                    <div className={`text-4xl font-semibold font-mono tracking-tight ${
                      timerExpired ? "text-destructive" : secondsLeft <= 10 ? "text-destructive" : secondsLeft <= 20 ? "text-amber-500" : ""
                    }`}>
                      {mm}:{ss}
                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                        style={{ width: `${timerRunning || timerExpired ? progress : 0}%` }}
                      />
                    </div>

                    {!timerRunning && !timerExpired && (
                      <button
                        onClick={startBidding}
                        className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Zap className="h-4 w-4" /> Start Auto-Bidding
                      </button>
                    )}

                    {timerExpired && !firstAcceptor && (
                      <button
                        onClick={startBidding}
                        className="w-full rounded-lg border border-border bg-background text-sm font-medium py-2.5 flex items-center justify-center gap-2 hover:bg-muted"
                      >
                        <RefreshCw className="h-4 w-4" /> Re-broadcast
                      </button>
                    )}
                  </div>
                )}

                {/* Live bid status */}
                {(timerRunning || timerExpired) && !assignedId && notifiedIds.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Live Bids</p>
                    {notifiedIds.map((id) => {
                      const tech = allTechnicians.find((t) => t.id === id)!;
                      const status = bidStatuses[id] ?? "notified";
                      return (
                        <div key={id} className={`flex items-center gap-3 rounded-lg border p-3 ${
                          status === "accepted"
                            ? "border-success/40 bg-success/10"
                            : "border-border bg-card"
                        }`}>
                          <BidStatusIcon status={status} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{tech.name}</p>
                            <p className="text-[10px] text-muted-foreground">{bidStatusLabel(status)} · {tech.etaMin} min ETA</p>
                          </div>
                          {status === "accepted" && (
                            <button
                              onClick={() => acceptBid(id)}
                              className="text-[11px] font-semibold bg-success text-white rounded-md px-2.5 py-1 hover:opacity-90 shrink-0"
                            >
                              Accept
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {timerExpired && firstAcceptor && !assignedId && (
                  <button
                    onClick={() => acceptBid(firstAcceptor.id)}
                    className="w-full rounded-lg bg-success text-white text-sm font-medium py-2.5 flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Confirm {firstAcceptor.name}
                  </button>
                )}
              </div>
            )}

            {/* Manual panel */}
            {mode === "manual" && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Manual Assignment</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a technician from the list, then confirm.
                  </p>
                </div>
                {selectedId ? (
                  <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{allTechnicians.find((t) => t.id === selectedId)?.name}</p>
                      <p className="text-xs text-muted-foreground">{allTechnicians.find((t) => t.id === selectedId)?.vendor}</p>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No technician selected</p>
                )}
                <button
                  onClick={manualAssign}
                  disabled={!selectedId || !!assignedId}
                  className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Assign Technician
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — technician list */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              {/* Header + filter */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold">Nearby Technicians</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filteredTechnicians.length} within 6 km
                    {vendorFilter !== "all" ? ` · ${vendorFilter} only` : ""}
                  </p>
                </div>
                {/* Vendor filter */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
                  {(["all", "COCO", "ASP"] as VendorFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setVendorFilter(f)}
                      className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                        vendorFilter === f
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f === "all" ? "All" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="px-6 py-2 border-b border-border bg-surface flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                <span className="font-medium text-foreground">Availability:</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Available</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Busy</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Not logged in</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Flagged</span>
              </div>

              <div className="divide-y divide-border">
                {filteredTechnicians.length === 0 ? (
                  <p className="px-6 py-8 text-sm text-muted-foreground text-center">No technicians match the current filter.</p>
                ) : (
                  filteredTechnicians.map((t) => (
                    <TechRow
                      key={t.id}
                      t={t}
                      mode={mode}
                      bidStatus={bidStatuses[t.id] ?? "idle"}
                      selected={selectedId === t.id}
                      assigned={assignedId === t.id}
                      onSelect={() => setSelectedId(t.id)}
                      onAcceptBid={() => acceptBid(t.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function BidStatusIcon({ status }: { status: BidStatus }) {
  if (status === "accepted") return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
  if (status === "viewing") return <Eye className="h-4 w-4 text-primary shrink-0 animate-pulse" />;
  return <span className="h-2 w-2 rounded-full bg-muted-foreground/40 mt-1 mx-1 shrink-0" />;
}

function bidStatusLabel(status: BidStatus) {
  if (status === "accepted") return "Accepted";
  if (status === "viewing") return "Viewing now";
  if (status === "notified") return "Notified";
  return "Idle";
}

function TechRow({
  t, mode, bidStatus, selected, assigned, onSelect, onAcceptBid,
}: {
  t: typeof allTechnicians[number];
  mode: "auto" | "manual";
  bidStatus: BidStatus;
  selected: boolean;
  assigned: boolean;
  onSelect: () => void;
  onAcceptBid: () => void;
}) {
  const dotColor =
    t.availColor === "green" ? "bg-success"
    : t.availColor === "amber" ? "bg-warning"
    : t.availColor === "grey" ? "bg-muted-foreground/40"
    : "bg-destructive";
  const borderColor =
    assigned ? "border-l-success"
    : selected ? "border-l-primary"
    : t.availColor === "green" ? "border-l-success"
    : t.availColor === "amber" ? "border-l-warning"
    : t.availColor === "grey" ? "border-l-muted-foreground/30"
    : "border-l-destructive";
  const availLabel =
    t.availColor === "green" ? "Available"
    : t.availColor === "amber" ? "Busy"
    : t.availColor === "grey" ? "Not logged in"
    : "Flagged";
  const isDisabled = t.availColor === "grey" || t.availColor === "red";

  return (
    <div
      className={`flex items-center gap-4 px-6 py-4 border-l-2 ${borderColor} transition-colors ${
        assigned ? "bg-success/10" : selected ? "bg-primary-soft/60" : t.recommended ? "bg-primary-soft/30" : ""
      } ${isDisabled ? "opacity-60" : ""} ${!isDisabled && mode === "manual" ? "cursor-pointer hover:bg-muted/40" : "hover:bg-muted/30"}`}
      onClick={() => {
        if (!isDisabled && mode === "manual") onSelect();
      }}
    >
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${dotColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate">{t.name}</span>
          {t.recommended && (
            <span className="text-[10px] font-medium uppercase tracking-wide bg-primary text-primary-foreground rounded px-1.5 py-0.5">
              Recommended
            </span>
          )}
          {assigned && (
            <span className="text-[10px] font-medium uppercase tracking-wide bg-success text-white rounded px-1.5 py-0.5">
              Assigned
            </span>
          )}
          {bidStatus === "accepted" && !assigned && (
            <span className="text-[10px] font-medium bg-success/20 text-success rounded px-1.5 py-0.5">
              Bid Accepted
            </span>
          )}
          {bidStatus === "viewing" && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary rounded px-1.5 py-0.5 flex items-center gap-1">
              <Eye className="h-2.5 w-2.5" /> Viewing
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">{t.vendor}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            t.vendorType === "COCO"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          }`}>
            {t.vendorType}
          </span>
        </div>
        {t.busyUntil && (
          <div className="text-[10px] text-warning-foreground mt-0.5">Free {t.busyUntil}</div>
        )}
      </div>

      <Meta icon={<MapPin className="h-3 w-3" />} value={`${t.distanceKm} km`} />
      <Meta icon={<Clock className="h-3 w-3" />} value={`${t.etaMin} min`} />
      <Meta icon={<Star className="h-3 w-3 fill-warning text-warning" />} value={t.rating.toFixed(1)} />
      <div className="text-xs text-muted-foreground w-14 text-right shrink-0">{t.workload}</div>

      <div className="flex items-center gap-1.5 w-24 shrink-0">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <span className="text-xs text-muted-foreground">{availLabel}</span>
      </div>

      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {assigned ? (
          <span className="text-xs font-medium text-success flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Done
          </span>
        ) : isDisabled ? (
          <span className="text-xs font-medium rounded-md px-3 py-1.5 bg-muted text-muted-foreground cursor-not-allowed">
            Unavailable
          </span>
        ) : mode === "manual" ? (
          <button
            onClick={onSelect}
            className={`text-xs font-medium rounded-md px-3 py-1.5 transition-colors ${
              selected
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background hover:bg-muted"
            }`}
          >
            {selected ? "Selected" : "Select"}
          </button>
        ) : bidStatus === "accepted" ? (
          <button
            onClick={onAcceptBid}
            className="text-xs font-semibold rounded-md px-3 py-1.5 bg-success text-white hover:opacity-90 transition-opacity"
          >
            Accept Bid
          </button>
        ) : (
          <span className="text-xs text-muted-foreground px-3 py-1.5">
            {bidStatus === "viewing" ? "Viewing…" : bidStatus === "notified" ? "Notified" : "—"}
          </span>
        )}
      </div>
    </div>
  );
}

function Meta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground w-14 shrink-0">
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
