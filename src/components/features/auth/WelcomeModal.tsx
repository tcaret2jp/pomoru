"use client"

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LogIn, Info } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Pomoru ✨"
    >
      <div className="space-y-8 py-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-primary/5">
          🍅
        </div>

        <div className="space-y-2 text-center px-4">
          <p className="text-xl font-bold tracking-tight">
            「静寂と集中」を、あなたに。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[300px]">
            Pomoru は究極のミニマリズムを追求したタイマーです。<br />
            設定を同期して、ボーナス特典を受け取りませんか？
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => signIn("google")}
            className="w-full h-14 text-lg rounded-2xl gap-3 shadow-xl shadow-primary/10 transition-transform hover:scale-[1.01]"
          >
            <LogIn className="w-5 h-5" />
            Google でログイン
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            asChild
            className="w-full h-14 text-base rounded-2xl gap-2"
          >
            <Link href="/about" onClick={onClose}>
              <Info className="w-4 h-4 opacity-60" />
              詳しく見る
            </Link>
          </Button>
        </div>

        <button 
          onClick={onClose}
          className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-8 decoration-border hover:decoration-primary transition-all duration-300"
        >
          ログインせずに続ける
        </button>
      </div>
    </Modal>
  );
}
