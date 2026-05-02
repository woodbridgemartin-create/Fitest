import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashMode = "business" | "gym";

const TIER_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Critical:   { bg: "bg-red-500/10",   text: "text-red-400",    bar: "bg-red-500"   },
  Exposed:    { bg: "bg-amber-500/10", text: "text-amber-400",  bar: "bg-amber-500" },
  Performing: { bg: "bg-primary/10",   text: "text-primary",    bar: "bg-primary"   },
  Elite:      { bg: "bg-cyan-500/10",  text: "text-cyan-400",   bar: "bg-cyan-500"  },
};

const BIZ_STATS = [
  { label: "Total Submissions", value: "148" },
  { label: "Average Score",     value: "61"  },
  { label: "Performing / Elite", value: "72%" },
  { label: "Departments Active", value: "6"  },
];

const BIZ_TIERS = [
  { tier: "Critical",   count: 14, pct: 9  },
  { tier: "Exposed",    count: 27, pct: 18 },
  { tier: "Performing", count: 68, pct: 46 },
  { tier: "Elite",      count: 39, pct: 26 },
];

const BIZ_DEPARTMENTS = [
  { name: "Sales",      submissions: 34, avg: 64, topTier: "Performing" },
  { name: "Operations", submissions: 28, avg: 58, topTier: "Exposed"    },
  { name: "Marketing",  submissions: 22, avg: 71, topTier: "Performing" },
  { name: "HR",         submissions: 18, avg: 79, topTier: "Elite"      },
  { name: "Finance",    submissions: 26, avg: 55, topTier: "Exposed"    },
  { name: "Tech",       submissions: 20, avg: 83, topTier: "Elite"      },
];

const GYM_STATS = [
  { label: "Total Members",    value: "213" },
  { label: "Audits Completed", value: "189" },
  { label: "Elite Members",    value: "41"  },
  { label: "Support Requests", value: "7"   },
];

const GYM_TIERS = [
  { tier: "Critical",   count: 18, pct: 10 },
  { tier: "Exposed",    count: 42, pct: 22 },
  { tier: "Performing", count: 88, pct: 47 },
  { tier: "Elite",      count: 41, pct: 22 },
];

const GYM_SUPPORT = [
  { name: "Jordan Mitchell",  score: 19, tier: "Critical",  issue: "Chronic fatigue — requested coach call",    date: "30 Apr" },
  { name: "Sam Patel",        score: 22, tier: "Critical",  issue: "Sleep disruption, low energy flagged",      date: "30 Apr" },
  { name: "Riley Thompson",   score: 24, tier: "Critical",  issue: "Requested nutrition guidance",              date: "29 Apr" },
  { name: "Alex Nguyen",      score: 31, tier: "Exposed",   issue: "Stress management — follow-up needed",     date: "28 Apr" },
  { name: "Morgan Davis",     score: 28, tier: "Exposed",   issue: "Recovery concerns, asked for programme",   date: "27 Apr" },
  { name: "Casey Williams",   score: 33, tier: "Exposed",   issue: "Wants tailored training plan",             date: "26 Apr" },
  { name: "Taylor Brown",     score: 21, tier: "Critical",  issue: "Requested referral to physiotherapist",    date: "25 Apr" },
];

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}>
      <Card className="bg-card border border-card-border">
        <CardContent className="p-5">
          <p className="text-3xl font-black tracking-tight mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TierBar({ tier, count, pct, delay }: { tier: string; count: number; pct: number; delay: number }) {
  const c = TIER_COLORS[tier];
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.35 }} className="flex items-center gap-3">
      <span className={`w-20 text-xs font-semibold ${c.text} shrink-0`}>{tier}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${c.bar}`}
        />
      </div>
      <span className="text-xs text-muted-foreground w-14 text-right shrink-0">{count} ({pct}%)</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [mode, setMode] = useState<DashMode>("business");

  useEffect(() => {
    const raw = localStorage.getItem("fitest_auth");
    if (!raw) { navigate("/login"); return; }
    try {
      const { email } = JSON.parse(raw);
      setUserEmail(email ?? "");
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  function handleSignOut() {
    localStorage.removeItem("fitest_auth");
    navigate("/login");
  }

  const firstName = userEmail.split("@")[0] ?? "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl">
          <Link href="/">
            <span className="text-lg font-black tracking-tight cursor-pointer select-none">
              <span className="text-primary">F</span>ITEST
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs border-border hover:border-primary/40 h-8">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl">

        {/* Header + mode toggle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-1">Dashboard</p>
            <h1 className="text-3xl font-black">Welcome back, {firstName}.</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "business" ? "Workforce performance overview." : "Member performance overview."}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1 self-start sm:self-auto">
            {(["business", "gym"] as DashMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "business" ? "Business" : "Gym"}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === "business" ? (
            <motion.div key="business" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {BIZ_STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Tier breakdown */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4 }}>
                  <Card className="bg-card border border-card-border h-full">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-5">Tier Breakdown</p>
                      <div className="space-y-4">
                        {BIZ_TIERS.map((t, i) => <TierBar key={t.tier} {...t} delay={0.3 + i * 0.07} />)}
                      </div>
                      <p className="text-xs text-muted-foreground/40 mt-5">Based on 148 submissions</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Department breakdown */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.4 }}>
                  <Card className="bg-card border border-card-border h-full">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-5">Department Breakdown</p>
                      <div className="space-y-1">
                        {BIZ_DEPARTMENTS.map((dept, i) => {
                          const c = TIER_COLORS[dept.topTier];
                          return (
                            <motion.div
                              key={dept.name}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.36 + i * 0.06, duration: 0.3 }}
                              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-2 h-2 rounded-full ${c.bar} shrink-0`} />
                                <span className="text-sm font-medium truncate">{dept.name}</span>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                <span className="text-xs text-muted-foreground">{dept.submissions} submitted</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-bold">{dept.avg}</span>
                                  <span className={`text-xs font-semibold ${c.text}`}>{dept.topTier}</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground/40 mt-4 px-3">Avg score shown per department</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

            </motion.div>

          ) : (

            <motion.div key="gym" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {GYM_STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Tier breakdown */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4 }}>
                  <Card className="bg-card border border-card-border h-full">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-5">Member Tiers</p>
                      <div className="space-y-4">
                        {GYM_TIERS.map((t, i) => <TierBar key={t.tier} {...t} delay={0.3 + i * 0.07} />)}
                      </div>
                      <p className="text-xs text-muted-foreground/40 mt-5">189 audits completed out of 213 members</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Support requests */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.4 }} className="md:col-span-2">
                  <Card className="bg-card border border-card-border h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Support Requests</p>
                        <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-0.5 font-semibold">
                          {GYM_SUPPORT.length} pending
                        </span>
                      </div>
                      <div className="space-y-2">
                        {GYM_SUPPORT.map((member, i) => {
                          const c = TIER_COLORS[member.tier];
                          return (
                            <motion.div
                              key={member.name}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.36 + i * 0.05, duration: 0.3 }}
                              className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                              <div className={`w-8 h-8 rounded-full ${c.bg} border ${c.bar.replace("bg-", "border-")}/30 flex items-center justify-center shrink-0 mt-0.5`}>
                                <span className={`text-xs font-black ${c.text}`}>{member.score}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm font-semibold">{member.name}</span>
                                  <span className={`text-xs font-bold ${c.text}`}>{member.tier}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{member.issue}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground/50">{member.date}</span>
                                <button className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold hover:underline">
                                  Mark resolved
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
