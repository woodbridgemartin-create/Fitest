import { Switch, Route } from "wouter";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuditPage from "./pages/audit"; // This is your 'audit' code
// Import your original Home/Landing component here
// import Home from "./pages/Home"; 

function App() {
  return (
    <>
      <Switch>
        {/* 1. Your original website/landing page */}
        <Route path="/" component={Onboarding} /> 

        {/* 2. The Dashboard for your clients */}
        <Route path="/dashboard" component={Dashboard} />

        {/* 3. The actual Audit form that people fill out */}
        <Route path="/audit" component={AuditPage} />

        {/* Default 404 */}
        <Route>404: Page Not Found</Route>
      </Switch>
    </>
  );
}

export default App;
