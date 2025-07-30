import { useState } from "react";

export default function DashboardPageClient() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  const addSite = async () => {
    await fetch("/api/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain }),
    });
    setName("");
    setDomain("");
    alert("Site added!");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-4">Add Site</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Site Name"
        className="border p-2 mr-2"
      />
      <input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Domain"
        className="border p-2 mr-2"
      />
      <button onClick={addSite} className="bg-blue-500 text-white px-3 py-1 rounded">
        Add
      </button>
    </div>
  );
}
