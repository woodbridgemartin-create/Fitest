import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UseCase = "business" | "gym" | "";
type Phase = "form" | "confirmation";

const FORMSPREE = "https://formspree.io/f/maqvqwrb";

const TEAM_SIZES = ["1 – 10", "11 – 50", "51 – 200", "201 – 500", "500+"];

const STRIPE = {
  business: "https://buy.stripe.com/8x29ASdLL99z3ycbMX6AM05",
  gym: "https://buy.stripe.com/fZudR89vvdpP9WA9EP6AM06",
};

export default function Demo() {
  const [phase, setPhase] = useState<Phase>("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState<UseCase>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (!company.trim()) e.company = "Please enter your company or gym name.";
    if (!teamSize) e.teamSize = "Please select a team size.";
    if (!useCase) e.useCase = "Please select a use case.";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          team_size: teamSize,
          use_case: useCase,
          _subject: `Fitest demo request from ${name} — ${company}`,
        }),
      });
      if (res.ok) {
        setPhase("confirmation");
      } else {
        setSubmitError("Something went wrong. Please email us at hello@fitest.co.uk.");
      }
    } catch {
      setSubmitError("Could not send request. Please email us at hello@fitest.co.uk.");
    } finally {
      setSubmitting(false);
    }
  }

  function field(id: string) {
    return {
      error: errors[id],
      clear: () => setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; }),
    };
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
          <Link href="/">
            <span className="text-lg font-black tracking-tight cursor-pointer select-none">
              <span className="text-primary">F</span>ITEST
            </span>
          </Link>
          <Link href="/">
            <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Back to home
            </span>
          </Link>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-4 py-16 max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

              {/* Left — copy */}
              <div className="md:pt-4">
                <div className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-3 py-1 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Request Demo</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                  See how Fitest works inside your organisation
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Fill in your details and we will be in touch within one business day to walk you through the platform and discuss your deployment options.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", text: "Private audit deployment for your team or members" },
                    { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", text: "Tiered scoring and aggregated performance data" },
                    { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", text: "GDPR-compliant. Annual licence. No monthly billing." },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Fast track */}
                <div className="mt-10 pt-8 border-t border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Prefer to skip the demo?
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">Purchase your licence instantly below.</p>
                  <div className="flex flex-col gap-3">
                    <a href={STRIPE.business} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                        Purchase Business Licence — £249/yr
                      </Button>
                    </a>
                    <a href={STRIPE.gym} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full font-bold border-border hover:border-primary/40 hover:bg-muted/60">
                        Purchase Gym Licence — £149/yr
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="bg-card border border-card-border rounded-2xl p-8 shadow-xl shadow-black/20">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Your details</p>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => { setName(e.target.value); field("name").clear(); }}
                      className="h-11 bg-background border-border"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); field("email").clear(); }}
                      className="h-11 bg-background border-border"
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company / Gym Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Acme Ltd or Apex Gym"
                      value={company}
                      onChange={(e) => { setCompany(e.target.value); field("company").clear(); }}
                      className="h-11 bg-background border-border"
                    />
                    {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
                  </div>

                  {/* Team size */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team / Member Size</Label>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => { setTeamSize(size); field("teamSize").clear(); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                            teamSize === size
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.teamSize && <p className="text-xs text-red-400 mt-1">{errors.teamSize}</p>}
                  </div>

                  {/* Use case */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Use Case</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["business", "gym"] as UseCase[]).map((uc) => (
                        <button
                          key={uc}
                          type="button"
                          onClick={() => { setUseCase(uc); field("useCase").clear(); }}
                          className={`flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-150 text-left ${
                            useCase === uc
                              ? "bg-primary/10 border-primary/40 text-foreground"
                              : "bg-background border-border text-muted-foreground hover:border-primary/20"
                          }`}
                        >
                          <span className={`text-sm font-bold capitalize ${useCase === uc ? "text-primary" : ""}`}>
                            {uc === "business" ? "Business" : "Gym"}
                          </span>
                          <span className="text-xs leading-snug">
                            {uc === "business" ? "Workforce performance audit" : "Member performance audit"}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.useCase && <p className="text-xs text-red-400 mt-1">{errors.useCase}</p>}
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 mt-2"
                  >
                    {submitting ? "Sending…" : "Request Demo"}
                  </Button>

                  <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
                    We will respond within one business day. No spam, ever.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "confirmation" && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="container mx-auto px-4 py-20 max-w-2xl"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h1 className="text-3xl font-black mb-3">Thank you, {name.split(" ")[0]}.</h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  We will be in touch within one business day.
                </p>
              </motion.div>
            </div>

            {/* Fast track — Stripe */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-card border border-card-border rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Fast Track</p>
                <h2 className="text-xl font-black mb-2">Prefer to skip the demo?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Purchase your licence instantly and get immediate access to the audit platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border border-primary/20 rounded-xl p-5 flex flex-col gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-0.5 mb-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">Business</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">£249</span>
                      <span className="text-sm text-muted-foreground">/ year</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {["Workforce performance audit", "Department insights", "Aggregated reporting"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href={STRIPE.business} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                      Purchase Business Licence
                    </Button>
                  </a>
                </div>

                <div className="bg-background border border-border rounded-xl p-5 flex flex-col gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-muted rounded-full px-2.5 py-0.5 mb-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gym</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">£149</span>
                      <span className="text-sm text-muted-foreground">/ year</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {["Member performance audit", "Coaching insights", "Retention tracking"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href={STRIPE.gym} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <Button variant="outline" className="w-full font-bold border-border hover:border-primary/40 hover:bg-muted/60">
                      Purchase Gym Licence
                    </Button>
                  </a>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground/40 mt-5">
                All licences include a commercial use agreement. Payments are processed securely by Stripe.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-8">
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Return to homepage
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
