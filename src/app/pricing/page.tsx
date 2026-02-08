'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Check, Crown, Sparkles, Users, Globe, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const LIMIT = 15;

  useEffect(() => {
    fetch('/api/stats/count')
      .then(res => res.json())
      .then(data => setUserCount(data.count))
      .catch(() => setUserCount(0));
  }, []);

  const remaining = userCount !== null ? Math.max(0, LIMIT - userCount) : null;
  const progressPercent = userCount !== null ? (Math.min(userCount, LIMIT) / LIMIT) * 100 : 0;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px]" />
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-6 leading-tight">
          Simple Pricing, <br />
          <span className="text-primary italic">Unlimited Focus.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
          あなたの集中を最大限に引き出すための、透明性の高い価格体系。
        </p>
      </section>

      {/* Early Adopter Banner - Slim Version */}
      <section className="max-w-5xl mx-auto px-6 mb-16 relative z-10">
        <div className="p-[1px] rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 shadow-xl shadow-primary/10 overflow-hidden">
          <div className="bg-background/90 backdrop-blur-xl rounded-full px-6 py-3 md:py-2 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm md:text-base font-bold tracking-tight">
                期間限定: 今なら <span className="text-primary italic">Premium Plan</span> が永久無料。
              </p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex-1 md:w-40 space-y-1">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>残り枠数</span>
                  <span className="text-primary">{remaining !== null ? remaining : '--'} / {LIMIT}</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <Button asChild size="sm" className="rounded-full px-6 h-9 text-xs font-bold shadow-lg shadow-primary/20 shrink-0">
                <Link href="/auth/signin">特典を確保</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Free Plan */}
          <Card className="p-8 border-border/50 bg-muted/20 flex flex-col rounded-[2.5rem] hover:bg-muted/30 transition-all hover:-translate-y-1">
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Free</h3>
              <div className="text-4xl font-bold font-mono">¥0</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">基本機能で集中を始める。</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                基本ポモドーロタイマー
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Check className="w-4 h-4 text-primary shrink-0" />
                クラウド設定同期
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Flow Mode (Basic)
              </li>
            </ul>
            <Button asChild variant="ghost" className="w-full rounded-2xl border border-border h-12 text-xs font-black uppercase tracking-widest">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </Card>

          {/* Plus Plan */}
          <Card className="p-8 border-border/50 bg-muted/20 flex flex-col rounded-[2.5rem] hover:bg-muted/30 transition-all hover:-translate-y-1">
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Plus</h3>
              <div className="text-4xl font-bold font-mono">¥480<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">生産性を一歩先へ。</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Free Plan の全機能
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Check className="w-4 h-4 text-primary shrink-0" />
                基本統計の閲覧
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Check className="w-4 h-4 text-primary shrink-0" />
                タスク連携 (Notion)
              </li>
            </ul>
            <Button asChild variant="ghost" className="w-full rounded-2xl border border-border h-12 text-xs font-black uppercase tracking-widest">
              <Link href="/auth/signin">Get Plus</Link>
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-primary/20 bg-primary/5 flex flex-col rounded-[2.5rem] hover:bg-primary/10 transition-all hover:-translate-y-1 relative shadow-2xl shadow-primary/5">
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                Premium
                <Crown className="w-3 h-3 fill-current" />
              </h3>
              <div className="text-4xl font-bold font-mono">¥980<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">プロのための究極の体験。</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Plus Plan の全機能
              </li>
              <li className="flex items-center gap-3 text-sm font-bold">
                <Check className="w-4 h-4 text-primary shrink-0" />
                詳細統計・分析
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <Check className="w-4 h-4 text-primary shrink-0" />
                カスタムアラーム音
              </li>
            </ul>
            <Button asChild className="w-full rounded-2xl h-12 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              <Link href="/auth/signin">Get Premium</Link>
            </Button>
          </Card>

          {/* Universe Plan */}
          <Card className="p-8 border-secondary/30 bg-secondary/5 flex flex-col rounded-[2.5rem] hover:bg-secondary/10 transition-all hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-24 h-24 rotate-12" />
            </div>
            <div className="mb-8 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-4 flex items-center gap-2">
                Universe
                <Star className="w-3 h-3 fill-current" />
              </h3>
              <div className="text-4xl font-bold font-mono">¥1,980<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">エコシステムへの全アクセス。</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-sm font-bold text-secondary">
                <Check className="w-4 h-4 shrink-0" />
                Pomoru Premium の全機能
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-secondary">
                <Check className="w-4 h-4 shrink-0" />
                全アプリの Premium 特権
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-secondary">
                <Check className="w-4 h-4 shrink-0" />
                開発者コミュニティ招待
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-secondary">
                <Check className="w-4 h-4 shrink-0" />
                🌟 ゴールドバッジ
              </li>
            </ul>
            <Button disabled variant="secondary" className="relative z-10 w-full rounded-2xl h-12 text-xs font-black uppercase tracking-widest bg-muted text-muted-foreground">
              Coming Soon
            </Button>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center border-t border-border/30 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground relative z-10 font-mono">
        © 2026 POMORU PROJECT. MINIMALISM IN FOCUS.
      </footer>
    </main>
  );
}