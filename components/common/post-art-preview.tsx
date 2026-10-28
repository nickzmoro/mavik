import type { PostArt } from "@/lib/mocks/home";
import { cn } from "@/lib/utils";

const artBackgrounds: Record<PostArt, string> = {
  autumnBlend: "bg-[#efe4d6]",
  roastingBackstage: "bg-[#2e2a27]",
  weeklyCombo: "bg-[#dde5da]",
};

function AutumnBlendArt() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -right-7.5 -bottom-5 size-37.5 rounded-full bg-[#c9a27e]"
      />
      <span className="relative text-[11px] font-semibold text-[#6b5a4a]">
        CAFÉ AURORA
      </span>
      <span className="relative max-w-32.5 font-[Georgia,serif] text-2xl leading-[1.1] text-[#2e2a27]">
        Novo blend de outono
      </span>
    </>
  );
}

function RoastingBackstageArt() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-4.5 top-12 h-[46%] rounded-[10px] bg-[#4a413b]"
      />
      <span className="relative text-[11px] font-semibold text-[#c9a27e]">
        BASTIDORES
      </span>
      <span className="relative font-[Georgia,serif] text-[22px] leading-[1.15] text-[#f4ede4]">
        Como nasce o seu café
      </span>
    </>
  );
}

function WeeklyComboArt() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute top-[42%] left-1/2 size-27.5 -translate-1/2 rounded-full bg-[#f4ede4] shadow-[0_0_0_14px_rgba(255,255,255,.35)]"
      />
      <span className="relative self-start rounded-full bg-[#2e2a27] px-2.5 py-1 text-[11px] font-semibold text-[#f4ede4]">
        SÓ ESTA SEMANA
      </span>
      <span className="relative font-[Georgia,serif] text-[22px] leading-[1.15] text-[#2e2a27]">
        Combo café + pão de queijo
      </span>
    </>
  );
}

const artComponents: Record<PostArt, () => React.ReactNode> = {
  autumnBlend: AutumnBlendArt,
  roastingBackstage: RoastingBackstageArt,
  weeklyCombo: WeeklyComboArt,
};

type PostArtPreviewProps = {
  art: PostArt;
  label: string;
};

export function PostArtPreview({ art, label }: PostArtPreviewProps) {
  const Art = artComponents[art];

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative box-border flex aspect-4/5 flex-col justify-between overflow-hidden rounded-[14px] p-4.5",
        artBackgrounds[art],
      )}
    >
      <Art />
    </div>
  );
}

const thumbnailShapes: Record<PostArt, string> = {
  autumnBlend: "-right-3 -bottom-2 size-15 rounded-full bg-[#c9a27e]",
  roastingBackstage: "inset-x-2 top-4.5 h-[44%] rounded-(--r-sm) bg-[#4a413b]",
  weeklyCombo:
    "top-[45%] left-1/2 size-11 -translate-1/2 rounded-full bg-[#f4ede4]",
};

const thumbnailBorders: Partial<Record<PostArt, string>> = {
  roastingBackstage: "dark:border dark:border-white/12",
};

export function PostArtThumbnail({
  art,
  label,
  className,
}: PostArtPreviewProps & { className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative box-border aspect-4/5 overflow-hidden rounded-(--r-md)",
        artBackgrounds[art],
        thumbnailBorders[art],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn("absolute", thumbnailShapes[art])}
      />
    </div>
  );
}
