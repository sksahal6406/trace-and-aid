import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Phone, Paperclip, Send, CheckCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Communication · RoadAssist" },
      { name: "description", content: "Live chat between dispatcher and driver." },
    ],
  }),
  component: Communication,
});

type Msg = {
  from: "driver" | "dispatcher";
  text: string;
  time: string;
  read?: boolean;
  alert?: boolean;
};

const conversations = [
  { id: "T-101", name: "Ramesh Patil", sr: "SR-2026-08421", last: "Reached customer location", time: "10:51", unread: 0, active: true },
  { id: "T-104", name: "Anil Yadav", sr: "SR-2026-08418", last: "Heavy traffic, ETA +10 mins", time: "10:47", unread: 2 },
  { id: "T-208", name: "Deepak Joshi", sr: "SR-2026-08415", last: "Need towing support", time: "10:39", unread: 1 },
  { id: "T-115", name: "Karan Mehta", sr: "SR-2026-08410", last: "Customer not answering", time: "10:22", unread: 0, alert: true },
  { id: "T-077", name: "Vivek Nair", sr: "SR-2026-08404", last: "Job completed, sending invoice", time: "10:05", unread: 0 },
];

const msgs: Msg[] = [
  { from: "dispatcher", text: "Hi Ramesh, SR-2026-08421 assigned. Customer Priya at BKC, Hyundai Creta.", time: "10:42", read: true },
  { from: "driver", text: "Got it. Leaving Mahalaxmi now.", time: "10:44" },
  { from: "driver", text: "On Western Express Hwy. Traffic moderate.", time: "10:47" },
  { from: "dispatcher", text: "Customer informed. SLA 38 min remaining.", time: "10:48", read: true },
  { from: "driver", text: "Heavy traffic at Bandra flyover, ETA +5 mins.", time: "10:49", alert: true },
  { from: "driver", text: "Reached customer location 📍", time: "10:51" },
];

const quickReplies = [
  "Customer informed",
  "Share live ETA",
  "Confirm drop-off location",
  "Need backup?",
];

function Communication() {
  return (
    <AppLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <PageHeader
          title="Communication"
          description="Direct chat with field technicians · synced with WhatsApp"
        />

        <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[640px]">
          {/* Conversation list */}
          <aside className="border-r border-border bg-surface overflow-y-auto">
            <div className="p-4 border-b border-border">
              <input
                placeholder="Search drivers…"
                className="w-full h-9 rounded-lg border border-input bg-card px-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <ul>
              {conversations.map((c) => (
                <li
                  key={c.id}
                  className={`px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/50 ${
                    c.active ? "bg-primary-soft/60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{c.sr}</div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${c.alert ? "text-destructive" : "text-muted-foreground"}`}>
                          {c.last}
                        </p>
                        {c.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat panel */}
          <section className="flex flex-col min-w-0">
            <header className="h-16 px-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
                  RP
                </div>
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    Ramesh Patil
                    <span className="text-[10px] font-medium uppercase tracking-wide bg-success-soft text-success rounded px-1.5 py-0.5">
                      On Job
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">SR-2026-08421 · 0.6 km from customer</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="h-9 px-3 rounded-lg border border-border text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> View on map
                </button>
                <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-surface">
              <DateDivider label="Today" />
              {msgs.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>

            <div className="border-t border-border bg-card p-3">
              <div className="flex gap-1.5 mb-2 overflow-x-auto">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    className="text-xs rounded-full border border-border bg-background px-3 py-1.5 whitespace-nowrap hover:bg-muted"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="h-10 w-10 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  placeholder="Message Ramesh…"
                  className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
                <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                  Send <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isDispatcher = m.from === "dispatcher";
  return (
    <div className={`flex ${isDispatcher ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
        isDispatcher
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : m.alert
          ? "bg-warning-soft text-warning-foreground border border-warning/30 rounded-bl-sm"
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

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}