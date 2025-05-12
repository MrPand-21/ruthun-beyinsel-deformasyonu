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
    startDate: z
        .string(),
    // .refine((date) => {
    //     const parsedDate = new Date(date);
    //     return !isNaN(parsedDate.getTime());
    // }, "Invalid date format")
    // .transform((date) => new Date(date)),
    endDate: z
        .string(),
    // .refine((date) => {
    //     const parsedDate = new Date(date);
    //     return !isNaN(parsedDate.getTime());
    // }, "Invalid date format")
    // .transform((date) => new Date(date))
    // .refine((date) => {
    // TODO: Uncomment this when startDate is available
    // const startDate = ctx.parent.startDate;
    // if (startDate && date < startDate) {
    //     ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: "End date must be after start date",
    //     });
    //     return false;
    // }
    //     return true;
    // }),
    category: z.enum([
        "internship",
        "course",
        "travel",
        "volunteering",
        "other",
    ]),
    tags: z
        .array(z.string().max(20, "Max 20 characters"))
        .max(5, "Max 5 tags")
        .optional(),
    userAgent: z.string().optional(),
    browserHash: z.string().optional(),
    isIncognitoMode: z.boolean().optional().default(false),
});

export type FormSchema = typeof formSchema;
