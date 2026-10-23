import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";

import { SignUpBrandPanel } from "./components/sign-up-brand-panel";
import { SignUpFlow } from "./components/sign-up-flow";

export const metadata: Metadata = {
  title: "Criar conta",
  alternates: { canonical: "/criar-conta" },
};

export default function SignUpPage() {
  return (
    <AuthLayout brandPanel={<SignUpBrandPanel />} className="gap-7">
      <SignUpFlow />
    </AuthLayout>
  );
}
