import {
    FilterFn,
    SortingFn,
} from "@tanstack/react-table"
import { Transaction } from "@/types/transaction"

declare module "@tanstack/react-table" {
    interface FilterFns {
        fuzzy: FilterFn<Transaction>
    }

    interface ColumnMeta<TData, TValue> {
        mobileHidden?: boolean
        cellClassName?: string
    }
}