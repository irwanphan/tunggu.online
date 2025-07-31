import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Test POST endpoint called');
    
    const data = await req.json();
    console.log('Received data:', data);
    
    // Simulate the government monitoring data structure
    const testData = {
      name: data.name || "Test Site",
      url: data.url || "https://example.com",
      category: data.category || "Government",
      status: data.status || "Online",
      responseTime: data.responseTime || 500
    };
    
    console.log('Test data to save:', testData);
    
    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return Response.json({ 
        success: false, 
        error: 'Database not configured',
        testData 
      });
    }

    // Only import database in runtime
    const { prisma } = await import("@/lib/prisma");
    
    const result = await prisma.governmentSite.create({
      data: {
        name: testData.name,
        url: testData.url,
        category: testData.category,
        status: testData.status,
        responseMs: testData.responseTime,
        checkedAt: new Date(),
      },
    });
    
    console.log('Test data saved successfully:', result);
    return Response.json({ 
      success: true, 
      id: result.id,
      message: 'Test data saved to database'
    });
  } catch (error) {
    console.error('Test POST error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save test data',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 