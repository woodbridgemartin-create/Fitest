import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BUSINESS_QUESTIONS, GYM_QUESTIONS, TIERS, getTier } from "@/lib/auditData";
import type { AuditPath } from "@/lib/auditData";

type Phase = "landing" | "consent" | "audit" | "email" | "result";

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 75;
    const inc = value / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

interface PrintReportProps {
  email: string;
  companyName: string;
  department: string;
  auditPath: AuditPath;
  questions: string[];
  answers: (number | null)[];
  score: number;
}

const TIER_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  Exposed: "#f59e0b",
  Performing: "#a3e635",
  Elite: "#10b981",
};

function PrintReport({ email, companyName, department, auditPath, questions, answers, score }: PrintReportProps) {
  const tier = getTier(score);
  const label = auditPath === "gym" ? "Member Performance Audit" : "Workforce Performance Audit";
  const reportDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const page1Qs = questions.slice(0, 10);
  const page2Qs = questions.slice(10);
  const total = answers.reduce((a, b) => a + (b ?? 0), 0);
  const maxTotal = questions.length * 5;

  const ReportLogo = ({ page }: { page: number }) => (
    <div className="rpt-header">
      <div className="rpt-logo">
        <span className="rpt-logo-f">F</span>
        <span className="rpt-logo-rest">ITEST</span>
      </div>
      <div className="rpt-header-right">
        <span className="rpt-header-label">{label}</span>
        <span className="rpt-header-page">Page {page} of 3</span>
      </div>
    </div>
  );

  const CompanyFooter = ({ withDisclaimer }: { withDisclaimer?: boolean }) => (
    <div className="rpt-footer">
      {withDisclaimer && (
        <div className="rpt-footer-disclaimer">
          <strong>Medical Disclaimer:</strong> This audit is not medical advice. It is for informational purposes only. Always consult a qualified healthcare professional before making changes to your health, fitness or lifestyle.
        </div>
      )}
      <div className="rpt-footer-company">
        <div className="rpt-footer-co-name">
          <strong>Fitest</strong> &nbsp;|&nbsp; Trading name of Leadsopedia Limited &nbsp;|&nbsp; Company Number: 13145058 &nbsp;|&nbsp; London, United Kingdom
        </div>
        <div className="rpt-footer-co-contact">hello@fitest.co.uk &nbsp;|&nbsp; fitest.co.uk</div>
      </div>
    </div>
  );

  const QuestionRow = ({ q, i, ans }: { q: string; i: number; ans: number | null }) => {
    const val = ans ?? 0;
    const pct = (val / 5) * 100;
    return (
      <div className="rpt-qrow">
        <div className="rpt-qrow-top">
          <span className="rpt-qrow-num">{i + 1}.</span>
          <span className="rpt-qrow-text">{q}</span>
          <span className="rpt-qrow-score">{val}/5</span>
        </div>
        <div className="rpt-qrow-bar-track">
          <div className="rpt-qrow-bar-fill" style={{ width: `${pct}%`, backgroundColor: TIER_COLORS[tier.name] }} />
        </div>
      </div>
    );
  };

  return (
    <div className="rpt hidden print:block">

      {/* ══════ PAGE 1 : SCORE SUMMARY ══════ */}
      <div className="rpt-page">
        <ReportLogo page={1} />

        <div className="rpt-p1-meta">
          <span>Report generated: {reportDate}</span>
          <span>Prepared for: <strong>{email}</strong></span>
          {companyName && <span>{auditPath === "gym" ? "Gym" : "Organisation"}: <strong>{companyName}</strong></span>}
          {department && <span>Department: <strong>{department}</strong></span>}
        </div>

        <div className="rpt-p1-score-section">
          <div className="rpt-p1-score-left">
            <div className="rpt-p1-score-number">{score}</div>
            <div className="rpt-p1-score-denom">/100</div>
          </div>
          <div className="rpt-p1-score-right">
            <div className="rpt-p1-tier-badge" style={{ color: TIER_COLORS[tier.name], borderColor: TIER_COLORS[tier.name] }}>
              {tier.name.toUpperCase()}
            </div>
            <div className="rpt-p1-tier-range">{tier.min} – {tier.max} range</div>
            <div className="rpt-p1-tier-desc">{tier.description}</div>
          </div>
        </div>

        <div className="rpt-p1-gradient-bar">
          <div className="rpt-p1-gradient-fill" style={{ width: `${score}%` }} />
        </div>
        <div className="rpt-p1-tier-row">
          {TIERS.map((t) => (
            <span key={t.name} className="rpt-p1-tier-label" style={{ color: tier.name === t.name ? TIER_COLORS[t.name] : "#bbb", fontWeight: tier.name === t.name ? 800 : 400 }}>
              {t.name}
            </span>
          ))}
        </div>

        <div className="rpt-p1-section-title">WHAT YOUR SCORE MEANS</div>
        <div className="rpt-p1-tiers-grid">
          {TIERS.map((t) => (
            <div key={t.name} className="rpt-p1-tier-card" style={{ borderLeftColor: TIER_COLORS[t.name], background: tier.name === t.name ? "#f9fafb" : "#fff" }}>
              <div className="rpt-p1-tier-card-name" style={{ color: TIER_COLORS[t.name] }}>{t.name.toUpperCase()}</div>
              <div className="rpt-p1-tier-card-range">{t.min} – {t.max}</div>
              <div className="rpt-p1-tier-card-desc">{t.description}</div>
            </div>
          ))}
        </div>

        <div className="rpt-p1-section-title" style={{ marginTop: 20 }}>AUDIT OVERVIEW</div>
        <div className="rpt-p1-overview-row">
          <div className="rpt-p1-overview-box">
            <div className="rpt-p1-overview-val">{total}</div>
            <div className="rpt-p1-overview-lbl">Total Points Scored</div>
          </div>
          <div className="rpt-p1-overview-box">
            <div className="rpt-p1-overview-val">{maxTotal}</div>
            <div className="rpt-p1-overview-lbl">Maximum Possible</div>
          </div>
          <div className="rpt-p1-overview-box">
            <div className="rpt-p1-overview-val">{questions.length}</div>
            <div className="rpt-p1-overview-lbl">Questions Answered</div>
          </div>
          <div className="rpt-p1-overview-box">
            <div className="rpt-p1-overview-val" style={{ color: TIER_COLORS[tier.name] }}>{score}%</div>
            <div className="rpt-p1-overview-lbl">Performance Score</div>
          </div>
        </div>

        <CompanyFooter />
      </div>

      {/* ══════ PAGE 2 : Q1–10 ══════ */}
      <div className="rpt-page">
        <ReportLogo page={2} />
        <div className="rpt-p2-title">DETAILED BREAKDOWN — QUESTIONS 1 TO 10</div>
        <div className="rpt-p2-sub">Each question rated 1 (Strongly Disagree) to 5 (Strongly Agree). Score bar shows your rating as a proportion of the maximum.</div>
        <div className="rpt-qlist">
          {page1Qs.map((q, i) => (
            <QuestionRow key={i} q={q} i={i} ans={answers[i]} />
          ))}
        </div>
        <CompanyFooter />
      </div>

      {/* ══════ PAGE 3 : Q11–20 + Disclaimer ══════ */}
      <div className="rpt-page">
        <ReportLogo page={3} />
        <div className="rpt-p2-title">DETAILED BREAKDOWN — QUESTIONS 11 TO 20</div>
        <div className="rpt-p2-sub">Continued from page 2.</div>
        <div className="rpt-qlist">
          {page2Qs.map((q, i) => (
            <QuestionRow key={i} q={q} i={i + 10} ans={answers[i + 10]} />
          ))}
        </div>
        <CompanyFooter withDisclaimer />
      </div>

    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

const HOW_IT_WORKS = [
  { step: "01", title: "Purchase Licence", body: "Select the Business or Gym licence. You receive immediate access to the audit platform and deployment materials for internal distribution." },
  { step: "02", title: "Deploy Audit Internally", body: "Share a private audit link with your team or members. The 20-question audit takes under 4 minutes and requires no account creation." },
  { step: "03", title: "Receive Tiered Performance Data", body: "Each participant receives a score from 0 to 100 and a performance tier. Organisations access aggregated insights across departments or membership groups." },
];

const PILLARS = [
  { label: "Energy", desc: "Stable, sustained energy across the day without crashes or reliance on stimulants." },
  { label: "Recovery", desc: "Sleep quality, stress resilience and the ability to bounce back after exertion or pressure." },
  { label: "Nutrition", desc: "Fuelling performance with consistent, nourishing food choices that support output." },
  { label: "Physical Output", desc: "Movement, training structure and body composition as markers of physical readiness." },
];

export default function Home() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [auditPath, setAuditPath] = useState<AuditPath | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [consentMedical, setConsentMedical] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const consentRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);

  const questions = auditPath === "gym" ? GYM_QUESTIONS : BUSINESS_QUESTIONS;
  const auditLabel = auditPath === "gym" ? "Member Performance Audit" : "Workforce Performance Audit";

  const handleSelectAudit = (path: AuditPath) => {
    setAuditPath(path);
    setConsentMedical(false);
    setConsentPrivacy(false);
    setPhase("consent");
    setTimeout(() => consentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleBeginAudit = () => {
    setPhase("audit");
    setCurrentQ(0);
    setDirection(1);
    setAnswers(Array(auditPath === "gym" ? GYM_QUESTIONS.length : BUSINESS_QUESTIONS.length).fill(null));
    setTimeout(() => auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleRating = (rating: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = rating;
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setTimeout(() => { setDirection(1); setCurrentQ((q) => q + 1); }, 350);
    }
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) { setDirection(1); setCurrentQ((q) => q + 1); }
  };

  const goPrev = () => {
    if (currentQ > 0) { setDirection(-1); setCurrentQ((q) => q - 1); }
  };

  const canSubmit = answers.every((a) => a !== null);

  const handleGetScore = () => {
    setPhase("email");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (!companyName.trim()) {
      setCompanyNameError(auditPath === "gym" ? "Please enter your gym name." : "Please enter your company name.");
      hasError = true;
    }
    if (auditPath === "business" && !department.trim()) {
      setDepartmentError("Please enter your department.");
      hasError = true;
    }
    if (hasError) return;
    const total = answers.reduce((a, b) => a + (b ?? 0), 0);
    const score = Math.round((total / (questions.length * 5)) * 100);
    setResultScore(score);
    setPhase("result");
  };

  const handleRetake = () => {
    setPhase("landing");
    setAuditPath(null);
    setResultScore(null);
    setEmail("");
    setEmailError("");
    setCompanyName("");
    setCompanyNameError("");
    setDepartment("");
    setDepartmentError("");
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const activeTier = resultScore !== null ? getTier(resultScore) : null;
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      {resultScore !== null && auditPath && (
        <PrintReport email={email} companyName={companyName} department={department} auditPath={auditPath} questions={questions} answers={answers} score={resultScore} />
      )}

      <div className="min-h-screen bg-background text-foreground print:hidden" ref={topRef}>

        {/* ── LANDING ── */}
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              {/* Hero */}
              <section className="text-center py-28 px-4 border-b border-border/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-3xl relative">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-1.5 mb-8">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Licensed Performance System</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                      Deploy a Performance System<br className="hidden md:block" /> Across Your Team
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                      Fitest gives organisations and gyms a structured way to measure energy, recovery, stress and output — scored and tiered in under 4 minutes.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link href="/demo">
                        <Button size="lg" className="h-13 px-8 font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Request Demo
                        </Button>
                      </Link>
                      <a href="#pricing">
                        <Button size="lg" variant="outline" className="h-13 px-8 font-bold rounded-full border-border hover:bg-muted">
                          Get Licence
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Problem */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">The Problem</p>
                      <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">The performance gap is invisible until it costs you</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Most organisations have no structured, objective way to measure human performance. By the time problems surface — through absence, churn, or burnout — the cost is already significant.
                      </p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { icon: "M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z", label: "Burnout goes undetected" },
                        { icon: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9", label: "Member churn happens without warning" },
                        { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", label: "No objective measurement of human performance" },
                      ].map(({ icon, label }, i) => (
                        <motion.div key={label} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                          <div className="flex items-center gap-4 p-4 bg-card border border-card-border rounded-xl">
                            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Solution */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-4">
                      {PILLARS.map((p, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                          <Card className="bg-card border border-card-border h-full">
                            <CardContent className="p-5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mb-3" />
                              <h3 className="text-sm font-bold mb-1">{p.label}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">The Solution</p>
                      <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">A system, not a survey</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Fitest is a structured performance audit system deployed across teams or memberships, generating measurable insight and tiered scoring across four pillars: energy, recovery, nutrition and physical output.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Every participant receives a validated score from 0 to 100, mapped to one of four tiers. Organisations see aggregated performance data — across departments or membership groups — in a single view.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Performance tiers */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">The scoring system</p>
                    <h2 className="text-2xl md:text-3xl font-black">Four tiers. One clear picture.</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {TIERS.map((tier, i) => (
                      <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                        <Card className={`bg-card/50 border ${tier.border} h-full`}>
                          <CardContent className="p-6">
                            <h3 className={`text-lg font-bold uppercase tracking-wider mb-1 ${tier.color}`}>{tier.name}</h3>
                            <p className="text-xs font-mono text-muted-foreground mb-3">{tier.min} to {tier.max}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{tier.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* How it works */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">How it works</p>
                    <h2 className="text-2xl md:text-3xl font-black">From licence to insight in three steps</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {HOW_IT_WORKS.map((step, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                        <div className="text-5xl font-black text-primary/20 mb-4 font-mono">{step.step}</div>
                        <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Who is it for */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">Access the Platform</p>
                    <h2 className="text-2xl md:text-3xl font-black">Built for two licence types</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        path: "business" as AuditPath,
                        letter: "B",
                        title: "For Businesses",
                        desc: "Workforce performance audit system. 20 questions covering energy, recovery, stress, nutrition and cognitive output. Designed for HR leaders, managers and wellbeing programmes.",
                        cta: "Deploy Audit",
                        page: "/for-businesses",
                      },
                      {
                        path: "gym" as AuditPath,
                        letter: "G",
                        title: "For Gyms",
                        desc: "Member performance audit system. 20 questions covering training structure, recovery, nutrition, conditioning and physical resilience. Designed for gym owners and coaches.",
                        cta: "Access Platform",
                        page: "/for-gyms",
                      },
                    ].map(({ path, letter, title, desc, cta, page }) => (
                      <Card key={path} className="bg-card border border-card-border hover:border-primary/40 transition-colors duration-200">
                        <CardContent className="p-8">
                          <div className="text-primary text-3xl font-black mb-4">{letter}</div>
                          <h3 className="text-xl font-bold mb-2">{title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{desc}</p>
                          <div className="flex gap-3 flex-wrap">
                            <Link href="/demo">
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                                Request Demo
                              </Button>
                            </Link>
                            <Link href="/login">
                              <Button variant="outline" className="border-border hover:border-primary/40 font-semibold">
                                Access Platform
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section id="pricing" className="py-24 px-4 border-b border-border/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-4xl relative">
                  <div className="text-center mb-14">
                    <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-3">Licensing</p>
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Annual licences. No monthly billing.</h2>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                      Each licence includes full access to the audit system, scoring model, and reporting capability. Deployed internally across your organisation or gym.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business licence */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                      <div className="relative bg-card border border-primary/30 rounded-2xl p-8 h-full flex flex-col shadow-lg shadow-primary/5">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-t-2xl" />
                        <div className="mb-6">
                          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Business</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-black tracking-tight">£249</span>
                            <span className="text-muted-foreground text-sm font-medium">/ year</span>
                          </div>
                          <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">Business Licence</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                          {[
                            "Workforce performance audit",
                            "Department insights",
                            "Aggregated reporting",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <a href="https://buy.stripe.com/8x29ASdLL99z3ycbMX6AM05" target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="w-full h-13 font-bold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl">
                            Purchase Business Licence
                          </Button>
                        </a>
                      </div>
                    </motion.div>

                    {/* Gym licence */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
                      <div className="relative bg-card border border-card-border rounded-2xl p-8 h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
                        <div className="mb-6">
                          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-3 py-1 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gym</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-black tracking-tight">£149</span>
                            <span className="text-muted-foreground text-sm font-medium">/ year</span>
                          </div>
                          <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">Gym Licence</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                          {[
                            "Member performance audit",
                            "Coaching insights",
                            "Retention tracking",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <a href="https://buy.stripe.com/fZudR89vvdpP9WA9EP6AM06" target="_blank" rel="noopener noreferrer">
                          <Button size="lg" variant="outline" className="w-full h-13 font-bold text-base border-border hover:border-primary/40 hover:bg-muted/60 rounded-xl transition-colors duration-200">
                            Purchase Gym Licence
                          </Button>
                        </a>
                      </div>
                    </motion.div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground/40 mt-8">
                    All licences include a commercial use agreement. To discuss volume pricing or custom deployments, email{" "}
                    <a href="mailto:hello@fitest.co.uk" className="text-muted-foreground/60 hover:text-primary transition-colors">hello@fitest.co.uk</a>.
                  </p>
                </div>
              </section>

              {/* Disclaimer */}
              <section className="py-10 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                  <p className="text-xs text-muted-foreground/50 italic leading-relaxed max-w-2xl mx-auto">
                    This audit is for informational and educational purposes only and does not constitute medical advice. Always consult a qualified professional.
                  </p>
                </div>
              </section>

            </motion.div>
          )}

          {/* ── CONSENT SCREEN ── */}
          {phase === "consent" && (
            <motion.div key="consent" ref={consentRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex items-start justify-center px-4 py-16">
              <div className="max-w-lg w-full space-y-6">

                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                    {auditPath === "gym" ? "Member Performance Audit" : "Workforce Performance Audit"}
                  </p>
                  <h2 className="text-2xl font-black mb-1">Before you begin</h2>
                  <p className="text-sm text-muted-foreground">Please read and agree to the following before starting your audit.</p>
                </div>

                {/* Medical disclaimer box */}
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Medical Disclaimer</p>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                    This audit is <strong>not medical advice</strong>. It is a self-assessment tool for informational and educational purposes only. It does not diagnose, treat or prevent any condition.
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                    Do not rely on your score as a substitute for professional medical, nutritional or fitness advice. If you have any existing health condition or concern, consult a qualified healthcare professional before acting on your results.
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    If you are experiencing a medical emergency, call 999 (UK) or your local emergency services immediately.
                  </p>
                </div>

                {/* Privacy box */}
                <div className="bg-card border border-card-border rounded-xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Your Privacy</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Your email address and audit responses are collected by Leadsopedia Limited (trading as Fitest), Company No. 13145058, solely to generate your personal performance report.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    We do not sell your data. We retain it for up to 24 months. You can request deletion at any time by emailing <span className="text-foreground">hello@fitest.co.uk</span>.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For full details see our{" "}
                    <Link href="/privacy-policy" className="text-primary underline underline-offset-2 hover:text-primary/80">Privacy Policy</Link>,{" "}
                    <Link href="/gdpr" className="text-primary underline underline-offset-2 hover:text-primary/80">GDPR Statement</Link>{" "}
                    and{" "}
                    <Link href="/medical-disclaimer" className="text-primary underline underline-offset-2 hover:text-primary/80">Medical Disclaimer</Link>.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentMedical}
                      onChange={(e) => setConsentMedical(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      I understand this audit is for informational purposes only and is not a substitute for professional medical advice.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      I agree to my data being processed as described in the Privacy Policy and GDPR Statement above.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleBeginAudit}
                    disabled={!consentMedical || !consentPrivacy}
                    className="flex-1 h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  >
                    Begin Audit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRetake}
                    className="h-12 border-border hover:bg-muted px-6"
                  >
                    Back
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground/40 text-center">
                  Fitest is a trading name of Leadsopedia Limited &middot; Company No. 13145058 &middot; London, United Kingdom
                </p>

              </div>
            </motion.div>
          )}

          {/* ── AUDIT ── */}
          {phase === "audit" && (
            <motion.div key="audit" ref={auditRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex flex-col">
              <div className="container mx-auto px-4 py-10 max-w-2xl flex-1 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                      {auditPath === "gym" ? "For Gyms" : "For Businesses"}
                    </p>
                    <p className="text-sm font-bold">{auditLabel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 bg-card border border-card-border rounded-full px-3 py-1">
                      <svg className="w-3 h-3 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <span className="text-xs font-semibold text-muted-foreground">Secure &amp; Confidential</span>
                    </div>
                    <button onClick={handleRetake} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Exit
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question card with swipe */}
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentQ}
                      custom={direction}
                      variants={{
                        enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d: number) => ({ x: d * -80, opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.08}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60 && answers[currentQ] !== null) goNext();
                        else if (info.offset.x > 60) goPrev();
                      }}
                      className="select-none"
                    >
                      <div className="bg-card border border-card-border rounded-2xl p-8 md:p-12 shadow-xl mb-8">
                        <p className="text-xs font-mono text-muted-foreground/50 mb-4 uppercase tracking-widest">
                          {String(currentQ + 1).padStart(2, "0")} of {questions.length}
                        </p>
                        <p className="text-xl md:text-2xl font-semibold leading-snug mb-10">
                          {questions[currentQ]}
                        </p>

                        {/* Rating boxes */}
                        <div className="flex gap-3 justify-center mb-4">
                          {[1, 2, 3, 4, 5].map((n) => {
                            const selected = answers[currentQ] === n;
                            return (
                              <button
                                key={n}
                                onClick={() => handleRating(n)}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 font-bold text-xl transition-all duration-150 cursor-pointer ${
                                  selected
                                    ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/25"
                                    : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-muted/40"
                                }`}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                          <span>Strongly Disagree</span>
                          <span>Strongly Agree</span>
                        </div>
                        {answers[currentQ] !== null && (
                          <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-xs text-primary font-semibold mt-4"
                          >
                            {RATING_LABELS[answers[currentQ] as number]}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={goPrev}
                      disabled={currentQ === 0}
                      className="border-border gap-2"
                    >
                      <ChevronLeft size={16} /> Previous
                    </Button>

                    {currentQ === questions.length - 1 ? (
                      <Button
                        onClick={handleGetScore}
                        disabled={!canSubmit}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2"
                      >
                        Get Score
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={goNext}
                        disabled={answers[currentQ] === null}
                        className="border-border gap-2"
                      >
                        Next <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ── EMAIL GATE ── */}
          {phase === "email" && (
            <motion.div key="email" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex items-start justify-center px-4 py-16">
              <div className="max-w-md w-full">

                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-1.5">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span className="text-xs font-semibold text-muted-foreground tracking-wide">Secure &amp; Confidential Audit</span>
                  </div>
                </div>

                <div className="bg-card border border-card-border rounded-2xl p-8 shadow-2xl shadow-black/20">
                  <div className="text-center mb-7">
                    <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-black text-lg">F</span>
                    </div>
                    <h2 className="text-xl font-black mb-1.5">One last step</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter your details to receive your personalised performance report. Your data is processed securely and never shared.
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {/* Work email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {auditPath === "gym" ? "Email Address" : "Work Email"}
                      </label>
                      <Input
                        type="email"
                        placeholder={auditPath === "gym" ? "you@example.com" : "you@company.com"}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        className="h-11 bg-background border-border focus:border-primary"
                      />
                      {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                    </div>

                    {/* Company / Gym name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {auditPath === "gym" ? "Gym Name" : "Company Name"}
                      </label>
                      <Input
                        type="text"
                        placeholder={auditPath === "gym" ? "e.g. Apex Performance Gym" : "e.g. Acme Corporation"}
                        value={companyName}
                        onChange={(e) => { setCompanyName(e.target.value); setCompanyNameError(""); }}
                        className="h-11 bg-background border-border focus:border-primary"
                      />
                      {companyNameError && <p className="text-red-400 text-xs mt-1">{companyNameError}</p>}
                    </div>

                    {/* Department — business only */}
                    {auditPath === "business" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</label>
                        <Input
                          type="text"
                          placeholder="e.g. Sales, Operations, HR"
                          value={department}
                          onChange={(e) => { setDepartment(e.target.value); setDepartmentError(""); }}
                          className="h-11 bg-background border-border focus:border-primary"
                        />
                        {departmentError && <p className="text-red-400 text-xs mt-1">{departmentError}</p>}
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                      Reveal My Score
                    </Button>
                  </form>

                  {/* Trust signals */}
                  <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-3 gap-3">
                    {[
                      { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "SSL Secured" },
                      { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "GDPR Compliant" },
                      { icon: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88", label: "No Spam" },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                        <svg className="w-4 h-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                        <span className="text-xs text-muted-foreground/50">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground/30 mt-5">
                  Fitest &middot; Leadsopedia Limited &middot; Company No. 13145058
                </p>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && resultScore !== null && activeTier && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-20 max-w-xl text-center space-y-8">

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">{auditLabel}</p>
                <div className={`inline-block px-6 py-2 rounded-full border ${activeTier.border} ${activeTier.bg}`}>
                  <span className={`text-sm font-bold uppercase tracking-widest ${activeTier.color}`}>{activeTier.name} Tier</span>
                </div>
              </motion.div>

              <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter tabular-nums">
                <AnimatedCounter value={resultScore} />
                <span className="text-4xl text-muted-foreground">/100</span>
              </div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-base text-muted-foreground leading-relaxed">
                {activeTier.description}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }} className="bg-card border border-card-border rounded-xl p-6">
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: "linear-gradient(to right, #ef4444, #f59e0b, #a3e635, #10b981)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${resultScore}%` }}
                    transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  {TIERS.map((t) => (
                    <span key={t.name} className={`text-xs font-bold uppercase tracking-wider ${activeTier.name === t.name ? t.color : "text-muted-foreground/40"}`}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }} className="bg-card border border-card-border rounded-xl p-6 text-left">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Your answers, question by question</h3>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-mono text-muted-foreground/50 w-5 shrink-0 mt-0.5">{i + 1}.</span>
                      <span className="text-sm text-muted-foreground flex-1 leading-snug">{q}</span>
                      <span className="text-sm font-bold text-primary font-mono shrink-0">{answers[i]}/5</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="text-xs text-muted-foreground/50 italic leading-relaxed">
                This audit is for informational and educational purposes only and does not constitute medical advice. Always consult a qualified professional.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} className="flex gap-4 justify-center flex-wrap pt-4">
                <Button size="lg" onClick={() => window.print()} className="h-12 px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                  Download Report
                </Button>
                <Button variant="outline" size="lg" onClick={handleRetake} className="h-12 px-8 border-border hover:bg-muted font-semibold uppercase tracking-wider">
                  New Audit
                </Button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
