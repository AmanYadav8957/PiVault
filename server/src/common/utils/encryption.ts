import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// AES-256-GCM requires a 32-byte (256-bit) key
const ALGORITHM = 'aes-256-gcm';
const RAW_KEY = process.env.ENCRYPTION_KEY || 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2';
const KEY = Buffer.from(RAW_KEY, 'hex');

/**
 * Encrypts a plain text secret string using AES-256-GCM.
 * Format of returned string: iv:authTag:encryptedData (all in hex)
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * If the string is not encrypted (e.g. legacy plain text), returns it gracefully.
 */
export function decryptSecret(encryptedString: string): string {
  if (!encryptedString) return '';

  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    return encryptedString;
  }

  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed, returning masked placeholder:', err);
    return '••••••••';
  }
}
