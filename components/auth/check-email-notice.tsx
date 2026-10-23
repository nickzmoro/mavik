import { Info, MailCheck } from "lucide-react";
import Link from "next/link";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

type CheckEmailNoticeProps = {
  description: string;
  retryPrompt: string;
  retryLabel: string;
  onRetry: () => void;
};

export function CheckEmailNotice({
  description,
  retryPrompt,
  retryLabel,
  onRetry,
}: CheckEmailNoticeProps) {
  return (
    <div role="status" className="flex flex-col gap-8">
      <AuthHeader
        title="Confira seu e-mail"
        description={description}
        icon={
          <span
            aria-hidden="true"
            className="mb-2 flex size-14 items-center justify-center rounded-full bg-success-bg text-success"
          >
            <MailCheck size={24} />
          </span>
        }
      />

      <div className="flex gap-3 rounded-(--r-lg) border border-border bg-surface p-4">
        <span aria-hidden="true" className="flex flex-none pt-0.5 text-primary">
          <Info size={18} />
        </span>
        <p className="m-0 text-sm leading-normal text-text">
          Não chegou em alguns minutos? Olhe a caixa de spam ou promoções.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button asChild variant="outline" className="w-full">
          <Link href={routes.login}>Voltar para o login</Link>
        </Button>
        <p className="m-0 text-center text-sm leading-normal text-muted">
          {retryPrompt}{" "}
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-(--r-sm) border-0 bg-transparent p-0 font-semibold text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {retryLabel}
          </button>
        </p>
      </div>
    </div>
  );
}
