"use client";

import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  pageviews: number;
  clicks: number;
  scrolls: number;
  topPages: { url: string; count: number }[];
  dailyStats: { date: string; pageviews: number; clicks: number }[];
  deviceStats: { device: string; count: number }[];
}

export default function AnalyticsPage({ searchParams }: { searchParams: { siteId?: string } }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState(searchParams.siteId || "");

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSiteId) {
      fetchAnalytics();
    }
  }, [selectedSiteId]);

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

  const fetchAnalytics = async () => {
    if (!selectedSiteId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?siteId=${selectedSiteId}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center text-gray-500 py-8">
          Select a site to view analytics
        </div>
      </div>
    );
  }

  const pageviewsChartData = {
    labels: data.dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: "Pageviews",
        data: data.dailyStats.map(stat => stat.pageviews),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "Clicks",
        data: data.dailyStats.map(stat => stat.clicks),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  const deviceChartData = {
    labels: data.deviceStats.map(stat => stat.device),
    datasets: [
      {
        data: data.deviceStats.map(stat => stat.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <select
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Pageviews</h3>
          <p className="text-3xl font-bold text-blue-600">{data.pageviews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-green-600">{data.clicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Scroll Events</h3>
          <p className="text-3xl font-bold text-purple-600">{data.scrolls.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Activity</h3>
          <Line data={pageviewsChartData} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Device Distribution</h3>
          <Doughnut data={deviceChartData} />
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Pages</h3>
        <div className="space-y-2">
          {data.topPages.map((page, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 truncate">{page.url}</span>
              <span className="text-gray-500 font-medium">{page.count} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
