import { cn } from "@/lib/utils";

type OnboardingSectionProps = {
  title: string;
  description?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function OnboardingSection({
  title,
  description,
  aside,
  className,
  children,
}: OnboardingSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="m-0 font-display text-xl leading-[1.25] font-semibold text-text">
            {title}
          </h2>
          {description && (
            <p className="m-0 mt-1 text-sm leading-normal text-muted">
              {description}
            </p>
          )}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
