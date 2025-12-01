import { NextRequest, NextResponse } from 'next/server';
import bookmarkSource from "@/data/data.json"
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    try {
        const data = bookmarkSource.bookmarks;

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: insertedData, error } = await supabase
            .from('fem_bookmarks')
            .insert(data);

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ inserted: insertedData }, { status: 200 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    //const data = await request.json();
    const data = bookmarkSource.bookmarks;
    return NextResponse.json({ message: 'Received data', data });
}