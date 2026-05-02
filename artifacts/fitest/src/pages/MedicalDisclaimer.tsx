import { motion } from "framer-motion";

export default function MedicalDisclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Medical Disclaimer</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: May 2025</p>

          <div className="space-y-10 text-muted-foreground">

            <section className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <p className="text-amber-400 font-bold text-sm mb-2 uppercase tracking-wide">Important Notice</p>
              <p className="leading-relaxed text-foreground/80">
                The Fitest audit tool is not a medical device, clinical diagnostic tool, or healthcare service. It does not diagnose, treat, cure or prevent any medical condition. Results must not be used as a substitute for professional medical advice, diagnosis or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Informational Purpose Only</h2>
              <p className="leading-relaxed">
                The Fitest platform provides a self-assessment audit designed to benchmark general performance across energy, recovery, nutrition and physical output. The audit is based on self-reported responses and produces an indicative score only.
              </p>
              <p className="leading-relaxed mt-3">
                All information provided through the Fitest platform, including scores, tier descriptions, and result narratives, is for informational and educational purposes only. It is not intended to replace, nor should it be relied upon as, professional medical advice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. Not a Medical Assessment</h2>
              <p className="leading-relaxed">
                The Fitest audit does not involve any clinical evaluation, physical examination, biometric measurement, or analysis of medical history. The audit cannot identify underlying health conditions, and a high score on the Fitest platform does not indicate the absence of disease or medical risk.
              </p>
              <p className="leading-relaxed mt-3">
                A low score should not be interpreted as a medical diagnosis. If you are experiencing symptoms, health concerns, or functional decline, please consult a qualified healthcare professional promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Pre-Existing Conditions</h2>
              <p className="leading-relaxed">
                Individuals with pre-existing medical conditions, including but not limited to cardiovascular disease, metabolic disorders, musculoskeletal injuries, mental health conditions, or any other chronic or acute condition, should seek advice from a qualified healthcare professional before acting on any information provided by the Fitest platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Physical Activity and Exercise</h2>
              <p className="leading-relaxed">
                If you are considering beginning or increasing physical activity based on your Fitest score, we strongly recommend obtaining medical clearance from a qualified healthcare professional before doing so, particularly if you are sedentary, over the age of 45, or have any known health risk factors.
              </p>
              <p className="leading-relaxed mt-3">
                Fitest accepts no responsibility for injury, illness or adverse health outcomes resulting from changes to physical activity or lifestyle made in response to audit results.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Mental Health</h2>
              <p className="leading-relaxed">
                Some questions within the Fitest audit relate to stress, sleep and emotional wellbeing. If your responses indicate significant distress or you are struggling with your mental health, please reach out to a qualified mental health professional or your GP. In the UK, the Samaritans can be reached on 116 123 (free, 24 hours a day).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Nutritional Information</h2>
              <p className="leading-relaxed">
                Any references to nutrition, supplementation or dietary habits within the Fitest audit are general in nature and do not constitute personalised nutritional advice. Nutritional needs vary significantly between individuals and are influenced by medical history, medications, activity level and other factors. Always consult a registered dietitian or nutritionist for personalised guidance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">7. No Doctor-Patient Relationship</h2>
              <p className="leading-relaxed">
                Use of the Fitest platform does not create a doctor-patient relationship between the user and Leadsopedia Limited, any of its employees, contractors, or any third party involved in the development or delivery of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">8. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by applicable law, Leadsopedia Limited disclaims all liability for any loss, injury, damage or adverse outcome arising directly or indirectly from reliance on information provided through the Fitest platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">9. Emergency Situations</h2>
              <p className="leading-relaxed">
                If you believe you are experiencing a medical emergency, call 999 (UK) or your local emergency services immediately. Do not rely on the Fitest platform or contact us in place of emergency medical services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">10. Contact</h2>
              <p className="leading-relaxed">
                For questions about this Medical Disclaimer, contact us at hello@fitest.co.uk or write to Leadsopedia Limited, 5 Brayford Square, London, E1 0SG.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
