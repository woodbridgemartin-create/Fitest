import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: May 2025</p>

          <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground">

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Who We Are</h2>
              <p className="leading-relaxed">
                Fitest is a trading name of Leadsopedia Limited, a company registered in England and Wales under company number 13145058. Our registered address is 5 Brayford Square, London, E1 0SG.
              </p>
              <p className="leading-relaxed mt-3">
                We are the data controller for the personal information collected through this website and the Fitest audit tool. If you have any questions about how we handle your data, please contact us at hello@fitest.co.uk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. What Data We Collect</h2>
              <p className="leading-relaxed mb-3">We collect the following categories of personal data:</p>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Email address: collected at the point of score reveal to associate your audit report with your results.",
                  "Audit responses: your answers to the 20-question audit, stored as numerical values (1 to 5) per question.",
                  "Usage data: anonymised information about how you interact with the website, including pages visited and time on site.",
                  "Contact form data: name, email, company name and message content when you submit an enquiry via our Contact page.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. How We Use Your Data</h2>
              <p className="leading-relaxed mb-3">We use your personal data to:</p>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Generate and deliver your performance audit report.",
                  "Respond to enquiries submitted via our Contact page.",
                  "Improve the Fitest platform and user experience.",
                  "Comply with legal obligations.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                We do not sell, rent or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Legal Basis for Processing</h2>
              <p className="leading-relaxed">
                We process your personal data on the following legal bases under UK GDPR:
              </p>
              <ul className="space-y-2 list-none pl-0 mt-3">
                {[
                  "Consent: where you have provided your email address to receive your audit report.",
                  "Legitimate interests: to improve and maintain the Fitest platform.",
                  "Contract: where you are engaging with us as a business customer.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your email address and audit responses for a period of 24 months from the date of submission. After this period, your data is deleted from our systems unless you have an active business relationship with us.
              </p>
              <p className="leading-relaxed mt-3">
                Contact form submissions are retained for 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Your Rights</h2>
              <p className="leading-relaxed mb-3">Under UK GDPR, you have the right to:</p>
              <ul className="space-y-2 list-none pl-0">
                {[
                  "Access the personal data we hold about you.",
                  "Request correction of inaccurate data.",
                  "Request deletion of your data.",
                  "Object to or restrict processing of your data.",
                  "Data portability.",
                  "Lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise any of these rights, contact us at hello@fitest.co.uk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">7. Cookies</h2>
              <p className="leading-relaxed">
                We use essential cookies to ensure the website functions correctly. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, although this may affect certain features of the website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">8. Third Party Services</h2>
              <p className="leading-relaxed">
                We may use third-party services to support site performance and analytics. These services process data in accordance with their own privacy policies. We ensure any third parties we work with provide appropriate data protection guarantees.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. The date at the top of this page indicates when it was last revised. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">10. Contact</h2>
              <p className="leading-relaxed">
                For any privacy-related queries, contact us at hello@fitest.co.uk or write to us at 5 Brayford Square, London, E1 0SG.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
