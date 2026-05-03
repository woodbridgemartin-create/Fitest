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

// ACTUAL LEGAL CONTENT PAGES (Restore these imports)
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import GDPR from "./pages/GDPR";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";

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

          {/* Pointing to your ORIGINAL content files */}
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms" component={Terms} />
          <Route path="/gdpr" component={GDPR} />
          <Route path="/medical-disclaimer" component={MedicalDisclaimer} />

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
