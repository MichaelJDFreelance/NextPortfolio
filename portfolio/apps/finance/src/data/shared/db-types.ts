import {createSelectSchema} from "drizzle-zod";
import {transactions} from "@/data/shared/schema/transactions";

export const TransactionSelectSchema = createSelectSchema(transactions);
//export const TransactionInsertSchema = createInsertSchema(transactions);