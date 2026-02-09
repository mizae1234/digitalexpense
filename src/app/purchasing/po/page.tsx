'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { FileCheck, ArrowRight, Package, Building2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'แบบร่าง', color: 'bg-slate-100 text-slate-700' },
    ISSUED: { label: 'ออกแล้ว', color: 'bg-blue-100 text-blue-700' },
    DELIVERED: { label: 'ส่งของแล้ว', color: 'bg-emerald-100 text-emerald-700' },
    CANCELLED: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' }
};

export default function POListPage() {
    const { purchaseOrders } = useDemo();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
                    <p className="text-slate-500">รายการใบสั่งซื้อทั้งหมด</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                        ทั้งหมด {purchaseOrders.length} รายการ
                    </span>
                </div>
            </div>

            {/* PO List */}
            {purchaseOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">ยังไม่มี PO</h3>
                    <p className="text-slate-500">สร้าง PO จากหน้า RFQ ที่เลือก Vendor แล้ว</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    PO Number
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    Vendor
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                                    PR อ้างอิง
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                                    มูลค่า
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                                    สถานะ
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                                    วันที่สร้าง
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchaseOrders.map((po) => {
                                const status = statusConfig[po.status] || statusConfig.DRAFT;
                                return (
                                    <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <FileCheck className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-medium text-slate-900">{po.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-700">{po.vendorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/purchase-requests/${po.prId}`}
                                                className="text-primary hover:underline"
                                            >
                                                {po.prId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-semibold text-slate-900">
                                                ฿{po.totalAmount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                                                status.color
                                            )}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-slate-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {po.createdDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/purchasing/po/${po.id}`}
                                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
                                            >
                                                ดูรายละเอียด
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
