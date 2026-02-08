'use client';

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 収集する情報",
      content: "本サービスは、Googleアカウントを用いたログイン時に、氏名、メールアドレス、プロフィール画像を取得します。また、サービス利用状況（タイマーの使用履歴、設定内容）を収集します。"
    },
    {
      title: "2. 利用目的",
      content: "収集した情報は、アカウントの認証、設定のクラウド同期、統計データの表示、およびサービスの改善のために利用します。"
    },
    {
      title: "3. データの管理",
      content: "ユーザーのデータは適切に保護され、法令に基づく場合を除き、本人の同意なく第三者に提供することはありません。"
    },
    {
      title: "4. Cookie の使用",
      content: "本サービスは、セッションの維持および利便性向上のために Cookie を使用します。ブラウザの設定で Cookie を無効にすることも可能ですが、一部の機能が利用できなくなる場合があります。"
    },
    {
      title: "5. お問い合わせ",
      content: "プライバシーポリシーに関するお問い合わせは、公式のフィードバックフォームまたは開発者までご連絡ください。"
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
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
        <div className="inline-flex p-3 rounded-2xl bg-secondary/10 text-secondary mb-6">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold font-mono tracking-tighter mb-4 leading-tight">
          Privacy <span className="text-secondary">Policy</span>
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-[0.3em] font-black">プライバシーポリシー</p>
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
