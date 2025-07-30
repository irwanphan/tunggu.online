import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        <li><Link href="/dashboard">My Sites</Link></li>
        <li><Link href="/dashboard/heatmap">Heatmap</Link></li>
        <li><Link href="/dashboard/analytics">Analytics</Link></li>
      </ul>
    </aside>
  );
}
