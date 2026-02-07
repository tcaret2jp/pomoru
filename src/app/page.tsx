'use client';

import { useState, useEffect, useCallback } from 'react';
import useSound from 'use-sound';
import { useTimer, DEFAULT_SETTINGS, TimerSettings, TimerMode } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/features/timer/TimerDisplay';
import { TimerProgress } from '@/components/features/timer/TimerProgress';
import { TimerControls } from '@/components/features/timer/TimerControls';
import { ModeSwitcher } from '@/components/features/timer/ModeSwitcher';
import { SettingsModal } from '@/components/features/settings/SettingsModal';
import { FlowModeDialog } from '@/components/features/timer/FlowModeDialog';

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
    extendTime,
  } = useTimer(settings, (finishedMode) => handleTimerComplete(finishedMode));

  const handleTimerComplete = (finishedMode: TimerMode) => {
    playAlarm();
    
    if (finishedMode === 'work') {
      if (settings.autoStartBreaks) {
        // 自動開始ONの場合：即座に休憩へ
        switchMode('shortBreak');
        setTimeout(start, 100);
      } else {
        // 自動開始OFFの場合：ダイアログを表示
        setIsFlowModeOpen(true);
      }
    } else {
      // 休憩終了時
      if (settings.autoStartWork) {
        switchMode('work');
        setTimeout(start, 100);
      } else {
        // 休憩終了後は待機（または通知のみ）
        switchMode('work');
      }
    }
  };

  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomoru-settings', JSON.stringify(newSettings));
  };

  const handleTakeBreak = () => {
    setIsFlowModeOpen(false);
    switchMode('shortBreak');
    setTimeout(start, 100);
  };

  const handleExtend = () => {
    setIsFlowModeOpen(false);
    extendTime(5 * 60); // 5分延長
    setTimeout(start, 100);
  };

  const handleFinish = () => {
    setIsFlowModeOpen(false);
    switchMode('work');
    reset();
  };

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - Pomoru`;
  }, [timeLeft]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 px-4">
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
        onTakeBreak={handleTakeBreak}
        onExtend={handleExtend}
        onFinish={handleFinish}
      />
    </main>
  );
}
