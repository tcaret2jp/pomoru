import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
