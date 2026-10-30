import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const algorithm = "aes-256-gcm";
const keyVersion = "v1";
const ivLength = 12;

function toKey(base64Key: string) {
  const key = Buffer.from(base64Key, "base64");

  if (key.length !== 32) {
    throw new Error("A chave de criptografia precisa ter 32 bytes em base64.");
  }

  return key;
}

export function encryptToken(token: string, base64Key: string) {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, toKey(base64Key), iv);
  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  return [
    keyVersion,
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptToken(payload: string, base64Key: string) {
  const [version, iv, authTag, encrypted] = payload.split(":");

  if (version !== keyVersion || !iv || !authTag || !encrypted) {
    throw new Error("Token criptografado em formato inválido.");
  }

  const decipher = createDecipheriv(
    algorithm,
    toKey(base64Key),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
