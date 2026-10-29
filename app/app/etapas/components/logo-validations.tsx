import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  logoCheckHints,
  logoCheckLabels,
  type CheckStatus,
} from "@/lib/onboarding/analyze-logo";

import type { BrandAssetItem } from "../hooks/use-brand-assets";
import {
  ValidationChecklist,
  type ValidationCheck,
} from "./validation-checklist";

const checkOrder = Object.values(logoCheckLabels);

type LogoValidationsProps = {
  logos: { title: string; asset: BrandAssetItem | undefined }[];
};

const toValidationChecks = (
  checks: Record<string, CheckStatus>,
): ValidationCheck[] =>
  checkOrder.map((label) => ({ label, status: checks[label] ?? "pendente" }));

export function LogoValidations({ logos }: LogoValidationsProps) {
  const uploadedLogos = logos.filter(({ asset }) => asset);
  const hasIssues = uploadedLogos.some(
    ({ asset }) => asset?.checks[logoCheckLabels.approval] !== "ok",
  );

  if (uploadedLogos.length === 0) {
    return <ValidationChecklist checks={toValidationChecks({})} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {uploadedLogos.map(({ title, asset }) => {
        const checks = asset?.checks ?? {};
        const failedHints = Object.entries(checks)
          .filter(
            ([label, status]) =>
              status !== "ok" && label !== logoCheckLabels.approval,
          )
          .map(([label]) => logoCheckHints[label])
          .filter(Boolean);

        return (
          <div key={title} className="flex flex-col gap-2.5">
            <h3 className="m-0 text-sm font-semibold">{title}</h3>
            <ValidationChecklist checks={toValidationChecks(checks)} />
            {failedHints.length > 0 ? (
              <ul className="m-0 flex list-disc flex-col gap-0.5 pl-5 text-sm text-muted">
                {failedHints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
      {hasIssues ? (
        <Alert variant="warning">
          <AlertTitle>
            Algumas logos não atendem a todos os requisitos
          </AlertTitle>
          <AlertDescription>
            Você pode continuar, mas as artes podem ficar com um resultado pior
            (logo cortada, pouco legível ou com fundo estranho). Se puder,
            envie um arquivo ajustado.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
