"use client";

import { useState, useEffect } from "react";
import HeatmapViewer from "@/components/HeatmapViewer";

interface Site {
  id: string;
  name: string;
  domain: string;
}

interface ClickData {
  extra: { x: number; y: number };
}

export default function HeatmapPage({ searchParams }: { searchParams: { siteId?: string; pageUrl?: string } }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState(searchParams.siteId || "");
  const [selectedUrl, setSelectedUrl] = useState(searchParams.pageUrl || "");
  const [availableUrls, setAvailableUrls] = useState<string[]>([]);
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      fetchUrls();
    }
  }, [selectedSiteId]);

  useEffect(() => {
    if (selectedSiteId && selectedUrl) {
      fetchClicks();
    }
  }, [selectedSiteId, selectedUrl]);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/site");
      if (response.ok) {
        const sitesData = await response.json();
        setSites(sitesData);
        if (!selectedSiteId && sitesData.length > 0) {
          setSelectedSiteId(sitesData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchUrls = async () => {
    if (!selectedSiteId) return;
    
    try {
      const response = await fetch(`/api/heatmap/urls?siteId=${selectedSiteId}`);
      if (response.ok) {
        const urls = await response.json();
        setAvailableUrls(urls);
        if (urls.length > 0 && !selectedUrl) {
          setSelectedUrl(urls[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
    }
  };

  const fetchClicks = async () => {
    if (!selectedSiteId || !selectedUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/heatmap/clicks?siteId=${selectedSiteId}&url=${encodeURIComponent(selectedUrl)}`);
      if (response.ok) {
        const clicksData = await response.json();
        setClicks(clicksData);
      }
    } catch (error) {
      console.error("Error fetching clicks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Heatmap Viewer</h1>
        <p className="text-gray-600">View click heatmaps for your pages</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Site</label>
            <select
              value={selectedSiteId}
              onChange={(e) => {
                setSelectedSiteId(e.target.value);
                setSelectedUrl("");
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
            <select
              value={selectedUrl}
              onChange={(e) => setSelectedUrl(e.target.value)}
              disabled={!selectedSiteId || availableUrls.length === 0}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select a page</option>
              {availableUrls.map((url) => (
                <option key={url} value={url}>
                  {url.length > 50 ? url.substring(0, 50) + "..." : url}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Heatmap Display */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading heatmap...</div>
          </div>
        </div>
      ) : clicks.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Click Heatmap</h3>
            <p className="text-sm text-gray-500">
              {clicks.length} clicks recorded on this page
            </p>
          </div>
          <HeatmapViewer clicks={clicks} />
        </div>
      ) : selectedSiteId && selectedUrl ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-500 py-8">
            No click data available for this page yet.
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-500 py-8">
            Select a site and page to view the heatmap
          </div>
        </div>
      )}
    </div>
  );
}
