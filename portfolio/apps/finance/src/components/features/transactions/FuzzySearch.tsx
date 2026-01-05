"use client"

import {useTransactionsTable} from "@/context/TransactionsTableProvider";

export function FuzzySearch() {
    const {columnFilters, setColumnFilters} = useTransactionsTable();

    return (
        <input className={`px-5 py-3 rounded border`}
            type="text"
            placeholder="Search transaction"
            value={
                columnFilters.find(f => f.id === "name")?.value as string ?? ""
            }
            onChange={(e) => {
                const value = e.target.value

                if (!value) {
                    setColumnFilters(filters =>
                        filters.filter(f => f.id !== "name")
                    )
                } else {
                    setColumnFilters([
                        { id: "name", value },
                    ])
                }
            }}
        />
    );
}