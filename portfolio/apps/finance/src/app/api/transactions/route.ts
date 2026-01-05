import {NextResponse} from 'next/server';
import {getTransactions, Transaction} from "@/data/server/data-access";

export async function GET() {
    try {
        const transactions: Transaction[] = await getTransactions();

        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json(
            {error: 'Failed to fetch transactions'},
            {status: 500}
        );
    }
}
