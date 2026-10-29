import { useEffect, useState } from "react";

import { fontNameSchema } from "@/actions/save-onboarding-brand-kit/schema";

export type FontStatus = "idle" | "checking" | "google" | "nome";

const fontLoads = new Map<string, Promise<boolean>>();

function loadGoogleFont(family: string) {
  const cachedLoad = fontLoads.get(family);

  if (cachedLoad) {
    return cachedLoad;
  }

  const fontLoad = new Promise<boolean>((resolve) => {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
    link.onload = () => resolve(true);
    link.onerror = () => {
      link.remove();
      resolve(false);
    };
    document.head.appendChild(link);
  });

  fontLoads.set(family, fontLoad);

  return fontLoad;
}

export function useGoogleFontStatus(fontName: string, delayInMs = 0) {
  const family = fontName.trim();
  const isValidName = fontNameSchema.safeParse(family).success;
  const [resolvedFont, setResolvedFont] = useState<{
    family: string;
    isGoogleFont: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isValidName) {
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(() => {
      loadGoogleFont(family).then((isGoogleFont) => {
        if (!isCancelled) {
          setResolvedFont({ family, isGoogleFont });
        }
      });
    }, delayInMs);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [family, isValidName, delayInMs]);

  if (!isValidName) {
    return "idle";
  }

  if (resolvedFont?.family !== family) {
    return "checking";
  }

  return resolvedFont.isGoogleFont ? "google" : "nome";
}

export const getFontFamilyStyle = (family: string, status: FontStatus) =>
  status === "google" ? `"${family}", sans-serif` : "inherit";
