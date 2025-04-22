import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
    email: string;
    password?: string;
    name: string;
    image?: string;
    provider?: string;
    providerId?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: false,
            minlength: 6
        },
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        provider: {
            type: String,
            default: 'credentials'
        },
        providerId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this as UserDocument;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password') || !user.password) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password using our new salt
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare passwords method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;
    if (!user.password) return false;

    return bcrypt.compare(candidatePassword, user.password);
};

// Create and export the model
export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);