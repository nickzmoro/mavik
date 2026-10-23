import { Info, MailCheck } from "lucide-react";
import Link from "next/link";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";

type RecoverPasswordSentProps = {
  onResend: () => void;
};

export function RecoverPasswordSent({ onResend }: RecoverPasswordSentProps) {
  return (
    <div role="status" className="flex flex-col gap-8">
      <AuthHeader
        title="Confira seu e-mail"
        description="Se houver uma conta com esse e-mail, você vai receber um link para criar uma nova senha."
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
          <Link href="/login">Voltar para o login</Link>
        </Button>
        <p className="m-0 text-center text-sm leading-normal text-muted">
          Não recebeu?{" "}
          <button
            type="button"
            onClick={onResend}
            className="cursor-pointer rounded-(--r-sm) border-0 bg-transparent p-0 font-semibold text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Enviar de novo
          </button>
        </p>
      </div>
    </div>
  );
}
