import Link from "next/link";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/constants/routes";

export const metadata = { title: "Welcome" };

export default function OnboardingPage() {
  return <PageWrapper className="grid min-h-[calc(100vh-4rem)] place-items-center"><section className="max-w-xl text-center"><p className="text-sm font-semibold text-[var(--primary)]">Welcome to LearnOS</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Your learning workspace is ready.</h1><p className="mt-5 text-lg leading-8 text-[var(--muted-foreground)]">AI onboarding will be implemented next. It will help LearnOS understand your goals, schedule, and preferred learning style.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href={ROUTES.DASHBOARD} className="rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)]">Continue to Dashboard</Link><Link href={ROUTES.HOME} className="rounded-xl border bg-[var(--card)] px-5 py-3 font-semibold hover:bg-[var(--muted)]">Back Home</Link></div></section></PageWrapper>;
}
