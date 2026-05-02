import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const QUESTIONS = [
  "I feel mentally fresh at the start of most days",
  "I sleep well consistently",
  "My energy is stable throughout the day",
  "I exercise regularly",
  "My stress is manageable"
];

const TIERS = [
  { name: "Critical", min: 0, max: 25, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10" },
  { name: "Exposed", min: 26, max: 50, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10" },
  { name: "Performing", min: 51, max: 75, color: "text-lime-500", border: "border-lime-500/20", bg: "bg-lime-500/10" },
  { name: "Elite", min: 76, max: 100, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10" }
];

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
  const [isAuditStarted, setIsAuditStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(3));
  const [resultScore, setResultScore] = useState<number | null>(null);
  
  const auditRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStartAudit = () => {
    setIsAuditStarted(true);
    setResultScore(null);
    setAnswers(Array(QUESTIONS.length).fill(3));
    setTimeout(() => {
      auditRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSliderChange = (index: number, value: number[]) => {
    const newAnswers = [...answers];
    newAnswers[index] = value[0];
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    const score = Math.round((total / (QUESTIONS.length * 5)) * 100);
    setResultScore(score);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const activeTier = resultScore !== null ? getTier(resultScore) : null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <main className="container mx-auto px-4 py-20 max-w-5xl">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
              <span className="text-primary">F</span>ITEST
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Benchmark Your Team's Performance
            </p>
            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest font-semibold opacity-70">
              Get your readiness score in under 4 minutes
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={handleStartAudit}
              className="h-14 px-8 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105"
            >
              Start Audit
            </Button>
          </motion.div>
        </section>

        {/* Tiers Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className={`bg-card/50 border ${tier.border} ${activeTier?.name === tier.name ? tier.bg : ''} transition-colors duration-500`}>
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

        {/* Audit Section */}
        <AnimatePresence>
          {isAuditStarted && resultScore === null && (
            <motion.section
              ref={auditRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto bg-card border border-card-border rounded-2xl p-8 md:p-12 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Performance Audit</h2>
              
              <div className="space-y-12">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-lg font-medium leading-tight">{q}</label>
                      <span className="text-2xl font-bold text-primary w-8 text-right font-mono">
                        {answers[i]}
                      </span>
                    </div>
                    <Slider
                      value={[answers[i]]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(val) => handleSliderChange(i, val)}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                      <span>Strongly Disagree</span>
                      <span>Strongly Agree</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-border flex justify-end">
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
              className="max-w-xl mx-auto text-center space-y-8"
            >
              <div className={`inline-block px-6 py-2 rounded-full border ${activeTier.border} ${activeTier.bg}`}>
                <span className={`text-sm font-bold uppercase tracking-widest ${activeTier.color}`}>
                  {activeTier.name} Tier
                </span>
              </div>
              
              <div className="relative">
                <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter tabular-nums text-foreground">
                  <AnimatedCounter value={resultScore} />
                  <span className="text-4xl text-muted-foreground">/100</span>
                </div>
              </div>

              <p className="text-xl text-muted-foreground">
                Based on your responses, you are currently operating in the <strong className={activeTier.color}>{activeTier.name}</strong> zone.
              </p>

              <div className="pt-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleStartAudit}
                  className="border-border hover:bg-muted font-semibold uppercase tracking-wider"
                >
                  Retake Audit
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
