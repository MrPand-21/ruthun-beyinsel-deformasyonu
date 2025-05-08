import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeBase32UpperCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { decodeBase64 } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv } from "crypto";
import { DynamicBuffer } from "@oslojs/binary";
import { ENCRYPTION_KEY } from '$env/static/private';

const key = decodeBase64(ENCRYPTION_KEY);

export function encrypt(data: Uint8Array): Uint8Array {
    const iv = new Uint8Array(16);
    crypto.getRandomValues(iv);
    const cipher = createCipheriv("aes-128-gcm", key, iv);
    const encrypted = new DynamicBuffer(0);
    encrypted.write(iv);
    encrypted.write(cipher.update(data));
    encrypted.write(cipher.final());
    encrypted.write(cipher.getAuthTag());
    return encrypted.bytes();
}

export function encryptString(data: string): Uint8Array {
    return encrypt(new TextEncoder().encode(data));
}

export function decrypt(encrypted: Uint8Array): Uint8Array {
    if (encrypted.byteLength < 33) {
        throw new Error("Invalid data");
    }
    const decipher = createDecipheriv("aes-128-gcm", key, encrypted.slice(0, 16));
    decipher.setAuthTag(encrypted.slice(encrypted.byteLength - 16));
    const decrypted = new DynamicBuffer(0);
    decrypted.write(decipher.update(encrypted.slice(16, encrypted.byteLength - 16)));
    decrypted.write(decipher.final());
    return decrypted.bytes();
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


