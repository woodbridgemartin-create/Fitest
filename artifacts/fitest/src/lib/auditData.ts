import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft, BarChart3 } from "lucide-react";

// --- DATA LOGIC (Keep this inside or move to lib/auditData.ts) ---
export const BUSINESS_QUESTIONS = [
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

export const GYM_QUESTIONS = [
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

export const TIERS = [
  { name: "Critical", min: 0, max: 25, color: "text-red-500", border: "border-red-500/20", bg: "bg-red-500/10", description: "Immediate intervention needed. Performance foundations are at risk." },
  { name: "Exposed", min: 26, max: 50, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/10", description: "Vulnerability present. Key pillars need attention." },
  { name: "Performing", min: 51, max: 75, color: "text-lime-500", border: "border-lime-500/20", bg: "bg-lime-500/10", description: "Solid foundation. Focus on optimization and recovery." },
  { name: "Elite", min: 76, max: 100, color: "text-emerald-500", border: "border-emerald-500/20", bg: "bg-emerald-500/10", description: "Exceptional foundation. Sustain and refine the edges." },
];

export function getTier(score: number) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
}

// --- UI COMPONENT ---
export default function Audit() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [path, setPath] = useState<"business" | "gym" | null>(null);

  const questions = path === "business" ? BUSINESS_QUESTIONS : GYM_QUESTIONS;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    const total = answers.reduce((acc, val) => acc + val, 0);
    return (total / (questions.length * 5)) * 100;
  };

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-4xl font-black italic tracking-tighter">SELECT YOUR PATH</h1>
          <div className="grid gap-4">
            <button onClick={() => setPath("business")} className="p-8 border border-white/20 hover:border-white transition-all bg-white/5 rounded-2xl text-xl font-bold">BUSINESS PERFORMANCE</button>
            <button onClick={() => setPath("gym")} className="p-8 border border-white/20 hover:border-white transition-all bg-white/5 rounded-2xl text-xl font-bold">GYM & ATHLETIC</button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = Math.round(calculateScore());
    const tier = getTier(score);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center space-y-6">
          <div className={`inline-block px-6 py-2 rounded-full border ${tier.border} ${tier.bg} ${tier.color} font-bold tracking-widest uppercase`}>
            {tier.name} Status
          </div>
          <h2 className="text-7xl font-black tracking-tighter">{score}%</h2>
          <p className="text-gray-400 leading-relaxed">{tier.description}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white text-black font-bold rounded-full">RESTART AUDIT</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <div className="w-full bg-white/10 h-1 rounded-full mb-12">
          <motion.div 
            className="bg-white h-full rounded-full" 
            initial={{ width: 0 }} 
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }} 
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <span className="text-white/40 font-mono tracking-widest">QUESTION {step + 1}/{questions.length}</span>
            <h2 className="text-3xl font-bold leading-tight">{questions[step]}</h2>
            
            <div className="grid gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className="w-full text-left p-6 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all font-semibold"
                >
                  {val === 1 && "Strongly Disagree"}
                  {val === 2 && "Disagree"}
                  {val === 3 && "Neutral"}
                  {val === 4 && "Agree"}
                  {val === 5 && "Strongly Agree"}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
