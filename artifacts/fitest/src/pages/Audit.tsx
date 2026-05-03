import { useState } from "react";
import { BUSINESS_QUESTIONS, GYM_QUESTIONS, getTier } from "../lib/auditData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditPage() {
  const [path, setPath] = useState<"business" | "gym" | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = path === "business" ? BUSINESS_QUESTIONS : GYM_QUESTIONS;

  const calculateScore = () => {
    const yesCount = Object.values(answers).filter(Boolean).length;
    return (yesCount / questions.length) * 100;
  };

  if (!path) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">Select Your Audit Path</h1>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setPath("business")}>Business Audit</Button>
          <Button onClick={() => setPath("gym")}>Gym Audit</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    const score = calculateScore();
    const tier = getTier(score);
    return (
      <div className="container mx-auto p-8 text-center">
        <Card className={`${tier.bg} ${tier.border}`}>
          <CardHeader>
            <CardTitle className={`text-3xl ${tier.color}`}>{tier.name} Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-4">{score}%</p>
            <p className="text-lg">{tier.description}</p>
            <Button className="mt-6" onClick={() => { setPath(null); setSubmitted(false); setAnswers({}); }}>
              Restart Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 capitalize">{path} Performance Audit</h1>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <span className="text-sm md:text-base pr-4">{q}</span>
            <div className="flex gap-2">
              <Button 
                variant={answers[index] === true ? "default" : "outline"}
                onClick={() => setAnswers({ ...answers, [index]: true })}
              >
                Yes
              </Button>
              <Button 
                variant={answers[index] === false ? "destructive" : "outline"}
                onClick={() => setAnswers({ ...answers, [index]: false })}
              >
                No
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button 
        className="w-full mt-8" 
        disabled={Object.keys(answers).length < questions.length}
        onClick={() => setSubmitted(true)}
      >
        Calculate Result
      </Button>
    </div>
  );
}
