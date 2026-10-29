import Image from "next/image";

import { cn } from "@/lib/utils";

const markSizeClassNames = {
  xs: "size-9.5 rounded-[10px]",
  sm: "size-11 rounded-[14px]",
  md: "size-14 rounded-[14px]",
  lg: "size-16 rounded-[14px]",
};

type BrandMarkProps = {
  size: keyof typeof markSizeClassNames;
  background: string;
  logoUrl?: string;
  className?: string;
};

export function BrandMark({
  size,
  background,
  logoUrl,
  className,
}: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        markSizeClassNames[size],
        !logoUrl && "border-[1.5px] border-dashed border-muted",
        className,
      )}
      style={{ background }}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          fill
          unoptimized
          sizes="64px"
          className="object-contain p-1"
        />
      ) : null}
    </span>
  );
}
