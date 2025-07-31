import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";

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

    // Get unique URLs with click events
    const urls = await prisma.event.findMany({
      where: { 
        siteId, 
        type: "click",
        url: { not: null }
      },
      select: { url: true },
      distinct: ['url'],
      orderBy: { url: 'asc' }
    });

    const urlList = urls.map(item => item.url).filter(Boolean) as string[];

    return Response.json(urlList);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 