"use client"

import {useTransactionsTable} from "@/context/TransactionsTableProvider";

export function PaginationBar() {
    const {tableDef, pagination} = useTransactionsTable();

    return (
        <div className={`flex gap-2 mt-3 w-full justify-between`}>
            <button className={`p-4 rounded border`}
                onClick={() => tableDef.previousPage()}
                disabled={!tableDef.getCanPreviousPage()}
            >
                Previous
            </button>

            <div className={`flex gap-2`}>
                {Array.from({ length: tableDef.getPageCount() }).map((_, i) => (
                    <button key={i} onClick={() => tableDef.setPageIndex(i)}
                        className={`p-4 rounded border ${pagination.pageIndex === i ? 'bg-accent text-accent-foreground' : ''}`}>
                        {i+1}
                    </button>
                ))}
            </div>

            <button className={`p-4 rounded border`}
                onClick={() => tableDef.nextPage()}
                disabled={!tableDef.getCanNextPage()}
            >
                Next
            </button>
        </div>
    );
}