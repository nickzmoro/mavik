export const LOGO_MAX_WIDTH_RATIO = 0.3;
export const LOGO_MAX_HEIGHT_RATIO = 0.12;
export const LOGO_MARGIN_RATIO = 0.05;

export const logoPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export const logoVariants = ["logo", "simbolo"] as const;

export type LogoPlacement = {
  position: (typeof logoPositions)[number];
  variant: (typeof logoVariants)[number];
};

export const defaultLogoPlacement: LogoPlacement = {
  position: "bottom-right",
  variant: "logo",
};

export function parseLogoPlacement(value: unknown): LogoPlacement {
  const candidate = value as Partial<LogoPlacement> | null;
  const position = logoPositions.find(
    (logoPosition) => logoPosition === candidate?.position,
  );
  const variant = logoVariants.find(
    (logoVariant) => logoVariant === candidate?.variant,
  );

  return {
    position: position ?? defaultLogoPlacement.position,
    variant: variant ?? defaultLogoPlacement.variant,
  };
}

export function describeLogoArea({ position }: LogoPlacement) {
  return `the ${position} corner (30% of the width, 15% of the height)`;
}

type LogoOffsetInput = {
  imageWidth: number;
  imageHeight: number;
  logoWidth: number;
  logoHeight: number;
  margin: number;
  position: LogoPlacement["position"];
};

export function getLogoOffset({
  imageWidth,
  imageHeight,
  logoWidth,
  logoHeight,
  margin,
  position,
}: LogoOffsetInput) {
  return {
    left: position.endsWith("left") ? margin : imageWidth - logoWidth - margin,
    top: position.startsWith("top")
      ? margin
      : imageHeight - logoHeight - margin,
  };
}
