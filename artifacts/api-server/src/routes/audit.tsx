
export default function AuditPage() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client");

  return (
    <div style={{ padding: "40px" }}>
      <h1>Fitest Audit</h1>

      <p>Client ID: {client || "Not provided"}</p>

      <p>This is where your 20-question audit will go.</p>
    </div>
  );
}
