'use client';

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. サービスの内容",
      content: "Pomoru（以下「本サービス」）は、ポモドーロ・テクニックを用いた集中支援ツールです。ユーザーは、タイマー機能、統計機能、クラウド同期機能等を利用できます。"
    },
    {
      title: "2. アカウント登録",
      content: "本サービスの一部の機能を利用するには、Googleアカウント等を用いた登録が必要です。ユーザーは自身の情報を適切に管理する責任を負います。"
    },
    {
      title: "3. 禁止事項",
      content: "本サービスの不正アクセス、データの改ざん、インフラへの過度な負荷をかける行為を禁止します。"
    },
    {
      title: "4. 免責事項",
      content: "本サービスの使用によって生じた損害について、開発者は一切の責任を負いません。本サービスは現状有姿で提供されます。"
    },
    {
      title: "5. 特典について",
      content: "早期アダプター特典は、先着15名に限定されます。特典の提供条件は予告なく変更される場合があります。"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
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

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6">
          <ScrollText className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold font-mono tracking-tighter mb-4 leading-tight">
          Terms of <span className="text-primary">Service</span>
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-[0.3em] font-black">利用規約</p>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 pb-32 relative z-10">
        <div className="bg-muted/20 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 md:p-12 space-y-12">
          {sections.map((s) => (
            <div key={s.title} className="space-y-4">
              <h2 className="text-lg font-bold font-mono tracking-tight">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {s.content}
              </p>
            </div>
          ))}
          <div className="pt-8 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
              最終更新日: 2026年2月8日
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center border-t border-border/30 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground relative z-10 font-mono">
        © 2026 POMORU PROJECT. MINIMALISM IN FOCUS.
      </footer>
    </main>
  );
}
