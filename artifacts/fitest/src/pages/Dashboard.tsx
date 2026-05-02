import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

type DashMode = "business" | "gym";

/* ─── Colour system ──────────────────────────────────── */
const TIER = {
  Critical:   { bar: "bg-red-500",     text: "text-red-400",     dim: "bg-red-500/10",   border: "border-red-500/20",   hex: "#ef4444" },
  Exposed:    { bar: "bg-amber-500",   text: "text-amber-400",   dim: "bg-amber-500/10", border: "border-amber-500/20", hex: "#f59e0b" },
  Performing: { bar: "bg-primary",     text: "text-primary",     dim: "bg-primary/10",   border: "border-primary/20",   hex: "#aaff00" },
  Elite:      { bar: "bg-emerald-500", text: "text-emerald-400", dim: "bg-emerald-500/10", border: "border-emerald-500/20", hex: "#10b981" },
} as const;
type TierName = keyof typeof TIER;

/* ─── Mock data ──────────────────────────────────────── */
const BIZ_TIERS: { tier: TierName; count: number; pct: number }[] = [
  { tier: "Critical",   count: 14, pct: 9  },
  { tier: "Exposed",    count: 27, pct: 18 },
  { tier: "Performing", count: 68, pct: 46 },
  { tier: "Elite",      count: 39, pct: 26 },
];

const BIZ_DEPARTMENTS = [
  { name: "Sales",      avg: 64, submissions: 34, topTier: "Performing" as TierName },
  { name: "Operations", avg: 58, submissions: 28, topTier: "Exposed"    as TierName },
  { name: "Marketing",  avg: 71, submissions: 22, topTier: "Performing" as TierName },
  { name: "HR",         avg: 79, submissions: 18, topTier: "Elite"      as TierName },
  { name: "Finance",    avg: 55, submissions: 26, topTier: "Exposed"    as TierName },
  { name: "Tech",       avg: 83, submissions: 20, topTier: "Elite"      as TierName },
];

const GYM_TIERS: { tier: TierName; count: number; pct: number }[] = [
  { tier: "Critical",   count: 18, pct: 10 },
  { tier: "Exposed",    count: 42, pct: 22 },
  { tier: "Performing", count: 88, pct: 47 },
  { tier: "Elite",      count: 41, pct: 22 },
];

const GYM_SUPPORT = [
  { name: "Jordan Mitchell",  score: 19, tier: "Critical" as TierName,  issue: "Chronic fatigue — requested coach call",    date: "30 Apr" },
  { name: "Sam Patel",        score: 22, tier: "Critical" as TierName,  issue: "Sleep disruption, low energy flagged",      date: "30 Apr" },
  { name: "Riley Thompson",   score: 24, tier: "Critical" as TierName,  issue: "Requested nutrition guidance",              date: "29 Apr" },
  { name: "Alex Nguyen",      score: 31, tier: "Exposed"  as TierName,  issue: "Stress management — follow-up needed",     date: "28 Apr" },
  { name: "Morgan Davis",     score: 28, tier: "Exposed"  as TierName,  issue: "Recovery concerns, asked for programme",   date: "27 Apr" },
  { name: "Casey Williams",   score: 33, tier: "Exposed"  as TierName,  issue: "Wants tailored training plan",             date: "26 Apr" },
  { name: "Taylor Brown",     score: 21, tier: "Critical" as TierName,  issue: "Requested referral to physiotherapist",    date: "25 Apr" },
];

/* ─── Animated counter ───────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);
  useEffect(() => { mv.set(target); }, [target, mv]);
  return <motion.span>{display}</motion.span>;
}

/* ─── Big stat tile ──────────────────────────────────── */
function StatTile({ label, value, suffix = "", accent = false, sub, delay }: {
  label: string; value: number; suffix?: string; accent?: boolean; sub?: string; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className={`rounded-2xl border p-6 h-full flex flex-col justify-between ${
        accent
          ? "bg-primary/10 border-primary/30"
          : "bg-card border-card-border"
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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3"
    >
      <div className={`w-2.5 h-2.5 rounded-full ${c.bar} shrink-0`} />
      <span className={`w-24 text-xs font-bold ${c.text} shrink-0`}>{tier}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
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
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 120);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/40" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

/* ─── Risk indicator ─────────────────────────────────── */
function RiskIndicator({ tiers, total, mode = "business" }: { tiers: typeof BIZ_TIERS; total: number; mode?: "business" | "gym" }) {
  const atRisk = tiers.filter((t) => t.tier === "Critical" || t.tier === "Exposed").reduce((s, t) => s + t.count, 0);
  const pct = Math.round((atRisk / total) * 100);
  const level = pct >= 40 ? "High" : pct >= 20 ? "Moderate" : "Low";
  const levelColor = pct >= 40 ? "text-red-400" : pct >= 20 ? "text-amber-400" : "text-emerald-400";
  const borderColor = pct >= 40 ? "border-red-500/30" : pct >= 20 ? "border-amber-500/30" : "border-emerald-500/30";
  const bgColor = pct >= 40 ? "bg-red-500/5" : pct >= 20 ? "bg-amber-500/5" : "bg-emerald-500/5";
  const ringColor = pct >= 40 ? "#ef4444" : pct >= 20 ? "#f59e0b" : "#10b981";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className={`rounded-2xl border ${borderColor} ${bgColor} p-6 mb-6`}
    >
      <div className="flex items-start gap-6">
        {/* Ring */}
        <div className="relative shrink-0">
          <DonutRing pct={pct} color={ringColor} size={88} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-black ${levelColor}`}>{pct}%</span>
          </div>
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Performance Risk Indicator</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${borderColor} ${levelColor}`}>
              {level} Risk
            </span>
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
                Critical: <span className="font-bold text-red-400">{tiers.find((t) => t.tier === "Critical")?.count}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">
                Exposed: <span className="font-bold text-amber-400">{tiers.find((t) => t.tier === "Exposed")?.count}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [orgName, setOrgName] = useState("Your Organisation");
  const [mode, setMode] = useState<DashMode>("business");

  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get("demo");
    const raw = localStorage.getItem("fitest_auth");
    if (!raw && demo !== "1") { navigate("/login"); return; }
    if (raw && raw !== "true") {
      try {
        const { email } = JSON.parse(raw);
        if (email) setUserEmail(email);
        else if (demo !== "1") { navigate("/login"); return; }
      } catch { if (demo !== "1") { navigate("/login"); return; } }
    }
    // Load org data from onboarding
    const orgRaw = localStorage.getItem("fitest_org");
    if (orgRaw) {
      try {
        const { name, type } = JSON.parse(orgRaw);
        if (name) setOrgName(name);
        if (type) setMode(type as DashMode);
      } catch { /* ignore */ }
    }
  }, [navigate]);

  function handleSignOut() {
    localStorage.removeItem("fitest_auth");
    navigate("/login");
  }

  const bizTotal  = BIZ_TIERS.reduce((s, t) => s + t.count, 0);
  const gymTotal  = GYM_TIERS.reduce((s, t) => s + t.count, 0);
  const bizAvg    = 61;
  const gymAvg    = 58;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl gap-4">
          <Link href="/">
            <span className="text-lg font-black tracking-tight cursor-pointer select-none shrink-0">
              <span className="text-primary">F</span>ITEST
            </span>
          </Link>

          {/* Org + licence */}
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

        {/* ── Page heading + toggle ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">Performance Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">{orgName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "business" ? "Workforce performance overview" : "Member performance overview"}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1 self-start sm:self-auto shrink-0">
            {(["business", "gym"] as DashMode[]).map((m) => (
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
        </motion.div>

        {/* ── Views ─────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ━━━ BUSINESS ━━━ */}
          {mode === "business" && (
            <motion.div key="biz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {/* Risk indicator */}
              <RiskIndicator tiers={BIZ_TIERS} total={bizTotal} />

              {/* Stat tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatTile label="Total Submissions" value={bizTotal}       delay={0.05} sub="across all departments" />
                <StatTile label="Average Score"     value={bizAvg}         delay={0.10} sub="out of 100" />
                <StatTile label="Performing & Elite" value={107}           suffix=""    delay={0.15} sub={`${Math.round((107 / bizTotal) * 100)}% of workforce`} accent />
                <StatTile label="Departments Active" value={6}             delay={0.20} sub="tracked this period" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Tier breakdown */}
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Tier Distribution</p>
                    <div className="space-y-5 mb-5">
                      {BIZ_TIERS.map((t, i) => <TierRow key={t.tier} {...t} delay={0.28 + i * 0.06} />)}
                    </div>
                    {/* Stacked bar */}
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-6">
                      {BIZ_TIERS.map((t) => (
                        <motion.div
                          key={t.tier}
                          initial={{ flex: 0 }}
                          animate={{ flex: t.pct }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className={`${TIER[t.tier].bar} rounded-full`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-3">Based on {bizTotal} submissions</p>
                  </div>
                </motion.div>

                {/* Department breakdown */}
                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                >
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Department Breakdown</p>
                    <div className="space-y-1">
                      {BIZ_DEPARTMENTS.map((dept, i) => {
                        const c = TIER[dept.topTier];
                        const barWidth = (dept.avg / 100) * 100;
                        return (
                          <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
                            className="grid grid-cols-[110px_1fr_80px_80px] items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/40 transition-colors group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-2 h-2 rounded-full ${c.bar} shrink-0`} />
                              <span className="text-sm font-semibold truncate">{dept.name}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
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
            </motion.div>
          )}

          {/* ━━━ GYM ━━━ */}
          {mode === "gym" && (
            <motion.div key="gym" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {/* Risk indicator */}
              <RiskIndicator tiers={GYM_TIERS} total={gymTotal} mode="gym" />

              {/* Stat tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatTile label="Total Members"    value={213}     delay={0.05} sub="registered on platform" />
                <StatTile label="Audits Completed" value={189}     delay={0.10} sub={`${Math.round((189 / 213) * 100)}% completion rate`} />
                <StatTile label="Average Score"    value={gymAvg}  delay={0.15} sub="out of 100" />
                <StatTile label="Support Requests" value={GYM_SUPPORT.length} delay={0.20} sub="pending action" accent />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Tier breakdown */}
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-5">Member Tiers</p>
                    <div className="space-y-5 mb-5">
                      {GYM_TIERS.map((t, i) => <TierRow key={t.tier} {...t} delay={0.28 + i * 0.06} />)}
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-6">
                      {GYM_TIERS.map((t) => (
                        <motion.div
                          key={t.tier}
                          initial={{ flex: 0 }}
                          animate={{ flex: t.pct }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className={`${TIER[t.tier].bar} rounded-full`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground/40 mt-3">189 audits from 213 members</p>
                  </div>
                </motion.div>

                {/* Support requests */}
                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                >
                  <div className="bg-card border border-card-border rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Members Requesting Support</p>
                      <span className="text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-0.5">
                        {GYM_SUPPORT.length} pending
                      </span>
                    </div>
                    <div className="space-y-1">
                      {GYM_SUPPORT.map((m, i) => {
                        const c = TIER[m.tier];
                        return (
                          <motion.div
                            key={m.name}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors group"
                          >
                            <div className={`w-9 h-9 rounded-xl ${c.dim} border ${c.border} flex items-center justify-center shrink-0`}>
                              <span className={`text-xs font-black ${c.text}`}>{m.score}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold">{m.name}</span>
                                <span className={`text-xs font-bold px-1.5 py-0 rounded ${c.dim} ${c.text}`}>{m.tier}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed truncate">{m.issue}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="text-xs text-muted-foreground/40">{m.date}</span>
                              <button className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                Resolve
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer note ───────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground/30 text-center mt-10"
        >
          Fitest · Leadsopedia Limited · Data shown is for the current licence period only
        </motion.p>

      </main>
    </div>
  );
}
