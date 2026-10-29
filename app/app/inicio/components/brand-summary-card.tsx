import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getBrandSteps } from "@/lib/brand/brand-kit-data";
import { getBrandKitData } from "@/lib/brand/get-brand-kit-data";
import { getVoiceToneLabel } from "@/lib/brand/voice-sample";
import { routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

const summaryColorRoles = ["primary", "secondary", "background", "accent"];

export async function BrandSummaryCard() {
  const brandKit = await getBrandKitData();
  const steps = getBrandSteps(brandKit);
  const completedSteps = steps.filter((step) => step.isDone).length;
  const nextStep = steps.find((step) => !step.isDone);
  const logo = brandKit.logos.symbol ?? brandKit.logos.light;
  const colors = brandKit.palette.filter((color) =>
    summaryColorRoles.includes(color.role),
  );
  const toneLabel = getVoiceToneLabel(
    Object.entries(brandKit.voiceValues).map(([id, value]) => ({ id, value })),
  );

  return (
    <section
      aria-labelledby="brand-title"
      className="glass flex flex-col gap-4 rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <HomeSectionTitle id="brand-title">Sua marca</HomeSectionTitle>
        <span className="text-sm leading-[1.4] font-semibold text-primary">
          {completedSteps} de {steps.length}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="relative box-border flex size-13 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-muted"
        >
          {logo ? (
            <Image
              src={logo.url}
              alt=""
              fill
              unoptimized
              sizes="52px"
              className="object-contain p-1"
            />
          ) : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div
            role="img"
            aria-label={`Cores da marca: ${colors.map((color) => color.name.toLowerCase()).join(", ")}`}
            className="flex gap-1.5"
          >
            {colors.map((color) => (
              <span
                key={color.id}
                className="size-7 rounded-full border-2 border-white shadow-(--shadow-sm) dark:border-white/85 dark:shadow-none"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <span className="text-sm leading-[1.4] text-muted">
            Tom: {toneLabel.toLowerCase()}
          </span>
        </div>
      </div>
      <Progress
        value={completedSteps}
        max={steps.length}
        aria-label="Marca completa"
      />
      <p className="m-0 text-sm leading-normal text-muted">
        {nextStep
          ? `Próximo passo: ${nextStep.label}.`
          : "Brand Kit completo. A IA já usa tudo o que você definiu."}
      </p>
      {nextStep ? (
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={routes.brand}>Completar marca</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
