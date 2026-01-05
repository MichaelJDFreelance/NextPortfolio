import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/data/schema/*",   // or "./src/db/schema.ts"
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,         // can also come from env
    },
});