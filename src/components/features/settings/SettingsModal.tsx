"use client"

import { Modal } from "@/components/ui/Modal";
import { TimerSettings } from "@/hooks/useTimer";
import { Button } from "@/components/ui/Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const handleTimeChange = (key: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onSave({
        ...settings,
        [key]: numValue * 60, // 秒に変換
      });
    }
  };

  const handleToggle = (key: 'autoStartBreaks' | 'autoStartWork') => {
    onSave({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings ⚙️"
      description="Customize your pomodoro experience."
    >
      <div className="space-y-6 py-4">
        {/* Time Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium leading-none text-center">Time (minutes)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Work</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.work / 60}
                onChange={(e) => handleTimeChange('work', e.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Short</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.shortBreak / 60}
                onChange={(e) => handleTimeChange('shortBreak', e.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Long</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreak / 60}
                onChange={(e) => handleTimeChange('longBreak', e.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Auto Start Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium leading-none text-center">Automation</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Auto Start Breaks</span>
            <button
              onClick={() => handleToggle('autoStartBreaks')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoStartBreaks ? 'bg-secondary' : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Auto Start Work</span>
            <button
              onClick={() => handleToggle('autoStartWork')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoStartWork ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoStartWork ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={onClose} variant="primary" className="w-full sm:w-32">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
