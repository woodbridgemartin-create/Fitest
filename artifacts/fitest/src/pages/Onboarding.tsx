import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OrgType = "business" | "gym" | "";

const TOTAL_STEPS = 5;

function generateAuditCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < step
              ? "w-6 h-1.5 bg-primary"
              : i === step
              ? "w-4 h-1.5 bg-primary/60"
              : "w-1.5 h-1.5 bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("");
  const [departments, setDepartments] = useState<string[]>(["", "", ""]);
  const [orgError, setOrgError] = useState("");
  const [typeError, setTypeError] = useState("");

  const auditCode = useRef(generateAuditCode());
  const auditLink = `https://fitest.co.uk/?client=${auditCode.current}`;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(auditLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSetupNext() {
    let ok = true;
    if (!orgName.trim()) { setOrgError("Please enter your organisation or gym name."); ok = false; }
    if (!orgType) { setTypeError("Please choose a type."); ok = false; }
    if (ok) next();
  }

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); }
  function updateDept(i: number, val: string) {
    setDepartments((prev) => { const n = [...prev]; n[i] = val; return n; });
  }

  // Save org to localStorage so Dashboard can read it
  useEffect(() => {
    if (step >= 2 && orgName) {
      localStorage.setItem("fitest_org", JSON.stringify({ name: orgName, type: orgType, departments: departments.filter(Boolean), clientId: auditCode.current }));
    }
  }, [step, orgName, orgType, departments]);

  const variants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-3xl">
          <span className="text-lg font-black tracking-tight select-none">
            <span className="text-primary">F</span>ITEST
          </span>
          <span className="text-xs text-muted-foreground">Onboarding</span>
        </div>
      </header>

      {/* Progress */}
      <div className="pt-8 pb-2">
        <ProgressDots step={step} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Welcome */}
            {step === 0 && (
              <motion.div key="welcome" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                    className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto"
                  >
                    <svg className="w-9 h-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Licence Active</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-3">Your Fitest licence is active.</h1>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Let's get your audit system deployed in the next few minutes. We'll set up your organisation, generate your unique audit link, and have your team ready to go.
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                    <Button
                      onClick={next}
                      size="lg"
                      className="h-12 px-10 font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                    >
                      Get started
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — Setup */}
            {step === 1 && (
              <motion.div key="setup" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <div className="bg-card border border-card-border rounded-2xl p-8 shadow-xl shadow-black/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 1 of 4</p>
                  <h2 className="text-2xl font-black mb-6">Set up your organisation</h2>

                  <div className="space-y-5">
                    {/* Org name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="orgName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Organisation / Gym Name
                      </Label>
                      <Input
                        id="orgName"
                        type="text"
                        placeholder="Acme Ltd or Apex Gym"
                        value={orgName}
                        onChange={(e) => { setOrgName(e.target.value); setOrgError(""); }}
                        className="h-11 bg-background border-border"
                      />
                      {orgError && <p className="text-xs text-red-400">{orgError}</p>}
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Type
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["business", "gym"] as OrgType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => { setOrgType(t); setTypeError(""); }}
                            className={`flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-150 text-left ${
                              orgType === t
                                ? "bg-primary/10 border-primary/40"
                                : "bg-background border-border text-muted-foreground hover:border-primary/20"
                            }`}
                          >
                            <span className={`text-sm font-bold capitalize ${orgType === t ? "text-primary" : ""}`}>
                              {t === "business" ? "Business" : "Gym"}
                            </span>
                            <span className="text-xs leading-snug">
                              {t === "business" ? "Workforce performance audit" : "Member performance audit"}
                            </span>
                          </button>
                        ))}
                      </div>
                      {typeError && <p className="text-xs text-red-400">{typeError}</p>}
                    </div>

                    {/* Departments — business only */}
                    <AnimatePresence>
                      {orgType === "business" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1.5 pt-1">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Departments <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">Add up to 3 departments you'll deploy the audit across.</p>
                            <div className="space-y-2">
                              {departments.map((d, i) => (
                                <Input
                                  key={i}
                                  type="text"
                                  placeholder={["e.g. HR", "e.g. Sales", "e.g. Engineering"][i]}
                                  value={d}
                                  onChange={(e) => updateDept(i, e.target.value)}
                                  className="h-10 bg-background border-border text-sm"
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handleSetupNext}
                      size="lg"
                      className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Audit Link */}
            {step === 2 && (
              <motion.div key="link" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <div className="text-center space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 2 of 4</p>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">Your audit link is ready.</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                      Share this link with your {orgType === "gym" ? "members" : "team"}. Anyone who opens it will be walked through the full audit.
                    </p>
                  </div>

                  {/* Link display */}
                  <div className="bg-card border border-primary/20 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Audit Link</span>
                    </div>
                    <div className="bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-muted-foreground break-all text-left">
                      {auditLink}
                    </div>
                    <Button
                      onClick={handleCopy}
                      className={`w-full font-bold transition-colors ${
                        copied
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {copied ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Copied to clipboard
                        </span>
                      ) : (
                        "Copy Link"
                      )}
                    </Button>
                  </div>

                  <div className="bg-card/50 border border-border/40 rounded-xl px-5 py-4 flex items-start gap-3 text-left">
                    <svg className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This link is unique to your licence. Do not share it publicly. Results are accessible from your dashboard only.
                    </p>
                  </div>

                  <Button onClick={next} size="lg" className="h-12 px-10 font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Instructions */}
            {step === 3 && (
              <motion.div key="instructions" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Step 3 of 4</p>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">Here's how it works</h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Once your link is shared, the system runs itself.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        num: "01",
                        title: "Send the link to your " + (orgType === "gym" ? "members" : "team"),
                        desc: "Paste your audit link into an email, Slack, or any internal communication channel. No accounts or downloads required.",
                        icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
                      },
                      {
                        num: "02",
                        title: (orgType === "gym" ? "Members" : "Users") + " complete the 20-question audit",
                        desc: "Each audit takes under 4 minutes. Questions cover energy, recovery, nutrition and physical output. Scores are generated automatically.",
                        icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
                      },
                      {
                        num: "03",
                        title: "Results are stored for your reporting",
                        desc: "Every completed audit is logged against your licence. View individual scores, tier breakdowns and " + (orgType === "business" ? "department comparisons" : "member trends") + " from your dashboard.",
                        icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
                      },
                    ].map(({ num, title, desc, icon }, i) => (
                      <motion.div
                        key={num}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.1 }}
                        className="flex gap-4 bg-card border border-card-border rounded-xl p-5"
                      >
                        <div className="text-2xl font-black text-primary/20 font-mono shrink-0 w-8 leading-none pt-0.5">{num}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                            <h3 className="text-sm font-bold">{title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button onClick={next} size="lg" className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Dashboard */}
            {step === 4 && (
              <motion.div key="dashboard" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                    className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto"
                  >
                    <svg className="w-9 h-9 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h2 className="text-3xl font-black mb-2">You're all set.</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-2">
                      {orgName} is now deployed on Fitest. As your {orgType === "gym" ? "members" : "team"} complete their audits, results and tier breakdowns will appear in your dashboard.
                    </p>
                  </motion.div>

                  {/* Summary card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-card border border-card-border rounded-2xl p-6 text-left space-y-3"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Deployment summary</p>
                    {[
                      { label: "Organisation", value: orgName },
                      { label: "Licence type", value: orgType === "business" ? "Business" : "Gym" },
                      { label: "Audit link", value: auditLink },
                      ...(orgType === "business" && departments.some(Boolean)
                        ? [{ label: "Departments", value: departments.filter(Boolean).join(", ") }]
                        : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-4 text-sm py-2 border-b border-border/30 last:border-0">
                        <span className="text-muted-foreground shrink-0">{label}</span>
                        <span className="font-medium text-right break-all text-xs">{value}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-3">
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                          localStorage.setItem("fitest_auth", "true");
                        }}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                        Return to homepage
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
