import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import "dotenv/config";

const DB_PATH = path.resolve(process.cwd(), process.env.DB_FILE_NAME!);

console.log("USING SQLITE DB:", DB_PATH);

export const sqlite = new Database("finance.db");
export const db = drizzle(sqlite);