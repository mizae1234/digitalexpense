'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ApprovalQueuePage() {
    const { purchaseRequests, expenses, currentUserRole } = useDemo();

    // Filter based on role
    const pendingPRs = purchaseRequests.filter(pr => {
        if (currentUserRole === 'MANAGER' && pr.status === 'PENDING_MANAGER') return true;
        if (currentUserRole === 'AUTHORIZED' && pr.status === 'PENDING_AUTHORIZED') return true;
        if (currentUserRole === 'PURCHASING' && pr.status === 'PURCHASING') return true;
        if (currentUserRole === 'FINANCE' && pr.status === 'PENDING_FINANCE') return true;
        return false;
    });

    const pendingExpenses = expenses.filter(exp => {
        if (currentUserRole === 'MANAGER' && exp.status === 'PENDING_MANAGER') return true;
        if (currentUserRole === 'AUTHORIZED' && exp.status === 'PENDING_AUTHORIZED') return true;
        if (currentUserRole === 'FINANCE' && exp.status === 'PENDING_FINANCE') return true;
        return false;
    });

    const totalPending = pendingPRs.length + pendingExpenses.length;

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            'REQUESTER': 'ผู้ขอซื้อ',
            'MANAGER': 'หัวหน้า',
            'AUTHORIZED': 'ผู้มีอำนาจอนุมัติ',
            'PURCHASING': 'ฝ่ายจัดซื้อ',
            'FINANCE': 'ฝ่ายการเงิน'
        };
        return labels[role] || role;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">รายการรออนุมัติ</h1>
                <p className="text-slate-500">รายการที่รอการดำเนินการของ <span className="font-semibold text-primary">{getRoleLabel(currentUserRole)}</span></p>
            </div>

            {totalPending === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">ไม่มีรายการรอดำเนินการ</h3>
                    <p className="text-slate-500 mt-1">คุณไม่มีรายการที่รออนุมัติในขณะนี้</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingPRs.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <h3 className="font-semibold text-slate-900">ใบขอซื้อ ({pendingPRs.length})</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {pendingPRs.map(pr => (
                                    <div key={pr.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                                PR
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{pr.title}</p>
                                                <p className="text-xs text-slate-500">{pr.requesterName} • ฿{pr.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/purchase-requests/${pr.id}`}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                                        >
                                            ตรวจสอบ
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {pendingExpenses.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <h3 className="font-semibold text-slate-900">ค่าใช้จ่าย ({pendingExpenses.length})</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {pendingExpenses.map(exp => (
                                    <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                                EXP
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{exp.description}</p>
                                                <p className="text-xs text-slate-500">{exp.requesterName} • ฿{exp.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/expenses/${exp.id}`}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                                        >
                                            ตรวจสอบ
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
