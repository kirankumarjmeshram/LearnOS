"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ROUTES } from "@/constants/routes";

export function DashboardNavbar({ onMenuClick }) {
  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-[color:var(--background)]/90 px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button type="button" onClick={onMenuClick} className="grid size-10 place-items-center rounded-xl border lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button><Logo /></div><nav className="hidden items-center gap-5 text-sm md:flex"><Link href={ROUTES.DASHBOARD} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Dashboard</Link><Link href={ROUTES.PROFILE} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Profile</Link><Link href={ROUTES.SETTINGS} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Settings</Link></nav><div className="flex items-center gap-3"><ThemeToggle /><UserButton afterSignOutUrl={ROUTES.HOME} /></div></header>;
}
