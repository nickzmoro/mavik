import { brandDisplayFont } from "@/lib/brand-display-font";
import { mockBrandInitials } from "@/lib/mocks/brand";
import { studioArtStyles, type StudioArtVariant } from "@/lib/mocks/studio";
import { cn } from "@/lib/utils";

type ArtTextProps = {
  title: string;
  subtitle?: string;
  titleColor: string;
};

const serifClassName = "font-(family-name:--font-dm-serif)";

function ArtSubtitle({
  subtitle,
  className,
}: {
  subtitle?: string;
  className: string;
}) {
  if (!subtitle) {
    return null;
  }

  return (
    <span className={cn("font-sans leading-[1.3]", className)}>{subtitle}</span>
  );
}

function DarkArt({ title, subtitle, titleColor }: ArtTextProps) {
  return (
    <>
      <div className="absolute inset-y-0 left-0 w-[6%] bg-[#C9A27A]" />
      <div className="absolute top-[8%] -right-[12%] size-[70cqw] rounded-full bg-[#3a302a]" />
      <div className="absolute top-[18%] right-[8%] size-[38cqw] rounded-full bg-[#C9A27A] shadow-[0_0_0_4cqw_#F3ECE2]" />
      <div className="absolute top-1/2 right-[2%] h-[6cqw] w-[52cqw] rounded-full bg-[#F3ECE2] opacity-90" />
      <div className="absolute right-[10%] bottom-[18%] left-[12%] flex flex-col gap-[2cqw]">
        <span
          className={cn(serifClassName, "text-[10cqw] leading-[1.02]")}
          style={{ color: titleColor }}
        >
          {title}
        </span>
        <ArtSubtitle
          subtitle={subtitle}
          className="text-[4cqw] text-[#C9A27A]"
        />
      </div>
    </>
  );
}

function LightArt({ title, subtitle, titleColor }: ArtTextProps) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[56%] bg-[#2B2420]" />
      <div className="absolute top-[14%] left-1/2 size-[46cqw] -translate-x-1/2 rounded-full bg-[#C9A27A] shadow-[0_0_0_5cqw_#3a302a]" />
      <span className="absolute top-[6%] left-[7%] rounded-full bg-[#8FA98A] px-[3cqw] py-[1.2cqw] font-sans text-[3.6cqw] font-semibold text-[#1F1A17]">
        Novo
      </span>
      <div className="absolute top-[62%] right-[8%] left-[8%] flex flex-col gap-[2cqw]">
        <span
          className={cn(serifClassName, "text-[9cqw] leading-[1.02]")}
          style={{ color: titleColor }}
        >
          {title}
        </span>
        <ArtSubtitle
          subtitle={subtitle}
          className="text-[4cqw] text-[#5b4a3f]"
        />
      </div>
    </>
  );
}

function SageArt({ title, subtitle, titleColor }: ArtTextProps) {
  return (
    <>
      <div className="absolute -bottom-[14%] -left-[18%] size-[80cqw] rounded-full bg-[#C9A27A] opacity-55" />
      <div className="absolute top-[12%] right-[10%] size-[22cqw] rounded-full bg-[#F3ECE2]" />
      <div className="absolute top-[30%] right-[9%] left-[9%] flex flex-col gap-[3cqw]">
        <span
          className={cn(serifClassName, "text-[12cqw] leading-none")}
          style={{ color: titleColor }}
        >
          {title}
        </span>
        <ArtSubtitle
          subtitle={subtitle}
          className="text-[4.2cqw] text-[#1F1A17]"
        />
      </div>
    </>
  );
}

const artVariants: Record<
  StudioArtVariant,
  (props: ArtTextProps) => React.ReactNode
> = {
  dark: DarkArt,
  light: LightArt,
  sage: SageArt,
};

type StudioArtProps = {
  styleIndex: number;
  title: string;
  subtitle?: string;
  aspectRatio: string;
  label: string;
  className?: string;
};

export function StudioArt({
  styleIndex,
  title,
  subtitle,
  aspectRatio,
  label,
  className,
}: StudioArtProps) {
  const artStyle = studioArtStyles[styleIndex % studioArtStyles.length];
  const Art = artVariants[artStyle.variant];

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        brandDisplayFont.variable,
        "@container relative w-full overflow-hidden rounded-2xl",
        className,
      )}
      style={{ aspectRatio, background: artStyle.background }}
    >
      <Art title={title} subtitle={subtitle} titleColor={artStyle.titleColor} />
      <span
        aria-hidden="true"
        className="absolute right-[5%] bottom-[4%] flex size-[11cqw] items-center justify-center rounded-full font-display text-[3.6cqw] font-bold"
        style={{
          background: artStyle.logoBackground,
          color: artStyle.logoColor,
        }}
      >
        {mockBrandInitials}
      </span>
    </div>
  );
}
