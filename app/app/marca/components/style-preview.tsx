import type { ImageStyle } from "@/lib/mocks/brand";
import { cn } from "@/lib/utils";

const styleBackgrounds: Record<ImageStyle, string> = {
  photographic: "linear-gradient(160deg,#C9A27A,#6E4B33)",
  illustrated: "#F3ECE2",
  minimalist: "#FFFFFF",
  "3d": "radial-gradient(circle at 40% 35%,#E9D6BE,#8B6A4E 60%,#3A2A20)",
};

function StyleShapes({ style }: { style: ImageStyle }) {
  if (style === "photographic") {
    return (
      <span className="absolute -bottom-4 right-4.5 size-17.5 rounded-full bg-[#F3ECE2] opacity-90" />
    );
  }

  if (style === "illustrated") {
    return (
      <>
        <span className="absolute top-5 left-4.5 size-14 rounded-full bg-[#C9A27A]" />
        <span className="absolute right-4 bottom-3.5 h-8.5 w-17.5 rounded-[18px] bg-[#8FA98A]" />
      </>
    );
  }

  if (style === "minimalist") {
    return (
      <span className="absolute top-1/2 left-1/2 size-9 -translate-1/2 rounded-full bg-[#2B2420]" />
    );
  }

  return null;
}

type StylePreviewProps = {
  style: ImageStyle;
  className?: string;
};

export function StylePreview({ style, className }: StylePreviewProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-24 overflow-hidden rounded-(--r-md)",
        style === "minimalist" && "border border-[#E8E1D6]",
        className,
      )}
      style={{ background: styleBackgrounds[style] }}
    >
      <StyleShapes style={style} />
    </div>
  );
}
