"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

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

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full hover:bg-muted"
        onClick={toggleTheme}
        title={getLabel()}
      >
        <span className="text-xl">{getIcon()}</span>
        <span className="sr-only">Toggle theme</span>
      </Button>
      <span className="text-[10px] text-muted-foreground font-medium mt-1 uppercase">
        {theme === "system" ? "Auto" : theme}
      </span>
    </div>
  )
}