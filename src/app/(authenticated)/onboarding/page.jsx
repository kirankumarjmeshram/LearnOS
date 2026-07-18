import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { PageWrapper } from "@/components/layout/page-wrapper";

export const metadata = { title: "Welcome" };

export default function OnboardingPage() {
  return (
    <PageWrapper>
      <OnboardingFlow />
    </PageWrapper>
  );
}
