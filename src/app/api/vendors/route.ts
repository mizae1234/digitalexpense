import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.vendors.getAll());
}

export async function POST(request: Request) {
    const body = await request.json();
    const newVendor = db.vendors.create(body);
    return NextResponse.json(newVendor);
}
