// src/routes/audit.tsx
export default function AuditPage() {
  // This looks at the URL for ?client=XYZ
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client") || "Unknown Client";

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>FITEST Audit System</h1>
      <p style={{ marginTop: '20px' }}>
        <strong>Current Client:</strong> {client}
      </p>
      <div style={{ marginTop: '30px', border: '2px dashed #ccc', padding: '50px' }}>
        Audit form components will be injected here.
      </div>
    </div>
  );
}
