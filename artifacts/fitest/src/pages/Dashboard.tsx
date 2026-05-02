import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { label: "Audits completed", value: "0" },
  { label: "Average score", value: "—" },
  { label: "Licences active", value: "1" },
  { label: "Team members", value: "—" },
];

const QUICK_LINKS = [
  { label: "Run Business Audit", href: "/" },
  { label: "Run Gym Audit", href: "/" },
  { label: "View pricing", href: "/#pricing" },
  { label: "Contact support", href: "/contact" },
];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("fitest_auth");
    if (!raw) {
      navigate("/login");
      return;
    }
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-xs border-border hover:border-primary/40 h-8"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-1">Dashboard</p>
          <h1 className="text-3xl font-black">Welcome back, {firstName}.</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's an overview of your Fitest account.</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              <Card className="bg-card border border-card-border">
                <CardContent className="p-5">
                  <p className="text-2xl font-black mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent activity */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="md:col-span-2">
            <Card className="bg-card border border-card-border h-full">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Recent Audits</p>
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium mb-1">No audits yet</p>
                  <p className="text-xs text-muted-foreground mb-5">Complete your first audit to see results here.</p>
                  <Link href="/">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                      Run your first audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.4 }}>
            <Card className="bg-card border border-card-border h-full">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Quick Links</p>
                <ul className="space-y-1">
                  {QUICK_LINKS.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href}>
                        <div className="flex items-center justify-between group px-3 py-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                          <svg className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-border/40">
                  <p className="text-xs text-muted-foreground/50 leading-relaxed">
                    Need help? Email us at{" "}
                    <a href="mailto:hello@fitest.co.uk" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@fitest.co.uk
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
