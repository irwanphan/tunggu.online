import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

type Site = { name: string; domain: string };

export async function GET() {
  const session = await getServerSession(authOptions) as Session & { user: { id: string } };

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sites = await prisma.site.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return Response.json(sites);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as Session & { user: { id: string } };

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, domain } = (await req.json()) as Site;

  const site = await prisma.site.create({
    data: { name, domain, userId: session.user.id },
  });

  return Response.json(site);
}
