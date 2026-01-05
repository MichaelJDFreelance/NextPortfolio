"use client"

import {useTransactionsTable} from "@/context/TransactionsTableProvider";
import {ColumnDef} from "@tanstack/react-table";

function hasAccessorKey<T>(
    col: ColumnDef<T>
): col is ColumnDef<T> & { accessorKey: keyof T } {
    return "accessorKey" in col
}

export function SortSelect() {
    const {sorting, setSorting, columns} = useTransactionsTable();

    return (
        <label className={`ml-auto`}>Sort by:
            <select className={`px-5 py-3 rounded border`}
                    value={sorting[0]?.id ?? ""}
                    onChange={(e) => {
                        const columnId = e.target.value

                        if (!columnId) {
                            setSorting([]) // no sorting
                            return
                        }

                        setSorting([{ id: columnId, desc: false }])
                    }}
            >
                <option value="">No sorting</option>

                {columns.filter(hasAccessorKey).map(col => (
                    <option key={col.accessorKey as string} value={col.accessorKey as string}>
                        {col.header as string}
                    </option>
                ))}
            </select>
        </label>
    );
}