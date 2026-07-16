"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} className="grid size-10 place-items-center rounded-xl border bg-[var(--card)] hover:bg-[var(--muted)]" aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}>
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
