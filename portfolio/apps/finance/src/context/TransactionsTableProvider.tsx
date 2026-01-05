"use client"

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState} from "react";
import {
    ColumnDef,
    ColumnFiltersState, FilterFn,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, PaginationState,
    SortingState, Table,
    useReactTable
} from "@tanstack/react-table";
import {Transaction} from "@/data/server/data-access";
import {asDate, formatAsDollars} from "@/lib/utils";
import {rankItem} from "@tanstack/match-sorter-utils";

type TransactionsTableContext = {
    tableDef: Table<Transaction>
    pagination: PaginationState
    sorting: SortingState
    columnFilters: ColumnFiltersState
    setSorting: Dispatch<SetStateAction<SortingState>>
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>
    columns: ColumnDef<Transaction>[]
    categories: string[]
}

export const defaultColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "name",
        header: "Name",
        filterFn: "fuzzy",
        cell: ({ row, getValue }) => {
            const name = getValue<string>()
            const avatar = row.original.avatar
            const category = row.original.category

            return (
                <div className="flex items-center gap-2">
                    <img
                        src={avatar}
                        alt={name}
                        className="h-6 w-6 rounded-full"
                    />
                    <div>
                        <div>{name}</div>
                        <div className={`md:hidden`}>{category}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        filterFn: "equalsString",
        meta: {
            mobileHidden: true
        }
    },
    {
        accessorKey: "date",
        header: "Transaction Date",
        cell: ({ getValue }) => {
            const value = getValue<string>()
            return asDate(value)
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => {
            const value = getValue<string>()
            return formatAsDollars(Number(value), {asAbsolute:true})
        },
    },
]

const fuzzyFilter: FilterFn<Transaction> = (
    row,
    columnId,
    value,
    addMeta
) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })

    return itemRank.passed
}

const TableContext = createContext<TransactionsTableContext | undefined>(undefined);

export function useTransactionsTable() {
    const ctx = useContext(TableContext);
    if (!ctx) {
        throw new Error(
            "useTransactionsTable must be used within TransactionsTableProvider"
        );
    }
    return ctx;
}

export function TransactionsTableProvider({children, transactions, columns}:{children:ReactNode, transactions:Transaction[], columns?:ColumnDef<Transaction>[]}) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [sorting, setSorting] = useState<SortingState>([])

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([])

    const tableDef = useReactTable({
        data: transactions || [],
        columns: columns || defaultColumns,
        state: { pagination, sorting, columnFilters },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const categories = Array.from(
        new Set(transactions?.map(t => t.category) ?? [])
    )

    const value = useMemo(
        () => ({
            tableDef,
            pagination,
            sorting,
            columnFilters,
            setSorting,
            setColumnFilters,
            columns: columns || defaultColumns,
            categories,
        }),
        [tableDef, columns, pagination, sorting, columnFilters, categories]
    );

    return (
        <TableContext.Provider value={value}>
            {children}
        </TableContext.Provider>
    );
}