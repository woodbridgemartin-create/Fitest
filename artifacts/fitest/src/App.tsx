import { Switch, Route } from "wouter";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuditPage from "./pages/Audit"; 
import Login from "./pages/Login"; 
import Demo from "./pages/Demo";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ"; // Ensure this file exists
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow"> 
        <Switch>
          <Route path="/" component={Home} />
          {/* Matches your Header.tsx exactly */}
          <Route path="/for-businesses" component={ForBusinesses} />
          <Route path="/for-gyms" component={ForGyms} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          
          {/* Functional Routes */}
          <Route path="/apply" component={Onboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/audit" component={AuditPage} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />

          {/* Legal Routes for Footer */}
          <Route path="/medical-disclaimer" component={() => <div>Medical Disclaimer Content</div>} />
          <Route path="/privacy" component={() => <div>Privacy Policy Content</div>} />
          <Route path="/terms" component={() => <div>Terms of Service Content</div>} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
