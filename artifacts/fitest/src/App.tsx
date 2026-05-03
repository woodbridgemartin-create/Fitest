import { Switch, Route } from "wouter";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages - Ensure these files exist in your src/pages folder
import Home from "./pages/Home";
import ForBusinesses from "./pages/ForBusinesses";
import ForGyms from "./pages/ForGyms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import AuditPage from "./pages/Audit";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Demo from "./pages/Demo";

// Placeholder components for legal links if you don't have separate files yet
const LegalPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-background pt-32 pb-20 px-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black mb-8">{title}</h1>
      <p className="text-muted-foreground">This page is under review. Please check back shortly for the full {title} documentation.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          {/* Main Navigation - Matches your Header.tsx exactly */}
          <Route path="/" component={Home} />
          <Route path="/for-businesses" component={ForBusinesses} />
          <Route path="/for-gyms" component={ForGyms} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />

          {/* Core App Logic */}
          <Route path="/audit" component={AuditPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />

          {/* Legal Links - Fixing the Footer 404s */}
          <Route path="/privacy">
            <LegalPage title="Privacy Policy" />
          </Route>
          <Route path="/terms">
            <LegalPage title="Terms & Conditions" />
          </Route>
          <Route path="/gdpr">
            <LegalPage title="GDPR" />
          </Route>
          <Route path="/medical-disclaimer">
            <LegalPage title="Medical Disclaimer" />
          </Route>

          {/* Catch-all 404 */}
          <Route>
            <div className="min-h-[60vh] flex items-center justify-center">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
