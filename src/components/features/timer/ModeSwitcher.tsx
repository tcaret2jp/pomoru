import { TimerMode } from "@/hooks/useTimer";
import { cn } from "@/lib/utils";

interface ModeSwitcherProps {
  currentMode: TimerMode;
  onSwitch: (mode: TimerMode) => void;
}

export function ModeSwitcher({ currentMode, onSwitch }: ModeSwitcherProps) {
  const modes: { id: TimerMode; label: string }[] = [
    { id: 'work', label: 'Work' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div className="flex p-1 bg-muted rounded-full w-full max-w-sm border border-border">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSwitch(mode.id)}
          className={cn(
            "flex-1 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200",
            currentMode === mode.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
