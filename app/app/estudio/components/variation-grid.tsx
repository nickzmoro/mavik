import { cn } from "@/lib/utils";

export function VariationGrid({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(140px,100%),1fr))] items-start gap-3",
        className,
      )}
      {...props}
    />
  );
}
