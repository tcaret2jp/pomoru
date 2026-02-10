import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // セッションにユーザー情報を追加
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).plan = (user as any).plan;
        
        // サーバーサイドでの管理者判定
        const adminEmail = process.env.ADMIN_EMAIL;
        (session.user as any).isAdmin = adminEmail && session.user.email === adminEmail;
      }
      return session;
    },
    // 新規登録時の処理（アーリーアダプター特典の判定）
    async signIn({ user, account, profile }) {
      // 既存ユーザーかチェック
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      // 新規ユーザーの場合のみ、人数を数えて特典を付与
      if (!existingUser) {
        const userCount = await prisma.user.count();
        if (userCount < 15) {
          (user as any).isEarlyAdopter = true;
          (user as any).plan = "EARLY_ACCESS";
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin", // ログイン専用ページへ飛ばす
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
