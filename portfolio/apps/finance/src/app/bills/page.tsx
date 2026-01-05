"use client"

import {TransactionsTableProvider} from "@/context/TransactionsTableProvider";
import {Table} from "@/components/features/transactions/Table";
import {FuzzySearch} from "@/components/features/transactions/FuzzySearch";
import {SortSelect} from "@/components/features/transactions/SortSelect";
import {Transaction} from "@/data/server/data-access";
import {ColumnDef} from "@tanstack/react-table";
import {asDate, formatAsDollars} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {fetchTransactions} from "@/data/client/data-access";
import IconNote from "@portfolio/icons/finance/icon-recurring-bills"

const columns: ColumnDef<Transaction>[] = [
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
        accessorKey: "date",
        header: "Due Date",
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

export default function Page() {
    const {data} = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    })

    return (
        <div className="flex mb-auto w-full">
            <main className="flex gap-8 w-full flex-col px-4 py-6 md:px-8 md:py-10">
                <header className={`flex items-center justify-between`}>
                    <h1 className={`text-preset-1`}>Recurring bills</h1>
                </header>
                <div className={`flex gap-6`}>
                    <div className={`flex flex-col gap-6`}>
                        <dl className={`flex flex-col gap-3 min-w-72.25 bg-accent text-accent-foreground p-6 rounded`}>
                                <dt className={`flex flex-col gap-8`}>
                                    <IconNote className={`h-10 w-10`} />
                                    Total bills</dt>
                                <dd className={`text-preset-1`}>$1,550.00</dd>
                        </dl>
                        <article className={`flex flex-col gap-5 min-w-72.25 bg-card text-card-foreground p-5 rounded`}>
                            <h2 className={`text-preset-3 text-accent`}>Summary</h2>
                            <dl className={`text-preset-5 flex flex-col gap-3`}>
                                <div className={`flex justify-between items-center`}>
                                    <dt>Total bills</dt>
                                    <dd className={`font-bold`}>$1,550.00</dd>
                                </div>
                                <hr />
                                <div className={`flex justify-between items-center`}>
                                    <dt>Total paid</dt>
                                    <dd className={`font-bold`}>$1,550.00</dd>
                                </div>
                                <hr />
                                <div className={`flex justify-between items-center`}>
                                    <dt>Total paid</dt>
                                    <dd className={`font-bold`}>$1,550.00</dd>
                                </div>
                            </dl>
                        </article>
                    </div>
                    <TransactionsTableProvider transactions={data||[]} columns={columns}>
                        <div className={`p-8 flex-1`}>
                            <div className={`flex gap-4 mb-4`}>
                                <FuzzySearch />
                                <SortSelect />
                            </div>
                            <Table />
                        </div>
                    </TransactionsTableProvider>
                </div>
            </main>
        </div>
    );
}
