import { NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        success: false, 
        error: 'DATABASE_URL not found',
        env: process.env.NODE_ENV 
      });
    }

    // Only import database in runtime
    const { prisma } = await import("@/lib/prisma");
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Count government sites
    const count = await prisma.governmentSite.count();
    console.log('Government sites count:', count);
    
    // Get latest 5 records
    const latestRecords = await prisma.governmentSite.findMany({
      take: 5,
      orderBy: {
        checkedAt: 'desc'
      }
    });
    
    return Response.json({
      success: true,
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured',
      nodeEnv: process.env.NODE_ENV,
      totalRecords: count,
      latestRecords: latestRecords
    });
  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 