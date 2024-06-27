import { createCipheriv, createHash, randomBytes } from "crypto";

const port = process.env.PORT || 8080;
export function encrypt(url: string): string {
  const secretKey = randomBytes(32);
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-ctr", secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(url), cipher.final()]);
  return encrypted.toString("hex");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return salt + ":" + hash;
}

export function verifyHashedPassword(
  inputPassword: string,
  hashedPassword: string
): boolean {
  const parts = hashedPassword.split(":");
  const salt = parts[0];
  const hash = parts[1];
  const valueHash = createHash("sha256")
    .update(salt + inputPassword)
    .digest("hex");
  return hash === valueHash;
}

export function createLink(
  maskedUrl: string,
  url = `http://localhost:${port}/l/`
) {
  return url + maskedUrl;
}
