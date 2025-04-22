import mongoose from 'mongoose';
import type { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document<mongoose.Types.ObjectId> {
    email: string;
    password?: string;
    name: string;
    image?: string;
    provider?: string;
    providerId?: string;
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

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this as UserDocument;
    if (!user.isModified('password') || !user.password) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);