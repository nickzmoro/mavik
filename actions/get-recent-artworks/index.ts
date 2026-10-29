"use server";

import { getRecentArtworks as readRecentArtworks } from "@/lib/content/get-recent-artworks";

import type { GetRecentArtworksResult } from "./schema";

const recentArtworksLimit = 6;

export async function getRecentArtworks(): Promise<GetRecentArtworksResult[]> {
  return readRecentArtworks({ limit: recentArtworksLimit });
}
