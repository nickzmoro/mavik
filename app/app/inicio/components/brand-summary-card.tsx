import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockBrandSummary } from "@/lib/mocks/home";
import { routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

export function BrandSummaryCard() {
  const colorNames = mockBrandSummary.colors.map((color) => color.name);

  return (
    <section
      aria-labelledby="brand-title"
      className="glass flex flex-col gap-4 rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <HomeSectionTitle id="brand-title">Sua marca</HomeSectionTitle>
        <span className="text-sm leading-[1.4] font-semibold text-primary">
          {mockBrandSummary.completedSteps} de {mockBrandSummary.totalSteps}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="box-border flex size-13 shrink-0 items-center justify-center rounded-[14px] bg-[#2e2a27] font-[Georgia,serif] text-xl text-[#f4ede4] dark:border dark:border-white/14"
        >
          {mockBrandSummary.initials}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div
            role="img"
            aria-label={`Cores da marca: ${colorNames.slice(0, -1).join(", ")} e ${colorNames.at(-1)}`}
            className="flex gap-1.5"
          >
            {mockBrandSummary.colors.map((color) => (
              <span
                key={color.hex}
                className="size-7 rounded-full border-2 border-white shadow-(--shadow-sm) dark:border-white/85 dark:shadow-none"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <span className="text-sm leading-[1.4] text-muted">
            Tom: {mockBrandSummary.tone}
          </span>
        </div>
      </div>
      <Progress
        value={mockBrandSummary.completedSteps}
        max={mockBrandSummary.totalSteps}
        aria-label="Marca completa"
      />
      <p className="m-0 text-sm leading-normal text-muted">
        {mockBrandSummary.missingStepHint}
      </p>
      <div>
        <Button variant="secondary" size="sm" asChild>
          <Link href={routes.brand}>Completar marca</Link>
        </Button>
      </div>
    </section>
  );
}
