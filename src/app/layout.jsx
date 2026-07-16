import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata = {
  title: { default: "LearnOS", template: "%s | LearnOS" },
  description: "The AI Operating System for Learning Anything.",
};

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><AppProviders>{children}</AppProviders></body></html>;
}
