// app/api/personal-info/route.ts
export async function POST(req: Request) {
    await new Promise(res => setTimeout(res, 500));

    // 30% chance of failure
    if (Math.random() < .3) {
        return new Response("Server error", { status: 500 });
    }

    return Response.json({ ok: true });
}