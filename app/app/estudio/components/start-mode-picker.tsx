import {
  ChevronRight,
  MessageCircle,
  PenLine,
  type LucideIcon,
} from "lucide-react";

import type { StudioMode } from "../hooks/use-studio";
import { BrandAssuranceNote } from "@/components/common/brand-assurance-note";

const startOptions: {
  mode: StudioMode;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    mode: "guided",
    title: "Me guie com perguntas",
    description:
      "Responda algumas perguntas rápidas e a IA monta o pedido para você.",
    icon: MessageCircle,
  },
  {
    mode: "free",
    title: "Já sei o que quero",
    description: "Escreva o seu próprio pedido, do seu jeito.",
    icon: PenLine,
  },
];

type StartModePickerProps = {
  onPick: (mode: StudioMode) => void;
};

export function StartModePicker({ onPick }: StartModePickerProps) {
  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-display text-xl leading-[1.3] font-semibold">
          Nova arte
        </h2>
        <p className="m-0 text-sm leading-normal text-muted">
          Como você prefere começar?
        </p>
      </div>
      <div
        role="group"
        aria-label="Como começar"
        className="flex flex-col gap-2.5"
      >
        {startOptions.map(({ mode, title, description, icon: Icon }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onPick(mode)}
            className="tile flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] p-4 text-left text-text transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-surface-2 text-primary"
            >
              <Icon className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-display text-base leading-[1.4] font-semibold">
                {title}
              </span>
              <span className="text-sm leading-normal text-muted">
                {description}
              </span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="size-4.5 shrink-0 text-muted"
            />
          </button>
        ))}
      </div>
      <BrandAssuranceNote>
        Logo, cores e fontes da sua marca entram automaticamente.
      </BrandAssuranceNote>
    </div>
  );
}
