import { Switch, Route } from "wouter";
import { useEffect } from "react";

// 1. Layout Components (These were likely missing from the Switch)
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

// 2. Original Website Pages
import Home from "./pages/Home";
import ForGyms from "./pages/ForGyms";
import ForBusinesses from "./pages/ForBusinesses";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";

// 3. New Tool Pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuditPage from "./pages/audit";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
          STATIONARY HEADER 
          Placed outside Switch so it never unmounts
      */}
      <Header />

      {/* 
          DYNAMIC CONTENT AREA 
          The 'flex-grow' ensures the footer stays at the bottom even on short pages
      */}
      <main className="flex-grow pt-16 md:pt-20"> 
        <Switch>
          {/* Main Landing Pages */}
          <Route path="/" component={Home} />
          <Route path="/gyms" component={ForGyms} />
          <Route path="/businesses" component={ForBusinesses} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
          <Route path="/login" component={Login} />
          
          {/* New Deployment Tools */}
          <Route path="/apply" component={Onboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/audit" component={AuditPage} />

          {/* 404 Error Handling */}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* 
          STATIONARY FOOTER 
      */}
      <Footer />
    </div>
  );
}
