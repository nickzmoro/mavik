import { timingSafeEqual } from "node:crypto";

export function isAuthorizedCronRequest(
  authorizationHeader: string | null,
  cronSecret: string,
) {
  const received = Buffer.from(authorizationHeader ?? "");
  const expected = Buffer.from(`Bearer ${cronSecret}`);

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
