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
    <div className="min-h-screen bg-[var(--background)]">
      <DashboardNavbar onMenuClick={handleMenuClick} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {children}
      </div>
    </div>
  );
}

