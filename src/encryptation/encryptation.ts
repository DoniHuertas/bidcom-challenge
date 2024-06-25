import { createCipheriv, createDecipheriv } from "crypto";

const algoritmo = process.env.ALGORITMO;
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = Buffer.from(process.env.IV, "hex");

export function encrypt(url: string): string {
  const cipher = createCipheriv(algoritmo, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(url), cipher.final()]);
  return encrypted.toString("hex");
}

export function decrypt(maskedUrl: string) {
  const encryptedText = Buffer.from(maskedUrl, "hex");
  const decipher = createDecipheriv(algoritmo, secretKey, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
}
