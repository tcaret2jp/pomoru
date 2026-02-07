"use client"

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface FlowModeDialogProps {
  isOpen: boolean;
  timeLeft: number;
  onTakeBreak: () => void;
  onFinish: () => void;
}

export function FlowModeDialog({ isOpen, timeLeft, onTakeBreak, onFinish }: FlowModeDialogProps) {
  const absTime = Math.abs(timeLeft);
  const minutes = Math.floor(absTime / 60);
  const seconds = absTime % 60;
  const timeString = `+${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onFinish}
      title="Work Session Complete! 🎉"
      description="You've entered bonus focus time. Keep it up or take a well-deserved rest."
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* ダイアログ内タイマー表示 - さらに控えめに */}
        <div className="text-3xl font-semibold font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
          {timeString}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={onTakeBreak}
            className="w-full text-lg h-14"
          >
            ☕ Take a Break
          </Button>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={onFinish}
            className="w-full text-muted-foreground"
          >
            Done for now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
