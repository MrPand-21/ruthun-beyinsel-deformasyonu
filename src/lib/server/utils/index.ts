import bcrypt from "bcryptjs";
import type { UserDocument } from "../db/models/user.model";
import { hash, verify } from "@node-rs/argon2";

export const comparePassword = async function (user: UserDocument, candidatePassword: string): Promise<boolean> {
    if (!user || !user.password) return false;
    const validPassword = await verify(user.password, candidatePassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    return validPassword;
};

export const hashPassword = async function (password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
};

