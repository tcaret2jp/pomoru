"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plan } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, X } from "lucide-react";

export function AdminDebugPanel() {
  const { data: session, update } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = (session?.user as any)?.isAdmin;

  // マウント前または管理者でない場合は何も表示しない
  if (!mounted || !isAdmin) return null;

  const currentPlan = (session?.user as any)?.plan;

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-debug-panel', handleToggle);
    return () => window.removeEventListener('toggle-debug-panel', handleToggle);
  }, []);

  const setMockPlan = async (plan: Plan | 'NOT_LOGGED_IN') => {
    if (plan === 'NOT_LOGGED_IN') {
      sessionStorage.setItem("debug_mock_auth", "unauthenticated");
      sessionStorage.removeItem("debug_mock_plan");
    } else {
      sessionStorage.removeItem("debug_mock_auth");
      sessionStorage.setItem("debug_mock_plan", plan);
    }
    window.location.reload();
  };

  const resetDebug = () => {
    sessionStorage.removeItem("debug_mock_plan");
    sessionStorage.removeItem("debug_mock_auth");
    window.location.reload();
  };

  return (
    <div className={`fixed bottom-24 right-6 z-[100] transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-card border border-destructive/20 p-4 rounded-2xl shadow-2xl w-48 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <span className="text-[10px] font-black uppercase tracking-widest text-destructive">Debug Mode</span>
          </div>
          <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        
        <div className="space-y-2">
          <p className="text-[9px] text-muted-foreground">Current: <span className="font-bold text-foreground">{sessionStorage.getItem("debug_mock_auth") ? "Not Logged In" : currentPlan}</span></p>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => setMockPlan('NOT_LOGGED_IN')}
              className={`text-[9px] font-black uppercase py-1.5 rounded-lg border transition-all ${
                sessionStorage.getItem("debug_mock_auth") === "unauthenticated" ? "bg-destructive text-white border-destructive" : "bg-muted/50 hover:bg-muted"
              }`}
            >
              Simulate: Not Logged In
            </button>
            <div className="h-[1px] bg-border my-1" />
            {Object.values(Plan).map((p) => (
              <button
                key={p}
                onClick={() => setMockPlan(p as Plan)}
                className={`text-[9px] font-black uppercase py-1.5 rounded-lg border transition-all ${
                  currentPlan === p && !sessionStorage.getItem("debug_mock_auth") ? "bg-destructive text-white border-destructive" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                Set {p}
              </button>
            ))}
            <button
              onClick={resetDebug}
              className="text-[9px] font-black uppercase py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
              Reset to Actual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
