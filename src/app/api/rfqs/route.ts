import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.rfqs.getAll());
}

export async function POST(request: Request) {
    const body = await request.json();
    const newRfq = db.rfqs.create(body);
    return NextResponse.json(newRfq);
}
