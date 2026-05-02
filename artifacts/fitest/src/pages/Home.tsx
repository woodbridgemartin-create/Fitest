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

function PrintReport({ email, auditPath, questions, answers, score }: PrintReportProps) {
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
  { step: "01", title: "Select Your Audit", body: "Choose the Business audit for workforce performance or the Gym audit for member performance. Each is tailored to its context." },
  { step: "02", title: "Answer 20 Questions", body: "Rate each statement on a scale of 1 to 5. The audit covers energy, recovery, stress, nutrition and physical output." },
  { step: "03", title: "Get Your Score", body: "Receive a validated score from 0 to 100 mapped to one of four tiers: Critical, Exposed, Performing or Elite. Download your report." },
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
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
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const activeTier = resultScore !== null ? getTier(resultScore) : null;
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <>
      {resultScore !== null && auditPath && (
        <PrintReport email={email} auditPath={auditPath} questions={questions} answers={answers} score={resultScore} />
      )}

      <div className="min-h-screen bg-background text-foreground print:hidden" ref={topRef}>

        {/* ── LANDING ── */}
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

              {/* Hero */}
              <section className="text-center py-24 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase">
                      <span className="text-primary">F</span>ITEST
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-3">
                      Benchmark Your Performance
                    </p>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold opacity-70 mb-10">
                      Score your readiness in under 4 minutes
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button onClick={() => handleSelectAudit("business")} size="lg" className="h-13 px-8 font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Business Audit
                      </Button>
                      <Button onClick={() => handleSelectAudit("gym")} size="lg" variant="outline" className="h-13 px-8 font-bold rounded-full border-border hover:bg-muted">
                        Gym Audit
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* What is Fitest */}
              <section className="py-20 px-4 border-b border-border/30">
                <div className="container mx-auto max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">What is Fitest?</p>
                      <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Performance intelligence. In 4 minutes.</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Fitest is a structured performance benchmarking platform that gives individuals, businesses and gyms a fast, validated score across four key pillars: energy, recovery, nutrition and physical output.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Most organisations have no objective way to measure human performance before it deteriorates. Fitest changes that. Answer 20 targeted questions and receive a score from 0 to 100, mapped to one of four performance tiers.
                      </p>
                    </div>
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
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">The process</p>
                    <h2 className="text-2xl md:text-3xl font-black">Three steps to your score</h2>
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
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">Built for two audiences</p>
                    <h2 className="text-2xl md:text-3xl font-black">Start your audit</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        path: "business" as AuditPath,
                        letter: "B",
                        title: "For Businesses",
                        desc: "Workforce performance audit. 20 questions covering energy, recovery, stress, nutrition and cognitive output. Ideal for HR leaders, managers and wellbeing programmes.",
                        cta: "Start Business Audit",
                        page: "/for-businesses",
                      },
                      {
                        path: "gym" as AuditPath,
                        letter: "G",
                        title: "For Gyms",
                        desc: "Member performance audit. 20 questions covering training structure, recovery, nutrition, conditioning and physical resilience. Ideal for gym owners and coaches.",
                        cta: "Start Gym Audit",
                        page: "/for-gyms",
                      },
                    ].map(({ path, letter, title, desc, cta, page }) => (
                      <Card key={path} className="bg-card border border-card-border hover:border-primary/40 transition-colors duration-200">
                        <CardContent className="p-8">
                          <div className="text-primary text-3xl font-black mb-4">{letter}</div>
                          <h3 className="text-xl font-bold mb-2">{title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{desc}</p>
                          <div className="flex gap-3">
                            <Button onClick={() => handleSelectAudit(path)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                              {cta}
                            </Button>
                            <Link href={page}>
                              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                Learn more
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                    Start Audit
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
                  <button onClick={handleRetake} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Exit
                  </button>
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
            <motion.div key="email" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="min-h-screen flex items-center justify-center px-4">
              <div className="max-w-md w-full bg-card border border-card-border rounded-2xl p-10 shadow-2xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary font-black text-xl">F</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Almost there</h2>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Enter your email to reveal your score and unlock your downloadable performance report.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className="h-12 text-center bg-background border-border focus:border-primary"
                  />
                  {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                  <Button type="submit" size="lg" className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    Reveal My Score
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground/50 mt-4">
                  No spam. Your data is kept private and secure.
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
                  Retake Audit
                </Button>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
