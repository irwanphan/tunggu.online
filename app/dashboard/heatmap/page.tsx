import HeatmapViewer from "@/components/HeatmapViewer";
import prisma from "@/lib/prisma";

export default async function HeatmapPage({ searchParams }: { searchParams: { siteId?: string; pageUrl?: string } }) {
  const clicks = await prisma.event.findMany({
    where: { siteId: searchParams.siteId, type: "click", url: searchParams.pageUrl },
    select: { extra: true }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Heatmap Viewer</h2>
      <HeatmapViewer clicks={clicks} />
    </div>
  );
}
