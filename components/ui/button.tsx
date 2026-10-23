import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent px-6 font-display text-sm leading-none font-semibold whitespace-nowrap no-underline transition-[background-color,color,border-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 motion-reduce:transition-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary not-disabled:hover:bg-primary-hover",
        brand:
          "bg-primary-brand text-white not-disabled:hover:bg-(--violet-700)",
        secondary:
          "bg-surface-2 text-text not-disabled:hover:bg-(--violet-200) not-disabled:hover:text-(--violet-900)",
        outline:
          "border-muted bg-transparent text-text not-disabled:hover:bg-surface-2",
        ghost: "bg-transparent text-text not-disabled:hover:bg-surface-2",
        link: "min-h-0 bg-transparent p-0 text-primary underline underline-offset-4",
        destructive:
          "bg-danger text-bg not-disabled:hover:brightness-[.92]",
      },
      size: {
        default: "",
        sm: "min-h-9 px-4 text-[13px]",
        lg: "min-h-13 px-8 text-base",
        icon: "w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && !asChild && (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent [animation-duration:700ms] motion-reduce:animate-none"
        />
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
