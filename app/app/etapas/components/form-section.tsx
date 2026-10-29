import { useId } from "react";

type FormSectionProps = {
  title: string;
  adornment?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
};

export function FormSection({
  title,
  adornment,
  description,
  children,
}: FormSectionProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 border-b border-border/60 pb-8 last:border-b-0 last:pb-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2
          id={titleId}
          className="m-0 font-display text-lg leading-[1.3] font-semibold"
        >
          {title}
        </h2>
        {adornment}
      </div>
      {description ? (
        <p className="m-0 text-sm leading-normal text-muted">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export function SectionHint({ children }: { children: React.ReactNode }) {
  return <span className="text-sm leading-normal text-muted">{children}</span>;
}
