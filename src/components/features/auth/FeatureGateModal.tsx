"use client"

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Lock, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'plus' | 'premium';
}

export function FeatureGateModal({ isOpen, onClose, type }: FeatureGateModalProps) {
  const content = {
    login: {
      icon: <Lock className="w-8 h-8 text-primary" />,
      tag: "Login Required",
      title: "集中を記録しよう",
      description: "タイマーのカスタマイズや設定の同期には、ログインが必要です。",
      buttonText: "ログインして始める",
      href: "/auth/signin"
    },
    plus: {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      tag: "Plus Plan Feature",
      title: "タスクと連携する",
      description: "Notion連携などのタスク管理機能を使うには、Plusプランへの参加が必要です。",
      buttonText: "プランを見る",
      href: "/pricing"
    },
    premium: {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      tag: "Premium Feature",
      title: "自分を分析する",
      description: "詳細な統計ダッシュボードで集中を可視化するには、Premiumプランが必要です。",
      buttonText: "アップグレード",
      href: "/pricing"
    }
  }[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-[360px] w-[95vw] overflow-hidden"
    >
      <div className="flex flex-col items-center text-center py-6 px-2">
        {/* Animated Icon Area */}
        <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-6 shadow-inner animate-in zoom-in duration-300">
          {content.icon}
        </div>

        {/* Tag */}
        <div className="px-3 py-1 rounded-full bg-muted border border-border/50 mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{content.tag}</span>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold tracking-tight mb-3">{content.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[240px]">
          {content.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button asChild variant="primary" className="h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 group">
            <Link href={content.href}>
              {content.buttonText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="ghost" onClick={onClose} className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
