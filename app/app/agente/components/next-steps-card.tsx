"use client";

import { useState } from "react";

import { PanelCard, PanelMeta } from "@/components/common/panel-card";
import { TruncatedText } from "@/components/common/truncated-text";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mockAgentNextSteps } from "@/lib/mocks/agent";
import { cn } from "@/lib/utils";

export function NextStepsCard() {
  const [nextSteps, setNextSteps] = useState(mockAgentNextSteps);

  const completedCount = nextSteps.filter((step) => step.isDone).length;

  const toggleStep = (stepId: string, isDone: boolean) =>
    setNextSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === stepId ? { ...step, isDone } : step,
      ),
    );

  return (
    <PanelCard
      titleId="next-title"
      title="Próximos passos"
      action={
        <PanelMeta>
          {completedCount} de {nextSteps.length}{" "}
          {completedCount > 1 ? "feitos" : "feito"}
        </PanelMeta>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {nextSteps.map((step) => {
          const checkboxId = `next-step-${step.id}`;

          return (
            <li key={step.id} className="flex min-h-10 items-center gap-2.5">
              <Checkbox
                id={checkboxId}
                checked={step.isDone}
                onCheckedChange={(checked) =>
                  toggleStep(step.id, checked === true)
                }
              />
              <Label
                htmlFor={checkboxId}
                className="min-w-0 flex-1 cursor-pointer text-sm leading-[1.4] font-normal"
              >
                <TruncatedText
                  className={cn(step.isDone && "text-muted line-through")}
                >
                  {step.label}
                </TruncatedText>
              </Label>
              {step.dueLabel && !step.isDone ? (
                <Badge variant="warning">{step.dueLabel}</Badge>
              ) : null}
            </li>
          );
        })}
      </ul>
    </PanelCard>
  );
}
