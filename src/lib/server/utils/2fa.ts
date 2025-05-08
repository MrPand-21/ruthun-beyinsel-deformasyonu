import { ObjectId } from 'mongodb';
import { getCollection, getDatabaseName } from '../db/mongodb';
import { type UserDocument } from '../db/models/user.model'; // Assuming UserDocument is exported
import { type SessionDocument } from '../db/models/session.model'; // Assuming SessionDocument is exported
import { ExpiringTokenBucket } from './rate-limit'; // Adjust path if necessary
import { decryptToString, encryptString, generateRandomRecoveryCode } from '.';

const USER_COLLECTION = 'users';
const SESSION_COLLECTION = 'sessions';
const DB_NAME = getDatabaseName();

// Rate limit for TOTP attempts: 5 attempts per 30 minutes per user ID
export const totpBucket = new ExpiringTokenBucket<string>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<string>(3, 60 * 60);

/**
 * Resets a user's 2FA settings using a recovery code.
 * If successful, it clears the TOTP key, generates a new recovery code,
 * and marks all active sessions for the user as not 2FA verified.
 * @param userId The ID of the user.
 * @param recoveryCode The recovery code provided by the user.
 * @returns True if 2FA was successfully reset, false otherwise.
 */
export async function resetUser2FAWithRecoveryCode(userId: ObjectId, recoveryCode: string): Promise<boolean> {
    const usersCollection = await getCollection<UserDocument>(DB_NAME, USER_COLLECTION);
    const sessionsCollection = await getCollection<SessionDocument>(DB_NAME, SESSION_COLLECTION);
    const user = await usersCollection.findOne({ _id: userId }, { projection: { recoveryCode: 1 } });

    if (!user || !user.recoveryCode) return false;

    const storedEncryptedRecoveryCode = user.recoveryCode;
    const decryptedUserRecoveryCode = decryptToString(storedEncryptedRecoveryCode);

    if (recoveryCode !== decryptedUserRecoveryCode) return false;

    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

    const updateUserResult = await usersCollection.updateOne(
        {
            _id: userId,
            recoveryCode: storedEncryptedRecoveryCode
        },
        {
            $set: {
                recoveryCode: encryptedNewRecoveryCode,
                totpKey: null,
                updatedAt: new Date()
            }
        }
    );

    if (updateUserResult.modifiedCount === 0) {
        console.warn(`Failed to update user 2FA settings for user ${userId}. Recovery code might have changed concurrently.`);
        return false;
    }

    await sessionsCollection.updateMany(
        { userId: userId },
        { $set: { twoFactorVerified: false } }
    );

    return true;
}