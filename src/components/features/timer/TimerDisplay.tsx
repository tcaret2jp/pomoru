import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeLeft: number;
  className?: string;
}

export function TimerDisplay({ timeLeft, className }: TimerDisplayProps) {
  const isOvertime = timeLeft < 0;
  const absTime = Math.abs(timeLeft);
  const minutes = Math.floor(absTime / 60);
  const seconds = absTime % 60;

  return (
    <div className={cn(
      "text-8xl font-bold font-mono tracking-tighter tabular-nums transition-colors duration-500",
      isOvertime ? "text-primary animate-pulse" : "text-foreground",
      className
    )}>
      {isOvertime && <span className="text-6xl mr-2">+</span>}
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}