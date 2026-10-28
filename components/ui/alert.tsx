import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, Info, TriangleAlert, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-(--r-lg) border p-4 font-sans text-text",
  {
    variants: {
      variant: {
        default:
          "border-border bg-surface [&_[data-slot=alert-icon]]:text-primary",
        success:
          "border-success bg-success-bg [&_[data-slot=alert-icon]]:text-success",
        warning:
          "border-warning bg-warning-bg [&_[data-slot=alert-icon]]:text-warning [&_[data-slot=alert-title]]:text-warning",
        destructive:
          "border-danger bg-danger-bg [&_[data-slot=alert-icon]]:text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const alertIcons = {
  default: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleX,
};

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>;

function Alert({ className, variant, children, ...props }: AlertProps) {
  const AlertIcon = alertIcons[variant ?? "default"];

  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="alert-icon" className="flex pt-0.5">
        <AlertIcon aria-hidden="true" className="size-4.5" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("m-0 text-sm leading-normal font-semibold", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm leading-normal text-text", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
