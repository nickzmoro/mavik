import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { BrandStep } from "@/lib/brand/brand-kit-data";
import {
  brandPermissions,
  mockBrandVersions,
  type BrandColor,
  type BrandTab,
} from "@/lib/mocks/brand";
import { cn } from "@/lib/utils";

import { BrandCard, BrandSmallText } from "./brand-card";
import { BrandMark } from "./brand-mark";

const summaryColorRoles = ["primary", "secondary", "background", "accent"];

type BrandSideColumnProps = {
  palette: BrandColor[];
  logoUrl?: string;
  toneLabel: string;
  steps: BrandStep[];
  currentVersionId: string;
  onCompleteBrand: (tab: BrandTab) => void;
  onRestoreVersion: (versionId: string) => void;
};

export function BrandSideColumn({
  palette,
  logoUrl,
  toneLabel,
  steps,
  currentVersionId,
  onCompleteBrand,
  onRestoreVersion,
}: BrandSideColumnProps) {
  const completedSteps = steps.filter((step) => step.isDone).length;
  const nextStep = steps.find((step) => !step.isDone);
  const summaryColors = summaryColorRoles.flatMap((role) =>
    palette.filter((color) => color.role === role),
  );
  const backgroundColor = palette.find((color) => color.role === "background");

  return (
    <div className="grid min-w-0 gap-6 md:grid-cols-2 md:items-start xl:flex xl:flex-col xl:items-stretch">
      <BrandCard
        titleId="brand-summary-title"
        title="Sua marca"
        action={
          <span className="text-[15px] font-semibold text-primary">
            {completedSteps} de {steps.length}
          </span>
        }
      >
        <div className="flex items-center gap-3.5">
          <BrandMark
            size="md"
            background={backgroundColor?.hex ?? "transparent"}
            logoUrl={logoUrl}
          />
          <div className="flex flex-col gap-2">
            <div
              role="img"
              aria-label={`Cores da marca: ${summaryColors.map((color) => color.name.toLowerCase()).join(", ")}`}
              className="flex gap-2"
            >
              {summaryColors.map((color) => (
                <span
                  key={color.id}
                  className="size-7 rounded-full border border-brand-tile-border"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
            <BrandSmallText>Tom: {toneLabel.toLowerCase()}</BrandSmallText>
          </div>
        </div>
        <Progress
          value={completedSteps}
          max={steps.length}
          aria-label="Brand Kit completo"
        />
        <BrandSmallText>
          {nextStep
            ? `Próximo passo: ${nextStep.label}.`
            : "Brand Kit completo. A IA já usa tudo o que você definiu."}
        </BrandSmallText>
        {nextStep ? (
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCompleteBrand(nextStep.tab)}
            >
              Completar marca
            </Button>
          </div>
        ) : null}
      </BrandCard>

      <BrandCard titleId="brand-versions-title" title="Versões do Brand Kit">
        <div className="flex flex-col gap-2">
          {mockBrandVersions.map((version) => {
            const isCurrent = version.id === currentVersionId;

            return (
              <div
                key={version.id}
                className={cn(
                  "brand-tile flex min-h-13 items-center gap-3 rounded-[18px] py-2 pr-2 pl-4 text-sm",
                  isCurrent && "border-accent bg-brand-selected",
                )}
              >
                <b className="w-18 font-semibold">{version.label}</b>
                <span className="flex-1 text-muted">
                  {version.date}
                  {isCurrent ? " · atual" : null}
                </span>
                {isCurrent ? (
                  <Badge variant="success">Em uso</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestoreVersion(version.id)}
                  >
                    Restaurar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        <BrandSmallText>
          Cada mudança cria uma nova versão e não altera artes já aprovadas.
        </BrandSmallText>
      </BrandCard>

      <BrandCard
        titleId="brand-permissions-title"
        title="Permissões"
        action={
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-[10px] border border-brand-tile-border bg-bg text-primary dark:bg-brand-selected"
          >
            <Lock className="size-4.5" />
          </span>
        }
      >
        <div className="flex flex-col gap-2.5 text-sm">
          {brandPermissions.map((permission) => (
            <div
              key={permission.label}
              className="flex items-center justify-between gap-3"
            >
              <span>{permission.label}</span>
              <Badge variant={permission.variant}>{permission.role}</Badge>
            </div>
          ))}
        </div>
        <BrandSmallText>
          Só o dono altera logos e cores. Designer sugere, dono aprova.
        </BrandSmallText>
      </BrandCard>
    </div>
  );
}
