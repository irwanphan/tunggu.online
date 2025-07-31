import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");
    const url = searchParams.get("url");

    if (!siteId || !url) {
      return new Response("Site ID and URL are required", { status: 400 });
    }

    // Verify user owns this site
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: session.user.id }
    });

    if (!site) {
      return new Response("Site not found", { status: 404 });
    }

    // Get click events for the specific URL
    const clicks = await prisma.event.findMany({
      where: { 
        siteId, 
        type: "click",
        url: decodeURIComponent(url)
      },
      select: { 
        extra: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 1000 // Limit to prevent performance issues
    });

    return Response.json(clicks);
  } catch (error) {
    console.error('Error fetching clicks:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 