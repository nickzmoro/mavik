"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-muted bg-bg p-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupCardItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-card-item"
      className={cn(
        "group flex min-h-11 w-full cursor-pointer items-start gap-3 rounded-(--r-md) border border-border bg-bg px-4 py-3 text-left font-sans text-sm leading-normal text-text shadow-(--shadow-sm) transition-[background-color,border-color] duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-surface-2 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full border-2 border-muted group-data-[state=checked]:border-primary"
      >
        <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-primary" />
      </span>
      <span className="flex flex-col">{children}</span>
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupChipItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-chip-item"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-muted bg-bg px-4 font-display text-sm leading-none font-semibold whitespace-nowrap text-text transition-[background-color,border-color] duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-surface-2 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupCardItem, RadioGroupChipItem, RadioGroupItem };
