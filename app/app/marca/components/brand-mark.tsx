import { mockBrandInitials } from "@/lib/mocks/brand";
import { cn } from "@/lib/utils";

const markSizeClassNames = {
  xs: "size-9.5 rounded-[10px] text-base",
  sm: "size-11 rounded-[14px] text-[19px]",
  md: "size-14 rounded-[14px] text-2xl",
  lg: "size-16 rounded-[14px] text-[28px]",
};

type BrandMarkProps = {
  size: keyof typeof markSizeClassNames;
  background: string;
  color: string;
  className?: string;
};

export function BrandMark({
  size,
  background,
  color,
  className,
}: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center font-(family-name:--font-dm-serif) leading-none",
        markSizeClassNames[size],
        className,
      )}
      style={{ background, color }}
    >
      {mockBrandInitials}
    </span>
  );
}
