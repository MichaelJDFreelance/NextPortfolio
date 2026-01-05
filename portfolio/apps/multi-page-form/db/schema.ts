import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

/**
 * Root form submission
 */
export const formSubmissions = sqliteTable("form_submissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch() * 1000)`),
});

/**
 * Personal info (1–1)
 */
export const personalInfo = sqliteTable("personal_info", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    submissionId: integer("submission_id")
        .notNull()
        .references(() => formSubmissions.id, { onDelete: "cascade" })
        .unique(), // 👈 REQUIRED,

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
});

/**
 * Plan (1–1)
 */
export const plans = sqliteTable("plans", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    submissionId: integer("submission_id")
        .notNull()
        .references(() => formSubmissions.id, { onDelete: "cascade" })
        .unique(),

    type: text("type").notNull(),
    yearly: integer("yearly", { mode: "boolean" }).notNull(),
});

/**
 * Add-ons (1–1)
 */
export const addOns = sqliteTable("add_ons", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    submissionId: integer("submission_id")
        .notNull()
        .references(() => formSubmissions.id, { onDelete: "cascade" })
        .unique(),

    online: integer("online", { mode: "boolean" }).notNull(),
    largerStorage: integer("larger_storage", { mode: "boolean" }).notNull(),
    customProfile: integer("custom_profile", { mode: "boolean" }).notNull(),
});