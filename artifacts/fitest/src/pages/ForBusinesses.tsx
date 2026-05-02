import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PROBLEMS = [
  {
    stat: "1 in 4",
    label: "employees report consistently low energy during the working day",
  },
  {
    stat: "67%",
    label: "of burnout cases go undetected until performance has already declined",
  },
  {
    stat: "3x",
    label: "more sick days are taken by employees in the Critical and Exposed tiers",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Deploy the Audit",
    body: "Share the 20-question workforce performance audit with your team. Anonymously or with email capture. Completed in under 4 minutes.",
  },
  {
    step: "02",
    title: "Receive Tiered Scores",
    body: "Each respondent is scored from 0 to 100 and placed into one of four tiers: Critical, Exposed, Performing or Elite.",
  },
  {
    step: "03",
    title: "Act on the Insight",
    body: "Identify where performance is breaking down at team or department level and implement targeted interventions with measurable outcomes.",
  },
];

const FEATURES = [
  "20-question validated performance audit",
  "Tiered scoring: Critical, Exposed, Performing, Elite",
  "Downloadable PDF report per respondent",
  "Department-level breakdown and benchmarking",
  "Anonymous or email-gated deployment",
  "Branded white-label version available",
];

export default function ForBusinesses() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border/40 py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary border border-primary/30 bg-primary/10 px-4 py-1.5 rounded-full mb-6">
              For Businesses
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Your team's performance<br />
              <span className="text-primary">starts with data.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Fitest gives HR leaders and managers a fast, evidence-informed view of workforce
              readiness: energy, recovery, stress, and output — scored and tiered in under 4 minutes.
            </p>
            <Link href="/demo">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem stats */}
      <section className="py-20 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <p className="text-center text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-12">
            The performance gap is hiding in plain sight
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="bg-card border border-card-border h-full">
                  <CardContent className="p-8">
                    <div className="text-4xl font-black text-primary mb-3">{p.stat}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                <div className="text-5xl font-black text-primary/20 mb-4 font-mono">{step.step}</div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-b border-border/40">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Everything you need to measure and act
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fitest is not a wellness survey. It is a performance intelligence platform —
                built to surface where human performance is breaking down before it costs you.
              </p>
              <Link href="/demo">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                  Request Demo
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-center gap-3 bg-card border border-card-border rounded-xl px-5 py-4"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to benchmark your workforce?
          </h2>
          <p className="text-muted-foreground mb-8">
            Deploy the audit system across your team. Business licences start from £249/yr.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request Demo
              </Button>
            </Link>
            <a href="/#pricing">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-bold rounded-full border-border hover:bg-muted"
              >
                Get Licence
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
