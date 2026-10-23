"use client";

import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-block font-sans text-sm leading-normal font-medium text-text",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
