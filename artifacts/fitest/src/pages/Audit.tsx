import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, ChevronRight, Layout } from "lucide-react";
import { BUSINESS_QUESTIONS, GYM_QUESTIONS, getTier } from "@/lib/audit-data";

export default function AuditPage() {
  const [, navigate] = useLocation();
  const [params] = useState(new URLSearchParams(window.location.search));
  const type = params.get("type") === "gym" ? "gym" : "business";
  const clientId = params.get("client");

  const [step, setStep] = useState<"consent" | "questions" | "result">("consent");
  const [consent, setConsent] = useState({ medical: false, privacy: false });
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const questions = type === "gym" ? GYM_QUESTIONS : BUSINESS_QUESTIONS;
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // 1. Consent Screen (The Gatekeeper)
  if (step === "consent") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-4">PRE-AUDIT CONSENT</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Mandatory Verification</p>
          </div>

          <Card className="p-6 border-amber-500/50 bg-amber-500/5 shadow-lg">
            <div className="flex gap-4">
              <AlertTriangle className="text-amber-500 shrink-0 h-6 w-6" />
              <div>
                <h3 className="font-black text-amber-500 uppercase text-sm tracking-tight">Medical Disclaimer</h3>
                <p className="text-sm leading-relaxed mt-2 text-foreground/80">
                  This audit is for informational and educational purposes only and does not constitute medical advice. 
                  In an emergency, always contact 999 or your local emergency services.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/5 shadow-lg">
            <div className="flex gap-4">
              <ShieldCheck className="text-primary shrink-0 h-6 w-6" />
              <div>
                <h3 className="font-black text-primary uppercase text-sm tracking-tight">Privacy & Data Handling</h3>
                <p className="text-sm leading-relaxed mt-2 text-foreground/80">
                  Data is processed by Leadsopedia Limited (Company No. 13145058). 
                  Individual responses remain confidential and are only shared in aggregated form with the organization.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-6 pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox id="medical" checked={consent.medical} onCheckedChange={(v) => setConsent({ ...consent, medical: !!v })} />
              <label htmlFor="medical" className="text-sm font-medium leading-none cursor-pointer">
                I understand this is not medical advice and I am fit to proceed.
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="privacy" checked={consent.privacy} onCheckedChange={(v) => setConsent({ ...consent, privacy: !!v })} />
              <label htmlFor="privacy" className="text-sm font-medium leading-none cursor-pointer">
                I agree to the privacy policy and data processing by Fitest.
              </label>
            </div>
            
            <Button 
              className="w-full h-16 text-lg font-black bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-all" 
              disabled={!consent.medical || !consent.privacy}
              onClick={() => setStep("questions")}
            >
              START THE AUDIT <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Question Logic
  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const isPageComplete = () => {
    const start = currentPage * 10;
    const end = start + 10;
    for (let i = start; i < end; i++) {
      if (answers[i] === undefined) return false;
    }
    return true;
  };

  const calculateAndFinish = () => {
    const totalPoints = answers.reduce((acc, curr) => acc + curr, 0);
    const score = (totalPoints / (questions.length * 5)) * 100;
    const finalScore = Math.round(score);
    const tier = getTier(finalScore);

    // DEMO BYPASS SYNC: Save to Dashboard without a DB
    if (clientId === "DEMO123") {
      const demoSubmissions = JSON.parse(localStorage.getItem("demo_submissions") || "[]");
      const newEntry = {
        id: `ENTRY-${Math.floor(Math.random() * 9000) + 1000}`,
        score: finalScore,
        tier: tier.name,
        timestamp: new Date().toISOString(),
        type: type,
        department: type === "business" ? "Strategy" : "N/A"
      };
      localStorage.setItem("demo_submissions", JSON.stringify([newEntry, ...demoSubmissions]));
    }

    // Redirect to Dashboard with the score
    navigate(`/dashboard?score=${finalScore}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b-2 border-black/5 pb-6">
          <div>
            <h2 className="text-xs font-black tracking-[0.2em] text-blue-600 uppercase">Performance Audit</h2>
            <p className="text-sm font-bold text-muted-foreground mt-1 uppercase">Section {currentPage + 1} of {totalPages}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black italic">{Math.round((answers.filter(a => a).length / questions.length) * 100)}%</span>
          </div>
        </header>

        <div className="space-y-16">
          {questions.slice(currentPage * 10, (currentPage + 1) * 10).map((q, i) => {
            const actualIndex = (currentPage * 10) + i;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={actualIndex} 
                className="space-y-6"
              >
                <h3 className="text-xl md:text-2xl font-black leading-tight tracking-tight">
                  <span className="text-blue-600 mr-2">{actualIndex + 1}.</span>
                  {q}
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(actualIndex, num)}
                      className={`h-16 md:h-20 flex flex-col items-center justify-center rounded-lg border-2 font-black text-xl transition-all ${
                        answers[actualIndex] === num 
                        ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                        : "border-slate-200 bg-white text-slate-300 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {num}
                      <span className="text-[8px] uppercase tracking-tighter opacity-60 mt-1">
                        {num === 1 ? "Never" : num === 5 ? "Always" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-20 pt-10 border-t-2 border-black/5 flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Fitest © {new Date().getFullYear()}
          </p>
          
          {currentPage === 0 ? (
            <Button 
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo(0, 0);
              }} 
              disabled={!isPageComplete()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 h-14 rounded-none"
            >
              NEXT 10 QUESTIONS
            </Button>
          ) : (
            <Button 
              onClick={calculateAndFinish} 
              disabled={!isPageComplete()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 h-14 rounded-none"
            >
              COMPLETE AUDIT
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
