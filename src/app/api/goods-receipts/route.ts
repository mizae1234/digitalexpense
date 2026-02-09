import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.grs.getAll());
}

export async function POST(request: Request) {
    const body = await request.json();
    const newGr = db.grs.create(body);
    // Update PR status
    if (body.prId) {
        db.prs.update(body.prId, { status: 'PENDING_FINANCE', grId: newGr.id });
    }
    return NextResponse.json(newGr);
}
