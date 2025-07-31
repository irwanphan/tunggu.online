import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
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

    // Get unique URLs with pageview counts
    const urls = await prisma.event.groupBy({
      by: ['url'],
      where: { 
        siteId, 
        type: "pageview", 
        createdAt: { gte: thirtyDaysAgo },
        url: { not: null }
      },
      _count: { url: true },
      orderBy: { _count: { url: 'desc' } },
      take: 50
    });

    return Response.json(urls.map(url => ({
      url: url.url,
      pageviews: url._count.url
    })));
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 