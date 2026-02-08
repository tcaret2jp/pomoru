'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, Clock, Moon, Cloud, Zap } from "lucide-react";

export default function AboutPage() {
  const features = [
    { 
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Flow Mode", 
      description: "セッション終了後も集中を途切れさせない、シームレスなカウントアップ機能。" 
    },
    { 
      icon: <Moon className="w-6 h-6 text-primary" />,
      title: "Dark Mode", 
      description: "視覚的ノイズを極限まで排除した、高コントラストな漆黒のインターフェース。" 
    },
    { 
      icon: <Cloud className="w-6 h-6 text-primary" />,
      title: "Cloud Sync", 
      description: "設定と統計をクラウドで同期。場所を選ばず、即座に作業を開始。" 
    },
    { 
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Integrations", 
      description: "Notion をはじめとする外部ツールとの強力な連携（近日公開）。" 
    },
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
          <span className="text-sm font-medium">Back to Timer</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Philosophy Section */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-8 leading-tight">
          About <span className="text-primary">Pomoru</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Pomoru は「静寂と集中」をテーマにしたポモドーロタイマーです。<br className="hidden md:block" />
          余計な通知や装飾を削ぎ落とし、<br />あなたが目の前の作業に没頭することだけを目的として設計されました。
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="p-8 border-none bg-muted/30 flex items-start gap-4 hover:bg-muted/50 transition-colors">
              <div className="p-3 rounded-xl bg-background shadow-sm shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Early Adopter Section */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center relative z-10">
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-muted/50 to-muted/10 border border-border/50">
          <h2 className="text-2xl font-bold font-mono tracking-tight mb-4">Early Adopter Program</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            現在ベータ版として公開されています。<br />
            先着 15 名の登録者には、将来の全プレミアム機能を永続的に無料で提供します。
          </p>
          <Button asChild size="lg" className="rounded-full px-10 h-14 text-base shadow-xl shadow-primary/20">
            <Link href="/early-access">特典の詳細を見る</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center border-t border-border/50 text-muted-foreground text-sm relative z-10 font-mono">
        © 2026 POMORU PROJECT. MINIMALISM IN FOCUS.
      </footer>
    </main>
  );
}
