import { Database, FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

export type EvidenceBadgeKind = "real" | "hypothesis" | "none";

const evidenceBadgeClassNames: Record<EvidenceBadgeKind, string> = {
  real: "border border-[#86d1bb] bg-[#e3f6f0] text-[#0b4d3c] dark:border-[rgba(79,209,174,.5)] dark:bg-[rgba(79,209,174,.14)] dark:text-[#c6f5e7]",
  hypothesis:
    "border border-dashed border-[#d39a2a] bg-[#fff6e3] text-[#5c3600] dark:border-[rgba(245,185,77,.6)] dark:bg-[rgba(245,185,77,.12)] dark:text-[#ffe2a8]",
  none: "border border-dashed border-[#b7b0cc] bg-white/70 text-[#5e5877] dark:border-white/28 dark:bg-white/4 dark:text-[#b9b0d6]",
};

export const evidenceLabels: Record<EvidenceBadgeKind, string> = {
  real: "Dado real",
  hypothesis: "Hipótese",
  none: "Sem dados",
};

const evidenceIcons = {
  real: Database,
  hypothesis: FlaskConical,
  none: null,
};

const evidenceBaseClassName =
  "inline-flex items-center gap-1.25 rounded-full px-2.25 py-0.75 font-sans text-xs leading-[1.3] font-semibold whitespace-nowrap";

type EvidenceBadgeProps = {
  kind: EvidenceBadgeKind;
  label?: string;
  hasIcon?: boolean;
  className?: string;
};

function EvidenceBadgeContent({
  kind,
  label,
  hasIcon = true,
}: Omit<EvidenceBadgeProps, "className">) {
  const EvidenceIcon = evidenceIcons[kind];

  return (
    <>
      {hasIcon && EvidenceIcon ? (
        <EvidenceIcon aria-hidden="true" className="size-3 shrink-0" />
      ) : null}
      {label ?? evidenceLabels[kind]}
    </>
  );
}

export function EvidenceBadge({
  kind,
  className,
  ...props
}: EvidenceBadgeProps) {
  return (
    <span
      className={cn(
        evidenceBaseClassName,
        evidenceBadgeClassNames[kind],
        className,
      )}
    >
      <EvidenceBadgeContent kind={kind} {...props} />
    </span>
  );
}

type EvidenceButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  kind: EvidenceBadgeKind;
};

export function EvidenceButton({
  kind,
  className,
  type = "button",
  ...props
}: EvidenceButtonProps) {
  return (
    <button
      type={type}
      aria-label={`${evidenceLabels[kind]}: entenda esta conclusão`}
      className={cn(
        evidenceBaseClassName,
        evidenceBadgeClassNames[kind],
        "cursor-pointer transition-[filter] duration-150 hover:brightness-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <EvidenceBadgeContent kind={kind} />
    </button>
  );
}
