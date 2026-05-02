import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Contact</h1>
          <p className="text-muted-foreground leading-relaxed">
            Interested in a licence, white-label deployment, or just have a question?
            We will get back to you within one business day.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 bg-primary/5 rounded-2xl p-12 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6">
              <span className="text-primary font-black text-lg">F</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Message received</h2>
            <p className="text-muted-foreground text-sm">
              Thanks for reaching out. We will be in touch within one business day.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-card border border-card-border rounded-2xl p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground block mb-2">
                    Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Jane Smith"
                    className="bg-background border-border focus:border-primary h-11"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground block mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="jane@company.com"
                    className="bg-background border-border focus:border-primary h-11"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground block mb-2">
                  Company / Organisation <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <Input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Acme Ltd"
                  className="bg-background border-border focus:border-primary h-11"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-muted-foreground block mb-2">
                  Message
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your use case, team size, or any questions you have..."
                  rows={5}
                  className="bg-background border-border focus:border-primary resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
