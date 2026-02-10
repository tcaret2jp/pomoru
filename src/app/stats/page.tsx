'use client';

import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, Clock, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/auth-helpers";
import { Plan } from "@prisma/client";
import { Button } from "@/components/ui/Button";

export default function StatsPage() {
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan;
  const canAccess = hasAccess(userPlan, Plan.PREMIUM);

  if (!canAccess) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold font-mono tracking-tighter">Premium Feature</h1>
            <p className="text-muted-foreground leading-relaxed">
              詳細な統計・分析機能を使用するには、<br />
              <span className="text-primary font-bold">Premium Plan</span> へのアップグレードが必要です。
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild variant="primary" className="h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              <Link href="/">Back to Timer</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px]" />
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

      {/* Content Area */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">Analytics</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Visualize your focus journey.</p>
        </div>

        {/* Dashboard Mockup with Overlay */}
        <div className="relative">
          {/* Mockup UI - Blurrred and Non-interactive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 filter blur-[2px] pointer-events-none select-none">
            
            {/* Stat Card 1: Daily Activity Chart Mock */}
            <Card className="md:col-span-2 p-8 border-border/50 bg-muted/10 rounded-[2.5rem] flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Weekly Focus</span>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground">FEB 02 - FEB 09</div>
              </div>
              <div className="flex items-end justify-between h-32 gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group">
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-black text-muted-foreground px-1">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
            </Card>

            {/* Stat Card 2: Goals Mock */}
            <Card className="p-8 border-border/50 bg-muted/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={100} className="text-primary" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-mono tracking-tighter">75%</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Daily Goal</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground">あと 2 セッションで目標達成</p>
            </Card>

            {/* Stat Card 3: Recent History Mock */}
            <Card className="md:col-span-3 p-8 border-border/50 bg-muted/10 rounded-[2.5rem]">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Recent Sessions</span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/10 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-xs">🚀</div>
                      <div>
                        <p className="text-xs font-bold">UI Design Session</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Today, 14:20</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-primary">25:00</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase">Focus</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-background/80 backdrop-blur-md border border-primary/20 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform rotate-1 scale-110 md:scale-100">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-3xl animate-bounce shadow-inner">
                📊
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2">Coming Soon</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">統計・分析機能</h2>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                  あなたの努力を可視化する<br />
                  高度な分析ツールを開発中です。
                </p>
              </div>
              <div className="mt-2 px-4 py-1.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Universe & Premium
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 font-mono">
        Your focus, quantified.
      </footer>
    </main>
  );
}
