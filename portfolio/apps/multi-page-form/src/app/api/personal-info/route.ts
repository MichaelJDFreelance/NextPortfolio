import {NextRequest, NextResponse} from "next/server";
import {getPersonalInfo, savePersonalInfo, saveSubmissionId} from "@/../db/form.repository";
import {personalInfoSchema} from "@/../db/validators";
import {getSubmissionId} from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const { submissionId, values } = await req.json();

        const parsed = personalInfoSchema.safeParse(values);
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
        }

        const id = submissionId ?? (await saveSubmissionId());

        await savePersonalInfo(id, parsed.data);
        const response = NextResponse.json({ok: true});
        response.cookies.set('submissionId', id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return response;
    } catch (err) {
        console.error("API ERROR", err);
        return NextResponse.json(
            { error: String(err) },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const submissionId = getSubmissionId(req);

        if (!submissionId) {
            return NextResponse.json({ error: 'Submission ID not found' }, { status: 400 });
        }

        const plan = await getPersonalInfo(submissionId);

        const parsed = personalInfoSchema.safeParse(plan);
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