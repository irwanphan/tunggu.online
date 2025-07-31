import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const eventData = await req.json();
    
    // Validate required fields
    if (!eventData.siteId || !eventData.type) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        siteId: eventData.siteId,
        type: eventData.type,
        url: eventData.url || null,
        referrer: eventData.referrer || null,
        ua: eventData.userAgent || null,
        screenWidth: eventData.screenWidth || null,
        screenHeight: eventData.screenHeight || null,
        extra: eventData.data || null,
        createdAt: new Date(eventData.timestamp || Date.now())
      }
    });

    return Response.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response("Internal server error", { status: 500 });
  }
} 