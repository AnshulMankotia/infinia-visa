import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Create your account | Infinia Visa",
  description: "One account for every journey. Store documents once, reuse them on every application.",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
