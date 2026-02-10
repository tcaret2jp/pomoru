"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plan } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, X } from "lucide-react";

export function AdminDebugPanel() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = (session?.user as any)?.isAdmin;

  // 管理者でない場合は何も表示しない
  if (!isAdmin) return null;

  const currentPlan = (session?.user as any)?.plan;

  const setMockPlan = async (plan: Plan) => {
    // セッション内のプランを一時的に書き換える（DBは変更しない）
    // 注意: update() は NextAuth のセッションをリロードするが、
    // クライアントサイドでプランを保持するために、ここでは localStorage か 
    // 専用の state 管理が必要になる場合があります。
    // 今回は簡易的に「このセッション中だけ」の状態を作ります。
    
    // 実際には、サーバーサイドのAPIを叩いて、
    // セッションのプロパティを上書きするような仕組みが理想的です。
    // ここではデバッグ用に、ブラウザの sessionStorage を使った判定ロジックへの統合を想定します。
    sessionStorage.setItem("debug_mock_plan", plan);
    window.location.reload(); // 反映のためにリロード
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all animate-pulse"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-card border border-destructive/20 p-4 rounded-2xl shadow-2xl w-48 space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-destructive">Debug Mode</span>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          
          <div className="space-y-2">
            <p className="text-[9px] text-muted-foreground">Current: <span className="font-bold text-foreground">{currentPlan}</span></p>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(Plan).map((p) => (
                <button
                  key={p}
                  onClick={() => setMockPlan(p as Plan)}
                  className={`text-[9px] font-black uppercase py-1.5 rounded-lg border transition-all ${
                    currentPlan === p ? "bg-destructive text-white border-destructive" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  Set {p}
                </button>
              ))}
              <button
                onClick={() => {
                  sessionStorage.removeItem("debug_mock_plan");
                  window.location.reload();
                }}
                className="text-[9px] font-black uppercase py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                Reset to DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
