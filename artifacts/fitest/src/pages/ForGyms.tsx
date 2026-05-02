import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PROBLEMS = [
  {
    stat: "42%",
    label: "of gym members quit within 3 months due to lack of visible progress",
  },
  {
    stat: "60%",
    label: "train without a structured programme, limiting their results",
  },
  {
    stat: "2x",
    label: "higher retention when members track measurable performance outcomes",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Onboard Members",
    body: "Deploy the 20-question member performance audit at sign-up or during a consultation. Completed in under 4 minutes.",
  },
  {
    step: "02",
    title: "Score and Tier",
    body: "Each member receives a score from 0 to 100 across training structure, recovery, nutrition and mental resilience.",
  },
  {
    step: "03",
    title: "Coach With Data",
    body: "Use the tiered breakdown to prioritise coaching conversations and design smarter programmes with measurable outcomes.",
  },
];

const FEATURES = [
  "20-question member performance audit",
  "Covers training, recovery, nutrition and resilience",
  "Tiered scoring: Critical, Exposed, Performing, Elite",
  "Downloadable PDF report per member",
  "Coaching conversation starter built in",
  "Branded white-label version available",
];

export default function ForGyms() {
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
              For Gyms
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Know your members'<br />
              <span className="text-primary">real performance baseline.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Fitest gives gym owners and coaches a fast, structured view of member readiness:
              training quality, recovery, nutrition and resilience. Scored and tiered in under 4 minutes.
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
            The retention problem starts with unmeasured performance
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
                Data-driven coaching starts here
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Stop guessing where members are struggling. Fitest gives you a structured
                baseline on day one, so every coaching conversation is grounded in real data,
                not assumptions.
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
            Ready to benchmark your members?
          </h2>
          <p className="text-muted-foreground mb-8">
            Deploy the audit system for your members. Gym licences start from £149/yr.
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
            <a href="https://buy.stripe.com/fZudR89vvdpP9WA9EP6AM06" target="_blank" rel="noopener noreferrer">
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
