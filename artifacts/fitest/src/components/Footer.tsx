import { Link } from "wouter";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "GDPR", href: "/gdpr" },
  { label: "Medical Disclaimer", href: "/medical-disclaimer" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background mt-auto print:hidden">
      <div className="container mx-auto px-4 max-w-5xl py-12">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-0.5 mb-3">
              <span className="text-lg font-black text-primary tracking-tighter">F</span>
              <span className="text-lg font-black tracking-tighter text-foreground">ITEST</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Performance intelligence for businesses and gyms.
            </p>
          </div>

          {/* Company info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
              Company
            </h4>
            <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p>Fitest is a trading name of Leadsopedia Limited</p>
              <p>Company Number: 13145058</p>
              <p>5 Brayford Square, London, E1 0SG</p>
            </div>
          </div>

          {/* Contact + nav */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
              Contact
            </h4>
            <a
              href="mailto:hello@fitest.co.uk"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150 block mb-6"
            >
              hello@fitest.co.uk
            </a>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
              Navigate
            </h4>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "For Businesses", href: "/for-businesses" },
                { label: "For Gyms", href: "/for-gyms" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border/40 pt-8 mb-6">
          <p className="text-xs text-muted-foreground/70 leading-relaxed italic max-w-2xl">
            This audit is for informational and educational purposes only and does not constitute
            medical advice. Always consult a qualified professional.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Leadsopedia Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
