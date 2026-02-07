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
    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full max-w-sm">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSwitch(mode.id)}
          className={cn(
            "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            currentMode === mode.id
              ? "bg-white dark:bg-zinc-900 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
