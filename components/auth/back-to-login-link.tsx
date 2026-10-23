import { ArrowLeft } from "lucide-react";

import { routes } from "@/lib/routes";

import { TextLink } from "./text-link";

export function BackToLoginLink() {
  return (
    <TextLink
      href={routes.login}
      className="inline-flex min-h-11 items-center gap-2 self-center text-sm leading-normal font-medium no-underline"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Voltar para o login
    </TextLink>
  );
}
