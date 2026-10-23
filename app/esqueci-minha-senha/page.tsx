import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";

import { RecoverPasswordFlow } from "./components/recover-password-flow";

export const metadata: Metadata = {
  title: "Recuperar senha",
  alternates: { canonical: "/esqueci-minha-senha" },
};

export default function RecoverPasswordPage() {
  return (
    <AuthLayout>
      <RecoverPasswordFlow />
    </AuthLayout>
  );
}
