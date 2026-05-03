import { Switch, Route } from "wouter";

// Layout Components
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

// Pages
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
// Changed this to look for a specific file name; ensure your file is named Audit.tsx
import AuditPage from "./pages/Audit"; 
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20"> 
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/gyms" component={ForGyms} />
          <Route path="/businesses" component={ForBusinesses} />
          <Route path="/apply" component={Onboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/audit" component={AuditPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
