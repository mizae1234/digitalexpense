'use client';

import { useParams } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Award, Building2, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RFQDetailPage() {
    const params = useParams();
    const { rfqs, vendors, updateRFQ, updatePRStatus, purchaseRequests, purchaseOrders } = useDemo();

    const id = params?.id as string;
    const rfq = rfqs.find(r => r.id === id);

    if (!rfq) {
        return <div className="p-8 text-center text-slate-500">ไม่พบ RFQ</div>;
    }

    const pr = purchaseRequests.find(p => p.id === rfq.prId);
    const existingPO = purchaseOrders.find(po => po.rfqId === rfq.id);

    const handleSelectVendor = (vendorId: string) => {
        updateRFQ(rfq.id, {
            selectedVendorId: vendorId,
            status: 'AWARDED'
        });
        // Update PR to next status
        if (pr) {
            updatePRStatus(pr.id, 'PENDING_GR', 'PURCHASING');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/purchasing/rfq"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{rfq.id}</h1>
                        <p className="text-slate-500">RFQ สำหรับ {rfq.prTitle} ({rfq.prId})</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {rfq.status === 'AWARDED' && !existingPO && (
                        <Link
                            href={`/purchasing/po/new?rfqId=${rfq.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            <FileCheck className="w-5 h-5" />
                            เปิด PO
                        </Link>
                    )}
                    {existingPO && (
                        <Link
                            href={`/purchasing/po/${existingPO.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                            <FileCheck className="w-5 h-5" />
                            ดู PO: {existingPO.id}
                        </Link>
                    )}
                    {rfq.status === 'AWARDED' && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-medium">
                            <CheckCircle2 className="w-5 h-5" />
                            เลือก Vendor แล้ว
                        </span>
                    )}
                </div>
            </div>

            {/* Items being quoted */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">รายการที่ขอใบเสนอราคา</h2>
                <div className="space-y-2">
                    {rfq.items.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-sm">{idx + 1}.</span>
                                <span className="text-slate-900">{item.description}</span>
                            </div>
                            <span className="text-slate-500">x {item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quotation Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-900">เปรียบเทียบใบเสนอราคา</h2>
                </div>

                {rfq.quotations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ยังไม่มีใบเสนอราคา</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {rfq.quotations.map((quot) => {
                            const isSelected = rfq.selectedVendorId === quot.vendorId;
                            const isLowest = rfq.quotations.every(q => quot.totalPrice <= q.totalPrice);

                            return (
                                <div
                                    key={quot.vendorId}
                                    className={cn(
                                        "relative rounded-xl border-2 p-6 transition-all",
                                        isSelected
                                            ? "border-emerald-500 bg-emerald-50"
                                            : isLowest
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 bg-white"
                                    )}
                                >
                                    {isLowest && !isSelected && (
                                        <span className="absolute -top-3 left-4 px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                                            ราคาต่ำสุด
                                        </span>
                                    )}
                                    {isSelected && (
                                        <span className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                            <Award className="w-3 h-3" /> เลือกแล้ว
                                        </span>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{quot.vendorName}</p>
                                            <p className="text-xs text-slate-500">ส่งเมื่อ {quot.submittedDate}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {quot.itemPrices.map((ip) => {
                                            const item = rfq.items.find(i => i.id === ip.itemId);
                                            return (
                                                <div key={ip.itemId} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">{item?.description}</span>
                                                    <span className="font-medium">฿{ip.price.toLocaleString()}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-600 font-medium">รวมทั้งสิ้น</span>
                                            <span className="text-xl font-bold text-primary">฿{quot.totalPrice.toLocaleString()}</span>
                                        </div>

                                        {rfq.status !== 'AWARDED' && (
                                            <button
                                                onClick={() => handleSelectVendor(quot.vendorId)}
                                                className="w-full py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                เลือก Vendor นี้
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
