import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const TIMER_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function useTimer(onComplete?: () => void) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isActive, setIsActive] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(TIMER_SETTINGS.work);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(TIMER_SETTINGS[newMode]);
    startTimeRef.current = null;
    initialTimeLeftRef.current = TIMER_SETTINGS[newMode];
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
    startTimeRef.current = null;
    initialTimeLeftRef.current = TIMER_SETTINGS[mode];
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, [mode]);

  const start = useCallback(() => {
    if (isActive || timeLeft <= 0) return;
    
    setIsActive(true);
    startTimeRef.current = Date.now();
    initialTimeLeftRef.current = timeLeft;
  }, [isActive, timeLeft]);

  const pause = useCallback(() => {
    if (!isActive) return;
    
    setIsActive(false);
    startTimeRef.current = null;
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, [isActive]);

  useEffect(() => {
    if (isActive && startTimeRef.current !== null) {
      timerIdRef.current = setInterval(() => {
        const now = Date.now();
        // startTimeRef.current is checked in the if condition but TS might complain inside callback?
        // Let's use ! assertion or check again.
        if (startTimeRef.current === null) return;

        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const newTimeLeft = initialTimeLeftRef.current - elapsed;
        
        if (newTimeLeft <= 0) {
          setTimeLeft(0);
          setIsActive(false);
          startTimeRef.current = null;
          if (timerIdRef.current) clearInterval(timerIdRef.current);
          if (onComplete) onComplete();
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 100);
    }

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isActive, onComplete]);

  // Handle visibility change for immediate update when returning to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isActive && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const newTimeLeft = initialTimeLeftRef.current - elapsed;

        if (newTimeLeft <= 0) {
          setTimeLeft(0);
          setIsActive(false);
          startTimeRef.current = null;
          if (timerIdRef.current) clearInterval(timerIdRef.current);
          if (onComplete) onComplete();
        } else {
          setTimeLeft(newTimeLeft);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, onComplete]);

  return {
    timeLeft,
    isActive,
    mode,
    start,
    pause,
    reset,
    switchMode,
  };
}
