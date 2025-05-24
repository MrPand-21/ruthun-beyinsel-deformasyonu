import { z } from "zod";

export const formSchema = z.object({
    title: z.string().max(100, "Max 100 characters"),
    description: z
        .string()
    , location: z
        .string()
        .optional(),
    duration: z
        .string(),
    year: z
        .number()
        .int("Year must be an integer")
        .min(1900, "Year must be after 1900")
        .max(2100, "Year must be before 2100")
        .optional(),
    category: z.enum([
        "internship",
        "course",
        "travel",
        "volunteering",
        "research",
        "workshop",
        "hackathon",
        "other",
    ]),
    major: z.object({
        _id: z.string(),
        title: z.string()
    }).optional(),
    requirements: z.array(
        z.object({
            _id: z.string(),
            title: z.string(),
            type: z.enum(['language', 'test', 'grade']).optional(),
            value: z.union([z.string(), z.number()]).optional(),
            details: z.string().optional()
        })
    ).optional(),
    languageRequirements: z.array(
        z.object({
            _id: z.string(),
            name: z.string(),
            level: z.string(),
            details: z.string().optional()
        })
    ).optional(),
    testRequirements: z.array(
        z.object({
            _id: z.string(),
            name: z.string(),
            score: z.number(),
            details: z.string().optional()
        })
    ).optional(),
    gradeRequirements: z.array(
        z.object({
            _id: z.string(),
            type: z.string(),
            value: z.union([z.string(), z.number()]),
            details: z.string().optional()
        })
    ).optional(),
    cost: z.number().optional(),
    recommended: z.number().optional(),
    goodForWho: z.string().optional(),
    link: z.string().optional(),
    userAgent: z.string().optional(),
    browserHash: z.string().optional(),
    isIncognitoMode: z.boolean().optional().default(false),
});

export type FormSchema = typeof formSchema;
