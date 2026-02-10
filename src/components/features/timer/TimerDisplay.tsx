import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeLeft: number;
  className?: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

export function TimerDisplay({ timeLeft, className, isEditable, onEdit }: TimerDisplayProps) {
  const isOvertime = timeLeft < 0;
  const absTime = Math.abs(timeLeft);
  const minutes = Math.floor(absTime / 60);
  const seconds = absTime % 60;

  return (
    <div 
      onClick={isEditable ? onEdit : undefined}
      className={cn(
        "text-7xl md:text-8xl font-bold font-mono tracking-tighter tabular-nums transition-all duration-500 relative group",
        isOvertime ? "text-primary animate-pulse" : "text-foreground",
        isEditable && "cursor-pointer hover:scale-105 active:scale-95",
        className
      )}
    >
      {isOvertime && <span className="text-5xl md:text-6xl mr-1 md:mr-2">+</span>}
      <span className={cn(isEditable && "group-hover:text-primary transition-colors")}>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
      
      {isEditable && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Tap to Change</span>
        </div>
      )}
    </div>
  );
}
