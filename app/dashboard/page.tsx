import prisma from "@/lib/prisma";

interface Site {
  id: string;
  name: string;
  domain: string;
}

export default async function DashboardPage() {
  const sites = await prisma.site.findMany();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Sites</h2>
      <ul className="space-y-2">
        {sites.map((s: Site) => (
          <li key={s.id} className="bg-white p-3 rounded shadow">
            {s.name} - {s.domain}
          </li>
        ))}
      </ul>
    </div>
  );
}
