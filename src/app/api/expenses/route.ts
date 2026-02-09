import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.expenses.getAll());
}

export async function POST(request: Request) {
    const body = await request.json();
    const newExpense = {
        ...body,
        id: `EXP-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING_MANAGER',
    };
    const created = db.expenses.create(newExpense);
    return NextResponse.json(created);
}
