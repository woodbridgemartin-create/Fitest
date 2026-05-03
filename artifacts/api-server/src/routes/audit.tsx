import { useSearchParams } from "react-router-dom";

export default function AuditPage() {
  const [params] = useSearchParams();
  const client = params.get("client");

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-3xl font-bold mb-4">
        Fitest Audit
      </h1>

      <p className="mb-6">
        Client ID: {client}
      </p>

      <div className="p-6 border rounded-lg">
        <p>Audit will load here</p>
      </div>
    </div>
  );
}
