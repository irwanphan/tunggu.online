"use client";

import { Bar } from "react-chartjs-2";

export default function AnalyticsPage() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ label: "Visitors", data: [120, 190, 300, 500, 200, 300, 400], backgroundColor: "rgba(59,130,246,0.5)" }]
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <Bar data={data} />
    </div>
  );
}
