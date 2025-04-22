// src/routes/(auth)/register/schema.ts
import { z } from 'zod';

export const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Max 100 characters'),
    email: z.string().max(100, 'Max 100 characters').email('Valid email is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Max 50 characters'),
    confirmPassword: z.string(),
    userAgent: z.string().optional(),
    browserHash: z.string().optional(),
    isIncognitoMode: z.boolean().optional().default(false)
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type FormSchema = typeof formSchema;