import { z } from "zod";

export const formSchema = z.object({
    title: z.string().max(100, "Max 100 characters"),
    description: z
        .string()
        .max(50, {
            message: "Max 50 characters",
        })
    , location: z
        .string()
        .max(50, {
            message: "Max 50 characters",
        })
        .optional(),
    duration: z
        .string(),

    category: z.enum([
        "internship",
        "course",
        "travel",
        "volunteering",
        "other",
    ]),
    major: z.object({
        _id: z.string(),
        title: z.string()
    }).optional(),
    requirements: z.array(
        z.object({
            _id: z.string(),
            title: z.string()
        })
    ).optional(),
    cost: z.number().optional(),
    recommended: z.number().optional(),
    goodForWho: z.string().optional(),
    link: z.string().optional(),
    tags: z
        .array(z.string().max(20, "Max 20 characters"))
        .max(5, "Max 5 tags")
        .optional(),
    userAgent: z.string().optional(),
    browserHash: z.string().optional(),
    isIncognitoMode: z.boolean().optional().default(false),
});

export type FormSchema = typeof formSchema;
