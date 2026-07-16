import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AuthenticatedLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
