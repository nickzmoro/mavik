"use client";

import { Suspense, useState } from "react";

import { AuthFaviconIcon } from "@/components/auth/auth-favicon-icon";
import { AuthHeader } from "@/components/auth/auth-header";
import { BackToLoginLink } from "@/components/auth/back-to-login-link";
import { CheckEmailNotice } from "@/components/auth/check-email-notice";
import { LinkErrorAlert } from "@/components/auth/link-error-alert";
import { recoverPasswordLinkErrorMessages } from "@/lib/auth-link-errors";

import { RecoverPasswordForm } from "./recover-password-form";

export function RecoverPasswordFlow() {
  const [isLinkSent, setIsLinkSent] = useState(false);

  if (isLinkSent) {
    return (
      <CheckEmailNotice
        description="Se houver uma conta com esse e-mail, você vai receber um link para criar uma nova senha."
        retryPrompt="Não recebeu?"
        retryLabel="Enviar de novo"
        onRetry={() => setIsLinkSent(false)}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <AuthHeader
          title="Esqueceu sua senha?"
          description="Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha."
          icon={<AuthFaviconIcon />}
        />

        <Suspense fallback={null}>
          <LinkErrorAlert messages={recoverPasswordLinkErrorMessages} />
        </Suspense>

        <RecoverPasswordForm onLinkSent={() => setIsLinkSent(true)} />
      </div>

      <BackToLoginLink />
    </>
  );
}
