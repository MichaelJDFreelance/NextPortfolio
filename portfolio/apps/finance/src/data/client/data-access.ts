import {TransactionSelectSchema} from "@/data/shared/db-types";
import {z, ZodError} from "zod";

export const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    if (!res.ok) throw new Error("Network error");

    const json = await res.json();

    try {
        return z.array(TransactionSelectSchema).parse(json);
    } catch (err) {
        if (err instanceof ZodError) {
            console.error("API contract violation", err.flatten());
        }
        throw err;
    }
};