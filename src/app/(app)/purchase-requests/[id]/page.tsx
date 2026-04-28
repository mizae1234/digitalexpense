'use client';

import { useParams } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import { ApprovalTimeline } from '@/components/shared/ApprovalTimeline';
import { ArrowLeft, Check, X, Printer, Package } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PRStatus } from '@/lib/mock-data';

export default function PurchaseRequestDetailPage() {
    const params = useParams();
    const { purchaseRequests, updatePRStatus, currentUserRole } = useDemo();

    const id = params?.id as string;
    const pr = purchaseRequests.find(p => p.id === id);

    if (!pr) {
        return <div className="p-8 text-center text-slate-500">ไม่พบใบขอซื้อ</div>;
    }

    const getNextStatus = (): PRStatus | null => {
        switch (currentUserRole) {
            case 'MANAGER':
                return pr.status === 'PENDING_MANAGER' ? 'PENDING_AUTHORIZED' : null;
            case 'AUTHORIZED':
                return pr.status === 'PENDING_AUTHORIZED' ? 'PURCHASING' : null;
            case 'PURCHASING':
                return pr.status === 'PURCHASING' ? 'PENDING_GR' : null;
            case 'FINANCE':
                return pr.status === 'PENDING_FINANCE' ? 'COMPLETED' : null;
            default:
                return null;
        }
    };

    const canApprove = getNextStatus() !== null;

    const handleApprove = () => {
        const nextStatus = getNextStatus();
        if (nextStatus) {
            updatePRStatus(id, nextStatus, currentUserRole);
        }
    };

    const handleReject = () => {
        updatePRStatus(id, 'REJECTED', currentUserRole);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            'PENDING_MANAGER': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'รอหัวหน้าอนุมัติ' },
            'PENDING_AUTHORIZED': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'รอผู้มีอำนาจอนุมัติ' },
            'PURCHASING': { bg: 'bg-purple-50', text: 'text-purple-700', label: 'ฝ่ายจัดซื้อดำเนินการ' },
            'PENDING_GR': { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'รอรับสินค้า' },
            'PENDING_FINANCE': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'รอการเงินตรวจสอบ' },
            'COMPLETED': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'เสร็จสิ้น' },
            'REJECTED': { bg: 'bg-red-50', text: 'text-red-700', label: 'ไม่อนุมัติ' },
        };
        const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-700', label: status };
        return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", s.bg, s.text)}>{s.label}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/purchase-requests"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{pr.id}</h1>
                            {getStatusBadge(pr.status)}
                        </div>
                        <p className="text-slate-500">{pr.title} • {pr.department}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {pr.status === 'PENDING_GR' && (
                        <Link
                            href={`/purchase-requests/${pr.id}/gr`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 shadow-sm transition-colors font-medium"
                        >
                            <Package className="w-4 h-4" />
                            บันทึกรับสินค้า
                        </Link>
                    )}
                    {canApprove && (
                        <>
                            <button
                                onClick={handleReject}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm transition-colors font-medium"
                            >
                                <X className="w-4 h-4" />
                                ไม่อนุมัติ
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-colors font-medium"
                            >
                                <Check className="w-4 h-4" />
                                อนุมัติ
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-slate-900 border-b border-slate-100 pb-2">รายละเอียดคำขอ</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500 block mb-1">ผู้ขอซื้อ</span>
                                <span className="font-medium text-slate-900">{pr.requesterName}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">วันที่ขอซื้อ</span>
                                <span className="font-medium text-slate-900">{pr.requestDate}</span>
                            </div>
                            {pr.poNumber && (
                                <div>
                                    <span className="text-slate-500 block mb-1">เลข PO</span>
                                    <span className="font-medium text-slate-900">{pr.poNumber}</span>
                                </div>
                            )}
                            <div className="col-span-2">
                                <span className="text-slate-500 block mb-1">รายละเอียด</span>
                                <p className="text-slate-900 leading-relaxed">{pr.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                            <h2 className="font-semibold text-slate-900">รายการสินค้า</h2>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 w-12">#</th>
                                    <th className="px-6 py-3">รายการ</th>
                                    <th className="px-6 py-3 text-right">จำนวน</th>
                                    <th className="px-6 py-3 text-right">ราคาต่อหน่วย</th>
                                    <th className="px-6 py-3 text-right">รวม</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pr.items.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-3 text-slate-400">{idx + 1}</td>
                                        <td className="px-6 py-3 font-medium text-slate-900">{item.description}</td>
                                        <td className="px-6 py-3 text-right">{item.quantity}</td>
                                        <td className="px-6 py-3 text-right">฿{item.unitPrice.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right font-medium text-slate-900">฿{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={4} className="px-6 py-3 text-right font-semibold text-slate-700">ยอดรวมทั้งสิ้น</td>
                                    <td className="px-6 py-3 text-right font-bold text-primary text-lg">฿{pr.totalAmount.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-slate-900">ขั้นตอนการอนุมัติ</h2>
                        <ApprovalTimeline steps={pr.approvals} />
                    </div>
                </div>
            </div>
        </div>
    );
}
