import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const BUSINESS_QUESTIONS = [
  "I feel mentally fresh at the start of most workdays.",
  "I sleep seven or more hours of quality sleep most nights.",
  "My energy stays steady through the afternoon without crashes.",
  "I move my body for at least 30 minutes daily.",
  "My stress levels feel manageable week to week.",
  "I switch off from work in the evenings and at weekends.",
  "I eat regular, nourishing meals during the workday.",
  "I rarely rely on caffeine to function.",
  "My blood sugar feels stable, with no mid morning slumps.",
  "I sleep without anxiety or racing thoughts.",
  "I drink at least two litres of water across the day.",
  "I rarely crave sugar or ultra processed snacks.",
  "I rarely experience symptoms of burnout.",
  "I recover quickly from a bad night of sleep.",
  "My waist measurement is stable or improving.",
  "I take my full annual leave allowance.",
  "I can focus deeply for 60 minutes without crashing.",
  "I rarely feel inflamed, bloated or sluggish after meals.",
  "I rarely work late or at weekends.",
  "Overall, I feel energised, focused and resilient day to day.",
];

const GYM_QUESTIONS = [
  "I train with a structured programme, not random workouts.",
  "I hit my weekly strength training target of three or more sessions.",
  "I track measurable progress in my key lifts or output metrics.",
  "My recovery between sessions feels complete.",
  "I sleep seven or more hours of quality sleep most nights.",
  "My nutrition is built to support my training goal.",
  "I hydrate consistently throughout training days.",
  "I rarely train through pain or injury.",
  "I include mobility and flexibility work weekly.",
  "I include conditioning work appropriate to my goal.",
  "My energy in sessions is consistently high.",
  "I have clear performance goals for the next 90 days.",
  "I deload or rest when my body signals fatigue.",
  "My body composition matches my performance goal.",
  "I manage stress without it killing my output.",
  "I supplement strategically, not impulsively.",
  "I warm up and cool down properly every session.",
  "I have access to coaching or expert feedback.",
  "I am motivated to train without forcing myself.",
  "Overall, my body feels physically resilient and capable.",
];

const TIERS = [
  { name: "Critical", min: 0, max: 25, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10", description: "Immediate intervention needed. Performance foundations are at risk." },
  { name: "Exposed", min: 26, max: 50, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10", description: "Vulnerability present. Key pillars need attention to prevent decline." },
  { name: "Performing", min: 51, max: 75, color: "text-lime-500", border: "border-lime-500/20", bg: "bg-lime-500/10", description: "A solid performing tier. Now it is about optimisation: recovery quality, stress mastery and the marginal gains that move you into Elite." },
  { name: "Elite", min: 76, max: 100, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10", description: "Exceptional foundation. Sustain it, refine the edges, and set the standard." },
];

type AuditPath = "business" | "gym";

function getTier(score: number) {
  return TIERS.find(t => score >= t.min && score <= t.max) || TIERS[0];
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const interval = 20;
    const steps = duration / interval;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function Home() {
  const [auditPath, setAuditPath] = useState<AuditPath | null>(null);
  const [isAuditStarted, setIsAuditStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [resultScore, setResultScore] = useState<number | null>(null);

  const pathRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = auditPath === "gym" ? GYM_QUESTIONS : BUSINESS_QUESTIONS;
  const auditLabel = auditPath === "gym" ? "Member Performance Audit" : "Workforce Performance Audit";

  const handleStartAudit = (path: AuditPath) => {
    setAuditPath(path);
    setIsAuditStarted(true);
    setResultScore(null);
    setAnswers(Array(path === "gym" ? GYM_QUESTIONS.length : BUSINESS_QUESTIONS.length).fill(3));
    setTimeout(() => {
      auditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleRetake = () => {
    setIsAuditStarted(false);
    setResultScore(null);
    setAuditPath(null);
    setTimeout(() => {
      pathRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSliderChange = (index: number, value: number[]) => {
    const newAnswers = [...answers];
    newAnswers[index] = value[0];
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    const score = Math.round((total / (questions.length * 5)) * 100);
    setResultScore(score);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const activeTier = resultScore !== null ? getTier(resultScore) : null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <main className="container mx-auto px-4 py-20 max-w-5xl">

        {/* Hero Section */}
        <section className="text-center space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
              <span className="text-primary">F</span>ITEST
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Benchmark Your Performance
            </p>
            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest font-semibold opacity-70">
              Score your readiness in under 4 minutes
            </p>
          </motion.div>
        </section>

        {/* Tiers Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className={`bg-card/50 border ${tier.border} ${activeTier?.name === tier.name ? tier.bg : ""} transition-colors duration-500 h-full`}>
                  <CardContent className="p-6 text-center">
                    <h3 className={`text-xl font-bold uppercase tracking-wider mb-2 ${tier.color}`}>
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {tier.min} — {tier.max}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Path Selector */}
        <AnimatePresence>
          {!isAuditStarted && (
            <motion.section
              ref={pathRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
            >
              <h2 className="text-center text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-8">
                Select your audit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartAudit("business")}
                  className="group relative bg-card border border-card-border hover:border-primary/40 rounded-2xl p-8 text-left transition-all duration-200 hover:bg-card/80 cursor-pointer"
                >
                  <div className="text-primary text-3xl font-black mb-3 group-hover:scale-105 transition-transform duration-200">
                    B
                  </div>
                  <h3 className="text-xl font-bold mb-2">For Businesses</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Workforce performance audit. Energy, recovery, stress and output for teams.
                  </p>
                  <div className="mt-6 text-xs uppercase tracking-widest font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Start audit →
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartAudit("gym")}
                  className="group relative bg-card border border-card-border hover:border-primary/40 rounded-2xl p-8 text-left transition-all duration-200 hover:bg-card/80 cursor-pointer"
                >
                  <div className="text-primary text-3xl font-black mb-3 group-hover:scale-105 transition-transform duration-200">
                    G
                  </div>
                  <h3 className="text-xl font-bold mb-2">For Gyms</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Member performance audit. Training, recovery, nutrition and physical resilience.
                  </p>
                  <div className="mt-6 text-xs uppercase tracking-widest font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Start audit →
                  </div>
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Audit Section */}
        <AnimatePresence>
          {isAuditStarted && resultScore === null && (
            <motion.section
              ref={auditRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto bg-card border border-card-border rounded-2xl p-8 md:p-12 shadow-2xl mb-24"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    {auditPath === "gym" ? "For Gyms" : "For Businesses"}
                  </p>
                  <h2 className="text-2xl font-bold">{auditLabel}</h2>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {questions.length} questions
                </span>
              </div>

              <div className="space-y-12">
                {questions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-3 items-start">
                        <span className="text-xs font-mono text-muted-foreground/60 w-5 shrink-0 mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <label className="text-base font-medium leading-snug">{q}</label>
                      </div>
                      <span className="text-2xl font-bold text-primary w-8 text-right font-mono shrink-0">
                        {answers[i]}
                      </span>
                    </div>
                    <div className="pl-8">
                      <Slider
                        value={[answers[i]]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(val) => handleSliderChange(i, val)}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                <button
                  onClick={handleRetake}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Change path
                </button>
                <Button
                  size="lg"
                  onClick={calculateScore}
                  className="h-12 px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Get Score
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Result Section */}
        <AnimatePresence>
          {resultScore !== null && activeTier && (
            <motion.section
              ref={resultRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto text-center space-y-8 mb-24"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                  {auditLabel}
                </p>
                <div className={`inline-block px-6 py-2 rounded-full border ${activeTier.border} ${activeTier.bg}`}>
                  <span className={`text-sm font-bold uppercase tracking-widest ${activeTier.color}`}>
                    {activeTier.name} Tier
                  </span>
                </div>
              </motion.div>

              <div className="relative">
                <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter tabular-nums text-foreground">
                  <AnimatedCounter value={resultScore} />
                  <span className="text-4xl text-muted-foreground">/100</span>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-base text-muted-foreground leading-relaxed"
              >
                {activeTier.description}
              </motion.p>

              {/* Tier progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 }}
                className="bg-card border border-card-border rounded-xl p-6"
              >
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
                  {TIERS.map(t => (
                    <span
                      key={t.name}
                      className={`text-xs font-bold uppercase tracking-wider ${activeTier.name === t.name ? t.color : "text-muted-foreground/40"}`}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="pt-4 flex gap-4 justify-center"
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRetake}
                  className="border-border hover:bg-muted font-semibold uppercase tracking-wider"
                >
                  Retake Audit
                </Button>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
