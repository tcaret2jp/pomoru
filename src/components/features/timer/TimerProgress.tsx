import { cn } from "@/lib/utils";
import { TimerMode } from "@/hooks/useTimer";

interface TimerProgressProps {
  timeLeft: number;
  totalTime: number; // 動的に受け取るように変更
  mode: TimerMode;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

export function TimerProgress({ 
  timeLeft, 
  totalTime,
  mode, 
  size = 320, 
  strokeWidth = 12,
  children,
  className
}: TimerProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime;
  const dashOffset = circumference - progress * circumference;

  return (
    <div className={cn("relative flex items-center justify-center w-full max-w-[var(--timer-size)] aspect-square", className)} style={{ "--timer-size": `${size}px` } as React.CSSProperties}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 w-full h-full"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-100 dark:text-zinc-800"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-in-out", 
            mode === 'work' ? 'text-primary' : 'text-secondary'
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}