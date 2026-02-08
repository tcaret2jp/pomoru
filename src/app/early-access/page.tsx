'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Star, Users } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EarlyAccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userCount, setUserCount] = useState<number | null>(null);
  const LIMIT = 15;

  // 登録人数の取得
  useEffect(() => {
    fetch('/api/stats/count')
      .then(res => res.json())
      .then(data => setUserCount(data.count))
      .catch(() => setUserCount(0));
  }, []);

  // 既にログイン済みの場合はタイマーへ戻す
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const remaining = userCount !== null ? Math.max(0, LIMIT - userCount) : null;
  const progressPercent = userCount !== null ? (Math.min(userCount, LIMIT) / LIMIT) * 100 : 0;

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
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in border border-primary/20">
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

        {/* Progress Section */}
        <div className="w-full max-w-sm mb-12 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Limited Slots</p>
              <p className="text-2xl font-bold font-mono">
                {remaining !== null ? `${remaining}` : '--'} <span className="text-sm font-medium text-muted-foreground ml-1">/ {LIMIT} Left</span>
              </p>
            </div>
            <Users className="w-5 h-5 text-primary/40" />
          </div>
          
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-[1px]">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(220,38,38,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
            {userCount !== null && userCount >= LIMIT ? "Waitlist only" : "Join before the slots are gone"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            size="lg" 
            className="text-lg px-12 h-16 rounded-full shadow-2xl shadow-primary/20 bg-white text-black hover:bg-zinc-100 border border-border transition-all disabled:opacity-50 flex items-center gap-4"
            disabled={status === "loading" || (userCount !== null && userCount >= LIMIT)}
            onClick={() => signIn("google")}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.76 1.85-1.61 2.42v2.84h2.6c1.52-1.41 2.4-3.48 2.4-5.27z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.6-2.84c-.5.34-1.14.54-1.81.54-2.83 0-5.22-1.92-6.08-4.5H2.18v2.92C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.92 13.54c-.22-.66-.35-1.36-.35-2.04s.13-1.38.35-2.04V6.54H2.18C1.43 8.09 1 9.73 1 11.5s.43 3.41 1.18 4.96l3.74-2.92z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.54l3.74 2.92c.86-2.58 3.25-4.5 6.08-4.5z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-base font-black uppercase tracking-widest">
              {status === "loading" ? "Loading..." : 
               userCount !== null && userCount >= LIMIT ? "Sold Out" : "Sign in with Google"}
            </span>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-10 border border-border/50 bg-muted/20 flex flex-col items-center text-center rounded-[2.5rem] hover:bg-muted/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-8 shadow-sm text-3xl">
              💎
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-primary">Forever Free</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              将来追加される有料プラン（Notion連携、詳細統計など）を一生無料で使い続けることができます。
            </p>
          </Card>

          <Card className="p-10 border border-border/50 bg-muted/20 flex flex-col items-center text-center rounded-[2.5rem] hover:bg-muted/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-8 shadow-sm text-3xl">
              🚀
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-primary">First Priority</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              新機能の先行体験や、開発チームへの直接的なフィードバック権限が付与されます。
            </p>
          </Card>

          <Card className="p-10 border border-border/50 bg-muted/20 flex flex-col items-center text-center rounded-[2.5rem] hover:bg-muted/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-8 shadow-sm text-3xl">
              👑
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-primary">Special Badge</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              プロフィールの特別バッジなど、アーリーアダプターだけの特別な証を提供します。
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center border-t border-border/30 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground relative z-10 font-mono">
        © 2026 POMORU PROJECT. FOR THOSE WHO SEEK FOCUS.
      </footer>
    </main>
  );
}