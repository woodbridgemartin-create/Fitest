import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Terms and Conditions</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: May 2025</p>

          <div className="space-y-10 text-muted-foreground">

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Introduction</h2>
              <p className="leading-relaxed">
                These Terms and Conditions govern your use of the Fitest platform, operated by Leadsopedia Limited (company number 13145058), trading as Fitest, with a registered address at 5 Brayford Square, London, E1 0SG.
              </p>
              <p className="leading-relaxed mt-3">
                By accessing or using the Fitest website and audit tools, you agree to be bound by these terms. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. The Fitest Service</h2>
              <p className="leading-relaxed">
                Fitest provides an online performance benchmarking audit tool designed to give individuals, businesses and gym operators a scored assessment of human performance across energy, recovery, nutrition and physical output.
              </p>
              <p className="leading-relaxed mt-3">
                The audit is for informational and educational purposes only. It does not constitute medical advice, a clinical assessment, or a substitute for professional health guidance. Results are self-reported and indicative only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Eligibility</h2>
              <p className="leading-relaxed">
                You must be at least 18 years of age to use the Fitest platform. By using the service, you confirm that you meet this requirement. The audit is intended for general wellness benchmarking and is not designed for use with individuals who have known medical conditions without appropriate professional oversight.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Intellectual Property</h2>
              <p className="leading-relaxed">
                All content on the Fitest platform, including but not limited to the audit questions, scoring methodology, design, text, graphics and brand assets, is the intellectual property of Leadsopedia Limited and is protected by copyright law.
              </p>
              <p className="leading-relaxed mt-3">
                You may not reproduce, distribute, modify, or create derivative works from any part of the Fitest platform without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Acceptable Use</h2>
              <p className="leading-relaxed mb-3">You agree not to:</p>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Use the Fitest platform for any unlawful purpose.",
                  "Attempt to gain unauthorised access to any part of the platform.",
                  "Scrape, copy or reproduce the audit content without permission.",
                  "Misrepresent the results of the audit to third parties.",
                  "Use the platform in a way that could cause harm to others.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                The Fitest platform is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the accuracy, completeness or fitness for purpose of the audit results or any information provided through the platform.
              </p>
              <p className="leading-relaxed mt-3">
                We do not warrant that the platform will be uninterrupted, error-free or free of viruses or other harmful components.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, Leadsopedia Limited shall not be liable for any indirect, incidental, special or consequential damages arising from your use of, or inability to use, the Fitest platform.
              </p>
              <p className="leading-relaxed mt-3">
                Our total liability to you in respect of any claim arising from your use of the platform shall not exceed the amount you paid (if any) for access to the service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">8. Commercial Licences</h2>
              <p className="leading-relaxed">
                Business and gym operators who wish to deploy Fitest for commercial use, white-label deployment or team-level analytics must enter into a separate commercial licence agreement with Leadsopedia Limited. Access to the audit system is provided exclusively to licensed organisations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">9. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms and Conditions are governed by the laws of England and Wales. Any disputes arising from your use of the Fitest platform shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">10. Changes to These Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to update these Terms and Conditions at any time. Continued use of the Fitest platform following any changes constitutes your acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">11. Contact</h2>
              <p className="leading-relaxed">
                For questions about these Terms and Conditions, contact us at hello@fitest.co.uk or write to Leadsopedia Limited, 5 Brayford Square, London, E1 0SG.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
