
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CreditCard, CheckCircle2, ArrowRight, Copy, Globe } from "lucide-react";

type OrgType = "business" | "gym" | "";
type BillingCycle = "monthly" | "annual";

const TOTAL_STEPS = 6; 

function generateAuditCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("");
  const [departments, setDepartments] = useState<string[]>(["", "", ""]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [auditStartDate, setAuditStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const auditCode = useRef(generateAuditCode());
  const auditLink = `https://fitest.co.uk/?client=${auditCode.current}`;

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  function handleSetupValidation() {
    const newErrors: Record<string, string> = {};
    if (!orgName.trim()) newErrors.orgName = "Organisation name is required.";
    if (!orgType) newErrors.orgType = "Please select a type.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      next();
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(auditLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    if (step > 0) {
      const config = {
        name: orgName,
        type: orgType,
        departments: departments.filter(Boolean),
        clientId: auditCode.current,
        billing: billingCycle,
        activeFrom: auditStartDate
      };
      localStorage.setItem("fitest_config", JSON.stringify(config));
    }
  }, [step, orgName, orgType, departments, billingCycle, auditStartDate]);

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xl">F</span>
            </div>
            <span className="text-xl font-black tracking-tighter">FITEST</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "w-4 bg-primary" : "w-2 bg-muted"}`} />
              ))}
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">STEP 0{step + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" variants={variants} initial="enter" animate="center" exit="exit" className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 animate-pulse" />
                  <div className="relative bg-card border border-border p-6 rounded-2xl">
                    <Globe className="w-12 h-12 text-primary mx-auto" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">Deployment Ready.</h1>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                    Your licence is active. Let's configure your audit window and payment logic to get your data flowing.
                  </p>
                </div>
                <Button onClick={next} size="lg" className="rounded-full px-12 h-14 text-lg font-bold">
                  Begin Setup <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Organisation Identity</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Entity Name</Label>
                      <Input id="orgName" placeholder="e.g. Acme Corp" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(["business", "gym"] as const).map((t) => (
                        <button key={t} onClick={() => setOrgType(t)} className={`p-4 rounded-xl border-2 text-left ${orgType === t ? "border-primary bg-primary/5" : "border-border"}`}>
                          <span className="block font-bold capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleSetupValidation} className="w-full h-12 font-bold">Next: Calendar & Billing</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Calendar & Billing</h2>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label>Audit Start Date</Label>
                      <Input type="date" value={auditStartDate} onChange={(e) => setAuditStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <Label>Billing Frequency</Label>
                      <div className="flex p-1 bg-muted rounded-lg">
                        {(["monthly", "annual"] as const).map((cycle) => (
                          <button key={cycle} onClick={() => setBillingCycle(cycle)} className={`flex-1 py-2 text-sm font-bold rounded-md ${billingCycle === cycle ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                            {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={next} className="w-full h-12 font-bold">Generate Audit Link</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" variants={variants} initial="enter" animate="center" exit="exit" className="text-center space-y-8">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-black">{orgName} is Live.</h2>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full font-black h-14 rounded-full" onClick={() => localStorage.setItem("fitest_auth", "true")}>
                    LAUNCH DASHBOARD
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
