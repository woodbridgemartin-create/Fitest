import { Switch, Route } from "wouter";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Main Pages
import Home from "./pages/Home";
import ForBusinesses from "./pages/ForBusinesses";
import ForGyms from "./pages/ForGyms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import AuditPage from "./pages/Audit";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Demo from "./pages/Demo";

// This component ensures the content ACTUALLY shows up when clicked
const LegalPageContainer = ({ title, body }: { title: string; body: string }) => (
  <div className="min-h-screen bg-background pt-32 pb-20 px-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black mb-8 tracking-tight">{title}</h1>
      <div className="prose prose-invert">
        <p className="text-muted-foreground leading-relaxed text-lg">
          {body}
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/for-businesses" component={ForBusinesses} />
          <Route path="/for-gyms" component={ForGyms} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          <Route path="/audit" component={AuditPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />

          {/* Legal Routes - Matched exactly to your Footer code */}
          <Route path="/privacy-policy">
            <LegalPageContainer 
              title="Privacy Policy" 
              body="At Fitest (Leadsopedia Limited), we take your data seriously. This policy explains how we collect and process performance metrics while maintaining strict user confidentiality." 
            />
          </Route>

          <Route path="/terms">
            <LegalPageContainer 
              title="Terms & Conditions" 
              body="By accessing Fitest, you agree to our platform terms. Our licensing for businesses and gyms is governed by the laws of England and Wales." 
            />
          </Route>

          <Route path="/gdpr">
            <LegalPageContainer 
              title="GDPR Compliance" 
              body="We are committed to data protection. All audit responses are handled in compliance with GDPR standards, ensuring right to access and right to erasure." 
            />
          </Route>

          <Route path="/medical-disclaimer">
            <LegalPageContainer 
              title="Medical Disclaimer" 
              body="Fitest is a performance benchmarking tool. The scores provided are for intelligence and readiness purposes and do not constitute medical advice or diagnosis." 
            />
          </Route>

          <Route>
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <h1 className="text-xl font-bold">404 - Page Not Found</h1>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
