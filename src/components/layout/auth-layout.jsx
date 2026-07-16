import { Logo } from "@/components/common/logo";

export function AuthLayout({ children }) {
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_var(--secondary),_transparent_38%)] p-6"><div className="absolute left-6 top-6"><Logo /></div><section className="w-full max-w-md">{children}</section></main>;
}
