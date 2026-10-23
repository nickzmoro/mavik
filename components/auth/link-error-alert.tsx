"use client";

import { useSearchParams } from "next/navigation";

import { FormAlert } from "./form-alert";

type LinkErrorAlertProps = {
  messages: Record<string, string>;
};

export function LinkErrorAlert({ messages }: LinkErrorAlertProps) {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("erro");

  return <FormAlert message={errorCode ? messages[errorCode] : undefined} />;
}
