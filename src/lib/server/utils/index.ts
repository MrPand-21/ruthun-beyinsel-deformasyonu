import { sha1 } from "@oslojs/crypto/sha1";
import { encodeBase32UpperCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv, randomBytes, pbkdf2 } from "crypto";


// TODO: ENV
const ENCRYPTION_KEY = randomBytes(32);
const IV_LENGTH = 16;

export function encrypt(data: Uint8Array): Uint8Array {
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    const encryptedData = Buffer.concat([
        cipher.update(Buffer.from(data)),
        cipher.final()
    ]);
    return new Uint8Array(Buffer.concat([iv, encryptedData]));
}

export function encryptString(data: string): Uint8Array {
    return encrypt(new TextEncoder().encode(data));
}

export function decrypt(encrypted: Uint8Array): Uint8Array {
    if (encrypted.byteLength < IV_LENGTH + 1) {
        throw new Error("Invalid encrypted data");
    }
    const iv = encrypted.slice(0, IV_LENGTH);
    const encryptedData = encrypted.slice(IV_LENGTH);

    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData)),
        decipher.final()
    ]);

    return new Uint8Array(decrypted);
}

export function decryptToString(data: Uint8Array): string {
    return new TextDecoder().decode(decrypt(data));
}

export function generateRandomOTP(): string {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const code = encodeBase32UpperCaseNoPadding(bytes);
    return code;
}

export function generateRandomRecoveryCode(): string {
    const recoveryCodeBytes = new Uint8Array(10);
    crypto.getRandomValues(recoveryCodeBytes);
    const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
    console.log("Recovery code: ", recoveryCode);
    return recoveryCode;
}

export async function verifyPasswordHash(storedHash: string, candidatePassword: string): Promise<boolean> {
    // Split the stored hash into components (format: iterations:salt:hash)
    const parts = storedHash.split(':');
    if (parts.length !== 3) {
        return false;
    }

    const iterations = parseInt(parts[0], 10);
    const salt = parts[1];
    const hash = parts[2];

    return new Promise((resolve, reject) => {
        pbkdf2(candidatePassword, salt, iterations, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(derivedKey.toString('hex') === hash);
        });
    });
}

export const hashPassword = async function (password: string): Promise<string> {
    // Generate a random salt
    const salt = randomBytes(16).toString('hex');
    const iterations = 10000; // Recommended minimum for PBKDF2

    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
                return;
            }
            // Format: iterations:salt:hash
            resolve(`${iterations}:${salt}:${derivedKey.toString('hex')}`);
        });
    });
};

export async function verifyPasswordStrength(password: string): Promise<boolean> {
    if (password.length < 8 || password.length > 255) {
        return false;
    }
    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
    const data = await response.text();
    const items = data.split("\n");
    for (const item of items) {
        const hashSuffix = item.slice(0, 35).toLowerCase();
        if (hash === hashPrefix + hashSuffix) {
            return false;
        }
    }
    return true;
}

export function verifyEmailInput(email: string): boolean {
    return /^.+@.+\..+$/.test(email) && email.length < 256;
}


