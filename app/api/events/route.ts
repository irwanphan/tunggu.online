import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      siteId,
      type,
      url,
      referrer,
      screenWidth,
      screenHeight,
      userAgent,
      timestamp,
      ...extra
    } = body;

    // Validate required fields
    if (!siteId || !type) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Verify site exists
    const site = await prisma.site.findUnique({
      where: { id: siteId }
    });

    if (!site) {
      return new Response("Site not found", { status: 404 });
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        siteId,
        type,
        url: url || null,
        referrer: referrer || null,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        ua: userAgent || null,
        screenWidth: screenWidth || null,
        screenHeight: screenHeight || null,
        extra: extra || {},
      }
    });

    return Response.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 