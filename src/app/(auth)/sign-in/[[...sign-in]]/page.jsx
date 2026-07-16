import { SignIn } from "@clerk/nextjs";

import { ROUTES } from "@/constants/routes";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return <SignIn fallbackRedirectUrl={ROUTES.DASHBOARD} signUpUrl={ROUTES.SIGN_UP} />;
}
