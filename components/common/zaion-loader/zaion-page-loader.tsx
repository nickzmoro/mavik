import { cn } from "@/lib/utils";

import { ZaionLoader } from "./zaion-loader";

type ZaionPageLoaderProps = {
  className?: string;
};

export function ZaionPageLoader({ className }: ZaionPageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60dvh] flex-1 items-center justify-center",
        className,
      )}
    >
      <ZaionLoader />
    </div>
  );
}
