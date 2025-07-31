import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return Response.json({
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Not configured'
  });
} 