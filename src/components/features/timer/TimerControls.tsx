import { Button } from "@/components/ui/Button";

interface TimerControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  variant?: 'primary' | 'secondary';
}

export function TimerControls({ isActive, onToggle, onReset, onOpenSettings, variant = 'primary' }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      {/* 左側: リセットボタン */}
      <div className="flex justify-end w-16 md:w-20">
        <Button
          variant="ghost"
          size="lg"
          onClick={onReset}
          aria-label="Reset Timer"
          className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-border bg-card shadow-sm hover:bg-muted text-foreground transition-all"
        >
          <span className="text-lg md:text-xl">🔄</span>
        </Button>
      </div>
      
      {/* 中央: 開始/停止ボタン */}
      <Button
        variant={variant}
        size="lg"
        onClick={onToggle}
        className="h-16 w-16 md:h-20 md:w-20 rounded-full shrink-0 shadow-lg active:scale-95 transition-all"
        aria-label={isActive ? "Pause Timer" : "Start Timer"}
      >
        <span className="text-2xl md:text-3xl leading-none">
          {isActive ? "⏸️" : "▶️"}
        </span>
      </Button>

      {/* 右側: 設定ボタン */}
      <div className="flex justify-start w-16 md:w-20">
        <Button
          variant="ghost"
          size="lg"
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-border bg-card shadow-sm hover:bg-muted text-foreground transition-all"
        >
          <span className="text-lg md:text-xl">⚙️</span>
        </Button>
      </div>
    </div>
  );
}
