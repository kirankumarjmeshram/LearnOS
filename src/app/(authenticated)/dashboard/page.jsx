import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, Compass, FolderKanban, LineChart, Sparkles } from "lucide-react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { ROUTES } from "@/constants/routes";

const actions = [{ title: "Generate AI Roadmap", description: "Plan your next learning outcome.", href: ROUTES.ROADMAP, icon: Sparkles }, { title: "Continue Learning", description: "Return to your learning space.", href: ROUTES.COURSES, icon: Compass }, { title: "My Courses", description: "Browse your future course library.", href: ROUTES.COURSES, icon: BookOpen }, { title: "Progress", description: "See your learning momentum.", href: ROUTES.PROFILE, icon: LineChart }, { title: "Resources", description: "Manage saved learning resources.", href: ROUTES.RESOURCES, icon: FolderKanban }];

export default async function DashboardPage() {
  const user = await currentUser();
  const name = user?.firstName || user?.username || "Learner";
  const email = user?.primaryEmailAddress?.emailAddress || "Your email will appear here.";
  return <PageWrapper><section><p className="text-sm font-semibold text-[var(--primary)]">Your workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {name}.</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--muted-foreground)]">Your LearnOS workspace is ready. Personalized learning features will be introduced in the next milestone.</p><div className="mt-8 rounded-2xl border bg-[var(--card)] p-5"><p className="text-sm text-[var(--muted-foreground)]">Signed in as</p><p className="mt-1 font-medium">{email}</p></div></section><section className="mt-10"><h2 className="text-xl font-semibold">Quick actions</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{actions.map(({ title, description, href, icon: Icon }) => <Link key={title} href={href} className="rounded-2xl border bg-[var(--card)] p-5 hover:-translate-y-0.5 hover:border-[var(--primary)]"><Icon className="size-5 text-[var(--primary)]" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p></Link>)}</div></section></PageWrapper>;
}
