import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeBase32UpperCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";


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

export async function verifyPasswordHash(hash: string, candidatePassword: string): Promise<boolean> {
    return await verify(hash, candidatePassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
}

export const hashPassword = async function (password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
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


