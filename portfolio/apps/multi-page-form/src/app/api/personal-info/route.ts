import { NextResponse } from "next/server";
import { savePersonalInfo, saveSubmissionId } from "@/../db/form.repository";
import { personalInfoSchema } from "@/../db/validators";

export async function POST(req: Request) {
    try {
        const { submissionId, values } = await req.json();

        const parsed = personalInfoSchema.safeParse(values);
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
        }

        const id = submissionId ?? (await saveSubmissionId());

        await savePersonalInfo(id, parsed.data);
        return NextResponse.json({ ok: true, submissionId: id });
    } catch (err) {
        console.error("API ERROR", err);
        return NextResponse.json(
            { error: String(err) },
            { status: 500 }
        );
    }
}