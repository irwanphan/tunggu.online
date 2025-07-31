// app/api/gov-monitoring/route.ts
import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Return mock data during build time or when database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return Response.json({ success: true });
    }

    // Only import database in runtime
    const { prisma } = await import("@/lib/prisma");
    
    const data = await req.json();
    await prisma.governmentSite.create({
      data: {
        name: data.name,
        url: data.url,
        category: data.category || 'Government',
        status: data.status,
        responseMs: data.responseTime,
        checkedAt: new Date(),
      },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error saving government monitoring data:', error);
    return Response.json({ success: false, error: 'Failed to save data' });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Return mock data during build time or when database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return Response.json([]);
    }

    // Only import database in runtime
    const { prisma } = await import("@/lib/prisma");
    
    // Get the latest status for each site
    const sites = await prisma.governmentSite.groupBy({
      by: ['name', 'url'],
      _max: {
        checkedAt: true
      }
    });

    // Get the actual data for each site's latest check
    const latestData = await Promise.all(
      sites.map(async (site) => {
        const latest = await prisma.governmentSite.findFirst({
          where: {
            name: site.name,
            url: site.url,
            checkedAt: site._max.checkedAt
          },
          orderBy: {
            checkedAt: 'desc'
          }
        });
        return latest;
      })
    );

    return Response.json(latestData.filter(Boolean));
  } catch (error) {
    console.error('Error fetching government monitoring data:', error);
    return Response.json([]);
  }
}
