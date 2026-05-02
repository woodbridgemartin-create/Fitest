import { motion } from "framer-motion";

export default function GDPR() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">GDPR Statement</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: May 2025</p>

          <div className="space-y-10 text-muted-foreground">

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Our Commitment to Data Protection</h2>
              <p className="leading-relaxed">
                Leadsopedia Limited, trading as Fitest, is committed to protecting the personal data of every individual who interacts with our platform. We comply fully with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p className="leading-relaxed mt-3">
                This statement outlines our approach to data protection governance, your rights as a data subject, and how we ensure that your personal data is handled lawfully, fairly and transparently.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. Data Controller Details</h2>
              <p className="leading-relaxed">
                The data controller for all personal data processed through the Fitest platform is:
              </p>
              <div className="mt-4 bg-card border border-card-border rounded-xl p-6">
                <p className="font-semibold text-foreground">Leadsopedia Limited</p>
                <p className="mt-1">Company number: 13145058</p>
                <p>5 Brayford Square, London, E1 0SG</p>
                <p>Email: hello@fitest.co.uk</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Legal Bases for Processing</h2>
              <p className="leading-relaxed mb-3">We rely on the following legal bases under Article 6 of UK GDPR to process personal data:</p>
              <div className="space-y-4">
                {[
                  { basis: "Consent (Article 6(1)(a))", detail: "Where you provide your email address to receive your audit report, you are giving informed consent for us to process that data for the stated purpose." },
                  { basis: "Legitimate Interests (Article 6(1)(f))", detail: "We process anonymised usage data to improve the platform, which we have assessed as falling within our legitimate interests without overriding your rights." },
                  { basis: "Contract (Article 6(1)(b))", detail: "Where a business or gym enters into a commercial arrangement with us, we process contact and billing data as necessary to perform that contract." },
                ].map(({ basis, detail }, i) => (
                  <div key={i} className="border border-card-border rounded-lg p-4">
                    <p className="text-sm font-bold text-foreground mb-1">{basis}</p>
                    <p className="text-sm leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Data Subject Rights</h2>
              <p className="leading-relaxed mb-3">Under UK GDPR, you have the following rights. We will respond to all valid requests within one calendar month:</p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  { right: "Right of Access", desc: "You can request a copy of the personal data we hold about you." },
                  { right: "Right to Rectification", desc: "You can request correction of inaccurate or incomplete personal data." },
                  { right: "Right to Erasure", desc: "You can request deletion of your personal data where there is no compelling reason for continued processing." },
                  { right: "Right to Restriction", desc: "You can request that we restrict the processing of your data in certain circumstances." },
                  { right: "Right to Portability", desc: "You can request your personal data in a structured, commonly used and machine-readable format." },
                  { right: "Right to Object", desc: "You can object to processing based on legitimate interests or for direct marketing purposes." },
                  { right: "Right to Withdraw Consent", desc: "Where processing is based on consent, you may withdraw that consent at any time without affecting the lawfulness of prior processing." },
                ].map(({ right, desc }, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <div>
                      <span className="text-sm font-semibold text-foreground">{right}: </span>
                      <span className="text-sm leading-relaxed">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise any of these rights, email hello@fitest.co.uk with the subject line "Data Subject Request".
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Data Transfers</h2>
              <p className="leading-relaxed">
                We do not transfer personal data outside of the United Kingdom or European Economic Area unless appropriate safeguards are in place, including Standard Contractual Clauses or equivalent mechanisms approved by the relevant supervisory authority.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, destruction or alteration. These measures are reviewed and updated regularly in line with best practice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">7. Data Breach Procedure</h2>
              <p className="leading-relaxed">
                In the event of a personal data breach, we will notify the Information Commissioner's Office (ICO) within 72 hours where the breach is likely to result in a risk to individuals' rights and freedoms. We will also notify affected data subjects without undue delay where the breach is likely to result in a high risk to their rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">8. Complaints</h2>
              <p className="leading-relaxed">
                You have the right to lodge a complaint with the ICO if you believe we have not handled your personal data lawfully. The ICO can be reached at ico.org.uk or by calling 0303 123 1113.
              </p>
              <p className="leading-relaxed mt-3">
                We would, however, always appreciate the opportunity to address any concerns before you contact the ICO. Please email us at hello@fitest.co.uk in the first instance.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
