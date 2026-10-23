"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { AuthHeader } from "@/components/auth/auth-header";
import { TextLink } from "@/components/auth/text-link";

import { RecoverPasswordForm } from "./recover-password-form";
import { RecoverPasswordSent } from "./recover-password-sent";

export function RecoverPasswordFlow() {
  const [isLinkSent, setIsLinkSent] = useState(false);

  if (isLinkSent) {
    return <RecoverPasswordSent onResend={() => setIsLinkSent(false)} />;
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <AuthHeader
          title="Esqueceu sua senha?"
          description="Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha."
          icon={
            <span
              aria-hidden="true"
              className="mb-2 flex size-14 items-center justify-center"
            >
              <Image
                src="/mavik-logo-favicon.webp"
                alt=""
                width={63}
                height={64}
                className="mb-2 block h-16 w-15.75 max-w-none"
              />
            </span>
          }
        />

        <RecoverPasswordForm onLinkSent={() => setIsLinkSent(true)} />
      </div>

      <TextLink
        href="/login"
        className="inline-flex min-h-11 items-center gap-2 self-center text-sm leading-normal font-medium no-underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para o login
      </TextLink>
    </>
  );
}
