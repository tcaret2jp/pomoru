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
      <div className="flex justify-end w-20">
        <Button
          variant="ghost"
          size="lg"
          onClick={onReset}
          aria-label="Reset Timer"
          className="h-14 w-14 rounded-full border border-zinc-200 bg-zinc-50"
        >
          <span className="text-xl">🔄</span>
        </Button>
      </div>
      
      {/* 中央: 開始/停止ボタン */}
      <Button
        variant={variant}
        size="lg"
        onClick={onToggle}
        className="h-20 w-20 rounded-full shrink-0 shadow-lg"
        aria-label={isActive ? "Pause Timer" : "Start Timer"}
      >
        <span className="text-3xl leading-none">
          {isActive ? "⏸️" : "▶️"}
        </span>
      </Button>

      {/* 右側: 設定ボタン (リセットボタンと線対称) */}
      <div className="flex justify-start w-20">
        <Button
          variant="ghost"
          size="lg"
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="h-14 w-14 rounded-full border border-zinc-200 bg-zinc-50"
        >
          <span className="text-xl">⚙️</span>
        </Button>
      </div>
    </div>
  );
}
