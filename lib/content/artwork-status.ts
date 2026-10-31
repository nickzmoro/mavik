type ArtworkStatus = "rascunho" | "em_revisao" | "aprovada" | "descartada";

type ContentStatus =
  "ideia" | "em_producao" | "em_revisao" | "aprovado" | "publicado";

export type ArtworkDisplayStatus = ArtworkStatus | "agendada" | "publicada";

export const artworkDisplayStatusLabels: Record<ArtworkDisplayStatus, string> =
  {
    rascunho: "Rascunho",
    em_revisao: "Em revisão",
    aprovada: "Aprovada",
    descartada: "Descartada",
    agendada: "Agendada",
    publicada: "Publicada",
  };

export const artworkStatusFilters = [
  "rascunho",
  "aprovada",
  "agendada",
] as const;

export type ArtworkStatusFilter = (typeof artworkStatusFilters)[number];

type ArtworkDisplayStatusInput = {
  artworkStatus: ArtworkStatus;
  contentStatus: ContentStatus | null;
  scheduledAt: Date | null;
  now: Date;
};

export function getArtworkDisplayStatus({
  artworkStatus,
  contentStatus,
  scheduledAt,
  now,
}: ArtworkDisplayStatusInput): ArtworkDisplayStatus {
  if (contentStatus === "publicado") {
    return "publicada";
  }

  if (contentStatus === "aprovado" && scheduledAt && scheduledAt > now) {
    return "agendada";
  }

  return artworkStatus;
}
