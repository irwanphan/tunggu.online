import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

type Site = { name: string; domain: string };

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, domain } = (await req.json()) as Site;

  const site = await prisma.site.create({
    data: { name, domain, userId: session.user.id },
  });

  return Response.json(site);
}
