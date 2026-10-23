"use client";

import { useSearchParams } from "next/navigation";

import { FormAlert } from "@/components/auth/form-alert";

const confirmationErrorMessages: Record<string, string> = {
  "link-invalido":
    "Esse link de confirmação expirou ou já foi usado. Entre com seu e-mail e senha ou crie a conta de novo.",
};

export function ConfirmationErrorAlert() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("erro");

  return (
    <FormAlert
      message={errorCode ? confirmationErrorMessages[errorCode] : undefined}
    />
  );
}
