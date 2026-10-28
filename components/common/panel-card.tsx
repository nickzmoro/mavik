import { cn } from "@/lib/utils";

type PanelCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  titleId: string;
  title: string;
  action?: React.ReactNode;
};

export function PanelCard({
  titleId,
  title,
  action,
  className,
  children,
  ...props
}: PanelCardProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn("glass flex flex-col gap-3 rounded-3xl p-5", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id={titleId}
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PanelTextButton({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "min-h-8 cursor-pointer self-start rounded-(--r-sm) border-0 bg-transparent px-1 text-sm leading-[1.4] font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function PanelMeta({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs leading-[1.4] font-medium text-muted", className)}
      {...props}
    />
  );
}
