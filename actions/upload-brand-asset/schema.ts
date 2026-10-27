import { z } from "zod";

import {
  LOGO_MAX_BYTES,
  LOGO_MIME_TYPES,
  MANUAL_MAX_BYTES,
  POST_EXAMPLE_MIME_TYPES,
} from "@/lib/onboarding/constants";

export const brandAssetKinds = [
  "logo_claro",
  "logo_escuro",
  "simbolo",
  "manual",
  "post_bom",
  "post_ruim",
] as const;

export type BrandAssetKind = (typeof brandAssetKinds)[number];

export const postExampleKinds = ["post_bom", "post_ruim"] as const;

export type PostExampleKind = (typeof postExampleKinds)[number];

export function isPostExampleKind(kind: string): kind is PostExampleKind {
  return postExampleKinds.some((postKind) => postKind === kind);
}

const manualMimeTypes = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
];

export const uploadBrandAssetSchema = z
  .object({
    kind: z.enum(brandAssetKinds),
    file: z.instanceof(File, { error: "Escolha um arquivo." }),
    isGenerated: z.boolean(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    checks: z.record(z.string(), z.enum(["ok", "aviso", "erro"])),
  })
  .superRefine(({ kind, file }, context) => {
    const isManual = kind === "manual";
    const isPostExample = isPostExampleKind(kind);
    const allowedTypes = isManual
      ? manualMimeTypes
      : isPostExample
        ? POST_EXAMPLE_MIME_TYPES
        : LOGO_MIME_TYPES;
    const maxBytes = isManual ? MANUAL_MAX_BYTES : LOGO_MAX_BYTES;

    if (!allowedTypes.includes(file.type)) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: isManual
          ? "Formato não suportado. Envie um PDF ou ZIP."
          : isPostExample
            ? "Formato não suportado. Envie PNG, JPG ou WebP."
            : "Formato não suportado. Envie SVG, PNG ou WebP.",
      });
    }

    if (file.size > maxBytes) {
      context.addIssue({
        code: "custom",
        path: ["file"],
        message: "Arquivo grande demais. Envie um arquivo de até 5 MB.",
      });
    }
  });

export type UploadBrandAssetInput = z.infer<typeof uploadBrandAssetSchema>;

export function toUploadBrandAssetFormData({
  kind,
  file,
  isGenerated,
  width,
  height,
  checks,
}: UploadBrandAssetInput) {
  const formData = new FormData();

  formData.set("kind", kind);
  formData.set("file", file);
  formData.set("isGenerated", String(isGenerated));
  formData.set("checks", JSON.stringify(checks));

  if (width && height) {
    formData.set("width", String(width));
    formData.set("height", String(height));
  }

  return formData;
}

export function fromUploadBrandAssetFormData(formData: FormData) {
  const width = formData.get("width");
  const height = formData.get("height");
  let checks: unknown = {};

  try {
    checks = JSON.parse(String(formData.get("checks") ?? "{}"));
  } catch {
    checks = null;
  }

  return {
    kind: formData.get("kind"),
    file: formData.get("file"),
    isGenerated: formData.get("isGenerated") === "true",
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
    checks,
  };
}
