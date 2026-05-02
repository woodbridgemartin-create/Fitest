import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

type DashMode = "business" | "gym";
type Period   = "7d" | "30d" | "all";

type LiveResult = {
  clientId: string;
  entryId?: string;
  score: number;
  tier: string;
  auditType: string;
  email?: string;
  department?: string;
  wantsSupport?: boolean;
  timestamp: string;
};

/* ─── Colour system ──────────────────────────────────── */
const TIER = {
  Critical:   { bar: "bg-red-500",     text: "text-red-400",     dim: "bg-red-500/10",     border: "border-red-500/20",   hex: "#ef4444" },
  Exposed:    { bar: "bg-amber-500",   text: "text-amber-400",   dim: "bg-amber-500/10",   border: "border-amber-500/20", hex: "#f59e0b" },
  Performing: { bar: "bg-primary",     text: "text-primary",     dim: "bg-primary/10",     border: "border-primary/20",   hex: "#abff1a" },
  Elite:      { bar: "bg-emerald-500", text: "text-emerald-400", dim: "bg-emerald-500/10", border: "border-emerald-500/20", hex: "#10b981" },
} as const;
type TierName = keyof typeof TIER;

/* ─── Submission types ───────────────────────────────── */
type BizSub = { id: number; score: number; tier: TierName; department: string; date: Date };
type GymSub = { id: number; score: number; tier: TierName; label: string; date: Date };

/* ─── Seeded random ──────────────────────────────────── */
function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ─── Reference "now" for demo data ─────────────────── */
const NOW = new Date("2026-05-02T17:00:00");

/* ─── Business submissions ───────────────────────────── */
const BIZ_SUBS: BizSub[] = (() => {
  const depts = ["Sales", "Operations", "Marketing", "HR", "Finance", "Tech"];
  const plan: [TierName, number, number, number][] = [
    ["Critical",    5,  30, 14],
    ["Exposed",    31,  50, 27],
    ["Performing", 51,  75, 68],
    ["Elite",      76,  98, 39],
  ];
  const out: BizSub[] = [];
  let k = 1, id = 0;
  for (const [tier, lo, hi, cnt] of plan) {
    for (let i = 0; i < cnt; i++) {
      const score = Math.round(lo + sr(k++) * (hi - lo));
      const daysAgo = Math.floor(sr(k++) * 29);
      const hours   = Math.floor(sr(k++) * 9 + 8);
      const mins    = Math.floor(sr(k++) * 60);
      const dept    = depts[Math.floor(sr(k++) * depts.length)];
      const date    = new Date(NOW);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(hours, mins, 0, 0);
      out.push({ id: id++, score, tier, department: dept, date });
    }
  }
  return out.sort((a, b) => b.date.getTime() - a.date.getTime());
})();

/* ─── Gym submissions ────────────────────────────────── */
const GYM_SUBS: GymSub[] = (() => {
  const plan: [TierName, number, number, number][] = [
    ["Critical",    5,  30, 18],
    ["Exposed",    31,  50, 42],
    ["Performing", 51,  75, 88],
    ["Elite",      76,  98, 41],
  ];
  const out: GymSub[] = [];
  let k = 300, id = 0;
  for (const [tier, lo, hi, cnt] of plan) {
    for (let i = 0; i < cnt; i++) {
      const score   = Math.round(lo + sr(k++) * (hi - lo));
      const daysAgo = Math.floor(sr(k++) * 29);
      const hours   = Math.floor(sr(k++) * 12 + 6);
      const mins    = Math.floor(sr(k++) * 60);
      const date    = new Date(NOW);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(hours, mins, 0, 0);
      id++;
      out.push({ id: id - 1, score, tier, label: `Entry ${id}`, date });
    }
  }
  return out.sort((a, b) => b.date.getTime() - a.date.getTime());
})();

/* ─── Gym support requests (static mock) ─────────────── */
const GYM_SUPPORT = [
  { entryId: "ENT-A1B2C3", email: "member@example.com",    score: 19, tier: "Critical" as TierName, date: "30 Apr" },
  { entryId: "ENT-D4E5F6", email: "athlete@gym.co.uk",     score: 22, tier: "Critical" as TierName, date: "30 Apr" },
  { entryId: "ENT-G7H8I9", email: "user3@mailbox.com",     score: 24, tier: "Critical" as TierName, date: "29 Apr" },
  { entryId: "ENT-J1K2L3", email: "member4@training.com",  score: 31, tier: "Exposed"  as TierName, date: "28 Apr" },
  { entryId: "ENT-M4N5O6", email: "client5@gym.co.uk",     score: 28, tier: "Exposed"  as TierName, date: "27 Apr" },
  { entryId: "ENT-P7Q8R9", email: "user6@example.com",     score: 33, tier: "Exposed"  as TierName, date: "26 Apr" },
  { entryId: "ENT-S1T2U3", email: "member7@fitness.co.uk", score: 21, tier: "Critical" as TierName, date: "25 Apr" },
];

/* ─── Utilities ──────────────────────────────────────── */
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function fmtShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function deriveTiers(subs: { tier: TierName }[], total: number) {
  const counts: Record<TierName, number> = { Critical: 0, Exposed: 0, Performing: 0, Elite: 0 };
  subs.forEach(s => counts[s.tier]++);
  return (["Critical","Exposed","Performing","Elite"] as TierName[]).map(tier => ({
    tier, count: counts[tier], pct: total > 0 ? Math.round((counts[tier] / total) * 100) : 0,
  }));
}

/* ─── Animated counter ───────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const mv      = useMotionValue(0);
  const spring  = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);
  useEffect(() => { mv.set(target); }, [target, mv]);
  return <motion.span>{display}</motion.span>;
}

/* ─── Stat tile ──────────────────────────────────────── */
function StatTile({ label, value, suffix = "", accent = false, sub, delay }: {
  label: string; value: number; suffix?: string; accent?: boolean; sub?: string; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className={`rounded-2xl border p-6 h-full flex flex-col justify-between ${
        accent ? "bg-primary/10 border-primary/30" : "bg-card border-card-border"
      }`}>
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">{label}</p>
        <div>
          <p className={`text-4xl font-black tracking-tight leading-none mb-1 ${accent ? "text-primary" : ""}`}>
            <AnimatedNumber target={value} suffix={suffix} />
          </p>
          {sub && <p className="text-xs text-muted-foreground/60 mt-1">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tier bar row ───────────────────────────────────── */
function TierRow({ tier, count, pct, delay }: { tier: TierName; count: number; pct: number; delay: number }) {
  const c = TIER[tier];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3"
    >
      <div className={`w-2.5 h-2.5 rounded-full ${c.bar} shrink-0`} />
      <span className={`w-24 text-xs font-bold ${c.text} shrink-0`}>{tier}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${c.bar}`}
        />
      </div>
      <div className="flex items-center gap-2 shrink-0 w-28 justify-end">
        <span className="text-xs font-semibold tabular-nums">{count}</span>
        <span className="text-xs text-muted-foreground/50 tabular-nums">({pct}%)</span>
      </div>
    </motion.div>
  );
}

/* ─── Donut ring ─────────────────────────────────────── */
function DonutRing({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 120);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/40" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

/* ─── Risk indicator ─────────────────────────────────── */
function RiskIndicator({ tiers, total, mode = "business" }: {
  tiers: { tier: TierName; count: number; pct: number }[];
  total: number;
  mode?: "business" | "gym";
}) {
  const atRisk     = tiers.filter(t => t.tier === "Critical" || t.tier === "Exposed").reduce((s, t) => s + t.count, 0);
  const pct        = total > 0 ? Math.round((atRisk / total) * 100) : 0;
  const level      = pct >= 40 ? "High" : pct >= 20 ? "Moderate" : "Low";
  const levelColor = pct >= 40 ? "text-red-400" : pct >= 20 ? "text-amber-400" : "text-emerald-400";
  const borderColor= pct >= 40 ? "border-red-500/30" : pct >= 20 ? "border-amber-500/30" : "border-emerald-500/30";
  const bgColor    = pct >= 40 ? "bg-red-500/5" : pct >= 20 ? "bg-amber-500/5" : "bg-emerald-500/5";
  const ringColor  = pct >= 40 ? "#ef4444" : pct >= 20 ? "#f59e0b" : "#10b981";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className={`rounded-2xl border ${borderColor} ${bgColor} p-6 mb-6`}
    >
      <div className="flex items-start gap-6">
        <div className="relative shrink-0">
          <DonutRing pct={pct} color={ringColor} size={88} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-black ${levelColor}`}>{pct}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Performance Risk Indicator</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${borderColor} ${levelColor}`}>{level} Risk</span>
          </div>
          <h3 className={`text-2xl font-black mb-1 ${levelColor}`}>
            {atRisk} {atRisk === 1 ? "person" : "people"} at risk
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            <span className={`font-bold ${levelColor}`}>{pct}%</span> of your {mode === "gym" ? "gym members" : "workforce"} sits in the{" "}
            <span className="text-red-400 font-semibold">Critical</span> or{" "}
            <span className="text-amber-400 font-semibold">Exposed</span> tiers. These individuals are at elevated risk of
            performance deterioration, absence or burnout without structured intervention.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">
                Critical: <span className="font-bold text-red-400">{tiers.find(t => t.tier === "Critical")?.count ?? 0}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">
                Exposed: <span className="font-bold text-amber-400">{tiers.find(t => t.tier === "Exposed")?.count ?? 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Trend chart (SVG) ──────────────────────────────── */
function TrendChart({ subs }: { subs: { score: number; date: Date }[] }) {
  const days = useMemo(() => {
    const map = new Map<string, number[]>();
    subs.forEach(s => {
      const key = s.date.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s.score);
    });
    return Array.from(map.entries())
      .map(([ds, scores]) => ({
        ds,
        date: new Date(ds + "T12:00:00"),
        avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        count: scores.length,
      }))
      .sort((a, b) => a.ds.localeCompare(b.ds));
  }, [subs]);

  if (days.length < 2) {
    return <p className="text-xs text-muted-foreground/40 text-center py-6">Not enough data for this period.</p>;
  }

  const W = 600, H = 80, PX = 8, PY = 6;
  const avgs   = days.map(d => d.avg);
  const minA   = Math.max(0,   Math.min(...avgs) - 8);
  const maxA   = Math.min(100, Math.max(...avgs) + 8);
  const toX    = (i: number) => PX + (i / (days.length - 1)) * (W - PX * 2);
  const toY    = (v: number) => H - PY - ((v - minA) / (maxA - minA)) * (H - PY * 2);
  const line   = days.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d.avg).toFixed(1)}`).join(" ");
  const area   = `${line} L ${toX(days.length - 1).toFixed(1)} ${H} L ${toX(0).toFixed(1)} ${H} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tcfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#abff1a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#abff1a" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tcfill)" />
        <path d={line} fill="none" stroke="#abff1a" strokeWidth="1.8" strokeLinejoin="round" />
        {days.map((d, i) => (
          <circle key={i} cx={toX(i)} cy={toY(d.avg)} r="3" fill="#abff1a" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground/40 mt-1 px-0.5">
        <span>{fmtShort(days[0].date)}</span>
        <span className="text-muted-foreground/30">Daily avg score</span>
        <span>{fmtShort(days[days.length - 1].date)}</span>
      </div>
    </div>
  );
}

/* ─── Recent activity ────────────────────────────────── */
function RecentActivity({ bizSubs, gymSubs, mode }: {
  bizSubs: BizSub[]; gymSubs: GymSub[]; mode: DashMode;
}) {
  const recent = (mode === "business" ? bizSubs : gymSubs).slice(0, 10);

  if (mode === "business") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        className="bg-card border border-card-border rounded-2xl p-6 mt-6"
      >
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">
          Recent Activity <span className="text-muted-foreground/40 normal-case font-normal tracking-normal">· last 10 submissions</span>
        </p>
        <div className="hidden md:grid grid-cols-[90px_1fr_110px_130px_90px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
          <span className="text-xs text-muted-foreground/40 font-semibold">Entry ID</span>
          <span className="text-xs text-muted-foreground/40 font-semibold">Department</span>
          <span className="text-xs text-muted-foreground/40 font-semibold">Score / Tier</span>
          <span className="text-xs text-muted-foreground/40 font-semibold">Date</span>
          <span className="text-xs text-muted-foreground/40 font-semibold text-right">Time</span>
        </div>
        <div className="space-y-0.5">
          {(recent as BizSub[]).map((s, i) => {
            const c = TIER[s.tier];
            const entryId = `ENT-${String(s.id + 1).padStart(4, "0")}`;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.04, duration: 0.3 }}
                className="grid grid-cols-[90px_1fr_auto] md:grid-cols-[90px_1fr_110px_130px_90px] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <span className="text-xs font-mono text-muted-foreground/50">{entryId}</span>
                <span className="text-sm font-medium truncate">{s.department}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${c.dim} border ${c.border} flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-black ${c.text}`}>{s.score}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border} hidden md:inline-flex w-fit`}>
                    {s.tier}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground/60 hidden md:block tabular-nums">{fmtDate(s.date)}</span>
                <span className="text-xs text-muted-foreground/40 text-right hidden md:block tabular-nums">{fmtTime(s.date)}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Gym mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38, duration: 0.4 }}
      className="bg-card border border-card-border rounded-2xl p-6 mt-6"
    >
      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">
        Recent Activity <span className="text-muted-foreground/40 normal-case font-normal tracking-normal">— last 10 submissions</span>
      </p>
      <div className="hidden md:grid grid-cols-[40px_1fr_110px_130px_90px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
        <span className="text-xs text-muted-foreground/40 font-semibold">Score</span>
        <span className="text-xs text-muted-foreground/40 font-semibold">Entry</span>
        <span className="text-xs text-muted-foreground/40 font-semibold">Tier</span>
        <span className="text-xs text-muted-foreground/40 font-semibold">Date</span>
        <span className="text-xs text-muted-foreground/40 font-semibold text-right">Time</span>
      </div>
      <div className="space-y-0.5">
        {(recent as GymSub[]).map((s, i) => {
          const c = TIER[s.tier];
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42 + i * 0.04, duration: 0.3 }}
              className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_110px_130px_90px] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${c.dim} border ${c.border} flex items-center justify-center`}>
                <span className={`text-xs font-black ${c.text}`}>{s.score}</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground/60 tabular-nums">{s.label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border} hidden md:inline-flex w-fit`}>
                {s.tier}
              </span>
              <span className="text-xs text-muted-foreground/60 hidden md:block tabular-nums">{fmtDate(s.date)}</span>
              <span className="text-xs text-muted-foreground/40 text-right hidden md:block tabular-nums">{fmtTime(s.date)}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Period filter button ───────────────────────────── */
function PeriodBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
        active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function Dashboard() {
  const [, navigate]  = useLocation();
  const [userEmail, setUserEmail]   = useState("");
  const [orgName, setOrgName]       = useState("Your Organisation");
  const [mode, setMode]             = useState<DashMode>("business");
  const [period, setPeriod]         = useState<Period>("30d");
  const [clientId, setClientId]     = useState("");
  const [liveResults, setLiveResults] = useState<LiveResult[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const auditLink = clientId ? `https://fitest.co.uk/?client=${clientId}` : "";

  function handleCopyLink() {
    if (!auditLink) return;
    navigator.clipboard.writeText(auditLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get("demo");
    const raw  = localStorage.getItem("fitest_auth");
    if (!raw && demo !== "1") { navigate("/login"); return; }
    if (raw && raw !== "true") {
      try {
        const { email } = JSON.parse(raw);
        if (email) setUserEmail(email);
        else if (demo !== "1") { navigate("/login"); return; }
      } catch { if (demo !== "1") { navigate("/login"); return; } }
    }
    const orgRaw = localStorage.getItem("fitest_org");
    if (orgRaw) {
      try {
        const org = JSON.parse(orgRaw);
        if (org.name) setOrgName(org.name);
        if (org.type) setMode(org.type as DashMode);
        if (org.clientId) {
          setClientId(org.clientId);
          try {
            const all: LiveResult[] = JSON.parse(localStorage.getItem("fitest_results") || "[]");
            setLiveResults(all.filter(r => r.clientId === org.clientId));
          } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
    }
  }, [navigate]);

  /* ── Period cutoff ───────────────────────────────────── */
  const cutoff = useMemo(() => {
    if (period === "7d")  { const d = new Date(NOW); d.setDate(d.getDate() - 7);  return d; }
    if (period === "30d") { const d = new Date(NOW); d.setDate(d.getDate() - 30); return d; }
    return new Date(0);
  }, [period]);

  /* ── Filtered submissions ────────────────────────────── */
  const filteredBiz = useMemo(() => BIZ_SUBS.filter(s => s.date >= cutoff), [cutoff]);
  const filteredGym = useMemo(() => GYM_SUBS.filter(s => s.date >= cutoff), [cutoff]);

  /* ── Derived tier data ───────────────────────────────── */
  const bizTiers = useMemo(() => deriveTiers(filteredBiz, filteredBiz.length), [filteredBiz]);
  const gymTiers = useMemo(() => deriveTiers(filteredGym, filteredGym.length), [filteredGym]);

  /* ── Derived averages ────────────────────────────────── */
  const bizAvg = useMemo(() =>
    filteredBiz.length ? Math.round(filteredBiz.reduce((s, x) => s + x.score, 0) / filteredBiz.length) : 0,
  [filteredBiz]);
  const gymAvg = useMemo(() =>
    filteredGym.length ? Math.round(filteredGym.reduce((s, x) => s + x.score, 0) / filteredGym.length) : 0,
  [filteredGym]);

  /* ── Derived department breakdown ────────────────────── */
  const bizDepts = useMemo(() => {
    const map: Record<string, { scores: number[]; tiers: TierName[] }> = {};
    filteredBiz.forEach(s => {
      if (!map[s.department]) map[s.department] = { scores: [], tiers: [] };
      map[s.department].scores.push(s.score);
      map[s.department].tiers.push(s.tier);
    });
    return Object.entries(map).map(([name, d]) => {
      const avg = Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length);
      const tc: Record<TierName, number> = { Critical: 0, Exposed: 0, Performing: 0, Elite: 0 };
      d.tiers.forEach(t => tc[t]++);
      const topTier = (Object.entries(tc) as [TierName, number][]).sort((a, b) => b[1] - a[1])[0][0];
      return { name, avg, submissions: d.scores.length, topTier };
    }).sort((a, b) => b.submissions - a.submissions);
  }, [filteredBiz]);

  /* ── Performing + Elite count ────────────────────────── */
  const bizGoodCount = useMemo(() =>
    filteredBiz.filter(s => s.tier === "Performing" || s.tier === "Elite").length,
  [filteredBiz]);
  const gymGoodCount = useMemo(() =>
    filteredGym.filter(s => s.tier === "Performing" || s.tier === "Elite").length,
  [filteredGym]);

  function handleSignOut() {
    localStorage.removeItem("fitest_auth");
    navigate("/login");
  }

  const periodLabel = period === "7d" ? "Last 7 days" : period === "30d" ? "Last 30 days" : "All time";

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top bar ────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl gap-4">
          <Link href="/">
            <span className="text-lg font-black tracking-tight cursor-pointer select-none shrink-0">
              <span className="text-primary">F</span>ITEST
            </span>
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold truncate hidden sm:block">{orgName}</span>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Licence Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {userEmail && <span className="text-xs text-muted-foreground hidden md:block">{userEmail}</span>}
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs border-border hover:border-primary/40 h-8">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* ── Page heading ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">Performance Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">{orgName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "business" ? "Workforce performance overview" : "Member performance overview"}
              <span className="text-muted-foreground/40 mx-2">·</span>
              <span className="text-muted-foreground/60">{periodLabel}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            {/* Period filter */}
            <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1">
              <PeriodBtn label="7d"  active={period === "7d"}  onClick={() => setPeriod("7d")}  />
              <PeriodBtn label="30d" active={period === "30d"} onClick={() => setPeriod("30d")} />
              <PeriodBtn label="All" active={period === "all"} onClick={() => setPeriod("all")} />
            </div>
            {/* Mode toggle */}
            <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1">
              {(["business","gym"] as DashMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                    mode === m ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "business" ? "Business" : "Gym"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Audit link banner ────────────────────────── */}
        {auditLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-card border border-primary/20 rounded-2xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mb-0.5">Your Audit Link</p>
                <p className="text-xs text-muted-foreground">Share this with your {mode === "gym" ? "members" : "team"}</p>
              </div>
            </div>
            <div className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-2 font-mono text-xs text-muted-foreground truncate">
              {auditLink}
            </div>
            <button
              onClick={handleCopyLink}
              className={`shrink-0 h-8 px-4 rounded-xl text-xs font-bold border transition-all duration-200 ${
                linkCopied
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              }`}
            >
              {linkCopied ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied
                </span>
              ) : "Copy Link"}
            </button>
          </motion.div>
        )}

        {/* ── Views ────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ━━━ BUSINESS ━━━ */}
          {mode === "business" && (
            <motion.div key="biz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              <RiskIndicator tiers={bizTiers} total={filteredBiz.length} />

              {/* Stat tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatTile label="Total Submissions"  value={filteredBiz.length}  delay={0.05} sub={`${periodLabel}`} />
                <StatTile label="Average Score"       value={bizAvg}              delay={0.10} sub="out of 100" />
                <StatTile label="Performing & Elite"  value={bizGoodCount}        delay={0.15} sub={`${filteredBiz.length > 0 ? Math.round((bizGoodCount / filteredBiz.length) * 100) : 0}% of workforce`} accent />
                <StatTile label="Departments Active"  value={bizDepts.length}     delay={0.20} sub="tracked this period" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Tier distribution */}
                <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Tier Distribution</p>
                    <div className="space-y-5 mb-5">
                      {bizTiers.map((t, i) => <TierRow key={t.tier} {...t} delay={0.28 + i * 0.06} />)}
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-6">
                      {bizTiers.map(t => (
                        <motion.div
                          key={t.tier}
                          initial={{ flex: 0 }} animate={{ flex: t.pct }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className={`${TIER[t.tier].bar} rounded-full`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-3">Based on {filteredBiz.length} submissions</p>
                  </div>
                </motion.div>

                {/* Department breakdown */}
                <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.4 }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Department Breakdown</p>
                    <div className="space-y-1">
                      {bizDepts.map((dept, i) => {
                        const c = TIER[dept.topTier as TierName];
                        return (
                          <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
                            className="grid grid-cols-[110px_1fr_80px_80px] items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-2 h-2 rounded-full ${c.bar} shrink-0`} />
                              <span className="text-sm font-semibold truncate">{dept.name}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }} animate={{ width: `${dept.avg}%` }}
                                transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                                className={`h-full rounded-full ${c.bar} opacity-70`}
                              />
                            </div>
                            <span className="text-sm font-black tabular-nums text-right">{dept.avg}</span>
                            <div className="flex items-center justify-end">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border}`}>
                                {dept.topTier}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-3 px-3">Average score shown per department</p>
                  </div>
                </motion.div>
              </div>

              {/* Performance trend */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.4 }}
                className="bg-card border border-card-border rounded-2xl p-6 mt-6"
              >
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Performance Trend</p>
                <TrendChart subs={filteredBiz} />
              </motion.div>

              {/* Recent activity */}
              <RecentActivity bizSubs={filteredBiz} gymSubs={filteredGym} mode="business" />

            </motion.div>
          )}

          {/* ━━━ GYM ━━━ */}
          {mode === "gym" && (
            <motion.div key="gym" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              <RiskIndicator tiers={gymTiers} total={filteredGym.length} mode="gym" />

              {/* Stat tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatTile label="Total Members"    value={213}              delay={0.05} sub="registered on platform" />
                <StatTile label="Audits Completed" value={filteredGym.length} delay={0.10} sub={`${periodLabel}`} />
                <StatTile label="Average Score"    value={gymAvg}           delay={0.15} sub="out of 100" />
                <StatTile label="Support Requests" value={GYM_SUPPORT.length} delay={0.20} sub="pending action" accent />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Tier breakdown */}
                <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Member Tiers</p>
                    <div className="space-y-5 mb-5">
                      {gymTiers.map((t, i) => <TierRow key={t.tier} {...t} delay={0.28 + i * 0.06} />)}
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-6">
                      {gymTiers.map(t => (
                        <motion.div
                          key={t.tier}
                          initial={{ flex: 0 }} animate={{ flex: t.pct }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className={`${TIER[t.tier].bar} rounded-full`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-3">{filteredGym.length} audits this period</p>
                  </div>
                </motion.div>

                {/* Support requests */}
                <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.4 }}>
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Support Requests</p>
                      <span className="text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-0.5">
                        {GYM_SUPPORT.length} pending
                      </span>
                    </div>
                    {/* Column headers */}
                    <div className="hidden md:grid grid-cols-[40px_1fr_90px_70px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
                      <span className="text-xs text-muted-foreground/40 font-semibold">Score</span>
                      <span className="text-xs text-muted-foreground/40 font-semibold">Email</span>
                      <span className="text-xs text-muted-foreground/40 font-semibold">Tier</span>
                      <span className="text-xs text-muted-foreground/40 font-semibold text-right">Date</span>
                    </div>
                    <div className="space-y-0.5">
                      {GYM_SUPPORT.map((m, i) => {
                        const c = TIER[m.tier];
                        return (
                          <motion.div
                            key={m.entryId}
                            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                            className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_90px_70px] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors group"
                          >
                            <div className={`w-9 h-9 rounded-xl ${c.dim} border ${c.border} flex items-center justify-center shrink-0`}>
                              <span className={`text-xs font-black ${c.text}`}>{m.score}</span>
                            </div>
                            <span className="text-sm text-muted-foreground/80 truncate font-mono text-xs">{m.email}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border} hidden md:inline-flex w-fit`}>
                              {m.tier}
                            </span>
                            <span className="text-xs text-muted-foreground/40 text-right">{m.date}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent activity */}
              <RecentActivity bizSubs={filteredBiz} gymSubs={filteredGym} mode="gym" />

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Live Submissions ──────────────────────────── */}
        {clientId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-card border border-card-border rounded-2xl p-6 mt-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  Live Submissions
                  <span className="text-muted-foreground/40 normal-case font-normal tracking-normal ml-2">· via your audit link</span>
                </p>
              </div>
              {liveResults.length > 0 && (
                <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
                  {liveResults.length} {liveResults.length === 1 ? "result" : "results"}
                </span>
              )}
            </div>

            {liveResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                  <svg className="w-5 h-5 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">No submissions yet</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Share your audit link above to start collecting results</p>
                </div>
              </div>
            ) : (() => {
              const bizLive   = liveResults.filter(r => r.auditType === "business");
              const gymAnon   = liveResults.filter(r => r.auditType === "gym" && !r.wantsSupport);
              const gymSupport = liveResults.filter(r => r.auditType === "gym" && r.wantsSupport);

              function LiveRow({ r, i }: { r: LiveResult; i: number }) {
                const c  = TIER[r.tier as TierName] ?? TIER.Performing;
                const dt = new Date(r.timestamp);
                return (
                  <motion.div
                    key={r.entryId ?? i}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.52 + i * 0.04, duration: 0.3 }}
                    className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[80px_1fr_110px_160px] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs font-mono text-muted-foreground/50">{r.entryId ?? "—"}</span>
                    <span className="text-sm truncate text-muted-foreground/70">{r.department ?? "—"}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${c.dim} border ${c.border} flex items-center justify-center shrink-0`}>
                        <span className={`text-xs font-black ${c.text}`}>{r.score}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border} hidden md:inline-flex w-fit`}>
                        {r.tier}
                      </span>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground/60">{dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      <p className="text-xs text-muted-foreground/40">{dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </motion.div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Business entries */}
                  {bizLive.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-widest px-3 mb-2">Business Entries</p>
                      <div className="hidden md:grid grid-cols-[80px_1fr_110px_160px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
                        <span className="text-xs text-muted-foreground/40 font-semibold">Entry ID</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">Department</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">Score / Tier</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold text-right">Date</span>
                      </div>
                      <div className="space-y-0.5">
                        {bizLive.map((r, i) => <LiveRow key={r.entryId ?? i} r={r} i={i} />)}
                      </div>
                    </div>
                  )}

                  {/* Gym anonymous entries */}
                  {gymAnon.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-widest px-3 mb-2">Gym Entries <span className="normal-case font-normal">(anonymous)</span></p>
                      <div className="hidden md:grid grid-cols-[80px_1fr_110px_160px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
                        <span className="text-xs text-muted-foreground/40 font-semibold">Entry ID</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">—</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">Score / Tier</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold text-right">Date</span>
                      </div>
                      <div className="space-y-0.5">
                        {gymAnon.map((r, i) => <LiveRow key={r.entryId ?? i} r={r} i={i} />)}
                      </div>
                    </div>
                  )}

                  {/* Gym support requests */}
                  {gymSupport.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-3 mb-2">
                        <p className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-widest">Support Requests</p>
                        <span className="text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0">
                          {gymSupport.length}
                        </span>
                      </div>
                      <div className="hidden md:grid grid-cols-[80px_1fr_110px_160px] gap-3 px-3 pb-2 border-b border-border/30 mb-1">
                        <span className="text-xs text-muted-foreground/40 font-semibold">Entry ID</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">Email</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold">Score / Tier</span>
                        <span className="text-xs text-muted-foreground/40 font-semibold text-right">Date</span>
                      </div>
                      <div className="space-y-0.5">
                        {gymSupport.map((r, i) => {
                          const c  = TIER[r.tier as TierName] ?? TIER.Performing;
                          const dt = new Date(r.timestamp);
                          return (
                            <motion.div
                              key={r.entryId ?? i}
                              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.52 + i * 0.04, duration: 0.3 }}
                              className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[80px_1fr_110px_160px] items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
                            >
                              <span className="text-xs font-mono text-muted-foreground/50">{r.entryId ?? "—"}</span>
                              <span className="text-xs font-mono text-muted-foreground/70 truncate">{r.email ?? "—"}</span>
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg ${c.dim} border ${c.border} flex items-center justify-center shrink-0`}>
                                  <span className={`text-xs font-black ${c.text}`}>{r.score}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.dim} ${c.text} border ${c.border} hidden md:inline-flex w-fit`}>
                                  {r.tier}
                                </span>
                              </div>
                              <div className="text-right hidden md:block">
                                <p className="text-xs text-muted-foreground/60">{dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                                <p className="text-xs text-muted-foreground/40">{dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ── Footer ───────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground/30 text-center mt-10"
        >
          Fitest · Leadsopedia Limited · Data shown is for the selected reporting period only
        </motion.p>

      </main>
    </div>
  );
}
