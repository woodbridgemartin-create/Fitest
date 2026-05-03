import Home from "./site/Home"; // Adjust path if your home file is named differently
import AuditPage from "./routes/audit";

function App() {
  // Get the current URL path (e.g., "/audit")
  const path = window.location.pathname;

  // If the user is at /audit, show the Audit Page
  if (path === "/audit") {
    return <AuditPage />;
  }

  // Otherwise, show the standard Homepage
  return <Home />;
}

export default App;
