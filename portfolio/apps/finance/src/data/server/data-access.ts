"use server"

import data from "../data.json"
import {createSecureGUID} from "@/lib/utils";
import {pots} from "@/data/shared/schema/pots";
import {budgets} from "@/data/shared/schema/budgets";
import {eq, sql} from "drizzle-orm";
import * as z from "zod";
import {db} from "@/data/server/db";
import {transactions} from "@/data/shared/schema/transactions";
import {TransactionSelectSchema} from "@/data/shared/db-types";

export type Transaction = {
    avatar: string
    name: string
    category: string
    date: string
    amount: number
    recurring: boolean
}

type TransactionWithId = Transaction & {id: string};

export type CreateBudgetInput = {
    category: string;
    maximum: number; // cents
    theme: string;
};

export type UpdateBudgetInput = CreateBudgetInput & {
    id: string;
};

export type CreatePotInput = {
    name: string;
    target: number; // cents
    total: number; // cents
    theme: string;
};

export type UpdatePotInput = CreatePotInput & {
    id: string;
};

export const getTransactions = async () => {
    const rows = db.select().from(transactions);
    return z.array(TransactionSelectSchema).parse(await rows)
}

export const getPots = async () => {
    return db.select().from(pots);
}

export const getBudgets = async () => {
    return db.select().from(budgets);
}

export const getBalance = async () => {
    return data.balance;
}

export const getTransactionsByCategory = async () => {
    const transactions = await getTransactions();
    return transactions.reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({...t, id: createSecureGUID()});
        return acc;
    }, {} as Record<string, TransactionWithId[]>);
}

export const getBills = async () => {
    const transactions = await getTransactions();
    const all = transactions.filter(t => t.recurring)
    return {
        totalPaid: 190,
        totalDue: 194.98,
        totalUpcoming: 59.98,
        all
    };
}

export async function createBudget(value: CreateBudgetInput) {
    await db.insert(budgets).values({
        id: createSecureGUID(),
        category: value.category,
        maximum: value.maximum,
        theme: value.theme,
    });
}

export async function updateBudget(value: UpdateBudgetInput) {
    await db
        .update(budgets)
        .set({
            category: value.category,
            maximum: value.maximum,
            theme: value.theme,
        })
        .where(eq(budgets.id, value.id));
}

export async function deleteBudget(id: string) {
    await db.delete(budgets).where(eq(budgets.id, id));
}

export async function createPot(value: CreatePotInput) {
    await db.insert(pots).values({
        id: createSecureGUID(),
        name: value.name,
        target: value.target, // cents
        total: 0, // cents
        theme: value.theme,
    });
}

export async function updatePot(value: UpdatePotInput) {
    await db
        .update(pots)
        .set({
            name: value.name,
            target: value.target, // cents
            theme: value.theme,
        })
        .where(eq(pots.id, value.id));
}

export async function deletePot(id: string) {
    await db.delete(pots).where(eq(pots.id, id));
}

export async function updatePotTotal(value: {amount: number; id: string;}) {
    await db
        .update(pots)
        .set({
            total: sql`MAX(${pots.total} + ${value.amount}, 0)`, // cents
        })
        .where(eq(pots.id, value.id));
}
