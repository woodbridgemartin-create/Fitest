import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    category: "About the Audit",
    items: [
      {
        q: "What does the Fitest audit measure?",
        a: "The audit measures human performance across five key domains: mental freshness and focus, sleep quality and recovery, energy stability, physical activity, and stress resilience. Each question is scored on a 1 to 5 scale and the total is mapped to a 0 to 100 performance score.",
      },
      {
        q: "How long does the audit take?",
        a: "The audit contains 20 questions and takes between 3 and 4 minutes to complete. It is designed to be fast enough to deploy at scale across a team or membership base without disrupting workflows.",
      },
      {
        q: "Is there a different audit for businesses and gyms?",
        a: "Yes. The Business audit covers workforce performance: energy, stress, nutrition, burnout and cognitive output. The Gym audit covers member performance: training structure, recovery, conditioning, coaching and physical resilience. Both use the same scoring and tiering framework.",
      },
      {
        q: "What do the four tiers mean?",
        a: "Critical (0 to 25): immediate intervention needed. Exposed (26 to 50): vulnerability present, key pillars need attention. Performing (51 to 75): solid foundation, optimisation will drive elite output. Elite (76 to 100): exceptional baseline, sustain and refine.",
      },
    ],
  },
  {
    category: "Data and Privacy",
    items: [
      {
        q: "What happens with my email address?",
        a: "Your email is used solely to associate your audit report with your results. It is not shared with third parties, sold, or used for unsolicited marketing. You can request deletion of your data at any time by contacting us.",
      },
      {
        q: "Is the audit anonymous?",
        a: "The audit can be deployed anonymously (without email capture) or with an email gate for report delivery. For business deployments, administrators can configure either mode depending on their data and compliance requirements.",
      },
      {
        q: "How is the score calculated?",
        a: "Each of the 20 questions is answered on a 1 to 5 scale (Strongly Disagree to Strongly Agree). The total is divided by the maximum possible score (100) and multiplied by 100 to give a percentage. This is then mapped to the nearest tier threshold.",
      },
    ],
  },
  {
    category: "Licensing and Access",
    items: [
      {
        q: "Is Fitest free to use?",
        a: "The individual audit is free. Business and gym deployments at scale, including white-label branding, department-level analytics, and team dashboards, are available under a commercial licence. Contact us for pricing.",
      },
      {
        q: "Can I white-label the audit for my brand?",
        a: "Yes. White-label licensing is available for both business and gym deployments. This includes your logo, brand colours and domain. Contact us to discuss your requirements.",
      },
      {
        q: "Can I embed the audit on my own website?",
        a: "Yes. Embed options are available under the commercial licence. We provide an iframe snippet or API access depending on your technical requirements.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium leading-snug group-hover:text-primary transition-colors duration-150">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5 text-muted-foreground"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about Fitest.
          </p>
        </motion.div>

        <div className="space-y-12">
          {FAQS.map((section, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.1, duration: 0.4 }}
            >
              <h2 className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">
                {section.category}
              </h2>
              <div className="bg-card border border-card-border rounded-2xl px-6">
                {section.items.map((item, ii) => (
                  <FAQItem key={ii} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center bg-card border border-card-border rounded-2xl p-10">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-6">
            We are happy to help. Reach out and we will get back to you within one business day.
          </p>
          <Link href="/contact">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
