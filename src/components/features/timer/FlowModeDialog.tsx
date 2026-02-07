"use client"

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface FlowModeDialogProps {
  isOpen: boolean;
  onTakeBreak: () => void;
  onExtend: () => void;
  onFinish: () => void;
}

export function FlowModeDialog({ isOpen, onTakeBreak, onExtend, onFinish }: FlowModeDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onFinish} // 外側クリック時は「終了」扱い
      title="Work Session Complete! 🎉"
      description="Great job staying focused. What would you like to do next?"
    >
      <div className="flex flex-col gap-3 py-4">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={onTakeBreak}
          className="w-full text-lg h-14"
        >
          ☕ Take a Break
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onExtend}
          className="w-full text-lg h-14"
        >
          🔥 Extend Work (+5 min)
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
    </Modal>
  );
}
