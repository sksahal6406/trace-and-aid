import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Sparkles, MapPin, Phone, MessageSquare, Timer,
  CheckCircle2, Circle, AlertTriangle, Car, User,
  Send, Paperclip, CheckCheck, Star, Clock, Zap, TowerControl,
  ShieldCheck, ChevronRight, Radio, AlertOctagon, Navigation,
  Hand, Eye, XCircle, UserCheck, RefreshCw, Filter,
} from "lucide-react";

export const Route = createFileRoute("/case/$caseId")({
  head: () => ({
    meta: [
      { title: "Case · TVS RoadAssist" },
      { name: "description", content: "Master view for a roadside assistance case." },
    ],
  }),
  component: CaseDetail,
});

type Phase =
  | "triage"
  | "assigning"
  | "assigned"
  | "tracking"
  | "delayed"
  | "onsite"
  | "completing"
  | "completed"
  | "breached";

type Tab = "overview" | "assignment" | "tracking" | "communication";

type CaseData = {
  customer: string;
  phone: string;
  membership: "Gold" | "Silver" | "Platinum";
  vehicle: string;
  vehicleReg: string;
  pastCases: string;
  issue: string;
  issueDetail: string;
  location: string;
  city: string;
  channel: string;
  createdAt: string;
  triage: string;
  triageDetail: string;
  confidence: number;
  techName: string;
  techVendor: string;
  techVendorType: "COCO" | "ASP";
  techVehicle: string;
  techEtaMin: number;
  initialPhase: Phase;
  initialTab: Tab;
  slaTarget: number;
  slaDisplay: string;
  completionService: string;
  completionNote: string;
};

const caseDataMap: Record<string, CaseData> = {
  "SR-2026-08421": {
    customer: "Priya Sharma", phone: "+91 98203 45678", membership: "Gold",
    vehicle: "Hyundai Creta 2022", vehicleReg: "MH 02 KX 4521", pastCases: "2 in last 12 months",
    issue: "Car not starting, smoke from bonnet",
    issueDetail: "Car not starting after meeting. Engine cranks but doesn't turn over. Smoke from bonnet noticed ~5 mins ago.",
    location: "Bandra Kurla Complex, Plot C-39, near Trident Hotel, Mumbai 400051",
    city: "Mumbai", channel: "WhatsApp", createdAt: "10:38 AM",
    triage: "Towing Required · Flatbed",
    triageDetail: "Suspected engine failure · recommended drop: Hyundai Service, Andheri East",
    confidence: 92,
    techName: "Ramesh Patil", techVendor: "Mahalaxmi Towing", techVendorType: "COCO",
    techVehicle: "TN-09-FB-2210", techEtaMin: 9,
    initialPhase: "triage", initialTab: "overview",
    slaTarget: 45, slaDisplay: "44:32",
    completionService: "Flatbed towing — vehicle loaded & transported",
    completionNote: "Vehicle towed to Hyundai Service Centre, Andheri East. Customer confirmed vehicle receipt. No additional damage observed.",
  },
  "SR-2026-08418": {
    customer: "Rohan Verma", phone: "+91 97103 88221", membership: "Silver",
    vehicle: "Maruti Swift 2021", vehicleReg: "DL 8C AB 9921", pastCases: "1 in last 12 months",
    issue: "Flat tyre near toll plaza",
    issueDetail: "Left rear tyre punctured near DND Flyway toll. Spare tyre also flat. Stranded on shoulder.",
    location: "DND Flyway, Sector 38 Toll, Delhi NCR",
    city: "Delhi NCR", channel: "App", createdAt: "10:26 AM",
    triage: "Flat Tyre · Roadside Service",
    triageDetail: "Tyre replacement on-site · both rear tyres reported flat",
    confidence: 88,
    techName: "Arun Sharma", techVendor: "Delhi Roadside Assist", techVendorType: "COCO",
    techVehicle: "DL-10-RS-5541", techEtaMin: 4,
    initialPhase: "tracking", initialTab: "tracking",
    slaTarget: 60, slaDisplay: "21:18",
    completionService: "Roadside tyre replacement",
    completionNote: "Both rear tyres replaced on-site. Customer verified and drove off safely.",
  },
  "SR-2026-08410": {
    customer: "Kabir Singh", phone: "+91 99012 77344", membership: "Platinum",
    vehicle: "BMW 530i 2023", vehicleReg: "MH 12 DE 7788", pastCases: "4 in last 12 months",
    issue: "Engine overheating on highway",
    issueDetail: "Temperature gauge in red zone. Smoke from engine bay. Pulled over at KM 42 marker. Cannot restart.",
    location: "Mumbai-Pune Expressway, KM 42 marker",
    city: "Pune", channel: "Call", createdAt: "10:29 AM",
    triage: "Towing Required · Flatbed",
    triageDetail: "VIP Platinum — skip bidding, direct assignment. Drop: BMW Service, Hinjewadi",
    confidence: 90,
    techName: "Suresh Kumar", techVendor: "Pune Premium Towing", techVendorType: "ASP",
    techVehicle: "MH-12-PT-8801", techEtaMin: 14,
    initialPhase: "assigned", initialTab: "assignment",
    slaTarget: 90, slaDisplay: "33:05",
    completionService: "Flatbed towing — high-value vehicle",
    completionNote: "BMW 530i towed to authorised BMW service centre, Hinjewadi. Platinum customer satisfaction call scheduled.",
  },
  "SR-2026-08395": {
    customer: "Rahul Mehta", phone: "+91 96221 34109", membership: "Silver",
    vehicle: "Tata Nexon EV 2023", vehicleReg: "GJ 01 AB 3321", pastCases: "0 in last 12 months",
    issue: "Car won't start — suspected battery",
    issueDetail: "Car not starting in mall parking. Battery warning on dashboard. No crank on ignition.",
    location: "SG Highway, Near IKEA, Ahmedabad",
    city: "Ahmedabad", channel: "WhatsApp", createdAt: "10:20 AM",
    triage: "Battery Jumpstart",
    triageDetail: "EV battery drain — jumpstart or portable charger, fallback tow if needed",
    confidence: 91,
    techName: "Vijay Desai", techVendor: "Ahmedabad Auto Rescue", techVendorType: "COCO",
    techVehicle: "GJ-01-AR-4420", techEtaMin: 9,
    initialPhase: "delayed", initialTab: "tracking",
    slaTarget: 60, slaDisplay: "12:45",
    completionService: "Battery jumpstart — EV portable charge",
    completionNote: "Vehicle jumpstarted successfully. Customer advised to visit Tata EV service for battery check.",
  },
  "SR-2026-08415": {
    customer: "Anita Iyer", phone: "+91 98446 23019", membership: "Gold",
    vehicle: "Tata Nexon 2022", vehicleReg: "KA 03 MN 4412", pastCases: "1 in last 12 months",
    issue: "Battery drained, car won't start",
    issueDetail: "Left interior light on overnight. Battery fully drained. Car won't crank.",
    location: "Indiranagar 100ft Road, near CMH Road junction",
    city: "Bengaluru", channel: "WhatsApp", createdAt: "10:10 AM",
    triage: "Battery Jumpstart",
    triageDetail: "Standard jumpstart · SLA approaching — prioritise",
    confidence: 95,
    techName: "Prakash Nair", techVendor: "Bengaluru Roadside Help", techVendorType: "COCO",
    techVehicle: "KA-01-RS-9930", techEtaMin: 0,
    initialPhase: "onsite", initialTab: "tracking",
    slaTarget: 60, slaDisplay: "08:44",
    completionService: "Battery jumpstart",
    completionNote: "Vehicle jumpstarted. Interior light checked and resolved. Customer satisfied.",
  },
  "SR-2026-08390": {
    customer: "Sunita Patel", phone: "+91 97551 44320", membership: "Silver",
    vehicle: "Honda Activa 6G", vehicleReg: "MH 04 CD 7720", pastCases: "0 in last 12 months",
    issue: "Two-wheeler flat tyre",
    issueDetail: "Rear tyre flat on the way to office near Nariman Point bus stop.",
    location: "Nariman Point, near Hotel Trident",
    city: "Mumbai", channel: "App", createdAt: "09:55 AM",
    triage: "Flat Tyre · Two-Wheeler",
    triageDetail: "On-site tyre repair or replacement",
    confidence: 97,
    techName: "Imran Sheikh", techVendor: "BKC Auto Rescue", techVendorType: "COCO",
    techVehicle: "MH-01-AR-3310", techEtaMin: 0,
    initialPhase: "breached", initialTab: "tracking",
    slaTarget: 60, slaDisplay: "BREACHED +8m",
    completionService: "Two-wheeler tyre replacement",
    completionNote: "Tyre replaced on-site. SLA breached due to high traffic. Breach documented.",
  },
  "SR-2026-08385": {
    customer: "Deepak Joshi", phone: "+91 94122 78009", membership: "Gold",
    vehicle: "Hyundai i20 2021", vehicleReg: "RJ 14 TC 9913", pastCases: "3 in last 12 months",
    issue: "Locked out, key inside car",
    issueDetail: "Keys locked inside car at shopping centre. No spare key available.",
    location: "Sindhi Colony, near Pink City Mall, Jaipur",
    city: "Jaipur", channel: "WhatsApp", createdAt: "09:33 AM",
    triage: "Locksmith Required",
    triageDetail: "Remote locking failure — locksmith dispatch",
    confidence: 89,
    techName: "Ravi Sharma", techVendor: "Jaipur Quick Assist", techVendorType: "ASP",
    techVehicle: "RJ-14-QA-2211", techEtaMin: 0,
    initialPhase: "breached", initialTab: "tracking",
    slaTarget: 45, slaDisplay: "BREACHED +15m",
    completionService: "Emergency locksmith — vehicle opened",
    completionNote: "Vehicle unlocked after 75 minutes. SLA breach reported to TL.",
  },
  "SR-2026-08380": {
    customer: "Kiran Shah", phone: "+91 98200 11882", membership: "Platinum",
    vehicle: "Mercedes C-Class 2022", vehicleReg: "MH 01 AA 5001", pastCases: "6 in last 12 months",
    issue: "Engine failure on expressway",
    issueDetail: "Complete engine failure at highway speed. Car coasted to emergency lane. Cannot restart.",
    location: "Eastern Express Highway, near Ghatkopar",
    city: "Mumbai", channel: "Call", createdAt: "09:16 AM",
    triage: "Towing Required · Flatbed",
    triageDetail: "VIP Platinum · high-value vehicle — notify supervisor, direct assign",
    confidence: 93,
    techName: "Anil Yadav", techVendor: "Western Roadside", techVendorType: "ASP",
    techVehicle: "MH-04-FS-7810", techEtaMin: 0,
    initialPhase: "breached", initialTab: "tracking",
    slaTarget: 90, slaDisplay: "BREACHED +22m",
    completionService: "Flatbed towing — high-value vehicle",
    completionNote: "Mercedes towed to authorised service. Supervisor notified of SLA breach.",
  },
  "SR-2026-08370": {
    customer: "Nisha Singh", phone: "+91 88021 55318", membership: "Silver",
    vehicle: "Maruti WagonR 2020", vehicleReg: "UP 80 DK 1123", pastCases: "0 in last 12 months",
    issue: "Fuel empty, stranded on highway",
    issueDetail: "Car came to stop on highway. Fuel gauge empty. No petrol station within 10 km.",
    location: "Lucknow-Kanpur Highway, KM 18",
    city: "Lucknow", channel: "WhatsApp", createdAt: "10:16 AM",
    triage: "Fuel Delivery",
    triageDetail: "Emergency 5L fuel delivery — Exception: GPS location unclear, confirm before dispatch",
    confidence: 99,
    techName: "Mohan Yadav", techVendor: "UP Roadside Assist", techVendorType: "ASP",
    techVehicle: "UP-80-RA-1122", techEtaMin: 22,
    initialPhase: "triage", initialTab: "overview",
    slaTarget: 45, slaDisplay: "22:48",
    completionService: "Emergency fuel delivery",
    completionNote: "5L petrol delivered. Customer confirmed able to drive to nearest station.",
  },
  "SR-2026-08404": {
    customer: "Meera Joshi", phone: "+91 99034 22801", membership: "Silver",
    vehicle: "Honda City 2020", vehicleReg: "TS 07 GH 2210", pastCases: "1 in last 12 months",
    issue: "Locked out of vehicle",
    issueDetail: "Keys locked in car outside Banjara Hills office. Required emergency locksmith.",
    location: "Banjara Hills Road No 12, Hyderabad",
    city: "Hyderabad", channel: "App", createdAt: "09:10 AM",
    triage: "Locksmith Required",
    triageDetail: "Standard lockout resolution",
    confidence: 84,
    techName: "Srinivas Reddy", techVendor: "Hyderabad Key Rescue", techVendorType: "COCO",
    techVehicle: "TS-09-KR-5510", techEtaMin: 0,
    initialPhase: "completed", initialTab: "overview",
    slaTarget: 45, slaDisplay: "—",
    completionService: "Emergency locksmith — vehicle opened",
    completionNote: "Vehicle unlocked on first attempt. Customer verified key works. Case closed within SLA.",
  },
  "SR-2026-08402": {
    customer: "Arjun Nair", phone: "+91 94443 67812", membership: "Silver",
    vehicle: "Maruti Suzuki Dzire 2019", vehicleReg: "TN 07 BK 6634", pastCases: "0 in last 12 months",
    issue: "Flat tyre repair escalated to tow — wheel hub damaged",
    issueDetail: "Called for flat tyre on rear-left wheel. Technician arrived and found the wheel hub cracked and brake drum deformed — likely from a deep pothole impact. Roadside repair not feasible. Flatbed tow dispatched to nearest Maruti workshop.",
    location: "Anna Nagar, 2nd Avenue, near Water Tank, Chennai 600040",
    city: "Chennai", channel: "App", createdAt: "10:07 AM",
    triage: "Towing Required · Flatbed (Escalated)",
    triageDetail: "Originally: Flat Tyre. On-site assessment revealed cracked wheel hub & damaged brake drum — repair not possible roadside. Escalated to flatbed tow. Drop: Maruti Suzuki Service, Koyambedu.",
    confidence: 87,
    techName: "Dinesh Babu", techVendor: "Chennai Road Rescue", techVendorType: "COCO",
    techVehicle: "TN-09-CR-4481", techEtaMin: 0,
    initialPhase: "onsite", initialTab: "tracking",
    slaTarget: 60, slaDisplay: "14:30",
    completionService: "Flatbed towing — escalated from flat tyre",
    completionNote: "Technician attempted tyre swap but found cracked wheel hub. Flatbed dispatched and now on-site. Vehicle being loaded for transport to Maruti Service, Koyambedu. Exception logged — service type changed mid-case.",
  },
};

type BidStatus = "idle" | "notified" | "viewing" | "accepted";
type VendorFilter = "all" | "COCO" | "ASP";

const technicians: {
  id: string;
  name: string;
  vendor: string;
  vendorType: "COCO" | "ASP";
  distanceKm: number;
  etaMin: number;
  rating: number;
  jobs: number;
  availColor: "green" | "amber" | "grey" | "red";
  busyUntil?: string;
  recommended?: boolean;
  bidDelayMs?: number;
}[] = [
  { id: "T-101", name: "Ramesh Patil",  vendor: "Mahalaxmi Towing",  vendorType: "COCO", distanceKm: 1.8, etaMin: 9,  rating: 4.9, jobs: 0, availColor: "green", recommended: true, bidDelayMs: 7000 },
  { id: "T-102", name: "Imran Sheikh",  vendor: "BKC Auto Rescue",   vendorType: "COCO", distanceKm: 2.4, etaMin: 12, rating: 4.7, jobs: 0, availColor: "green", bidDelayMs: 18000 },
  { id: "T-104", name: "Anil Yadav",    vendor: "Western Roadside",  vendorType: "ASP",  distanceKm: 4.2, etaMin: 19, rating: 4.8, jobs: 0, availColor: "green", bidDelayMs: 28000 },
  { id: "T-103", name: "Suresh Kumar",  vendor: "Mumbai Quick Tow",  vendorType: "ASP",  distanceKm: 3.1, etaMin: 16, rating: 4.6, jobs: 1, availColor: "amber", busyUntil: "~11:05 AM" },
  { id: "T-105", name: "Vijay Singh",   vendor: "City Tow 24x7",     vendorType: "COCO", distanceKm: 5.8, etaMin: 28, rating: 4.3, jobs: 0, availColor: "grey" },
];

const BID_TIMER_DURATION = 45;
const NOTIFIED_IDS = ["T-101", "T-102", "T-104"];

// ── Route animation helpers ──────────────────────────────────────────────────
// Waypoints follow the SVG road grid (roads at x=150,400,650 and y=100,280,430)
const ROUTE_WP = [
  { x: 120, y: 460 },  // origin
  { x: 150, y: 460 },
  { x: 150, y: 280 },  // north on left road
  { x: 400, y: 280 },  // east on main road
  { x: 400, y: 200 },  // north toward destination
  { x: 640, y: 200 },  // customer
];
const ROUTE_SEGS = ROUTE_WP.slice(1).map((p, i) =>
  Math.hypot(p.x - ROUTE_WP[i].x, p.y - ROUTE_WP[i].y)
);
const ROUTE_TOTAL = ROUTE_SEGS.reduce((a, b) => a + b, 0); // 780 units
const ROUTE_CUM = ROUTE_SEGS.reduce<number[]>(
  (acc, l) => { acc.push(acc[acc.length - 1] + l); return acc; }, [0]
);

function wpPos(progress: number): { x: number; y: number } {
  const dist = Math.min(Math.max(progress, 0), 1) * ROUTE_TOTAL;
  for (let i = 0; i < ROUTE_WP.length - 1; i++) {
    if (dist <= ROUTE_CUM[i + 1]) {
      const span = ROUTE_CUM[i + 1] - ROUTE_CUM[i];
      const t = span > 0 ? (dist - ROUTE_CUM[i]) / span : 0;
      return {
        x: ROUTE_WP[i].x + (ROUTE_WP[i + 1].x - ROUTE_WP[i].x) * t,
        y: ROUTE_WP[i].y + (ROUTE_WP[i + 1].y - ROUTE_WP[i].y) * t,
      };
    }
  }
  return { ...ROUTE_WP[ROUTE_WP.length - 1] };
}

function wpPath(progress: number, done: boolean): string {
  const dist = Math.min(Math.max(progress, 0), 1) * ROUTE_TOTAL;
  const pos = wpPos(progress);
  if (done) {
    const pts = [ROUTE_WP[0]];
    for (let i = 1; i < ROUTE_WP.length; i++) {
      if (ROUTE_CUM[i] < dist) pts.push(ROUTE_WP[i]); else break;
    }
    if (progress > 0.001) pts.push(pos);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  } else {
    const pts: { x: number; y: number }[] = [pos];
    for (let i = 1; i < ROUTE_WP.length; i++) {
      if (ROUTE_CUM[i] > dist) pts.push(ROUTE_WP[i]);
    }
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  }
}

function parseSlaSeconds(display: string): number | null {
  const m = display.match(/^(\d+):(\d+)$/);
  if (!m) return null;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

function CaseDetail() {
  const { caseId } = Route.useParams();
  const caseData = caseDataMap[caseId] ?? caseDataMap["SR-2026-08421"];

  const [phase, setPhase] = useState<Phase>(caseData.initialPhase);
  const [tab, setTab] = useState<Tab>(caseData.initialTab);

  // Live SLA countdown
  const [slaSeconds, setSlaSeconds] = useState<number | null>(() => parseSlaSeconds(caseData.slaDisplay));
  useEffect(() => {
    if (slaSeconds === null || slaSeconds <= 0) return;
    const id = setInterval(() => setSlaSeconds((s) => (s !== null ? Math.max(0, s - 1) : null)), 1000);
    return () => clearInterval(id);
  }, [slaSeconds]);
  const liveSlaDisplay =
    slaSeconds === null ? caseData.slaDisplay
    : slaSeconds === 0 ? "BREACHED"
    : `${String(Math.floor(slaSeconds / 60)).padStart(2, "0")}:${String(slaSeconds % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (phase === "tracking") {
      const t = setTimeout(() => setPhase("delayed"), 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const phaseMeta = getPhaseMeta(phase, caseData);
  const isBreached = phase === "breached";
  const isCompleted = phase === "completed";
  const isCompleting = phase === "completing";

  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/service-requests" search={{ queue: "all" }} className="hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Service Requests
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono text-foreground">{caseId}</span>
        </div>

        {/* Case header */}
        <div className={`rounded-xl border bg-card shadow-[var(--shadow-card)] p-6 mb-6 ${
          isBreached ? "border-destructive/40" : isCompleted ? "border-success/30" : "border-border"
        }`}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight">
                  {caseData.customer} · {caseData.vehicle.split(" ").slice(0, 2).join(" ")}
                </h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${phaseMeta.statusClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${phaseMeta.dotClass} ${!isCompleted ? "animate-pulse" : ""}`} />
                  {phaseMeta.statusLabel}
                </span>
                {caseData.membership === "Platinum" && (
                  <span className="text-[10px] uppercase tracking-wide bg-warning-soft text-warning-foreground rounded px-1.5 py-0.5 font-medium">
                    Platinum VIP
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                <span className="font-mono">{caseId}</span> · {caseData.createdAt} via {caseData.channel} · {caseData.city}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 justify-end">
                  <Timer className="h-3 w-3" /> {isCompleted ? "Resolved" : "SLA Remaining"}
                </div>
                <div className={`text-2xl font-mono font-semibold tabular-nums ${
                  isBreached || liveSlaDisplay === "BREACHED" ? "text-destructive"
                  : isCompleted ? "text-success"
                  : phase === "delayed" ? "text-warning-foreground"
                  : "text-success"
                }`}>
                  {phase === caseData.initialPhase ? liveSlaDisplay : phaseMeta.slaTimer}
                </div>
              </div>
              {!isCompleted && (
                <DemoStepper phase={phase} setPhase={setPhase} setTab={setTab} />
              )}
              {isCompleted && (
                <button
                  onClick={() => { setPhase("triage"); setTab("overview"); }}
                  className="rounded-lg border border-border bg-card text-sm font-medium px-4 py-2.5 text-muted-foreground hover:bg-muted"
                >
                  Restart Demo
                </button>
              )}
            </div>
          </div>

          <JourneyBar phase={phase} />

          {/* Tabs */}
          {!isCompleted && (
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
                      active ? "text-primary"
                      : enabled ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    {t}
                    {active && <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        {isCompleted ? (
          <CompletedView caseId={caseId} caseData={caseData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {tab === "overview" && <OverviewTab phase={phase} caseData={caseData} setPhase={setPhase} />}
              {tab === "assignment" && <AssignmentTab phase={phase} caseData={caseData} onAssign={() => setPhase("assigned")} />}
              {tab === "tracking" && <TrackingTab phase={phase} caseData={caseData} slaSeconds={slaSeconds} />}
              {tab === "communication" && <CommunicationTab phase={phase} caseData={caseData} />}
            </div>
            <ActivityTimeline phase={phase} caseData={caseData} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

/* ── helpers ── */

function getPhaseMeta(phase: Phase, caseData: CaseData) {
  switch (phase) {
    case "triage":
      return { statusLabel: "Awaiting Assignment", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: caseData.slaDisplay };
    case "assigning":
      return { statusLabel: "Broadcasting to vendors", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: "43:50" };
    case "assigned":
      return { statusLabel: "Assigned · Journey Pending", statusClass: "bg-warning-soft text-warning-foreground", dotClass: "bg-warning", slaTimer: "42:10" };
    case "tracking":
      return { statusLabel: "En Route", statusClass: "bg-primary-soft text-accent-foreground", dotClass: "bg-primary", slaTimer: "38:14" };
    case "delayed":
      return { statusLabel: "En Route · Delayed", statusClass: "bg-warning-soft text-warning-foreground", dotClass: "bg-warning", slaTimer: "29:42" };
    case "onsite":
      return { statusLabel: "On-site", statusClass: "bg-success-soft text-success", dotClass: "bg-success", slaTimer: "24:18" };
    case "completing":
      return { statusLabel: "Completing Service", statusClass: "bg-success-soft text-success", dotClass: "bg-success", slaTimer: "21:05" };
    case "completed":
      return { statusLabel: "Resolved", statusClass: "bg-success-soft text-success", dotClass: "bg-success", slaTimer: "—" };
    case "breached":
      return { statusLabel: "SLA Breached · Escalation", statusClass: "bg-destructive/10 text-destructive", dotClass: "bg-destructive", slaTimer: caseData.slaDisplay };
  }
}

function isTabEnabled(tab: Tab, phase: Phase) {
  if (tab === "overview" || tab === "assignment") return true;
  if (tab === "tracking" || tab === "communication") {
    return phase !== "triage" && phase !== "assigning" && phase !== "completing";
  }
  return true;
}

function DemoStepper({ phase, setPhase, setTab }: {
  phase: Phase;
  setPhase: (p: Phase) => void;
  setTab: (t: Tab) => void;
}) {
  const next = () => {
    if (phase === "triage") { setPhase("assigning"); setTab("assignment"); }
    else if (phase === "assigning") { setPhase("assigned"); setTab("assignment"); }
    else if (phase === "assigned") { setPhase("tracking"); setTab("tracking"); }
    else if (phase === "tracking" || phase === "delayed") { setPhase("onsite"); setTab("tracking"); }
    else if (phase === "onsite") { setPhase("completing"); setTab("overview"); }
    else if (phase === "completing") { setPhase("completed"); }
    else if (phase === "breached") { setPhase("assigning"); setTab("assignment"); }
  };

  const label =
    phase === "triage" ? "Assign Technician"
    : phase === "assigning" ? "Tech Accepted"
    : phase === "assigned" ? "Start Tracking"
    : phase === "tracking" || phase === "delayed" ? "Mark On-site"
    : phase === "onsite" ? "Complete Service"
    : phase === "completing" ? "Close Case"
    : phase === "breached" ? "Escalate & Reassign"
    : "Restart Demo";

  const btnClass =
    phase === "breached"
      ? "bg-destructive text-white hover:opacity-90"
      : phase === "completing"
      ? "bg-success text-white hover:opacity-90"
      : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <button
      onClick={next}
      className={`rounded-lg text-sm font-medium px-4 py-2.5 inline-flex items-center gap-2 ${btnClass}`}
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
    { key: "completed", label: "Completed" },
  ] as const;

  const phaseToStepIdx = (p: Phase): number => {
    if (p === "triage") return 0;
    if (p === "assigning") return 1;
    if (p === "assigned") return 2;
    if (p === "tracking" || p === "delayed" || p === "breached") return 3;
    if (p === "onsite" || p === "completing") return 4;
    if (p === "completed") return 5;
    return 0;
  };

  const currentIdx = phaseToStepIdx(phase);

  return (
    <div className="mt-6 flex items-center">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        const isBreachedStep = phase === "breached" && i === 3;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                isBreachedStep ? "bg-destructive text-white ring-4 ring-destructive/15"
                : done ? "bg-success text-success-foreground"
                : current ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                : "bg-muted text-muted-foreground"
              }`}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[11px] ${current || isBreachedStep ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 ${i < currentIdx ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── OVERVIEW ── */

function OverviewTab({ phase, caseData, setPhase }: { phase: Phase; caseData: CaseData; setPhase: (p: Phase) => void }) {
  return (
    <>
      {/* Wrap-up panel (completing phase) */}
      {phase === "completing" && <WrapUpPanel caseData={caseData} onClose={() => setPhase("completed")} />}

      {/* Exception banner */}
      {caseData.triage.includes("Exception") || caseData.triageDetail.includes("Exception") ? (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-orange-700">Exception Flagged</div>
            <p className="text-xs text-orange-600 mt-0.5">{caseData.triageDetail}</p>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" /> Customer
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <Field label="Name" value={caseData.customer} />
          <Field label="Phone" value={caseData.phone} />
          <Field label="Membership" value={`${caseData.membership} · Active`} />
          <Field label="Past cases" value={caseData.pastCases} />
          <Field label="Vehicle" value={caseData.vehicle} />
          <Field label="Reg No." value={caseData.vehicleReg} mono />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" /> Breakdown details
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Reported issue</div>
            <p className="leading-relaxed">"{caseData.issueDetail}"</p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Location</div>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <span>{caseData.location}</span>
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
            <div className="text-sm font-medium">{caseData.triage}</div>
            <div className="text-xs text-muted-foreground">{caseData.triageDetail}</div>
          </div>
          <div className="text-lg font-semibold">{caseData.confidence}%</div>
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

/* ── WRAP-UP PANEL (completing phase) ── */

function WrapUpPanel({ caseData, onClose }: { caseData: CaseData; onClose: () => void }) {
  const [notes, setNotes] = useState(caseData.completionNote);
  const checklist = [
    "Service performed successfully",
    "Customer present and verified",
    "Billing / payment captured",
    "Vehicle condition documented",
  ];
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <h3 className="text-sm font-semibold text-amber-700">Service Done — Wrap Up to Close Case</h3>
      </div>
      <div className="mb-4">
        <div className="text-xs text-amber-600/80 mb-2 font-medium uppercase tracking-wide">Service performed</div>
        <div className="text-sm font-medium">{caseData.completionService}</div>
      </div>
      <div className="mb-4 space-y-2">
        <div className="text-xs text-amber-600/80 mb-2 font-medium uppercase tracking-wide">Checklist</div>
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
            {item}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="text-xs text-amber-600/80 mb-2 font-medium uppercase tracking-wide">Technician notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder:text-muted-foreground shadow-sm"
          placeholder="Add technician notes before closing…"
        />
      </div>
      <button
        onClick={onClose}
        className="w-full rounded-lg bg-amber-500 text-white text-sm font-medium py-2.5 flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
      >
        <CheckCircle2 className="h-4 w-4" /> Close Case
      </button>
    </div>
  );
}

/* ── COMPLETED VIEW (full-page replacement) ── */

function CompletedView({ caseId, caseData }: { caseId: string; caseData: CaseData }) {
  const slaBreached = caseData.slaDisplay.includes("BREACHED");
  const totalTime =
    caseData.initialPhase === "completed" ? "32m 18s"
    : slaBreached ? `${caseData.slaTarget + parseInt(caseData.slaDisplay.replace("BREACHED +", ""))}m total`
    : "38m 42s";

  const timeline = [
    { time: caseData.createdAt, label: `${caseData.channel} request received from ${caseData.customer}` },
    { time: "+2 min", label: `Auto-triaged: ${caseData.triage.split(" · ")[0]}` },
    { time: "+4 min", label: `${caseData.techName} assigned (${caseData.techVendor})` },
    { time: "+6 min", label: "Driver journey started" },
    ...(caseData.techEtaMin > 0 ? [{ time: `+${caseData.techEtaMin} min`, label: "Arrived on-site" }] : [{ time: "+12 min", label: "Arrived on-site" }]),
    { time: totalTime, label: "Case closed ✓" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Resolution banner */}
        <div className={`rounded-xl border p-6 ${slaBreached ? "border-destructive/40 bg-destructive/5" : "border-success/40 bg-success-soft"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${slaBreached ? "bg-destructive/15" : "bg-success/20"}`}>
              <CheckCircle2 className={`h-6 w-6 ${slaBreached ? "text-destructive" : "text-success"}`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${slaBreached ? "text-destructive" : "text-success"}`}>
                Case Closed · {slaBreached ? "SLA Breached" : "SLA Met"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {caseId} · {caseData.customer} · {caseData.city}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-card border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total time</div>
              <div className="font-mono text-sm font-semibold">{totalTime}</div>
            </div>
            <div className="rounded-lg bg-card border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">SLA target</div>
              <div className="font-mono text-sm font-semibold">{caseData.slaTarget} min</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${slaBreached ? "bg-destructive/10 border border-destructive/20" : "bg-success-soft border border-success/20"}`}>
              <div className="text-xs text-muted-foreground mb-1">Result</div>
              <div className={`text-sm font-semibold ${slaBreached ? "text-destructive" : "text-success"}`}>
                {slaBreached ? "Breached" : "Within SLA"}
              </div>
            </div>
          </div>
        </div>

        {/* Resolution timeline */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold mb-4">Case timeline</h3>
          <ol className="space-y-3">
            {timeline.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {i < timeline.length - 1 && <div className="w-px h-5 bg-success/30 mt-1" />}
                </div>
                <div className="flex-1 -mt-0.5 flex items-center justify-between">
                  <span className="text-sm">{e.label}</span>
                  <span className="text-xs text-muted-foreground font-mono">{e.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Completion notes */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold mb-3">Service notes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">"{caseData.completionNote}"</p>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Resolved by <span className="font-medium text-foreground">{caseData.techName}</span> · {caseData.techVendor}
              <span className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                caseData.techVendorType === "COCO" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>{caseData.techVendorType}</span>
            </div>
            <div className="text-xs text-muted-foreground">Customer satisfaction: ★★★★★ Pending</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold mb-3">Case summary</h3>
          <div className="space-y-2.5 text-sm">
            <Field label="Customer" value={caseData.customer} />
            <Field label="Vehicle" value={caseData.vehicleReg} mono />
            <Field label="Issue" value={caseData.triage.split(" · ")[0]} />
            <Field label="City" value={caseData.city} />
            <Field label="Channel" value={caseData.channel} />
          </div>
        </div>
        <Link
          to="/service-requests"
          search={{ queue: "all" }}
          className="block rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] hover:border-primary/40 transition-colors"
        >
          <div className="text-sm font-semibold flex items-center justify-between">
            Back to Queue
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">View all open service requests.</p>
        </Link>
      </div>
    </div>
  );
}

/* ── ASSIGNMENT ── */

function AssignmentTab({ phase, caseData, onAssign }: { phase: Phase; caseData: CaseData; onAssign: () => void }) {
  const isAlreadyAssigned = phase === "assigned" || phase === "tracking" || phase === "delayed" || phase === "onsite" || phase === "completing" || phase === "breached";

  const [assignMode, setAssignMode] = useState<"auto" | "manual">("auto");
  const [vendorFilter, setVendorFilter] = useState<VendorFilter>("all");
  const [timerSeconds, setTimerSeconds] = useState(BID_TIMER_DURATION);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [bidStatuses, setBidStatuses] = useState<Record<string, BidStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localAssignedId, setLocalAssignedId] = useState<string | null>(null);
  const bidTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const filteredTechs = technicians.filter((t) =>
    vendorFilter === "all" ? true : t.vendorType === vendorFilter
  );

  const acceptedTechs = technicians.filter((t) => bidStatuses[t.id] === "accepted");
  const finalAssignedId = isAlreadyAssigned ? technicians.find((t) => t.recommended)?.id ?? null : localAssignedId;

  // bid countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) { setTimerRunning(false); setTimerExpired(true); return; }
    const id = setInterval(() => {
      setTimerSeconds((s) => { if (s <= 1) { setTimerRunning(false); setTimerExpired(true); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  function startBid() {
    bidTimeouts.current.forEach(clearTimeout);
    bidTimeouts.current = [];
    setTimerSeconds(BID_TIMER_DURATION);
    setTimerExpired(false);
    setTimerRunning(true);
    setBidStatuses({});

    NOTIFIED_IDS.forEach((id) => {
      const tech = technicians.find((t) => t.id === id)!;
      setBidStatuses((prev) => ({ ...prev, [id]: "notified" }));
      const t1 = setTimeout(() => setBidStatuses((prev) => ({ ...prev, [id]: "viewing" })), 2000);
      if (tech.bidDelayMs !== undefined && tech.bidDelayMs < BID_TIMER_DURATION * 1000) {
        const t2 = setTimeout(() => setBidStatuses((prev) => ({ ...prev, [id]: "accepted" })), tech.bidDelayMs);
        bidTimeouts.current.push(t2);
      }
      bidTimeouts.current.push(t1);
    });
  }

  function resetBid() {
    bidTimeouts.current.forEach(clearTimeout);
    bidTimeouts.current = [];
    setTimerSeconds(BID_TIMER_DURATION);
    setTimerRunning(false);
    setTimerExpired(false);
    setBidStatuses({});
    setSelectedId(null);
    setLocalAssignedId(null);
  }

  function acceptBid(techId: string) {
    setLocalAssignedId(techId);
    setTimerRunning(false);
    bidTimeouts.current.forEach(clearTimeout);
    onAssign();
  }

  const timerColor = timerSeconds > 20 ? "bg-primary" : timerSeconds > 10 ? "bg-amber-500" : "bg-destructive";
  const progress = ((BID_TIMER_DURATION - timerSeconds) / BID_TIMER_DURATION) * 100;
  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const ss = String(timerSeconds % 60).padStart(2, "0");

  return (
    <>
      {/* Already assigned banner */}
      {isAlreadyAssigned && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-success">{caseData.techName} assigned</div>
            <div className="text-xs text-success/80">
              {caseData.techVendor} · {caseData.techVehicle} · ETA {caseData.techEtaMin > 0 ? `${caseData.techEtaMin} min` : "Arrived"}
              <span className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                caseData.techVendorType === "COCO" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>{caseData.techVendorType}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode switcher + bid/manual panel — only when not yet assigned */}
      {!isAlreadyAssigned && (
        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          {/* Mode toggle */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
            <div className="flex rounded-lg border border-border bg-muted p-1 text-sm">
              <button
                onClick={() => { setAssignMode("auto"); resetBid(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                  assignMode === "auto" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Zap className="h-3.5 w-3.5" /> Auto-Bidding
              </button>
              <button
                onClick={() => { setAssignMode("manual"); resetBid(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                  assignMode === "manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Hand className="h-3.5 w-3.5" /> Manual
              </button>
            </div>
            {(timerRunning || timerExpired) && !localAssignedId && (
              <button onClick={resetBid} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Auto-bid panel */}
          {assignMode === "auto" && (
            <div className="p-5 border-b border-border bg-primary-soft/40 space-y-4">
              <div className="flex items-center gap-2">
                <Radio className={`h-4 w-4 text-primary ${timerRunning ? "animate-pulse" : ""}`} />
                <span className="text-sm font-semibold text-accent-foreground">
                  {timerRunning ? "Broadcast Active" : timerExpired ? "Bid Expired" : "Auto-Bidding"}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{NOTIFIED_IDS.length} vendors notified</span>
              </div>

              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{timerExpired ? "Time expired" : "Time remaining"}</span>
                  <span className={`text-3xl font-mono font-semibold tabular-nums ${
                    timerExpired ? "text-destructive" : timerSeconds <= 10 ? "text-destructive" : timerSeconds <= 20 ? "text-amber-500" : ""
                  }`}>{mm}:{ss}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerRunning || timerExpired ? progress : 0}%` }} />
                </div>

                {!timerRunning && !timerExpired && (
                  <button onClick={startBid} className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2 flex items-center justify-center gap-2 hover:opacity-90">
                    <Zap className="h-4 w-4" /> Start Auto-Bidding
                  </button>
                )}
                {timerExpired && acceptedTechs.length === 0 && (
                  <button onClick={startBid} className="w-full rounded-lg border border-border bg-background text-sm font-medium py-2 flex items-center justify-center gap-2 hover:bg-muted">
                    <RefreshCw className="h-3.5 w-3.5" /> Re-broadcast
                  </button>
                )}
              </div>

              {/* Live bid status */}
              {(timerRunning || timerExpired) && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Live Bids</p>
                  {NOTIFIED_IDS.map((id) => {
                    const tech = technicians.find((t) => t.id === id)!;
                    const status = bidStatuses[id] ?? "notified";
                    return (
                      <div key={id} className={`flex items-center gap-3 rounded-lg border p-2.5 ${status === "accepted" ? "border-success/40 bg-success/10" : "border-border bg-card"}`}>
                        <BidIcon status={status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{tech.name}</p>
                          <p className="text-[10px] text-muted-foreground">{bidStatusLabel(status)} · {tech.etaMin} min ETA</p>
                        </div>
                        {status === "accepted" && (
                          <button onClick={() => acceptBid(id)} className="text-[11px] font-semibold bg-success text-white rounded-md px-2.5 py-1 hover:opacity-90 shrink-0">
                            Accept
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {timerExpired && acceptedTechs[0] && !localAssignedId && (
                <button onClick={() => acceptBid(acceptedTechs[0].id)} className="w-full rounded-lg bg-success text-white text-sm font-medium py-2 flex items-center justify-center gap-2 hover:opacity-90">
                  <CheckCircle2 className="h-4 w-4" /> Confirm {acceptedTechs[0].name}
                </button>
              )}
            </div>
          )}

          {/* Manual panel */}
          {assignMode === "manual" && (
            <div className="p-5 border-b border-border space-y-3">
              <p className="text-xs text-muted-foreground">Select a technician from the list below, then confirm assignment.</p>
              {selectedId ? (
                <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{technicians.find((t) => t.id === selectedId)?.name}</p>
                    <p className="text-xs text-muted-foreground">{technicians.find((t) => t.id === selectedId)?.vendor}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)}><XCircle className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No technician selected — click a row below</p>
              )}
              <button
                disabled={!selectedId}
                onClick={() => { if (selectedId) acceptBid(selectedId); }}
                className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                Assign Technician
              </button>
            </div>
          )}
        </div>
      )}

      {/* Technician list */}
      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold">Nearby technicians</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredTechs.length} within 6 km{vendorFilter !== "all" ? ` · ${vendorFilter} only` : " · COCO preferred"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
            {(["all", "COCO", "ASP"] as VendorFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setVendorFilter(f)}
                className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                  vendorFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-2 border-b border-border bg-surface flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground">Availability:</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Available</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Busy</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Not logged in</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Flagged</span>
        </div>

        <div className="divide-y divide-border">
          {filteredTechs.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">No technicians match the filter.</p>
          ) : filteredTechs.map((t) => {
            const borderColor =
              finalAssignedId === t.id ? "border-l-success"
              : selectedId === t.id ? "border-l-primary"
              : t.availColor === "green" ? "border-l-success"
              : t.availColor === "amber" ? "border-l-warning"
              : t.availColor === "grey" ? "border-l-muted-foreground/30"
              : "border-l-destructive";
            const dotColor =
              t.availColor === "green" ? "bg-success"
              : t.availColor === "amber" ? "bg-warning"
              : t.availColor === "grey" ? "bg-muted-foreground/40"
              : "bg-destructive";
            const isDisabled = t.availColor === "grey" || t.availColor === "red";
            const bidStatus = bidStatuses[t.id] ?? "idle";
            const isAssigned = finalAssignedId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => { if (!isDisabled && !isAlreadyAssigned && assignMode === "manual") setSelectedId(t.id); }}
                className={`flex items-center gap-3 px-5 py-3.5 border-l-2 ${borderColor} transition-colors ${
                  isAssigned ? "bg-success/10"
                  : selectedId === t.id ? "bg-primary-soft/50"
                  : t.recommended && !isAlreadyAssigned ? "bg-primary-soft/30"
                  : ""
                } ${isDisabled ? "opacity-60" : ""} ${
                  !isDisabled && !isAlreadyAssigned && assignMode === "manual" ? "cursor-pointer hover:bg-muted/40" : "hover:bg-muted/20"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${dotColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium">{t.name}</span>
                    {t.recommended && (
                      <span className="text-[10px] font-medium uppercase tracking-wide bg-primary text-primary-foreground rounded px-1.5 py-0.5">Best match</span>
                    )}
                    {isAssigned && (
                      <span className="text-[10px] font-medium bg-success text-white rounded px-1.5 py-0.5">Assigned</span>
                    )}
                    {bidStatus === "accepted" && !isAssigned && (
                      <span className="text-[10px] font-medium bg-success/20 text-success rounded px-1.5 py-0.5">Bid Accepted</span>
                    )}
                    {bidStatus === "viewing" && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary rounded px-1.5 py-0.5 flex items-center gap-1">
                        <Eye className="h-2.5 w-2.5" /> Viewing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-muted-foreground truncate">{t.vendor}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      t.vendorType === "COCO" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>{t.vendorType}</span>
                  </div>
                  {t.busyUntil && <div className="text-[10px] text-warning-foreground mt-0.5">Free {t.busyUntil}</div>}
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.distanceKm} km</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.etaMin} min</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {t.rating}</span>
                </div>
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  {isAssigned ? (
                    <span className="text-xs font-medium text-success flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Assigned</span>
                  ) : isAlreadyAssigned ? (
                    <span className="text-xs text-muted-foreground">{t.recommended ? "Was recommended" : "—"}</span>
                  ) : isDisabled ? (
                    <span className="text-xs font-medium rounded-md px-3 py-1.5 bg-muted text-muted-foreground cursor-not-allowed">Unavailable</span>
                  ) : assignMode === "manual" ? (
                    <button
                      onClick={() => setSelectedId(t.id)}
                      className={`text-xs font-medium rounded-md px-3 py-1.5 transition-colors ${
                        selectedId === t.id ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {selectedId === t.id ? "Selected" : "Select"}
                    </button>
                  ) : bidStatus === "accepted" ? (
                    <button onClick={() => acceptBid(t.id)} className="text-xs font-semibold rounded-md px-3 py-1.5 bg-success text-white hover:opacity-90">
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
          })}
        </div>
      </div>
    </>
  );
}

function BidIcon({ status }: { status: BidStatus }) {
  if (status === "accepted") return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
  if (status === "viewing") return <Eye className="h-4 w-4 text-primary shrink-0 animate-pulse" />;
  return <span className="h-2 w-2 rounded-full bg-muted-foreground/40 mx-1 shrink-0" />;
}

function bidStatusLabel(status: BidStatus) {
  if (status === "accepted") return "Accepted";
  if (status === "viewing") return "Viewing now";
  return "Notified";
}

/* ── TRACKING ── */

function TrackingTab({ phase, caseData, slaSeconds }: {
  phase: Phase;
  caseData: CaseData;
  slaSeconds: number | null;
}) {
  const isOnsite = phase === "onsite" || phase === "completing";
  const isDelayed = phase === "delayed";
  const isBreached = phase === "breached";

  const speedKmhBase = isOnsite ? 0 : isBreached ? 3 : isDelayed ? 6 : 22;

  const initProgress = isOnsite ? 1.0 : isBreached ? 0.42 : isDelayed ? 0.38 : phase === "tracking" ? 0.28 : 0.04;
  const initEtaSec   = isOnsite ? 0 : (isDelayed || isBreached) ? 9 * 60 : 4 * 60;
  const initDistKm   = isOnsite ? 0 : (isDelayed || isBreached) ? 0.35 : 0.42;

  const [driverProgress, setDriverProgress] = useState(initProgress);
  const [etaSec, setEtaSec] = useState(initEtaSec);
  const [distKm, setDistKm] = useState(initDistKm);
  const [displaySpeed, setDisplaySpeed] = useState(speedKmhBase);

  // 10× real-time for visual demo
  const visualProgressPerSec = isOnsite ? 0 : isBreached ? 0.009 : isDelayed ? 0.011 : 0.029;

  // Synchronized: ETA and distance reach 0 exactly when driverProgress reaches 1
  const remainingProg = Math.max(0.001, 1 - initProgress);
  const etaDecPerSec  = isOnsite ? 0 : (initEtaSec  * visualProgressPerSec) / remainingProg;
  const distDecPerSec = isOnsite ? 0 : (initDistKm  * visualProgressPerSec) / remainingProg;

  useEffect(() => {
    if (isOnsite) return;
    const id = setInterval(() => {
      setDriverProgress(p => Math.min(1, p + visualProgressPerSec));
      setEtaSec(e => Math.max(0, e - etaDecPerSec));
      setDistKm(d => Math.max(0, d - distDecPerSec));
    }, 1000);
    return () => clearInterval(id);
  }, [isOnsite, visualProgressPerSec, etaDecPerSec, distDecPerSec]);

  // subtle speed jitter for realism
  useEffect(() => {
    if (isOnsite || speedKmhBase === 0) return;
    const id = setInterval(() => {
      setDisplaySpeed(Math.round(Math.max(1, speedKmhBase + (Math.random() - 0.5) * (isDelayed ? 4 : 8))));
    }, 2500);
    return () => clearInterval(id);
  }, [isOnsite, speedKmhBase, isDelayed]);

  const arrived = driverProgress >= 1 || isOnsite;

  const etaDisplay = arrived ? "Arrived"
    : etaSec < 60 ? "<1 min"
    : `${Math.ceil(etaSec / 60)} min`;

  const distDisplay = arrived ? "0 m"
    : distKm < 0.1 ? `${Math.round(distKm * 1000)} m`
    : `${distKm.toFixed(2)} km`;

  const slaDisplay = slaSeconds === null ? "—"
    : slaSeconds === 0 ? "BREACHED"
    : `${String(Math.floor(slaSeconds / 60)).padStart(2, "0")}:${String(slaSeconds % 60).padStart(2, "0")}`;

  const slaTone: "success" | "warning" | "destructive" | "muted" =
    (isBreached || slaSeconds === 0) ? "destructive"
    : (slaSeconds !== null && slaSeconds < 300) ? "destructive"
    : (slaSeconds !== null && slaSeconds < 600) ? "warning"
    : "success";

  const mapLabel = arrived ? "On location"
    : isBreached ? "SLA exceeded"
    : isDelayed ? `${etaDisplay} · delayed`
    : `${etaDisplay} · ${distDisplay}`;

  const stages = [
    { label: "Assigned",             time: "10:42", done: true,   alert: false },
    { label: "Journey Started",      time: "10:44", done: true,   alert: false },
    { label: isDelayed || isBreached ? `Delayed — ${caseData.city} traffic` : "En Route", time: "10:51", done: true, alert: isDelayed || isBreached },
    { label: "Arrived",              time: arrived ? "10:58 AM" : "—", done: arrived, alert: false },
    { label: "Service In Progress",  time: "—",     done: false,  alert: false },
    { label: "Completed",            time: "—",     done: false,  alert: false },
  ];

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
        <MapPanel
          driverProgress={driverProgress}
          isDelayed={isDelayed}
          isBreached={isBreached}
          isOnsite={arrived}
          mapLabel={mapLabel}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox icon={<Navigation className="h-3.5 w-3.5" />} label="ETA" value={arrived ? "Arrived" : isBreached ? "Delayed" : etaDisplay} tone={isBreached ? "destructive" : isDelayed ? "warning" : "primary"} />
        <StatBox icon={<MapPin className="h-3.5 w-3.5" />} label="Distance" value={distDisplay} tone="muted" />
        <StatBox icon={<Timer className="h-3.5 w-3.5" />} label="SLA Timer" value={slaDisplay} tone={slaTone} />
        <StatBox icon={<Car className="h-3.5 w-3.5" />} label="Avg Speed" value={arrived ? "0 km/h" : `${displaySpeed} km/h`} tone="muted" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4">Journey status</h3>
        <ol className="space-y-3">
          {stages.map((s, i) => (
            <li key={s.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {s.done ? (
                  <CheckCircle2 className={`h-4 w-4 ${s.alert ? (isBreached ? "text-destructive" : "text-warning") : "text-success"}`} />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
                {i < stages.length - 1 && (
                  <div className={`w-px h-5 mt-1 ${s.done ? (s.alert ? (isBreached ? "bg-destructive/40" : "bg-warning/40") : "bg-success/40") : "bg-border"}`} />
                )}
              </div>
              <div className="flex-1 -mt-0.5 flex items-center justify-between">
                <span className={`text-sm ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.time}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {isDelayed && !arrived && (
        <div className="rounded-xl border border-warning/40 bg-warning-soft p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-warning-foreground">SLA risk · driver delayed</div>
            <p className="text-xs text-warning-foreground/80 mt-0.5">
              {caseData.techName} moving slowly in {caseData.city} traffic. ETA {etaDisplay} — SLA at risk.
            </p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs font-medium rounded-md bg-warning text-warning-foreground px-3 py-1.5">Escalate to backup</button>
              <button className="text-xs font-medium rounded-md border border-warning/40 bg-card px-3 py-1.5">Notify customer</button>
            </div>
          </div>
        </div>
      )}

      {isBreached && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-destructive">SLA Breached — Escalation Required</div>
            <p className="text-xs text-destructive/80 mt-0.5">
              This case has exceeded the {caseData.slaTarget}-minute SLA. {caseData.slaDisplay.replace("BREACHED ", "")} over limit.
              Technician {caseData.techName} is still en route. Immediate action needed.
            </p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs font-medium rounded-md bg-destructive text-white px-3 py-1.5">Escalate to TL</button>
              <button className="text-xs font-medium rounded-md border border-destructive/40 bg-card px-3 py-1.5 text-destructive">Reassign Tech</button>
              <button className="text-xs font-medium rounded-md border border-border bg-card px-3 py-1.5 text-muted-foreground">Notify Customer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── MAP ── */

function MapPanel({ driverProgress, isDelayed, isBreached, isOnsite, mapLabel }: {
  driverProgress: number;
  isDelayed: boolean;
  isBreached: boolean;
  isOnsite: boolean;
  mapLabel: string;
}) {
  const pos = wpPos(driverProgress);
  const completedPath = wpPath(driverProgress, true);
  const remainingPath = driverProgress < 1 && !isOnsite ? wpPath(driverProgress, false) : null;

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
        {/* Roads */}
        <path d="M0 280 L800 280" stroke="white" strokeWidth="22" />
        <path d="M400 0 L400 480" stroke="white" strokeWidth="22" />
        <path d="M150 0 L150 480" stroke="white" strokeWidth="14" />
        <path d="M650 0 L650 480" stroke="white" strokeWidth="14" />
        <path d="M0 100 L800 100" stroke="white" strokeWidth="14" />
        <path d="M0 430 L800 430" stroke="white" strokeWidth="14" />
        {/* Completed route */}
        <path
          d={completedPath}
          stroke="oklch(0.58 0.17 252)"
          strokeWidth="4" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Remaining route (dashed) */}
        {remainingPath && (
          <path
            d={remainingPath}
            stroke="oklch(0.58 0.17 252)"
            strokeWidth="4" strokeDasharray="8 6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
          />
        )}
        {/* Destination (customer) */}
        <g transform="translate(640,200)">
          <circle r="22" fill="oklch(0.58 0.17 252 / 0.18)" />
          <circle r="10" fill="oklch(0.58 0.17 252)" stroke="white" strokeWidth="3" />
        </g>
        {/* Driver */}
        <g transform={`translate(${pos.x.toFixed(1)},${pos.y.toFixed(1)})`}>
          <circle r="20"
            fill={isBreached ? "oklch(0.96 0.05 30)" : isDelayed ? "oklch(0.97 0.05 85)" : "white"}
            stroke={isBreached ? "oklch(0.63 0.22 25)" : isDelayed ? "oklch(0.78 0.15 75)" : "oklch(0.58 0.17 252)"}
            strokeWidth="2"
          />
          <text x="0" y="6" textAnchor="middle" fontSize="16">🛻</text>
        </g>
        {/* Origin */}
        <g transform="translate(120,460)">
          <circle r="6" fill="oklch(0.62 0.16 155)" stroke="white" strokeWidth="2" />
        </g>
      </svg>

      {/* ETA overlay */}
      <div className="absolute top-4 left-4 rounded-lg bg-card shadow-[var(--shadow-pop)] border border-border px-3 py-2 text-xs">
        <div className="text-muted-foreground">{isOnsite ? "Status" : "ETA"}</div>
        <div className={`font-semibold text-sm ${isBreached ? "text-destructive" : isDelayed ? "text-warning-foreground" : ""}`}>
          {mapLabel}
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
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot, boxShadow: ring ? `0 0 0 3px ${dot}33` : undefined }} />
      {label}
    </div>
  );
}

function StatBox({ icon, label, value, tone }: {
  icon: React.ReactNode; label: string; value: string;
  tone: "primary" | "success" | "warning" | "muted" | "destructive";
}) {
  const t =
    tone === "primary" ? "bg-primary-soft text-accent-foreground"
    : tone === "success" ? "bg-success-soft text-success"
    : tone === "warning" ? "bg-warning-soft text-warning-foreground"
    : tone === "destructive" ? "bg-destructive/10 text-destructive"
    : "bg-card border border-border";
  return (
    <div className={`rounded-xl p-3 ${t}`}>
      <div className="text-[11px] opacity-80 flex items-center gap-1">{icon}{label}</div>
      <div className="text-lg font-semibold font-mono mt-1">{value}</div>
    </div>
  );
}

/* ── COMMUNICATION ── */

type Msg = { from: "driver" | "dispatcher"; text: string; time: string; read?: boolean; alert?: boolean };

function CommunicationTab({ phase, caseData }: { phase: Phase; caseData: CaseData }) {
  const techInitials = caseData.techName.split(" ").map((n) => n[0]).join("");

  const base: Msg[] = [
    { from: "dispatcher", text: `Hi ${caseData.techName.split(" ")[0]}, case assigned. Customer ${caseData.customer} at ${caseData.location.split(",")[0]}, ${caseData.city}.`, time: "10:42", read: true },
    { from: "driver", text: "Got it. On my way now.", time: "10:44" },
    { from: "driver", text: `Heading via main route. ETA ${caseData.techEtaMin > 0 ? caseData.techEtaMin : 12} min.`, time: "10:47" },
  ];
  const delayedMsgs: Msg[] = [
    { from: "driver", text: `Heavy traffic in ${caseData.city}, ETA +5 mins.`, time: "10:49", alert: true },
    { from: "dispatcher", text: "Acknowledged. I'll inform the customer.", time: "10:49", read: true },
  ];
  const onsiteMsgs: Msg[] = [
    { from: "driver", text: `Reached ${caseData.customer}'s location 📍`, time: "10:58" },
  ];
  const completingMsgs: Msg[] = [
    { from: "driver", text: "Service complete. Getting customer confirmation.", time: "11:14" },
    { from: "dispatcher", text: "Great work. Close case once customer confirms.", time: "11:14", read: true },
  ];
  const breachedMsgs: Msg[] = [
    { from: "driver", text: "Sorry, delayed due to traffic jam. Almost there.", time: "10:52", alert: true },
    { from: "dispatcher", text: "Understood. SLA has been flagged. Please arrive ASAP.", time: "10:53", read: true },
  ];

  const msgs: Msg[] = [
    ...base,
    ...(phase === "delayed" || phase === "onsite" || phase === "completing" ? delayedMsgs : []),
    ...(phase === "onsite" || phase === "completing" ? onsiteMsgs : []),
    ...(phase === "completing" ? completingMsgs : []),
    ...(phase === "breached" ? breachedMsgs : []),
  ];

  const quickReplies = phase === "completing" || phase === "onsite"
    ? ["Confirm completion", "Close case", "Customer satisfied?", "Upload proof"]
    : ["Share live ETA", "Customer informed", "Need backup?", "Confirm drop-off"];

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden flex flex-col h-[640px]">
      <header className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
            {techInitials}
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              {caseData.techName}
              <span className="text-[10px] font-medium uppercase tracking-wide bg-success-soft text-success rounded px-1.5 py-0.5">On Job</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${caseData.techVendorType === "COCO" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                {caseData.techVendorType}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{caseData.techVendor} · synced with WhatsApp</div>
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
          {quickReplies.map((q) => (
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
            placeholder={`Message ${caseData.techName.split(" ")[0]}…`}
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
        isDispatcher ? "bg-primary text-primary-foreground rounded-br-sm"
        : m.alert ? "bg-warning-soft text-warning-foreground border border-warning/30 rounded-bl-sm"
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

/* ── ACTIVITY TIMELINE ── */

function ActivityTimeline({ phase, caseData }: { phase: Phase; caseData: CaseData }) {
  const events: { time: string; label: string; tone: "primary" | "success" | "warning" | "destructive" }[] = [
    { time: caseData.createdAt.replace(" AM", ""), label: `${caseData.channel} request from ${caseData.customer}`, tone: "primary" },
    { time: "+1 min", label: "Location & vehicle verified", tone: "primary" },
    { time: "+2 min", label: `Auto-triaged: ${caseData.triage.split(" · ")[0]} (${caseData.confidence}%)`, tone: "primary" },
    { time: "+2 min", label: "SR created · awaiting assignment", tone: "success" },
  ];

  if (phase !== "triage") {
    events.push({ time: "+3 min", label: "Auto-bid broadcast to vendors", tone: "primary" });
  }
  if (["assigned", "tracking", "delayed", "onsite", "completing", "breached"].includes(phase)) {
    events.push({ time: "+4 min", label: `${caseData.techName} accepted job`, tone: "success" });
  }
  if (["tracking", "delayed", "onsite", "completing", "breached"].includes(phase)) {
    events.push({ time: "+6 min", label: "Driver journey started", tone: "primary" });
  }
  if (phase === "delayed") {
    events.push({ time: "+11 min", label: "SLA risk · traffic delay flagged", tone: "warning" });
  }
  if (phase === "breached") {
    events.push({ time: "+11 min", label: "Delay reported — SLA breached", tone: "destructive" });
    events.push({ time: "Now", label: "Escalation required", tone: "destructive" });
  }
  if (phase === "onsite" || phase === "completing") {
    events.push({ time: `+${caseData.techEtaMin > 0 ? caseData.techEtaMin + 8 : 20} min`, label: "Technician arrived on-site", tone: "success" });
  }
  if (phase === "completing") {
    events.push({ time: "+38 min", label: "Service completed — wrapping up", tone: "success" });
  }

  const slaUsed =
    phase === "completing" ? 78
    : phase === "onsite" ? 62
    : phase === "delayed" ? 44
    : phase === "tracking" ? 30
    : phase === "breached" ? 115
    : 12;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-4">Activity timeline</h3>
        <ol className="space-y-3">
          {[...events].reverse().map((e, i) => {
            const dot =
              e.tone === "success" ? "bg-success"
              : e.tone === "warning" ? "bg-warning"
              : e.tone === "destructive" ? "bg-destructive"
              : "bg-primary";
            return (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  {i < events.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="text-sm">{e.label}</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{e.time}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-semibold mb-3">SLA</h3>
        <div className="text-xs text-muted-foreground mb-2">Target: {caseData.slaTarget} min · {caseData.triage.split(" · ")[0]}</div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
          <div
            className={`h-full rounded-full ${phase === "breached" ? "bg-destructive" : phase === "delayed" ? "bg-warning" : "bg-success"}`}
            style={{ width: `${Math.min(slaUsed, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Elapsed</span>
          <span className={`font-mono font-medium ${phase === "breached" ? "text-destructive" : ""}`}>
            {phase === "completing" ? "38m 42s" : phase === "onsite" ? "20m 42s" : phase === "delayed" ? "15m 18s" : phase === "tracking" ? "6m 46s" : phase === "breached" ? `${caseData.slaTarget + 8}m+` : "4m 28s"}
          </span>
        </div>
      </div>
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
