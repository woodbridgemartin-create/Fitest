import { Switch, Route } from "wouter";

// 1. Layout Components
// Note: Ensure the file names match the case (Header vs header) in your folder
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

// 2. Page Components
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuditPage from "./pages/audit";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header: Stays at the top of every page */}
      <Header />

      {/* Main Content: pt-20 adds space so content isn't hidden under a fixed header */}
      <main className="flex-grow pt-20"> 
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/gyms" component={ForGyms} />
          <Route path="/businesses" component={ForBusinesses} />
          <Route path="/apply" component={Onboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/audit" component={AuditPage} />
          
          {/* Default 404 Page */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Global Footer: Stays at the bottom of every page */}
      <Footer />
    </div>
  );
}
