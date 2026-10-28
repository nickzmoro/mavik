import { cn } from "@/lib/utils";

type BrandCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  titleId: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
};

export function BrandCard({
  titleId,
  title,
  hint,
  action,
  className,
  children,
  ...props
}: BrandCardProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "brand-glass flex min-w-0 flex-col gap-4.5 rounded-3xl px-5 py-5.5 sm:px-7 sm:py-6.5",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-[1_1_240px]">
          <h2
            id={titleId}
            className="m-0 font-display text-xl leading-[1.3] font-semibold"
          >
            {title}
          </h2>
          {hint ? (
            <p className="m-0 mt-1 text-sm leading-normal text-muted">{hint}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function BrandSmallText({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("m-0 text-[13px] leading-normal text-muted", className)}
      {...props}
    />
  );
}
