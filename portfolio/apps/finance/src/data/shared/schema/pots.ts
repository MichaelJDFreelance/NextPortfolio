import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pots = sqliteTable("pots", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    target: integer("target").notNull(),
    total: integer("total").notNull(),
    theme: text("theme").notNull()
});