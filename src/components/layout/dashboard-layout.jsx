"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLearning = pathname?.startsWith("/lesson/");

  const handleMenuClick = () => {
    if (isLearning) {
      window.dispatchEvent(new CustomEvent("toggle-learning-sidebar"));
    } else {
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)]">
      <DashboardNavbar onMenuClick={handleMenuClick} />
      {/* Content area fills remaining height; overflow-hidden lets children manage their own scroll */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {children}
      </div>
    </div>
  );
}
