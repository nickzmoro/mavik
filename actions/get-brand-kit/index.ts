"use server";

import { getBrandKitData } from "@/lib/brand/get-brand-kit-data";

import type { GetBrandKitResult } from "./schema";

export async function getBrandKit(): Promise<GetBrandKitResult> {
  return getBrandKitData();
}
