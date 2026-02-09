import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.prs.getAll());
}

export async function POST(request: Request) {
    const body = await request.json();
    const newPr = {
        ...body,
        id: `PR-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'PENDING_MANAGER',
        approvals: [
            { role: 'Manager', status: 'PENDING' },
            { role: 'Authorized', status: 'PENDING' },
            { role: 'Finance', status: 'PENDING' },
        ]
    };
    const created = db.prs.create(newPr);
    return NextResponse.json(created);
}
