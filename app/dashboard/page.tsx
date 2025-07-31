"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Site {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

export default function DashboardPageClient() {
  const [sites, setSites] = useState<Site[]>([]);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/site");
      if (response.ok) {
        const data = await response.json();
        setSites(data);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const addSite = async () => {
    if (!name.trim() || !domain.trim()) {
      alert("Please fill in both name and domain");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain }),
      });

      if (response.ok) {
        setName("");
        setDomain("");
        await fetchSites();
        alert("Site added successfully!");
      } else {
        alert("Failed to add site");
      }
    } catch (error) {
      console.error("Error adding site:", error);
      alert("Error adding site");
    } finally {
      setLoading(false);
    }
  };

  const getTrackingCode = (siteId: string) => {
    const script = `<script src="${window.location.origin}/monitor.js" data-site-id="${siteId}"></script>`;
    return script;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your websites and view analytics</p>
      </div>

      {/* Add Site Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Site</h2>
        <div className="flex flex-wrap gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Site Name"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Domain (e.g., example.com)"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={addSite} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Site"}
          </button>
        </div>
      </div>

      {/* Sites List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Sites</h2>
        {sites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sites added yet. Add your first site above.</p>
        ) : (
          <div className="grid gap-4">
            {sites.map((site) => (
              <div key={site.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
                    <p className="text-gray-600">{site.domain}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/analytics?siteId=${site.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Analytics
                    </Link>
                    <Link
                      href={`/dashboard/heatmap?siteId=${site.id}`}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Heatmap
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-2">Tracking Code:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {getTrackingCode(site.id)}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
