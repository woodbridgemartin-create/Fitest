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
      <div className="container mx-auto px-6 max-w-5xl py-12 text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-0.5 mb-3">
          <span className="text-lg font-black text-primary tracking-tighter">F</span>
          <span className="text-lg font-black tracking-tighter text-foreground">ITEST</span>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Performance intelligence for businesses and gyms.
        </p>

        {/* Company info */}
        <div className="text-xs text-muted-foreground/60 space-y-1 mb-8">
          <p>Fitest is a trading name of Leadsopedia Limited &nbsp;&middot;&nbsp; Company No. 13145058</p>
          <p>5 Brayford Square, London, E1 0SG</p>
          <a href="mailto:hello@fitest.co.uk" className="hover:text-primary transition-colors duration-150">hello@fitest.co.uk</a>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
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

        {/* Divider */}
        <div className="border-t border-border/40 pt-6 mt-2">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
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
          <p className="text-xs text-muted-foreground/40">
            &copy; {new Date().getFullYear()} Leadsopedia Limited. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
