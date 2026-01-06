// app/api/personal-info/route.ts
import {planSchema} from "../../../../db/validators";
import {NextRequest, NextResponse} from "next/server";
import {getPlan, savePlan} from "../../../../db/form.repository";
import {getSubmissionId} from "@/lib/utils";

export async function POST(req: NextRequest) {
    const { values } = await req.json();

    const submissionId = getSubmissionId(req);

    if (!submissionId) {
        return NextResponse.json({ error: 'Submission ID not found' }, { status: 400 });
    }

    const parsed = planSchema.safeParse(values);
    if (!parsed.success) {
        return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    await savePlan(submissionId, parsed.data);
    return NextResponse.json({ ok: true, submissionId });
}

export async function GET(req: NextRequest) {
    try {
        const submissionId = getSubmissionId(req);

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID not found' }, { status: 400 });
        }

        const plan = await getPlan(submissionId);

        const parsed = planSchema.safeParse(plan);
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.issues }, { status: 404 });
        }

        return NextResponse.json({ plan: parsed.data });
    }
    catch (err) {
        console.error("GET API ERROR", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}