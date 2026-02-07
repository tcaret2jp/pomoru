import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeLeft: number;
  className?: string;
}

export function TimerDisplay({ timeLeft, className }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={cn("text-8xl font-bold font-mono tracking-tighter tabular-nums", className)}>
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
