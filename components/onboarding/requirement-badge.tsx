import { cn } from "@/lib/utils";

const requirementStyles = {
  obrigatorio: "bg-surface-2 text-primary",
  recomendado: "border border-warning bg-warning-bg text-text",
  opcional: "border border-muted bg-bg text-text",
};

const requirementLabels = {
  obrigatorio: "Obrigatório",
  recomendado: "Recomendado",
  opcional: "Opcional",
};

export function RequirementBadge({
  requirement,
}: {
  requirement: keyof typeof requirementStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs leading-[1.4] font-medium",
        requirementStyles[requirement],
      )}
    >
      {requirement === "recomendado" && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-warning" />
      )}
      {requirementLabels[requirement]}
    </span>
  );
}
