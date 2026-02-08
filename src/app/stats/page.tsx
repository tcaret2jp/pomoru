'use client';

import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, Sparkles } from "lucide-react";

export default function StatsPage() {
  const previews = [
    {
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      title: "Daily Focus",
      description: "日ごとの集中時間を可視化。自分の最も生産的な時間帯を特定します。"
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "Session History",
      description: "完了したポモドーロの全履歴。過去の努力をいつでも振り返れます。"
    },
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      title: "Goals & Badges",
      description: "目標達成に応じた報酬システム。継続する楽しさを提供します。"
    }
  ];

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

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6 animate-pulse">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-6 leading-tight">
          Your <span className="text-primary italic">Stats.</span>
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border/50 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
          あなたの集中をデータで解き明かす。 <br />
          詳細な分析ダッシュボードを現在開発中です。
        </p>
      </section>

      {/* Preview Section */}
      <section className="max-w-4xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {previews.map((item) => (
            <Card key={item.title} className="p-6 border-none bg-muted/20 backdrop-blur-sm rounded-[2rem] flex flex-col items-center text-center group hover:bg-muted/30 transition-all">
              <div className="p-3 rounded-2xl bg-background shadow-sm mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-2">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center border-t border-border/30 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground relative z-10 font-mono">
        © 2026 POMORU PROJECT. MINIMALISM IN FOCUS.
      </footer>
    </main>
  );
}
