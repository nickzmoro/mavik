import { createHmac, timingSafeEqual } from "node:crypto";

export function parseSignedRequest(signedRequest: string, appSecret: string) {
  const [signature, encodedPayload] = signedRequest.split(".");

  if (!signature || !encodedPayload) {
    return null;
  }

  const expectedSignature = createHmac("sha256", appSecret)
    .update(encodedPayload)
    .digest();
  const receivedSignature = Buffer.from(signature, "base64url");

  if (
    receivedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as { user_id?: string | number; algorithm?: string };

    return payload.algorithm?.toUpperCase() === "HMAC-SHA256" &&
      payload.user_id !== undefined
      ? { userId: String(payload.user_id) }
      : null;
  } catch {
    return null;
  }
}
