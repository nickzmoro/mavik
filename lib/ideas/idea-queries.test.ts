import assert from "node:assert/strict";
import { test } from "node:test";

import { drizzle } from "drizzle-orm/postgres-js";

import {
  deleteReplaceableIdeas,
  selectRequestInProgress,
  selectStoreIdeas,
} from "./idea-queries.ts";

const mockDb = drizzle.mock();

test("selectStoreIdeas filtra pela loja: ideia da loja A não aparece para a loja B", () => {
  const { sql, params } = selectStoreIdeas(mockDb, "loja-b").toSQL();

  assert.match(sql, /where "ideas"\."store_id" = \$1/);
  assert.deepEqual(params, ["loja-b"]);
});

test("deleteReplaceableIdeas nunca apaga favoritada nem ideia usada em conteúdo", () => {
  const { sql, params } = deleteReplaceableIdeas(mockDb, "loja-a").toSQL();

  assert.match(sql, /^delete from "ideas"/);
  assert.match(sql, /"ideas"\."store_id" = \$1/);
  assert.match(sql, /not exists \(select .* from "idea_saves"/);
  assert.match(sql, /not exists \(select .* from "contents"/);
  assert.deepEqual(params, ["loja-a"]);
});

test("selectRequestInProgress só considera pedidos pendentes ou em processamento dos últimos 5 minutos da loja", () => {
  const { sql, params } = selectRequestInProgress(mockDb, "loja-a").toSQL();

  assert.match(sql, /"idea_requests"\."store_id" = \$1/);
  assert.match(sql, /"idea_requests"\."status" in \(\$2, \$3\)/);
  assert.match(
    sql,
    /"idea_requests"\."created_at" > now\(\) - interval '5 minutes'/,
  );
  assert.deepEqual(params, ["loja-a", "pendente", "processando", 1]);
});
