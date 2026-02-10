'use client';

import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { useTimer, DEFAULT_SETTINGS, TimerSettings } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/features/timer/TimerDisplay';
import { TimerProgress } from '@/components/features/timer/TimerProgress';
import { TimerControls } from '@/components/features/timer/TimerControls';
import { ModeSwitcher } from '@/components/features/timer/ModeSwitcher';
import { SettingsModal } from '@/components/features/settings/SettingsModal';
import { TimeEditModal } from '@/components/features/timer/TimeEditModal';
import { FlowModeDialog } from '@/components/features/timer/FlowModeDialog';
import { WelcomeModal } from '@/components/features/auth/WelcomeModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { Star, ChevronUp, X, LayoutDashboard, CreditCard, Info, Sparkles, ChevronDown, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { hasAccess, getEffectiveStatus } from '@/lib/auth-helpers';
import { Plan } from '@prisma/client';

export default function Home() {
  const { data: session, status: actualStatus } = useSession();
  const [mounted, setMounted] = useState(false);
  const status = getEffectiveStatus(actualStatus, mounted);
  
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimeEditOpen, setIsTimeEditOpen] = useState(false);
  const [isFlowModeOpen, setIsFlowModeOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const taskMenuRef = useRef<HTMLDivElement>(null);

  // メニューの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskMenuRef.current && !taskMenuRef.current.contains(event.target as Node)) {
        setIsTaskMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayTasks = [
    "[Sample] Pomoru UIのブラッシュアップ",
    "[Sample] Notion APIの調査"
  ];
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.touches[0].clientY;
    const distance = touchEnd - touchStart;

    // 50px以上下にスワイプしたら閉じる
    if (distance > 50) {
      setIsNavOpen(false);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  useEffect(() => {
    // 1. Settings load
    const savedSettings = localStorage.getItem('pomoru-settings');
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }

    // 2. Welcome Modal check
    // 未ログインかつ、過去にこのポップアップを見ていない場合に表示
    const hasSeenWelcome = localStorage.getItem('pomoru-welcome-seen');
    if (status === "unauthenticated" && !hasSeenWelcome) {
      setIsWelcomeOpen(true);
    }

    setMounted(true);
  }, [status]);

  const closeWelcome = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem('pomoru-welcome-seen', 'true');
  };

  const {
    timeLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(settings);

  const hasTriggeredComplete = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 && !hasTriggeredComplete.current && isActive) {
      hasTriggeredComplete.current = true;
      playAlarm();

      if (mode === 'work') {
        if (settings.autoStartBreaks) {
          switchMode('shortBreak');
          hasTriggeredComplete.current = false;
        } else {
          setIsFlowModeOpen(true);
        }
      } else {
        if (settings.autoStartWork) {
          switchMode('work');
          hasTriggeredComplete.current = false;
        } else {
          switchMode('work');
          pause();
          hasTriggeredComplete.current = false;
        }
      }
    }

    if (timeLeft > 0) {
      hasTriggeredComplete.current = false;
    }
  }, [timeLeft, mode, settings, playAlarm, isActive, switchMode, pause]);

  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomoru-settings', JSON.stringify(newSettings));
  };

  const handleTakeBreak = () => {
    setIsFlowModeOpen(false);
    switchMode('shortBreak');
    start();
  };

  const handleFinish = () => {
    setIsFlowModeOpen(false);
    switchMode('work');
    reset();
  };

  const handleTimerClick = () => {
    if (isActive) return;
    if (status !== "authenticated") {
      setIsWelcomeOpen(true);
      return;
    }
    setIsTimeEditOpen(true);
  };

  const handleTaskMenuToggle = () => {
    const userPlan = (session?.user as any)?.plan;
    if (!hasAccess(userPlan, Plan.PLUS, mounted)) {
      // 本来は専用のUpgradeModalを出すべきですが、一旦既存の挙動を維持しつつ
      // ログインしていない場合はログイン画面、ログイン済みの場合はPricingへ誘導
      if (status !== "authenticated") {
        setIsWelcomeOpen(true);
      } else {
        window.location.href = "/pricing";
      }
      return;
    }
    setIsTaskMenuOpen(!isTaskMenuOpen);
  };

  useEffect(() => {
    const isOvertime = timeLeft < 0;
    const absTime = Math.abs(timeLeft);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    const timeString = `${isOvertime ? '+' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - Pomoru`;
  }, [timeLeft]);

  const isEarlyAdopter = (session?.user as any)?.plan === 'EARLY_ACCESS';

  if (!mounted) {
    return <main className="min-h-screen bg-background" />;
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center bg-background text-foreground transition-colors duration-300 px-4 relative overflow-hidden text-center">
      <div className="absolute top-4 right-4 text-right z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-md mx-auto py-12">
        <div className="flex flex-col items-center gap-4 w-full">
          <ModeSwitcher currentMode={mode} onSwitch={switchMode} />
          
          {/* Task & Stats Quick Access */}
          <div className="flex items-center gap-2 w-full max-w-[280px] mx-auto relative" ref={taskMenuRef}>
            <div className="flex-1 flex items-center bg-muted/30 border border-border/50 rounded-2xl overflow-hidden h-10 group/task shadow-sm">
              {/* Left Side: Dropdown Trigger (Select Task) */}
              <button 
                onClick={handleTaskMenuToggle}
                className="flex-1 flex items-center gap-3 px-4 h-full hover:bg-muted/50 transition-all min-w-0 text-left"
              >
                {selectedTask ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                ) : (
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200", isTaskMenuOpen && "rotate-180")} />
                )}
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider truncate",
                  selectedTask ? "text-foreground" : "text-muted-foreground group-hover/task:text-foreground"
                )}>
                  {selectedTask || "Select Task"}
                </span>
              </button>

              {/* Right Side: Direct Link to Tasks List */}
              <button
                onClick={() => {
                  const userPlan = (session?.user as any)?.plan;
                  if (hasAccess(userPlan, Plan.PLUS, mounted)) {
                    window.location.href = "/tasks";
                  } else {
                    if (status !== "authenticated") {
                      setIsWelcomeOpen(true);
                    } else {
                      window.location.href = "/pricing";
                    }
                  }
                }}
                className="px-3.5 h-full hover:bg-primary/10 transition-all border-l border-border/10 flex items-center justify-center group/arrow bg-muted/20"
                title="View All Tasks"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover/arrow:text-primary transition-colors" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isTaskMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <p className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Today's Focus</p>
                  {todayTasks.map((task) => (
                    <button
                      key={task}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsTaskMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left group"
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        selectedTask === task ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                      )}>
                        {selectedTask === task && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={cn("text-xs font-medium truncate", selectedTask === task ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                        {task}
                      </span>
                    </button>
                  ))}

                  <div className="px-3 py-2 mb-1 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-[8px] font-bold text-primary leading-tight">
                      ※ 現在はプレビュー版です。実際のタスク管理機能は近日公開予定。
                    </p>
                  </div>
                  
                  <div className="h-[1px] bg-border my-2" />
                  
                  <button
                    onClick={() => {
                      const userPlan = (session?.user as any)?.plan;
                      if (hasAccess(userPlan, Plan.PLUS, mounted)) {
                        window.location.href = "/tasks";
                      } else {
                        window.location.href = "/pricing";
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">View All Tasks</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors rotate-180" />
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                const userPlan = (session?.user as any)?.plan;
                if (hasAccess(userPlan, Plan.PREMIUM, mounted)) {
                  window.location.href = "/stats";
                } else {
                  if (status !== "authenticated") {
                    setIsWelcomeOpen(true);
                  } else {
                    window.location.href = "/pricing";
                  }
                }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all text-lg hover:bg-primary/5 active:scale-95"
            >
              📊
            </button>
          </div>
        </div>
        
        <TimerProgress 
          timeLeft={timeLeft} 
          totalTime={settings[mode]} 
          mode={mode} 
          size={320}
          className="mx-auto w-[280px] h-[280px] md:w-[320px] md:h-[320px]"
        >
          <TimerDisplay 
            timeLeft={timeLeft} 
            isEditable={!isActive}
            onEdit={handleTimerClick}
          />
        </TimerProgress>
        
        <TimerControls 
          isActive={isActive} 
          onToggle={isActive ? pause : start} 
          onReset={reset}
          onOpenSettings={() => setIsSettingsOpen(true)}
          variant={mode === 'work' ? 'primary' : 'secondary'}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
      />

      <FlowModeDialog
        isOpen={isFlowModeOpen}
        timeLeft={timeLeft}
        onTakeBreak={handleTakeBreak}
        onFinish={handleFinish}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={closeWelcome}
      />

      <TimeEditModal
        isOpen={isTimeEditOpen}
        onClose={() => setIsTimeEditOpen(false)}
        mode={mode}
        initialSeconds={settings[mode]}
        onSave={(newSeconds) => saveSettings({ ...settings, [mode]: newSeconds })}
      />

      {/* Bottom Area: Trigger and Badge */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 text-center">
        {/* Pull-up Trigger */}
        <button
          onClick={() => setIsNavOpen(true)}
          className="group flex flex-col items-center gap-1.5 px-6 py-2 rounded-full hover:bg-muted/50 transition-all active:scale-95 mx-auto"
        >
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 transition-all" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-foreground">Menu</span>
        </button>

        {/* Status Badge */}
        {isEarlyAdopter && (
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-fade-in cursor-default select-none mx-auto">
            <span className="text-xs leading-none">👑</span>
            <span>EARLY ADOPTER</span>
          </div>
        )}
      </div>

      {/* Pull-up Navigation Menu (Drawer) */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/40 backdrop-blur-md z-40 transition-all duration-500",
          isNavOpen ? "opacity-100 visible" : "opacity-0 pointer-events-none invisible"
        )}
        onClick={() => setIsNavOpen(false)}
      />
      
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 transition-transform duration-500 ease-out rounded-t-[2.5rem] shadow-2xl pb-12 pt-4 px-6",
          isNavOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="max-w-md mx-auto text-center">
          {/* Handle */}
          <div 
            className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing touch-none" 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsNavOpen(false)}
          />
          
          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/pricing" 
              onClick={() => setIsNavOpen(false)}
              className="flex items-center gap-4 p-5 rounded-3xl bg-muted/30 hover:bg-muted transition-colors group text-left"
            >
              <div className="p-3 rounded-2xl bg-background shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Pricing</p>
                <p className="text-[10px] text-muted-foreground truncate">プラン詳細とプレミアム特典</p>
              </div>
            </Link>

            <Link 
              href="/about" 
              onClick={() => setIsNavOpen(false)}
              className="flex items-center gap-4 p-5 rounded-3xl bg-muted/30 hover:bg-muted transition-colors group text-left"
            >
              <div className="p-3 rounded-2xl bg-background shadow-sm group-hover:scale-110 transition-transform">
                {/* 📊アイコンの代わりに Lucide アイコンを維持しつつ、一貫性を保つ */}
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">About</p>
                <p className="text-[10px] text-muted-foreground truncate">Pomoruのコンセプトと機能</p>
              </div>
            </Link>

            {!isEarlyAdopter && (
              <Link 
                href="/early-access" 
                onClick={() => setIsNavOpen(false)}
                className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group text-left"
              >
                <div className="p-3 rounded-2xl bg-primary/10 shadow-sm group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 text-primary">Early Access</p>
                  <p className="text-[10px] text-primary/60 italic font-medium truncate">先着特典を確保する</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

