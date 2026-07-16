import { SignUp } from "@clerk/nextjs";

import { ROUTES } from "@/constants/routes";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return <SignUp fallbackRedirectUrl={ROUTES.ONBOARDING} signInUrl={ROUTES.SIGN_IN} />;
}
