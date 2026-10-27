"use client";

import { Check } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import { Button } from "@/components/ui/button";

export function VoicePreviewCard({ sampleCaption }: { sampleCaption: string }) {
  const form = useFormContext<SaveOnboardingVoiceFormValues>();
  const isApproved = useWatch({
    control: form.control,
    name: "sampleApproved",
  });

  const setApproval = (isSampleApproved: boolean) =>
    form.setValue("sampleApproved", isSampleApproved, { shouldDirty: true });

  return (
    <div className="rounded-(--r-lg) border border-border bg-bg p-5 shadow-(--shadow-md)">
      <p className="m-0 font-display text-lg font-semibold text-text">
        É assim que sua marca fala?
      </p>
      <p className="m-0 mt-1 text-sm text-muted">
        Legenda de exemplo no tom escolhido. Muda quando você mexe nas réguas.
      </p>
      <blockquote
        aria-live="polite"
        className="m-0 mt-4 font-display text-lg leading-snug font-medium text-text"
      >
        “{sampleCaption}”
      </blockquote>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={isApproved ? "default" : "brand"}
          aria-pressed={isApproved}
          onClick={() => setApproval(true)}
        >
          {isApproved && <Check size={16} aria-hidden="true" />}
          {isApproved ? "Confirmado" : "Sim, é isso"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setApproval(false);
            document
              .getElementById("tone-of-voice")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ajustar
        </Button>
      </div>
    </div>
  );
}
