"use client"

import { Modal } from "@/components/ui/Modal";
import { TimerSettings } from "@/hooks/useTimer";
import { Button } from "@/components/ui/Button";
import { signOut, useSession } from "next-auth/react";
import { Crown, LogOut, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

type ExtendedUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan?: string;
};

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const { data: session, status } = useSession();

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

  const user = session?.user as ExtendedUser | undefined;
  const isEarlyAdopter = user?.plan === 'EARLY_ACCESS';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings ⚙️"
      className="max-w-[400px] w-[95vw]"
    >
      <div className="space-y-8 py-6">
        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Account</h3>
          <div className="bg-muted/30 rounded-[1.5rem] p-4 border border-border/50">
            {status === "authenticated" ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  {isEarlyAdopter && (
                    <div className="px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2">
                <p className="text-[11px] text-muted-foreground text-center leading-relaxed font-medium uppercase tracking-tighter">
                  Sign in to sync your settings and <br />unlock premium features.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                  className="w-full justify-center gap-3 h-12 rounded-[1rem] shadow-lg shadow-primary/10"
                >
                  <Link href="/auth/signin" onClick={onClose}>
                    <LogIn className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Go to Sign In</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

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
                className="w-full rounded-[1rem] border border-border bg-background px-2 py-2 md:px-3 md:py-3 text-sm md:text-base font-mono text-center focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none transition-all shadow-sm"
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
                className="w-full rounded-[1rem] border border-border bg-background px-2 py-2 md:px-3 md:py-3 text-sm md:text-base font-mono text-center focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all shadow-sm"
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
                className="w-full rounded-[1rem] border border-border bg-background px-2 py-2 md:px-3 md:py-3 text-sm md:text-base font-mono text-center focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Auto Start Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">Automation</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-[1.25rem] hover:bg-muted/50 transition-colors">
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
            <div className="flex items-center justify-between p-3 rounded-[1.25rem] hover:bg-muted/50 transition-colors">
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
          <Button onClick={onClose} variant="primary" className="w-full sm:w-40 h-12 text-base rounded-[1.25rem] shadow-lg shadow-primary/20">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
