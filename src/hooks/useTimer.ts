import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  autoStartBreaks: false,
  autoStartWork: false,
};

export function useTimer(settings: TimerSettings = DEFAULT_SETTINGS) {
  const [mode, setMode] = useState<TimerMode>('work');
  const targetTime = settings[mode];
  const [timeLeft, setTimeLeft] = useState(targetTime);
  const [isActive, setIsActive] = useState(false);
  
  // 設定変更（targetTimeの変更）を検知してステートを調整する
  // refs ではなく state を使うことで、レンダー中の安全な更新を実現（React公式推奨パターン）
  const [prevTargetTime, setPrevTargetTime] = useState(targetTime);
  if (prevTargetTime !== targetTime) {
    setPrevTargetTime(targetTime);
    if (!isActive) {
      setTimeLeft(targetTime);
    }
  }

  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(targetTime);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode]);
    startTimeRef.current = null;
    initialTimeLeftRef.current = settings[newMode];
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, [settings]);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(settings[mode]);
    startTimeRef.current = null;
    initialTimeLeftRef.current = settings[mode];
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, [mode, settings]);

  const start = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    initialTimeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const pause = useCallback(() => {
    if (!isActive) return;
    setIsActive(false);
    startTimeRef.current = null;
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, [isActive]);

  const extendTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => prev + seconds);
    initialTimeLeftRef.current += seconds;
    if (startTimeRef.current !== null) {
      startTimeRef.current += seconds * 1000;
    }
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - startTimeRef.current) / 1000);
    const newTimeLeft = initialTimeLeftRef.current - elapsed;
    
    setTimeLeft(newTimeLeft);
  }, []);

  useEffect(() => {
    if (isActive && startTimeRef.current !== null) {
      timerIdRef.current = setInterval(tick, 100);
    }
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isActive, tick]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isActive && startTimeRef.current !== null) {
        tick();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, tick]);

  return { timeLeft, isActive, mode, start, pause, reset, switchMode, extendTime };
}