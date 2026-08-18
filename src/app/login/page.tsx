import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign in | Infinia Visa",
  description: "Sign in to track applications, manage documents, and file your next visa.",
};

export default function LoginPage() {
  return <AuthPage mode="signin" />;
}
