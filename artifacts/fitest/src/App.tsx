import { Switch, Route } from "wouter";
// Import your original pages that are visible in your file tree
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Switch>
      {/* This restores your main landing page */}
      <Route path="/" component={Home} />
      
      {/* This restores your sub-pages */}
      <Route path="/gyms" component={ForGyms} />
      <Route path="/businesses" component={ForBusinesses} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/login" component={Login} />
      
      {/* These are your new tool routes */}
      <Route path="/apply" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />

      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
