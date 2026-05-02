import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    category: "Audit Access",
    items: [
      {
        q: "Who can take the Fitest audit?",
        a: "The audit is only available to organisations and gyms with an active Fitest licence. It is not publicly accessible.",
      },
      {
        q: "How do users access the audit?",
        a: "Once a licence is purchased, a private audit link or platform access is provided for internal distribution.",
      },
    ],
  },
  {
    category: "Licensing",
    items: [
      {
        q: "What does a Fitest licence include?",
        a: "A Fitest licence provides access to the audit system, scoring model, and reporting capability for internal use within your organisation or gym.",
      },
      {
        q: "Is this a subscription?",
        a: "No. Fitest is sold as an annual licence with no monthly billing.",
      },
      {
        q: "Can I use Fitest commercially?",
        a: "Yes. All licences include commercial usage rights for internal teams or members.",
      },
    ],
  },
  {
    category: "Data & Privacy",
    items: [
      {
        q: "Is employee or member data shared?",
        a: "No. Individual responses are never shared. Only aggregated data is visible at organisation level.",
      },
      {
        q: "Is the audit anonymous?",
        a: "It can be deployed anonymously or with email capture depending on your use case.",
      },
      {
        q: "How is the score calculated?",
        a: "The score is derived from a weighted model across four performance pillars: energy, recovery, nutrition and physical output.",
      },
    ],
  },
  {
    category: "Results & Reporting",
    items: [
      {
        q: "What do users receive?",
        a: "Each user receives a score out of 100, a performance tier, and a downloadable report.",
      },
      {
        q: "Do organisations get insights?",
        a: "Yes. Organisations can analyse performance trends across departments or membership groups.",
      },
    ],
  },
  {
    category: "Legal",
    items: [
      {
        q: "Is this medical advice?",
        a: "No. Fitest is a performance benchmarking tool and does not provide medical or clinical advice.",
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
