"use client";

import Link from "next/link";
import { BookOpen, FolderKanban, LayoutDashboard, Map, Settings, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const items = [{ label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard }, { label: "Roadmap", href: ROUTES.ROADMAP, icon: Map }, { label: "Courses", href: ROUTES.COURSES, icon: BookOpen }, { label: "Resources", href: ROUTES.RESOURCES, icon: FolderKanban }, { label: "Profile", href: ROUTES.PROFILE, icon: UserRound }, { label: "Settings", href: ROUTES.SETTINGS, icon: Settings }];

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  return <><button type="button" onClick={onClose} aria-label="Close navigation overlay" className={cn("fixed inset-0 z-30 bg-slate-950/30 lg:hidden", isOpen ? "block" : "hidden")} /><aside className={cn("fixed inset-y-16 left-0 z-40 flex w-64 flex-col border-r bg-[var(--background)] p-4 transition-transform lg:static lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}><button type="button" onClick={onClose} className="ml-auto grid size-9 place-items-center rounded-lg hover:bg-[var(--muted)] lg:hidden" aria-label="Close navigation"><X className="size-4" /></button><p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Workspace</p><nav className="space-y-1">{items.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={onClose} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]", pathname === href && "bg-[var(--secondary)] text-[var(--secondary-foreground)]")}><Icon className="size-4" />{label}</Link>)}</nav><p className="mt-auto rounded-xl border bg-[var(--card)] p-3 text-xs leading-5 text-[var(--muted-foreground)]">Your learning workspace is ready for the next milestone.</p></aside></>;
}
