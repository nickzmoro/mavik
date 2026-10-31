import { zipSync } from "fflate";

import { downloadFile } from "@/lib/download-file";

import { getSlideFileName } from "./slides";

export async function downloadCarouselZip(
  slides: { position: number; imageUrl: string }[],
  fileName: string,
) {
  const files = await Promise.all(
    slides.map(async ({ position, imageUrl }, index) => {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Slide ${position} indisponível`);
      }

      return [
        getSlideFileName(index + 1),
        new Uint8Array(await response.arrayBuffer()),
      ] as const;
    }),
  );
  const zip = zipSync(Object.fromEntries(files), { level: 0 });

  downloadFile(fileName, new Blob([zip], { type: "application/zip" }));
}
