'use client';

import useSound from 'use-sound';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/features/timer/TimerDisplay';
import { TimerProgress } from '@/components/features/timer/TimerProgress';
import { TimerControls } from '@/components/features/timer/TimerControls';
import { ModeSwitcher } from '@/components/features/timer/ModeSwitcher';
import { useEffect } from 'react';

export default function Home() {
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });
  
  const {
    timeLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(playAlarm);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - Pomoru`;
  }, [timeLeft]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center gap-8">
        <ModeSwitcher currentMode={mode} onSwitch={switchMode} />
        
        <TimerProgress timeLeft={timeLeft} mode={mode} size={320}>
          <TimerDisplay timeLeft={timeLeft} />
        </TimerProgress>
        
        <TimerControls 
          isActive={isActive} 
          onToggle={isActive ? pause : start} 
          onReset={reset}
          variant={mode === 'work' ? 'primary' : 'secondary'}
        />
      </div>
    </main>
  );
}
