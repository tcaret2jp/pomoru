'use client';

import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import { useTimer, DEFAULT_SETTINGS, TimerSettings } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/features/timer/TimerDisplay';
import { TimerProgress } from '@/components/features/timer/TimerProgress';
import { TimerControls } from '@/components/features/timer/TimerControls';
import { ModeSwitcher } from '@/components/features/timer/ModeSwitcher';
import { SettingsModal } from '@/components/features/settings/SettingsModal';
import { FlowModeDialog } from '@/components/features/timer/FlowModeDialog';
import { WelcomeModal } from '@/components/features/auth/WelcomeModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFlowModeOpen, setIsFlowModeOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });

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
    extendTime,
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <ModeSwitcher currentMode={mode} onSwitch={switchMode} />
        
        <TimerProgress 
          timeLeft={timeLeft} 
          totalTime={settings[mode]} 
          mode={mode} 
          size={320}
        >
          <TimerDisplay timeLeft={timeLeft} />
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

      {/* Bottom Area: Link or Emoji Badge */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {isEarlyAdopter ? (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary animate-fade-in cursor-default">
            <span className="text-sm leading-none">👑</span>
            <span>EARLY ADOPTER</span>
          </div>
        ) : (
          <Link 
            href="/early-access" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm leading-none">🌟</span>
            <span>Early Adopter Program</span>
          </Link>
        )}
      </div>
    </main>
  );
}