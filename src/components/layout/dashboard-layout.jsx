"use client";

import { useState } from "react";

import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-[var(--background)]"><DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} /><div className="flex"><Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />{children}</div></div>;
}
