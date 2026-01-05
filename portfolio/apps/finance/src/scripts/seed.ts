import data from "@/data/data.json";
import { transactions } from "@/data/shared/schema/transactions";
import { createSecureGUID } from "@/lib/utils";
import {pots} from "@/data/shared/schema/pots";
import {budgets} from "@/data/shared/schema/budgets";
import {db} from "@/data/server/db";

function seed() {
    const rows = data.transactions.map(t => ({
        ...t,
        amount: Math.round(t.amount * 100),
        id: createSecureGUID(),
    }));

    console.log("ROWS TO INSERT:", rows.length);
    console.log("FIRST ROW:", rows[0]);

    db.transaction((tx) => {
        const deleted = tx.delete(transactions).run();
        console.log("DELETED ROWS:", deleted.changes);

        const inserted = tx.insert(transactions).values(rows).run();
        console.log("INSERTED ROWS:", inserted.changes);
    });
}

function seedPots() {
    const rows = data.pots.map(t => ({
        ...t,
        target: Math.round(t.target * 100),
        total: Math.round(t.total * 100),
        id: createSecureGUID(),
    }));

    console.log("ROWS TO INSERT:", rows.length);
    console.log("FIRST ROW:", rows[0]);

    db.transaction((tx) => {
        const deleted = tx.delete(pots).run();
        console.log("DELETED ROWS:", deleted.changes);

        const inserted = tx.insert(pots).values(rows).run();
        console.log("INSERTED ROWS:", inserted.changes);
    });
}

function seedBudgets() {
    const rows = data.budgets.map(t => ({
        ...t,
        maximum: Math.round(t.maximum * 100),
        id: createSecureGUID(),
    }));

    console.log("ROWS TO INSERT:", rows.length);
    console.log("FIRST ROW:", rows[0]);

    db.transaction((tx) => {
        const deleted = tx.delete(budgets).run();
        console.log("DELETED ROWS:", deleted.changes);

        const inserted = tx.insert(budgets).values(rows).run();
        console.log("INSERTED ROWS:", inserted.changes);
    });
}

seed()
seedPots()
seedBudgets()
console.log("Seed complete");
/*
    .then(() => {

        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });*/
