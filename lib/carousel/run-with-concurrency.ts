export async function runWithConcurrency<TItem, TResult>(
  items: TItem[],
  limit: number,
  worker: (item: TItem) => Promise<TResult>,
) {
  const results: PromiseSettledResult<TResult>[] = new Array(items.length);
  let nextIndex = 0;

  const runNext = async (): Promise<void> => {
    const index = nextIndex++;

    if (index >= items.length) {
      return;
    }

    results[index] = await worker(items[index]).then(
      (value) => ({ status: "fulfilled", value }) as const,
      (reason: unknown) => ({ status: "rejected", reason }) as const,
    );

    return runNext();
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, runNext),
  );

  return results;
}
