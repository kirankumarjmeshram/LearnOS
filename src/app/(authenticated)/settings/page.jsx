import { currentUser } from "@clerk/nextjs/server";
import { SettingsClient } from "./_components/settings-client";

import { PageWrapper } from "@/components/layout/page-wrapper";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await currentUser();

  const serializedUser = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Learner",
    email: user.emailAddresses[0]?.emailAddress || "Unknown",
    provider: user.externalAccounts[0]?.provider || "password",
    createdAt: user.createdAt,
  } : null;

  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1100px] animate-in fade-in duration-500">
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage your account preferences, learning pace, and application settings.
          </p>
        </div>

        <SettingsClient user={serializedUser} />
      </div>
    </PageWrapper>
  );
}
