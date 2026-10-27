import { Check, CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { AutosaveStatus } from "@/hooks/use-onboarding-autosave";
import { routes } from "@/lib/routes";

const autosaveLabels: Record<AutosaveStatus, string> = {
  idle: "Salvamos sozinho enquanto você preenche",
  saving: "Salvando...",
  saved: "Salvo automaticamente",
  error: "Não conseguimos salvar. Tentamos de novo na próxima mudança.",
};

type OnboardingFooterProps = {
  autosaveStatus: AutosaveStatus;
  isSubmitting: boolean;
  submitLabel: string;
  secondaryActions?: React.ReactNode;
};

export function OnboardingFooter({
  autosaveStatus,
  isSubmitting,
  submitLabel,
  secondaryActions,
}: OnboardingFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-10 border-t border-border bg-bg/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          aria-live="polite"
          className="m-0 flex items-center gap-2 text-sm text-muted"
        >
          {autosaveStatus === "saving" && (
            <LoaderCircle
              size={16}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          )}
          {autosaveStatus === "saved" && (
            <Check size={16} aria-hidden="true" className="text-success" />
          )}
          {autosaveStatus === "error" && (
            <CircleAlert size={16} aria-hidden="true" className="text-danger" />
          )}
          {autosaveLabels[autosaveStatus]}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {secondaryActions ?? (
            <Button asChild variant="ghost">
              <Link href={routes.studio}>
                Sair e continuar depois
              </Link>
            </Button>
          )}
          <Button type="submit" variant="brand" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
