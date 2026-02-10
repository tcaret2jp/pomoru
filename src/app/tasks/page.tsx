'use client';

import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Plus, Search, Tag, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { hasAccess } from "@/lib/auth-helpers";
import { Plan } from "@/types/auth";
import { Button } from "@/components/ui/Button";

export default function TasksPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const userPlan = (session?.user as any)?.plan;
  const canAccess = hasAccess(userPlan, Plan.PLUS, mounted);

  // 仮のタスクデータ（後にNotion/DBと連携）
  const [tasks] = useState([
    { id: 1, title: "[Sample] Pomoru UIのブラッシュアップ", category: "Design", status: "todo" },
    { id: 2, title: "[Sample] Notion APIの調査", category: "Dev", status: "todo" },
    { id: 3, title: "[Sample] リサーチ: 競合アプリの分析", category: "Research", status: "done" },
  ]);

  if (!mounted) {
    return <main className="min-h-screen bg-background" />;
  }

  if (!canAccess) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold font-mono tracking-tighter">Task Management</h1>
            <p className="text-muted-foreground leading-relaxed">
              Notion連携を含むタスク管理機能を使用するには、<br />
              <span className="text-primary font-bold">Plus Plan</span> へのアップグレードが必要です。
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
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

      {/* Content */}
      <section className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">Tasks</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Manage your focus list.</p>
          </div>
          <button 
            disabled
            className="w-10 h-10 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center cursor-not-allowed opacity-50"
            title="Coming Soon"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar (Minimal) */}
        <div className="relative mb-8 group opacity-50 pointer-events-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Coming Soon..." 
            disabled
            className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none"
          />
        </div>

        {/* Task List with Overlay */}
        <div className="relative">
          <div className="space-y-3 opacity-40 pointer-events-none filter blur-[1px]">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 border-border/50 bg-muted/10 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                    {task.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{task.category}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Aggressive Coming Soon Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-background/80 backdrop-blur-sm border border-primary/20 px-8 py-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 transform -rotate-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl animate-bounce">
                🚀
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Coming Soon</p>
              <p className="text-xs font-bold text-center leading-relaxed">
                Notion連携を含むタスク機能は<br />
                現在全力で開発中です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 font-mono">
        Select a task to stay focused.
      </footer>
    </main>
  );
}
