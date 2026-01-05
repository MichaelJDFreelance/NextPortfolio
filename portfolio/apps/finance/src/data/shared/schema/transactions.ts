import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const transactions = sqliteTable("transactions", {
    id: text("id").primaryKey(),
    avatar: text("avatar").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    date: text("date").notNull(), // ISO string
    amount: real("amount").notNull(),
    recurring: integer("recurring", { mode: "boolean" }).notNull(),
});