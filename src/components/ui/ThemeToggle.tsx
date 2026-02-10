"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // ハイドレーションエラー防止のためマウント後に表示
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  // テーマを切り替える (light -> dark -> system)
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getIcon = () => {
    if (theme === "light") return "☀️"
    if (theme === "dark") return "🌙"
    return "🖥️" // システム設定用
  }

  const getLabel = () => {
    if (theme === "light") return "Light Mode"
    if (theme === "dark") return "Dark Mode"
    return "System Default"
  }

  // Debug Panel Logic
  const handleStart = () => {
    timerRef.current = setTimeout(() => {
      window.dispatchEvent(new Event('toggle-debug-panel'));
    }, 1500); // 1.5s long press
  };

  const handleEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full hover:bg-muted"
        onClick={toggleTheme}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        title={getLabel()}
      >
        <span className="text-xl select-none">{getIcon()}</span>
        <span className="sr-only">Toggle theme</span>
      </Button>
      <span className="text-[10px] text-muted-foreground font-medium mt-1 uppercase select-none">
        {theme === "system" ? "Auto" : theme}
      </span>
    </div>
  )
}