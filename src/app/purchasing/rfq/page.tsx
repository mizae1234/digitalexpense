'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Plus, FileSearch, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function RFQListPage() {
    const { rfqs } = useDemo();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3" /> เปิดรับใบเสนอราคา</span>;
            case 'EVALUATING':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><FileSearch className="w-3 h-3" /> กำลังประเมิน</span>;
            case 'AWARDED':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3" /> เลือก Vendor แล้ว</span>;
            case 'CANCELLED':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600"><XCircle className="w-3 h-3" /> ยกเลิก</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">RFQ / เทียบราคา</h1>
                    <p className="text-slate-500">Request for Quotation - เปรียบเทียบราคาจาก Vendor</p>
                </div>
                <Link
                    href="/purchasing/rfq/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    สร้าง RFQ
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {rfqs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ยังไม่มี RFQ</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-500">RFQ No.</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">PR อ้างอิง</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">รายการ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Vendor ที่เชิญ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">ใบเสนอราคา</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">สถานะ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rfqs.map((rfq) => (
                                    <tr key={rfq.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-primary">
                                            <Link href={`/purchasing/rfq/${rfq.id}`}>{rfq.id}</Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/purchase-requests/${rfq.prId}`} className="text-slate-600 hover:text-primary">
                                                {rfq.prId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{rfq.prTitle}</td>
                                        <td className="px-6 py-4 text-slate-600">{rfq.invitedVendors.length} ราย</td>
                                        <td className="px-6 py-4 text-slate-600">{rfq.quotations.length} ใบ</td>
                                        <td className="px-6 py-4">{getStatusBadge(rfq.status)}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/purchasing/rfq/${rfq.id}`}
                                                className="text-primary hover:text-primary/80 font-medium text-xs"
                                            >
                                                ดูรายละเอียด
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
