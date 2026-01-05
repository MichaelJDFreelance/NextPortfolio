import { NextResponse } from "next/server";
import { savePersonalInfo } from "@/../db/form.repository";
import { personalInfoSchema } from "@/../db/validators";

export async function POST(req: Request) {
    const { submissionId, values } = await req.json();

    const parsed = personalInfoSchema.safeParse(values);
    if (!parsed.success) {
        return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    await savePersonalInfo(submissionId, parsed.data);
    return NextResponse.json({ ok: true });
}