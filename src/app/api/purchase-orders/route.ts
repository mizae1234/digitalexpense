'use server';

import { NextResponse } from 'next/server';
import { MOCK_POS, MOCK_RFQS, PurchaseOrder, PRItem } from '@/lib/mock-data';

// In-memory storage (resets on server restart)
let purchaseOrders: PurchaseOrder[] = [...MOCK_POS];

export async function GET() {
    return NextResponse.json(purchaseOrders);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { rfqId, deliveryDate, notes } = body;

        // Find the RFQ to get vendor and items info
        const rfq = MOCK_RFQS.find(r => r.id === rfqId);
        if (!rfq) {
            return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
        }

        // Get selected quotation
        const selectedQuotation = rfq.quotations.find(q => q.vendorId === rfq.selectedVendorId);
        if (!selectedQuotation) {
            return NextResponse.json({ error: 'No vendor selected for this RFQ' }, { status: 400 });
        }

        // Calculate items with updated prices from quotation
        const items: PRItem[] = rfq.items.map(item => {
            const quotedPrice = selectedQuotation.itemPrices.find(ip => ip.itemId === item.id);
            const unitPrice = quotedPrice?.price || item.unitPrice;
            return {
                ...item,
                unitPrice,
                total: unitPrice * item.quantity
            };
        });

        const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

        // Generate PO ID
        const year = new Date().getFullYear();
        const count = purchaseOrders.filter(po => po.id.includes(`PO-${year}`)).length + 1;
        const poId = `PO-${year}-${count.toString().padStart(3, '0')}`;

        const newPO: PurchaseOrder = {
            id: poId,
            rfqId,
            prId: rfq.prId,
            vendorId: rfq.selectedVendorId!,
            vendorName: selectedQuotation.vendorName,
            createdDate: new Date().toISOString().split('T')[0],
            deliveryDate: deliveryDate || undefined,
            items,
            totalAmount,
            status: 'ISSUED',
            notes: notes || undefined
        };

        purchaseOrders = [newPO, ...purchaseOrders];

        return NextResponse.json(newPO, { status: 201 });
    } catch (error) {
        console.error('Error creating PO:', error);
        return NextResponse.json({ error: 'Failed to create PO' }, { status: 500 });
    }
}
