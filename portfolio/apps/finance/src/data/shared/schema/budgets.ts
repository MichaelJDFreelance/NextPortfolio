import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budgets", {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    maximum: integer("maximum").notNull(),
    theme: text("theme").notNull()
});