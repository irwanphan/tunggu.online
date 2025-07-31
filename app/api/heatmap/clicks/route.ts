import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Return mock data during build time or when database is not available
    const mockData: any[] = [];

    // If we're in build time or don't have database connection, return mock data
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return Response.json(mockData);
    }

    // Only import and use database in runtime
    const { prisma } = await import("@/lib/prisma");
    const { getServerSession } = await import("next-auth/next");
    const { authOptions } = await import("@/lib/auth");

    const session = await getServerSession(authOptions) as any;
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

    // Get click events
    const clicks = await prisma.event.findMany({
      where: { 
        siteId, 
        type: "click", 
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        extra: true,
        url: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 1000
    });

    return Response.json(clicks);
  } catch (error) {
    console.error('Error fetching clicks:', error);
    return Response.json([]);
  }
} 