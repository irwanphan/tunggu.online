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
    return new Response("Internal server error", { status: 500 });
  }
} 