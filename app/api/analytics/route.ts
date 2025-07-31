import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return new Response("Site ID is required", { status: 400 });
    }

    // Verify user owns this site
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: session.user.id }
    });

    if (!site) {
      return new Response("Site not found", { status: 404 });
    }

    // Get date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get total counts
    const [pageviews, clicks, scrolls] = await Promise.all([
      prisma.event.count({
        where: { siteId, type: "pageview", createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.event.count({
        where: { siteId, type: "click", createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.event.count({
        where: { siteId, type: "scroll", createdAt: { gte: thirtyDaysAgo } }
      })
    ]);

    // Get daily stats
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN type = 'pageview' THEN 1 END) as pageviews,
        COUNT(CASE WHEN type = 'click' THEN 1 END) as clicks
      FROM "Event" 
      WHERE site_id = ${siteId} 
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    // Get top pages
    const topPages = await prisma.event.groupBy({
      by: ['url'],
      where: { 
        siteId, 
        type: "pageview", 
        createdAt: { gte: thirtyDaysAgo },
        url: { not: null }
      },
      _count: { url: true },
      orderBy: { _count: { url: 'desc' } },
      take: 10
    });

    // Get device stats (simplified)
    const deviceStats = await prisma.event.groupBy({
      by: ['ua'],
      where: { 
        siteId, 
        type: "pageview", 
        createdAt: { gte: thirtyDaysAgo },
        ua: { not: null }
      },
      _count: { ua: true },
      orderBy: { _count: { ua: 'desc' } },
      take: 5
    });

    // Process device stats
    const processedDeviceStats = deviceStats.map(stat => {
      const ua = stat.ua || 'Unknown';
      let device = 'Desktop';
      
      if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
        device = 'Mobile';
      } else if (ua.includes('Tablet') || ua.includes('iPad')) {
        device = 'Tablet';
      }
      
      return {
        device,
        count: stat._count.ua
      };
    });

    // Aggregate device stats
    const aggregatedDeviceStats = processedDeviceStats.reduce((acc, curr) => {
      const existing = acc.find(item => item.device === curr.device);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as { device: string; count: number }[]);

    const analyticsData = {
      pageviews,
      clicks,
      scrolls,
      topPages: topPages.map(page => ({
        url: page.url || 'Unknown',
        count: page._count.url
      })),
      dailyStats: (dailyStats as any[]).map(stat => ({
        date: stat.date,
        pageviews: Number(stat.pageviews),
        clicks: Number(stat.clicks)
      })).reverse(),
      deviceStats: aggregatedDeviceStats
    };

    return Response.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 