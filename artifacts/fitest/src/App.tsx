import { Switch, Route } from "wouter";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard"; // Assume you have this
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Switch>
        {/* The onboarding flow is the default entry point */}
        <Route path="/" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
