"use client"

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Plan } from "@/types/auth";
import { ShieldAlert, ChevronUp, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminDebugPanel() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = (session?.user as any)?.isAdmin;
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // 管理者であるか、ローカル環境であれば表示
  if (!mounted || (!isAdmin && !isLocalhost)) return null;

  const currentPlan = (session?.user as any)?.plan;
  const mockAuth = typeof window !== 'undefined' ? sessionStorage.getItem("debug_mock_auth") : null;
  const isMockLoggedIn = mockAuth === "authenticated";

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragY(Math.max(0, Math.min(300, currentY - startY.current)));
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragY > 50) setIsOpen(true);
    setDragY(0);
  };

  const toggleMockAuth = () => {
    if (isMockLoggedIn) {
      sessionStorage.setItem("debug_mock_auth", "unauthenticated");
      sessionStorage.removeItem("debug_mock_plan");
    } else {
      sessionStorage.setItem("debug_mock_auth", "authenticated");
      if (!sessionStorage.getItem("debug_mock_plan")) {
        sessionStorage.setItem("debug_mock_plan", Plan.FREE);
      }
    }
    window.location.reload();
  };

  const setMockPlan = (plan: Plan) => {
    // プラン選択時は自動的にログイン済み（authenticated）として扱う
    sessionStorage.setItem("debug_mock_auth", "authenticated");
    sessionStorage.setItem("debug_mock_plan", plan);
    window.location.reload();
  };

  const clearAllMocks = () => {
    sessionStorage.removeItem("debug_mock_plan");
    sessionStorage.removeItem("debug_mock_auth");
    window.location.reload();
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-48 h-12 z-[110] flex flex-col items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseUp={handleEnd}
          onTouchEnd={handleEnd}
          className="w-full h-full flex flex-col items-center justify-start pt-3 group focus:outline-none"
        >
          <div className={cn(
            "w-12 h-1.5 rounded-full bg-primary/20 transition-all group-hover:bg-primary/40 shadow-sm",
            (isDragging || isOpen) && "opacity-0"
          )} />
        </button>
      </div>

      <div 
        className={cn(
          "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-destructive/20 z-[100] transition-all duration-500 ease-out shadow-2xl rounded-b-[2.5rem]",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
        style={isDragging && dragY > 0 ? { transform: `translateY(${dragY - 300}px)`, transition: 'none' } : {}}
      >
        <div className="max-w-md mx-auto pt-12 pb-8 px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive font-mono">Control Center</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {/* Toggle Auth Button */}
              <button
                onClick={toggleMockAuth}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all text-xs font-black font-mono",
                  mockAuth ? "bg-destructive text-white border-destructive shadow-lg" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                )}
              >
                {isMockLoggedIn ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                <span>{isMockLoggedIn ? "LOGGED IN (MOCK)" : "NOT LOGGED IN (MOCK)"}</span>
              </button>

              {/* Plan Simulators - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[Plan.FREE, Plan.PLUS, Plan.PREMIUM, Plan.UNIVERSE].map((p) => (
                  <button
                    key={p}
                    onClick={() => setMockPlan(p)}
                    className={cn(
                      "py-4 rounded-2xl border transition-all text-[10px] font-black font-mono tracking-tighter",
                      currentPlan === p && !mockAuth ? "bg-destructive text-white border-destructive shadow-md" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clearAllMocks}
              className="w-full py-3 mt-2 rounded-2xl border-2 border-dashed border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all"
            >
              Clear All Mocks (Reset to DB)
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <div className="w-12 h-1.5 bg-muted rounded-full cursor-pointer hover:bg-muted-foreground/30 transition-colors" onClick={() => setIsOpen(false)} />
          </div>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 z-[99] bg-background/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />}
    </>
  );
}
