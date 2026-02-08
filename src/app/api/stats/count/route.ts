import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// この API は Vercel 側でキャッシュされるように設定
// 60秒間は同じ結果を返し、データベースへの負荷を抑える
export const revalidate = 60; 

export async function GET() {
  try {
    // キャッシュを使いつつも、人数をカウント
    const count = await prisma.user.count();
    
    return NextResponse.json(
      { count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}