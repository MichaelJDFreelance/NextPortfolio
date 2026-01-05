import { z } from "zod";

/**
 * Personal info section
 */
export const personalInfoSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),

    email: z
        .string()
        .email("Invalid email address"),

    phone: z
        .string()
        .min(5, "Phone number is too short"),
});

/**
 * Plan section
 */
export const planSchema = z.object({
    type: z
        .string()
        .min(1, "Plan type is required"),

    yearly: z.boolean(),
});

/**
 * Add-ons section
 */
export const addOnsSchema = z.object({
    online: z.boolean(),
    largerStorage: z.boolean(),
    customProfile: z.boolean(),
});

/**
 * Full form context (matches FormContext type)
 */
export const formContextSchema = z.object({
    personalInfo: personalInfoSchema,
    plan: planSchema,
    addOns: addOnsSchema,
});

/**
 * Inferred TypeScript type
 */
export type FormContext = {
    submissionId?: number;

    personalInfo: {
        name: string;
        email: string;
        phone: string;
    };
    plan: {
        type: string;
        yearly: boolean;
    };
    addOns: {
        online: boolean;
        largerStorage: boolean;
        customProfile: boolean;
    };
};
