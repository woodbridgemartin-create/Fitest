import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
});

function AuditPage() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client");

  return (
    <div style={{ padding: "40px" }}>
      <h1>Fitest Audit</h1>

      <p>Client ID: {client || "Not provided"}</p>

      <p>This is where your audit will run.</p>
    </div>
  );
}
