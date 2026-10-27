import { ImagePlus, PenLine, Sparkles, type LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: PenLine,
    title: "Descreva a ideia",
    description: "Conte o que a arte deve mostrar, com suas palavras.",
  },
  {
    icon: ImagePlus,
    title: "Envie uma foto",
    description: "Opcional. Ajuda a manter o produto e o clima da sua loja.",
  },
  {
    icon: Sparkles,
    title: "Receba a arte",
    description: "Leva cerca de 30 segundos. Baixe e use onde quiser.",
  },
];

export function HowItWorksCard() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="rounded-[24px] border border-border bg-bg p-6 shadow-(--shadow-sm)"
    >
      <h2
        id="how-it-works-title"
        className="m-0 font-display text-lg leading-[1.3] font-semibold text-text"
      >
        Como funciona
      </h2>
      <ol className="m-0 mt-5 flex list-none flex-col gap-5 p-0">
        {steps.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-10 flex-none items-center justify-center rounded-(--r-md) border border-border bg-surface text-primary"
            >
              <Icon size={18} />
            </span>
            <div>
              <p className="m-0 text-sm leading-normal font-semibold text-text">
                {title}
              </p>
              <p className="m-0 text-sm leading-normal text-muted">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
