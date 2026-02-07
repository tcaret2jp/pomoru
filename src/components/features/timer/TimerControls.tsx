import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TimerControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  variant?: 'primary' | 'secondary';
}

export function TimerControls({ isActive, onToggle, onReset, variant = 'primary' }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="lg"
        onClick={onReset}
        aria-label="Reset Timer"
        className="h-14 w-14 rounded-full"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>
      
      <Button
        variant={variant}
        size="lg"
        onClick={onToggle}
        className="h-20 w-20 rounded-full"
        aria-label={isActive ? "Pause Timer" : "Start Timer"}
      >
        {isActive ? (
          <Pause className="h-8 w-8 fill-current" />
        ) : (
          <Play className="h-8 w-8 fill-current ml-1" />
        )}
      </Button>
    </div>
  );
}
