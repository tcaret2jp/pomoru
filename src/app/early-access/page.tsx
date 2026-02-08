'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EarlyAccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 既にログイン済みの場合はタイマーへ戻す
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px]" />
      </div>

      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Timer</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
          <Star className="w-3 h-3 fill-current" />
          Early Adopter Program
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-8 leading-[1.1]">
          究極の集中を、あなたに。<br />
          <span className="text-primary italic">そして永遠に。</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          アーリーアダプターとして登録して、将来の全プレミアム機能を永続無料で手に入れよう。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            size="lg" 
            className="text-lg px-12 h-16 rounded-full shadow-2xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform"
            disabled={status === "loading"}
            onClick={() => signIn("google")}
          >
            {status === "loading" ? "Loading..." : "Google でログインして特典を受け取る"}
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border-none bg-muted/50 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm text-2xl">
              💎
            </div>
            <h3 className="text-xl font-bold mb-4">Forever Free</h3>
            <p className="text-muted-foreground">
              将来追加される有料プラン（Notion連携、詳細統計など）を一生無料で使い続けることができます。
            </p>
          </Card>

          <Card className="p-8 border-none bg-muted/50 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm text-2xl">
              🚀
            </div>
            <h3 className="text-xl font-bold mb-4">First Priority</h3>
            <p className="text-muted-foreground">
              新機能の先行体験や、開発チームへの直接的なフィードバック権限が付与されます。
            </p>
          </Card>

          <Card className="p-8 border-none bg-muted/50 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm text-2xl">
              👑
            </div>
            <h3 className="text-xl font-bold mb-4">Special Badge</h3>
            <p className="text-muted-foreground">
              プロフィールの特別バッジなど、アーリーアダプターだけの特別な証を提供します。
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center border-t border-border/50 text-muted-foreground text-sm relative z-10 font-mono">
        © 2026 POMORU PROJECT. FOR THOSE WHO SEEK FOCUS.
      </footer>
    </main>
  );
}