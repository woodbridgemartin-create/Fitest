import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import { BUSINESS_QUESTIONS, GYM_QUESTIONS, getTier } from "@/lib/audit-data";

export default function AuditPage() {
  const [, navigate] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") === "gym" ? "gym" : "business";
  const clientId = params.get("client");

  const [step, setStep] = useState<"consent" | "questions" | "result">("consent");
  const [consent, setConsent] = useState({ medical: false, privacy: false });

  const [answers, setAnswers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [resultData, setResultData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [needsSupport, setNeedsSupport] = useState(false);

  const questions = type === "gym" ? GYM_QUESTIONS : BUSINESS_QUESTIONS;

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // =========================
  // CONSENT SCREEN
  // =========================
  if (step === "consent") {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-8">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black">PRE AUDIT CONSENT</h1>
          </div>

          <Card className="p-6 border-amber-500/40 bg-amber-500/5">
            <div className="flex gap-4">
              <AlertTriangle className="text-amber-500" />
              <p className="text-sm">
                This audit is for informational purposes only and does not constitute medical advice.
              </p>
            </div>
          </Card>

          <Card className="p-6 border-blue-500/30 bg-blue-500/5">
            <div className="flex gap-4">
              <ShieldCheck className="text-blue-600" />
              <p className="text-sm">
                Data is processed securely. Individual responses are confidential.
              </p>
            </div>
          </Card>

          <div className="space-y-4 pt-6">
            <div className="flex gap-3">
              <Checkbox
                checked={consent.medical}
                onCheckedChange={(v) => setConsent({ ...consent, medical: !!v })}
              />
              <span>I understand and accept</span>
            </div>

            <div className="flex gap-3">
              <Checkbox
                checked={consent.privacy}
                onCheckedChange={(v) => setConsent({ ...consent, privacy: !!v })}
              />
              <span>I agree to data processing</span>
            </div>

            <Button
              className="w-full bg-blue-600 text-white h-14"
              disabled={!consent.medical || !consent.privacy}
              onClick={() => setStep("questions")}
            >
              START AUDIT
            </Button>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // RESULT SCREEN
  // =========================
  if (step === "result" && resultData) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-10">

          <h1 className="text-4xl font-black">YOUR SCORE</h1>

          <div className="text-6xl font-black text-blue-600">
            {resultData.score}
          </div>

          <div className="text-xl font-bold uppercase">
            {resultData.tier.name}
          </div>

          <p className="text-muted-foreground">
            {resultData.tier.description}
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* GYM SUPPORT */}
          {type === "gym" && (
            <div className="flex justify-center gap-2">
              <Checkbox
                checked={needsSupport}
                onCheckedChange={(v) => setNeedsSupport(!!v)}
              />
              <span>Request support from gym</span>
            </div>
          )}

          <Button
            className="w-full bg-black text-white"
            onClick={() => {

              if (clientId === "DEMO123") {
                const existing = JSON.parse(localStorage.getItem("demo_submissions") || "[]");

                const entry = {
                  id: Math.random().toString(36).substring(7),
                  email,
                  score: resultData.score,
                  tier: resultData.tier.name,
                  support: needsSupport,
                  timestamp: new Date().toISOString(),
                  type
                };

                localStorage.setItem("demo_submissions", JSON.stringify([entry, ...existing]));
              }

              window.print();
            }}
          >
            DOWNLOAD REPORT
          </Button>

        </div>
      </div>
    );
  }

  // =========================
  // QUESTIONS
  // =========================
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

  const finishAudit = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    const score = Math.round((total / (questions.length * 5)) * 100);
    const tier = getTier(score);

    setResultData({ score, tier });
    setStep("result");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">

      <div className="max-w-3xl mx-auto">

        <div className="mb-10 flex justify-between">
          <h2 className="text-sm font-bold uppercase">
            Section {currentPage + 1} of {totalPages}
          </h2>
          <span className="font-bold">
            {Math.round((answers.filter(a => a).length / questions.length) * 100)}%
          </span>
        </div>

        <div className="space-y-12">

          {questions
            .slice(currentPage * 10, (currentPage + 1) * 10)
            .map((q, i) => {
              const index = currentPage * 10 + i;

              return (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-xl font-bold mb-4">
                    {index + 1}. {q}
                  </h3>

                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleAnswer(index, num)}
                        className={`h-14 border ${
                          answers[index] === num
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}

        </div>

        <div className="mt-16 flex justify-end">
          {currentPage === 0 ? (
            <Button
              disabled={!isPageComplete()}
              onClick={() => setCurrentPage(1)}
            >
              NEXT
            </Button>
          ) : (
            <Button
              disabled={!isPageComplete()}
              onClick={finishAudit}
            >
              COMPLETE
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
