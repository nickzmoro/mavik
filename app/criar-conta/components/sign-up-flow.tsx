"use client";

import { useState } from "react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { CheckEmailNotice } from "@/components/auth/check-email-notice";
import { GoogleButton } from "@/components/auth/google-button";
import { TextLink } from "@/components/auth/text-link";
import { routes } from "@/lib/routes";

import { SignUpForm } from "./sign-up-form";

export function SignUpFlow() {
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);

  if (isConfirmationSent) {
    return (
      <CheckEmailNotice
        description="Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta."
        retryPrompt="Digitou o e-mail errado?"
        retryLabel="Corrigir e-mail"
        onRetry={() => setIsConfirmationSent(false)}
      />
    );
  }

  return (
    <>
      <AuthHeader
        title="Crie sua conta"
        description="Comece grátis. Leva menos de um minuto."
      />

      <GoogleButton>Cadastrar com Google</GoogleButton>

      <AuthDivider>ou use seu e-mail</AuthDivider>

      <SignUpForm onSignUpSuccess={() => setIsConfirmationSent(true)} />

      <p className="m-0 text-center text-sm leading-normal text-muted">
        Já tem conta?{" "}
        <TextLink href={routes.login} className="font-semibold underline">
          Entrar
        </TextLink>
      </p>
    </>
  );
}
