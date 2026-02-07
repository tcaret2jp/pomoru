'use client';

import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { useTimer, DEFAULT_SETTINGS, TimerSettings } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/features/timer/TimerDisplay';
import { TimerProgress } from '@/components/features/timer/TimerProgress';
import { TimerControls } from '@/components/features/timer/TimerControls';
import { ModeSwitcher } from '@/components/features/timer/ModeSwitcher';
import { SettingsModal } from '@/components/features/settings/SettingsModal';

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
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });
  
  // マウント後の読み込み useEffect は不要になったので削除
  
  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomoru-settings', JSON.stringify(newSettings));
  };

  const {
    timeLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(settings, playAlarm);

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
    </main>
  );
}