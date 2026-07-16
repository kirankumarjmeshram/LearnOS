import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export const metadata = { title: "Welcome" };

export default function OnboardingPage() {
  return <main className="min-w-0 flex-1 p-5 lg:p-8"><OnboardingFlow /></main>;
}
