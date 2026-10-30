import { and, desc, eq, gt, inArray, notExists, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import { contents, ideaRequests, ideas, ideaSaves } from "../../db/schema.ts";

type IdeasDatabase = Pick<
  PgDatabase<PgQueryResultHKT, Record<string, never>>,
  "select" | "delete"
>;

export const selectStoreIdeas = (database: IdeasDatabase, storeId: string) =>
  database
    .select()
    .from(ideas)
    .where(eq(ideas.storeId, storeId))
    .orderBy(desc(ideas.createdAt));

export const deleteReplaceableIdeas = (
  database: IdeasDatabase,
  storeId: string,
) =>
  database
    .delete(ideas)
    .where(
      and(
        eq(ideas.storeId, storeId),
        notExists(
          database
            .select({ ideaId: ideaSaves.ideaId })
            .from(ideaSaves)
            .where(eq(ideaSaves.ideaId, ideas.id)),
        ),
        notExists(
          database
            .select({ ideaId: contents.ideaId })
            .from(contents)
            .where(eq(contents.ideaId, ideas.id)),
        ),
      ),
    );

export const selectRequestInProgress = (
  database: IdeasDatabase,
  storeId: string,
) =>
  database
    .select({ id: ideaRequests.id })
    .from(ideaRequests)
    .where(
      and(
        eq(ideaRequests.storeId, storeId),
        inArray(ideaRequests.status, ["pendente", "processando"]),
        gt(ideaRequests.createdAt, sql`now() - interval '5 minutes'`),
      ),
    )
    .limit(1);
