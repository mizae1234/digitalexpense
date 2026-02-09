'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, FileCheck, Building2, Calendar, Save } from 'lucide-react';

export default function NewPOPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { rfqs, vendors, createPO } = useDemo();

    const rfqId = searchParams.get('rfqId');
    const rfq = rfqs.find(r => r.id === rfqId);

    const [deliveryDate, setDeliveryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!rfq) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500 mb-4">ไม่พบ RFQ หรือไม่ได้ระบุ rfqId</p>
                <Link href="/purchasing/rfq" className="text-primary hover:underline">
                    ไปหน้า RFQ
                </Link>
            </div>
        );
    }

    if (rfq.status !== 'AWARDED' || !rfq.selectedVendorId) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500 mb-4">RFQ นี้ยังไม่ได้เลือก Vendor</p>
                <Link href={`/purchasing/rfq/${rfqId}`} className="text-primary hover:underline">
                    กลับไปหน้า RFQ
                </Link>
            </div>
        );
    }

    const selectedQuotation = rfq.quotations.find(q => q.vendorId === rfq.selectedVendorId);
    const vendor = vendors.find(v => v.id === rfq.selectedVendorId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newPo = await createPO(rfq.id, {
                deliveryDate: deliveryDate || undefined,
                notes: notes || undefined
            });

            router.push(`/purchasing/po/${newPo.id}`);
        } catch (error) {
            console.error('Error creating PO:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/purchasing/rfq/${rfqId}`}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">สร้าง Purchase Order</h1>
                    <p className="text-slate-500">จาก RFQ: {rfq.id} - {rfq.prTitle}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-semibold text-slate-900">รายการสินค้า</h2>
                        </div>
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                        รายการ
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                                        จำนวน
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                                        ราคา/หน่วย
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                                        รวม
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rfq.items.map((item, idx) => {
                                    const quotedPrice = selectedQuotation?.itemPrices.find(ip => ip.itemId === item.id);
                                    const unitPrice = quotedPrice?.price || item.unitPrice;
                                    const total = unitPrice * item.quantity;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-slate-900">{item.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-700">
                                                ฿{unitPrice.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-900">
                                                ฿{total.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right font-semibold text-slate-900">
                                        รวมทั้งสิ้น
                                    </td>
                                    <td className="px-6 py-4 text-right text-xl font-bold text-primary">
                                        ฿{selectedQuotation?.totalPrice?.toLocaleString() || '-'}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                        <h2 className="font-semibold text-slate-900">ข้อมูลเพิ่มเติม</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                กำหนดส่งของ
                            </label>
                            <input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                หมายเหตุ
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="หมายเหตุหรือข้อมูลเพิ่มเติม..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Vendor Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Vendor ที่เลือก</h3>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{selectedQuotation?.vendorName}</p>
                                {vendor && (
                                    <p className="text-sm text-slate-500">{vendor.code}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileCheck className="w-5 h-5" />
                            {isSubmitting ? 'กำลังสร้าง...' : 'ยืนยันสร้าง PO'}
                        </button>
                        <p className="text-sm text-slate-500 text-center mt-3">
                            หลังจากสร้าง PO จะอัพเดท PO Number ใน PR อัตโนมัติ
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
