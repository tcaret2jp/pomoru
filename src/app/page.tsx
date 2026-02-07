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
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pomoru-settings');
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to load settings', e);
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFlowModeOpen, setIsFlowModeOpen] = useState(false);
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });

  const {
    timeLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(settings);

  // タイマー終了（0到達）の監視
  const hasTriggeredComplete = useRef(false);

  useEffect(() => {
    // 0になった瞬間を1回だけ検知
    if (timeLeft <= 0 && !hasTriggeredComplete.current && isActive) {
      hasTriggeredComplete.current = true;
      playAlarm();

      if (mode === 'work') {
        if (settings.autoStartBreaks) {
          switchMode('shortBreak');
          // 自動開始の場合は hasTriggeredComplete をリセット
          hasTriggeredComplete.current = false;
        } else {
          // 自動開始OFFならダイアログを表示（タイマーは裏で進み続ける）
          setIsFlowModeOpen(true);
        }
      } else {
        if (settings.autoStartWork) {
          switchMode('work');
          hasTriggeredComplete.current = false;
        } else {
          switchMode('work');
          pause(); // 休憩終了時は止める
          hasTriggeredComplete.current = false;
        }
      }
    }

    // タイマーがリセットされたり、正の値に戻ったらフラグをリセット
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
    </main>
  );
}
