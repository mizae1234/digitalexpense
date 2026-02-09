'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { ArrowLeft, Package, Check, AlertCircle } from 'lucide-react';

export default function GoodsReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const { purchaseRequests, createGR, updatePRStatus } = useDemo();

    const prId = params?.id as string;
    const pr = purchaseRequests.find(p => p.id === prId);

    const [receivedItems, setReceivedItems] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState('');

    if (!pr) {
        return <div className="p-8 text-center text-slate-500">ไม่พบใบขอซื้อ</div>;
    }

    if (pr.status !== 'PENDING_GR') {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-slate-700 font-medium">ใบขอซื้อนี้ไม่อยู่ในสถานะรอรับสินค้า</p>
                <Link href={`/purchase-requests/${prId}`} className="text-primary hover:underline mt-2 inline-block">
                    กลับไปดูรายละเอียด
                </Link>
            </div>
        );
    }

    const handleReceive = async () => {
        const grData = {
            receivedDate: new Date().toISOString().split('T')[0],
            receivedBy: 'สมชาย ผู้ขอซื้อ',
            items: pr.items.map(item => ({
                itemId: item.id,
                receivedQty: receivedItems[item.id] || item.quantity,
                notes: ''
            })),
            status: 'COMPLETE' as const
        };

        await createGR(prId, grData);
        updatePRStatus(prId, 'PENDING_FINANCE', 'PURCHASING');
        router.push(`/purchase-requests/${prId}`);
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href={`/purchase-requests/${prId}`}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">บันทึกรับสินค้า (GR)</h1>
                    <p className="text-slate-500">{pr.id} - {pr.title}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Package className="w-5 h-5 text-slate-500" />
                    <h2 className="font-semibold text-slate-900">รายการสินค้า</h2>
                </div>

                <div className="p-6 space-y-4">
                    {pr.items.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                            <span className="text-slate-400 w-6">{idx + 1}.</span>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">{item.description}</p>
                                <p className="text-sm text-slate-500">สั่งซื้อ: {item.quantity} ชิ้น</p>
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-slate-500 block mb-1">รับจริง</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={item.quantity}
                                    value={receivedItems[item.id] ?? item.quantity}
                                    onChange={(e) => setReceivedItems({ ...receivedItems, [item.id]: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <label className="text-sm font-medium text-slate-700 block mb-2">หมายเหตุ</label>
                <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="บันทึกหมายเหตุเพิ่มเติม..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={`/purchase-requests/${prId}`}
                    className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                    ยกเลิก
                </Link>
                <button
                    onClick={handleReceive}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                    <Check className="w-4 h-4" />
                    ยืนยันรับสินค้า
                </button>
            </div>
        </div>
    );
}
