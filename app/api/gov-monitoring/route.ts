// app/api/gov-monitoring/route.ts
import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('POST /api/gov-monitoring called');
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    
    const data = await req.json();
    console.log('Received data:', data);
    
    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return Response.json({ success: false, error: 'Database not configured' }, { status: 500 });
    }

    // Only import database in runtime
    const { prisma } = await import("@/lib/prisma");
    
    console.log('Saving to database:', {
      name: data.name,
      url: data.url,
      category: data.category || 'Government',
      status: data.status,
      responseMs: data.responseTime,
    });
    
    const result = await prisma.governmentSite.create({
      data: {
        name: data.name,
        url: data.url,
        category: data.category || 'Government',
        status: data.status,
        responseMs: data.responseTime,
        checkedAt: new Date(),
      },
    });
    
    console.log('Data saved successfully:', result);
    return Response.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error saving government monitoring data:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save data' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/gov-monitoring called');
    
    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
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

    console.log('Found sites:', sites.length);

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

    const filteredData = latestData.filter(Boolean);
    console.log('Returning data:', filteredData.length, 'records');
    
    return Response.json(filteredData);
  } catch (error) {
    console.error('Error fetching government monitoring data:', error);
    return Response.json([]);
  }
}
