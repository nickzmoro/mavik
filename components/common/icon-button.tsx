import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-muted transition-colors duration-150 hover:bg-icon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-8 [&_svg]:size-3.5",
        default: "size-9 [&_svg]:size-4",
        lg: "size-11 [&_svg]:size-4.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    label: string;
  };

export function IconButton({
  className,
  size,
  label,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
