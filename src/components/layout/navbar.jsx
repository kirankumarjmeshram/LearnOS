"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ROUTES } from "@/constants/routes";

const links = [{ label: "Features", href: "#features" }, { label: "About", href: "#solution" }, { label: "Docs", href: "#faq" }];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b bg-[color:var(--background)]/85 backdrop-blur"><nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8"><Logo /> <div className="hidden items-center gap-7 md:flex">{links.map((link) => <Link key={link.label} href={link.href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">{link.label}</Link>)}</div><div className="hidden items-center gap-3 md:flex"><ThemeToggle /><Link href={ROUTES.SIGN_IN} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-[var(--muted)]">Sign in</Link><Link href={ROUTES.SIGN_UP} className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90">Get started</Link></div><button className="grid size-10 place-items-center rounded-xl border md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">{isOpen ? <X /> : <Menu />}</button></nav>{isOpen && <div className="border-t bg-[var(--background)] p-5 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-2">{links.map((link) => <Link key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 hover:bg-[var(--muted)]">{link.label}</Link>)}<Link href={ROUTES.SIGN_IN} className="rounded-xl px-4 py-3 hover:bg-[var(--muted)]">Sign in</Link><Link href={ROUTES.SIGN_UP} className="rounded-xl bg-[var(--primary)] px-4 py-3 text-center font-semibold text-[var(--primary-foreground)]">Get started</Link><ThemeToggle /></div></div>}</header>;
}
