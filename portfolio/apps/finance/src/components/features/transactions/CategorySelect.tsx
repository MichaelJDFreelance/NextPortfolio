"use client"

import {useTransactionsTable} from "@/context/TransactionsTableProvider";

export function CategorySelect() {
    const {columnFilters, setColumnFilters, categories} = useTransactionsTable();

    return (
        <label>Category:
            <select className={`px-5 py-3 rounded border`}
                value={
                    columnFilters.find(f => f.id === "category")?.value as string ?? ""
                }
                onChange={(e) => {
                    const value = e.target.value

                    if (!value) {
                        setColumnFilters(filters =>
                            filters.filter(f => f.id !== "category")
                        )
                    } else {
                        setColumnFilters([
                            { id: "category", value },
                        ])
                    }
                }}
            >
                <option value="">All categories</option>

                {categories.map(cat => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </label>
    );
}