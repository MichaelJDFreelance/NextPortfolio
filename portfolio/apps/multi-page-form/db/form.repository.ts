import "server-only";
import { db } from "./client";
import {personalInfo, plans, addOns, formSubmissions} from "./schema";
import {eq} from "drizzle-orm";

export async function saveSubmissionId(
) {
    const result = await db.insert(formSubmissions).values({})
        .returning({ id: formSubmissions.id });

    return result[0].id;
}

export async function savePersonalInfo(
    submissionId: number,
    values: {
        name: string;
        email: string;
        phone: string;
    }
) {
    await db
        .insert(personalInfo)
        .values({ submissionId, ...values })
        .onConflictDoUpdate({
            target: [personalInfo.submissionId],
            set: values,
        });
}

export async function getPersonalInfo(submissionId: number) {
    const result = await db.select().from(personalInfo)
        .where(eq(personalInfo.submissionId, submissionId));
    return result[0];
}

export async function savePlan(
    submissionId: number,
    values: {
        type: string;
        yearly: boolean;
    }
) {
    await db
        .insert(plans)
        .values({ submissionId, ...values })
        .onConflictDoUpdate({
            target: [plans.submissionId],
            set: values,
        });
}

export async function getPlan(submissionId: number) {
    const result = await db.select().from(plans)
        .where(eq(plans.submissionId, submissionId));
    return result[0];
}

export async function saveAddOns(
    submissionId: number,
    values: {
        online: boolean;
        largerStorage: boolean;
        customProfile: boolean;
    }
) {
    await db
        .insert(addOns)
        .values({ submissionId, ...values })
        .onConflictDoUpdate({
            target: [addOns.submissionId],
            set: values,
        });
}

export async function getAddOns(submissionId: number) {
    const result = await db.select().from(addOns)
        .where(eq(addOns.submissionId, submissionId));
    return result[0];
}
