import {NextResponse} from 'next/server';
import {fetchData} from "@/data/data-fetch";

export async function GET() {
    const data = await fetchData();
    return NextResponse.json(data);
}
