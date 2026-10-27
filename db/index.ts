import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getRequiredEnv } from "@/lib/get-required-env";

import * as schema from "./schema";

const globalForDatabase = globalThis as unknown as {
  databaseClient?: postgres.Sql;
};

const databaseClient =
  globalForDatabase.databaseClient ??
  postgres(getRequiredEnv("DATABASE_URL", process.env.DATABASE_URL), {
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.databaseClient = databaseClient;
}

export const db = drizzle({ client: databaseClient, schema });
