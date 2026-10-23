import { AuthFaviconIcon } from "@/components/auth/auth-favicon-icon";
import { AuthHeader } from "@/components/auth/auth-header";
import { BackToLoginLink } from "@/components/auth/back-to-login-link";

import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordFlow() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <AuthHeader
          title="Crie uma nova senha"
          description="Escolha uma senha que você não usa em outros sites. Depois de salvar, você entra direto na sua conta."
          icon={<AuthFaviconIcon />}
        />

        <ResetPasswordForm />
      </div>

      <BackToLoginLink />
    </>
  );
}
