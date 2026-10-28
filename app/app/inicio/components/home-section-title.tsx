import { cn } from "@/lib/utils";

export function HomeSectionTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "m-0 font-display text-lg leading-[1.3] font-semibold",
        className,
      )}
      {...props}
    />
  );
}
