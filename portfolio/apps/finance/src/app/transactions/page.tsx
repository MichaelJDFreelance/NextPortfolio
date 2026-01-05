import {TransactionsTableProvider} from "@/context/TransactionsTableProvider";
import {Table} from "@/components/features/transactions/Table";
import {PaginationBar} from "@/components/features/transactions/PaginationBar";
import {FuzzySearch} from "@/components/features/transactions/FuzzySearch";
import {SortSelect} from "@/components/features/transactions/SortSelect";
import {CategorySelect} from "@/components/features/transactions/CategorySelect";
import {getTransactions} from "@/data/server/data-access";

export default async function Page() {
    const data = await getTransactions();

    return (
        <div className="flex mb-auto w-full">
            <main className="flex gap-8 w-full flex-col px-4 py-6 md:px-8 md:py-10">
                <header className={`flex items-center justify-between`}>
                    <h1 className={`text-preset-1`}>Transactions</h1>
                </header>
                <TransactionsTableProvider transactions={data}>
                    <div className={`w-full p-8`}>
                        <div className={`flex gap-4 mb-4`}>
                            <FuzzySearch />
                            <SortSelect />
                            <CategorySelect />
                        </div>
                        <Table />
                        <PaginationBar />
                    </div>
                </TransactionsTableProvider>
            </main>
        </div>
    );
}
