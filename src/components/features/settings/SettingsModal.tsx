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
        [key]: numValue * 60,
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
    >
      <div className="space-y-8 py-6">
        {/* Time Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Time (minutes)</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-medium block text-center">Work</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.work / 60}
                onChange={(e) => handleTimeChange('work', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-3 text-base font-mono text-center focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-medium block text-center">Short</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.shortBreak / 60}
                onChange={(e) => handleTimeChange('shortBreak', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-3 text-base font-mono text-center focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-medium block text-center">Long</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreak / 60}
                onChange={(e) => handleTimeChange('longBreak', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-3 text-base font-mono text-center focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Auto Start Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Automation</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Auto Start Breaks</span>
              <button
                onClick={() => handleToggle('autoStartBreaks')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/50 ${
                  settings.autoStartBreaks ? 'bg-secondary' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                    settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Auto Start Work</span>
              <button
                onClick={() => handleToggle('autoStartWork')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 ${
                  settings.autoStartWork ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                    settings.autoStartWork ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={onClose} variant="primary" className="w-full sm:w-40 h-12 text-base rounded-xl shadow-lg shadow-primary/20">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}