"use client"

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface TimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  initialSeconds: number;
  onSave: (seconds: number) => void;
}

export function TimeEditModal({ isOpen, onClose, mode, initialSeconds, onSave }: TimeEditModalProps) {
  const [minutes, setMinutes] = useState(Math.floor(initialSeconds / 60));
  const [seconds, setSeconds] = useState(initialSeconds % 60);

  // モーダルが開くたびに初期値を同期
  useEffect(() => {
    if (isOpen) {
      setMinutes(Math.floor(initialSeconds / 60));
      setSeconds(initialSeconds % 60);
    }
  }, [isOpen, initialSeconds]);

  const handleSave = () => {
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds > 0) {
      onSave(totalSeconds);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${mode.charAt(0).toUpperCase() + mode.slice(1)} Time ⏱️`}
      className="max-w-[320px] w-[90vw]"
    >
      <div className="py-8 flex flex-col items-center gap-8">
        <div className="flex items-center justify-center gap-4">
          {/* Minutes Input */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min</span>
            <input
              type="number"
              min="0"
              max="99"
              value={minutes}
              onChange={(e) => setMinutes(Math.min(99, Math.max(0, parseInt(e.target.value || "0"))))}
              className="w-20 h-20 rounded-2xl border-2 border-border bg-muted/20 text-3xl font-bold font-mono text-center focus:border-primary focus:outline-none transition-all"
            />
          </div>

          <span className="text-3xl font-bold text-muted-foreground mt-6">:</span>

          {/* Seconds Input */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sec</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value || "0"))))}
              className="w-20 h-20 rounded-2xl border-2 border-border bg-muted/20 text-3xl font-bold font-mono text-center focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-2 h-12 rounded-xl shadow-lg shadow-primary/20">
            Save Time
          </Button>
        </div>
      </div>
    </Modal>
  );
}
