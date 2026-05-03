import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

const DEMO_EMAIL = "demo@fitest.co.uk";
const DEMO_PASS = "fitest123";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (
        email.toLowerCase() === DEMO_EMAIL &&
        password === DEMO_PASS
      ) {
        localStorage.setItem("fitest_auth", JSON.stringify({ email: DEMO_EMAIL }));
        localStorage.setItem("fitest_org", JSON.stringify({ name: "Demo Gym", type: "gym", clientId: "DEMO123" }));
        navigate("/dashboard");
      } else {
        setLoading(false);
        setError(
          "We don't recognise those credentials. Dashboard access is provided to licensed account holders only — email hello@fitest.co.uk to get set up."
        );
      }
    }, 700);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-2xl font-black tracking-tight cursor-pointer select-none">
              <span className="text-primary">F</span>ITEST
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border h-11"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 leading-relaxed"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Access is restricted to licensed account holders.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              To get started,{" "}
              <a href="mailto:hello@fitest.co.uk" className="text-primary hover:underline">
                email us
              </a>{" "}
              or{" "}
              <Link href="/#pricing" className="text-primary hover:underline">
                purchase a licence
              </Link>.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Fitest &middot; A trading name of Leadsopedia Limited
        </p>
      </motion.div>
    </div>
  );
}
