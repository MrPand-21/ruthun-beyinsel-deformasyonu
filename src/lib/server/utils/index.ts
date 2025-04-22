import bcrypt from "bcryptjs";
import type { UserDocument } from "../models/user.model";

export const comparePassword = async function (user: UserDocument, candidatePassword: string): Promise<boolean> {
    if (!user.password) return false;

    return bcrypt.compare(candidatePassword, user.password);
};