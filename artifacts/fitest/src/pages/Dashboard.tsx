import Logo from "./Logo";
import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

type DashMode = "business" | "gym";
type Period   = "7d" | "30d" | "all";

type LiveResult = {
  clientId: string;
  refId?: string;
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

const AFFILIATE_METRICS = { referrals: 12, conversions: 3, earnings: 149.4 };

/* ─── Utilities ──────────────────────────────────────── */
function fmtDate(d: Date) { return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
function fmtShort(d: Date) { return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); }
function deriveTiers(subs: { tier: TierName }[], total: number) {
  const counts: Record<TierName, number> = { Critical: 0, Exposed: 0, Performing: 0, Elite: 0 };
  subs.forEach(s => counts[s.tier]++);
  return (["Critical","Exposed","Performing","Elite"] as TierName[]).map(tier => ({
    tier, count: counts[tier], pct: total > 0 ? Math.round((counts[tier] / total) * 100) : 0,
  }));
}

/* ─── Components ─────────────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);
  useEffect(() => { mv.set(target); }, [target, mv]);
  return <motion.span>{display}</motion.span>;
}

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

function DonutRing({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
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

/* ─── Recent Activity (The fixed part) ───────────────── */
function RecentActivity({ bizSubs, gymSubs, mode }: { bizSubs: BizSub[]; gymSubs: GymSub[]; mode: DashMode }) {
  const recent = (mode === "business" ? bizSubs : gymSubs).slice(0, 10);
  
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
        <span className="text-xs text-muted-foreground/40 font-semibold">{mode === "business" ? "Dept" : "Entry"}</span>
        <span className="text-xs text-muted-foreground/40 font-semibold">Tier</span>
        <span className="text-xs text-muted-foreground/40 font-semibold">Date</span>
        <span className="text-xs text-muted-foreground/40 font-semibold text-right">Time</span>
      </div>
      <div className="space-y-0.5">
        {recent.map((s, i) => {
          const c = TIER[s.tier];
          const label = mode === "business" ? (s as BizSub).department : (s as GymSub).label;
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
              <span className="text-sm font-medium text-muted-foreground/60 tabular-nums">{label}</span>
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

/* ─── Main Component ─────────────────────────────────── */
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [orgName, setOrgName] = useState("Your Organisation");
  const [mode, setMode] = useState<DashMode>("business");
  const [period, setPeriod] = useState<Period>("30d");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("fitest_auth");
    if (!raw) { navigate("/login"); return; }
    const orgRaw = localStorage.getItem("fitest_org");
    if (orgRaw) {
      try {
        const org = JSON.parse(orgRaw);
        if (org.name) setOrgName(org.name);
        if (org.type) setMode(org.type as DashMode);
        if (org.clientId) setClientId(org.clientId);
      } catch { /* ignore */ }
    }
  }, [navigate]);

  const cutoff = useMemo(() => {
    const d = new Date(NOW);
    if (period === "7d") d.setDate(d.getDate() - 7);
    else if (period === "30d") d.setDate(d.getDate() - 30);
    else return new Date(0);
    return d;
  }, [period]);

  const filteredBiz = useMemo(() => BIZ_SUBS.filter(s => s.date >= cutoff), [cutoff]);
  const filteredGym = useMemo(() => GYM_SUBS.filter(s => s.date >= cutoff), [cutoff]);
  const activeSubs = mode === "business" ? filteredBiz : filteredGym;
  const avg = activeSubs.length ? Math.round(activeSubs.reduce((s, x) => s + x.score, 0) / activeSubs.length) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl">
          <Link href="/"><span className="text-lg font-black tracking-tight cursor-pointer"><span className="text-primary">F</span>ITEST</span></Link>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Sign out</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">{orgName}</h1>
            <p className="text-sm text-muted-foreground">Performance Overview • {period}</p>
          </div>
          <div className="flex gap-1 bg-card border rounded-xl p-1">
            <PeriodBtn label="7d" active={period === "7d"} onClick={() => setPeriod("7d")} />
            <PeriodBtn label="30d" active={period === "30d"} onClick={() => setPeriod("30d")} />
            <PeriodBtn label="All" active={period === "all"} onClick={() => setPeriod("all")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatTile label="Total Submissions" value={activeSubs.length} delay={0.1} />
          <StatTile label="Average Score" value={avg} suffix="%" accent delay={0.2} />
          <StatTile label="Active Users" value={Math.floor(activeSubs.length * 0.8)} delay={0.3} />
        </div>

        <RecentActivity bizSubs={filteredBiz} gymSubs={filteredGym} mode={mode} />
      </main>
    </div>
  );
}
