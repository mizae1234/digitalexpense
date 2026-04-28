'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShoppingCart, ArrowRight, FileSearch } from 'lucide-react';

export default function PurchasingQueuePage() {
    const { purchaseRequests, rfqs } = useDemo();

    // PRs that are in PURCHASING status (approved but need RFQ/PO)
    const purchasingQueue = purchaseRequests.filter(pr => pr.status === 'PURCHASING');
    // PRs waiting for GR
    const pendingGR = purchaseRequests.filter(pr => pr.status === 'PENDING_GR');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">คิวจัดซื้อ</h1>
                <p className="text-slate-500">รายการใบขอซื้อที่รออนุมัติเสร็จสิ้นและรอดำเนินการจัดซื้อ</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">รอดำเนินการ</p>
                            <h3 className="text-2xl font-bold text-slate-900">{purchasingQueue.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <FileSearch className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">RFQ กำลังดำเนินการ</p>
                            <h3 className="text-2xl font-bold text-slate-900">{rfqs.filter(r => r.status === 'OPEN' || r.status === 'EVALUATING').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">รอรับสินค้า (GR)</p>
                            <h3 className="text-2xl font-bold text-slate-900">{pendingGR.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Queue List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">รายการรอดำเนินการจัดซื้อ</h3>
                </div>

                {purchasingQueue.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ไม่มีรายการรอดำเนินการ</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {purchasingQueue.map(pr => (
                            <div key={pr.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                                        PR
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{pr.title}</p>
                                        <p className="text-sm text-slate-500">{pr.id} • {pr.department} • ฿{pr.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {pr.rfqId ? (
                                        <Link
                                            href={`/purchasing/rfq/${pr.rfqId}`}
                                            className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20"
                                        >
                                            ดู RFQ
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/purchasing/rfq/new?prId=${pr.id}`}
                                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                                        >
                                            สร้าง RFQ
                                        </Link>
                                    )}
                                    <Link
                                        href={`/purchase-requests/${pr.id}`}
                                        className="p-2 text-slate-400 hover:text-slate-600"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pending GR */}
            {pendingGR.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-purple-50">
                        <h3 className="font-semibold text-slate-900">รอรับสินค้า (Goods Receipt)</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {pendingGR.map(pr => (
                            <div key={pr.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                                        GR
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{pr.title}</p>
                                        <p className="text-sm text-slate-500">{pr.poNumber || pr.id} • ฿{pr.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/purchase-requests/${pr.id}/gr`}
                                    className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                                >
                                    บันทึกรับสินค้า
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
