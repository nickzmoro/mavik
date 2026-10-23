import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";

import { ResetPasswordFlow } from "./components/reset-password-flow";

export const metadata: Metadata = {
  title: "Criar nova senha",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout shouldRedirectIfAuthenticated={false}>
      <ResetPasswordFlow />
    </AuthLayout>
  );
}
