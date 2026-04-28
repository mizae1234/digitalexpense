'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { ArrowLeft, FileCheck, Building2, Calendar, Package, Printer, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'แบบร่าง', color: 'bg-slate-100 text-slate-700' },
    ISSUED: { label: 'ออกแล้ว', color: 'bg-blue-100 text-blue-700' },
    DELIVERED: { label: 'ส่งของแล้ว', color: 'bg-emerald-100 text-emerald-700' },
    CANCELLED: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' }
};

export default function PODetailPage() {
    const params = useParams();
    const router = useRouter();
    const { purchaseOrders, vendors, updatePO } = useDemo();

    const id = params?.id as string;
    const po = purchaseOrders.find(p => p.id === id);

    if (!po) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-500">ไม่พบ PO</p>
                <Link href="/purchasing/po" className="text-primary hover:underline mt-2 inline-block">
                    กลับไปหน้ารายการ PO
                </Link>
            </div>
        );
    }

    const status = statusConfig[po.status] || statusConfig.DRAFT;
    const vendor = vendors.find(v => v.id === po.vendorId);

    const handleMarkDelivered = () => {
        updatePO(po.id, { status: 'DELIVERED' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/purchasing/po"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{po.id}</h1>
                            <span className={cn(
                                "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                                status.color
                            )}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-slate-500">Purchase Order สำหรับ {po.prId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {po.status === 'ISSUED' && (
                        <button
                            onClick={handleMarkDelivered}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <Truck className="w-4 h-4" />
                            ยืนยันรับของ
                        </button>
                    )}
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        พิมพ์
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                {po.items.map((item, idx) => (
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
                                            ฿{item.unitPrice.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                                            ฿{item.total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right font-semibold text-slate-900">
                                        รวมทั้งสิ้น
                                    </td>
                                    <td className="px-6 py-4 text-right text-xl font-bold text-primary">
                                        ฿{po.totalAmount.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Notes */}
                    {po.notes && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-2">หมายเหตุ</h3>
                            <p className="text-slate-600">{po.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Vendor Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">ข้อมูล Vendor</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{po.vendorName}</p>
                                    {vendor && (
                                        <p className="text-sm text-slate-500">{vendor.code}</p>
                                    )}
                                </div>
                            </div>
                            {vendor && (
                                <>
                                    <div className="text-sm">
                                        <span className="text-slate-500">ติดต่อ: </span>
                                        <span className="text-slate-700">{vendor.contact}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-slate-500">Email: </span>
                                        <span className="text-slate-700">{vendor.email}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">วันที่สำคัญ</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">วันที่สร้าง</p>
                                    <p className="font-medium text-slate-900">{po.createdDate}</p>
                                </div>
                            </div>
                            {po.deliveryDate && (
                                <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-500">กำหนดส่งของ</p>
                                        <p className="font-medium text-slate-900">{po.deliveryDate}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Documents */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">เอกสารที่เกี่ยวข้อง</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/purchase-requests/${po.prId}`}
                                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <p className="text-sm text-slate-500">Purchase Request</p>
                                <p className="font-medium text-primary">{po.prId}</p>
                            </Link>
                            <Link
                                href={`/purchasing/rfq/${po.rfqId}`}
                                className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <p className="text-sm text-slate-500">RFQ</p>
                                <p className="font-medium text-primary">{po.rfqId}</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
