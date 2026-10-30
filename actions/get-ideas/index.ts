"use server";

import { getIdeasData } from "@/lib/ideas/get-ideas-data";

import type { GetIdeasResult } from "./schema";

export async function getIdeas(): Promise<GetIdeasResult> {
  return getIdeasData();
}
