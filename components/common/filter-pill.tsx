import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const filterPillVariants = cva(
  "cursor-pointer rounded-full text-sm transition-[background-color,border-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "min-h-[34px] px-3.5",
        default: "min-h-9 px-3.5",
        lg: "min-h-10 px-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const getFilterPillClassName = ({
  isActive,
  size,
}: VariantProps<typeof filterPillVariants> & { isActive: boolean }) =>
  cn(
    filterPillVariants({ size }),
    isActive
      ? "border border-primary bg-primary font-semibold text-on-primary"
      : "chip-surface font-medium hover:border-accent hover:text-text",
  );

type FilterPillProps = Omit<React.ComponentProps<"button">, "aria-pressed"> &
  VariantProps<typeof filterPillVariants> & {
    isActive: boolean;
  };

export function FilterPill({
  className,
  size,
  isActive,
  type = "button",
  ...props
}: FilterPillProps) {
  return (
    <button
      type={type}
      aria-pressed={isActive}
      className={cn(getFilterPillClassName({ isActive, size }), className)}
      {...props}
    />
  );
}
