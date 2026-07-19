import { currentUser } from "@clerk/nextjs/server";
import { SettingsClient } from "./_components/settings-client";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await currentUser();

  const serializedUser = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Learner",
    email: user.emailAddresses[0]?.emailAddress || "Unknown",
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
    provider: user.externalAccounts && user.externalAccounts.length > 0 
      ? user.externalAccounts[0].provider 
      : "Email / Password"
  } : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
        <p className="text-[var(--muted-foreground)]">
          Manage your account preferences, learning pace, and application settings.
        </p>
      </div>

      <SettingsClient user={serializedUser} />
    </div>
  );
}
