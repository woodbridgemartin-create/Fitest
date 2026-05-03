import { Switch, Route } from "wouter";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuditPage from "./pages/Audit";
import Login from "./pages/Login"; // Added
import Demo from "./pages/Demo";   // Added
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
          
          {/* Access Platform Routes */}
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
