'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Banknote, CheckCircle2 } from 'lucide-react';

export default function FinancePage() {
    const { purchaseRequests, expenses, updatePRStatus, updateExpenseStatus } = useDemo();

    const financePendingPRs = purchaseRequests.filter(pr => pr.status === 'PENDING_FINANCE');
    const financePendingExpenses = expenses.filter(e => e.status === 'PENDING_FINANCE');

    const handleCompletePR = (id: string) => {
        updatePRStatus(id, 'COMPLETED', 'FINANCE');
    };

    const handleCompleteExpense = (id: string) => {
        updateExpenseStatus(id, 'COMPLETED', 'FINANCE');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Finance Review</h1>
                    <p className="text-slate-500">ตรวจสอบเอกสารและดำเนินการจ่ายเงิน</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Pending PRs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-slate-500" />
                        <h3 className="font-semibold text-slate-900">ใบขอซื้อรอตรวจสอบ ({financePendingPRs.length})</h3>
                    </div>
                    {financePendingPRs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">ไม่มีรายการรอตรวจสอบ</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {financePendingPRs.map(pr => (
                                <div key={pr.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">{pr.title}</p>
                                        <p className="text-xs text-slate-500">฿{pr.totalAmount.toLocaleString()} • {pr.department}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCompletePR(pr.id)}
                                        className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                    >
                                        ตรวจสอบเสร็จ
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Expenses */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-slate-500" />
                        <h3 className="font-semibold text-slate-900">ค่าใช้จ่ายรอจ่าย ({financePendingExpenses.length})</h3>
                    </div>
                    {financePendingExpenses.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">ไม่มีรายการรอจ่าย</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {financePendingExpenses.map(exp => (
                                <div key={exp.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">{exp.description}</p>
                                        <p className="text-xs text-slate-500">฿{exp.amount.toLocaleString()} • {exp.requesterName}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCompleteExpense(exp.id)}
                                        className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                    >
                                        จ่ายเงินแล้ว
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Completed Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold text-slate-900">รายการเสร็จสิ้น</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500">รายการที่ตรวจสอบเสร็จสิ้นจะถูกส่งไปยังหน้า Accounting Interface เพื่อส่งเข้าระบบบัญชีต่อไป</p>
                    <Link href="/accounting" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary hover:text-primary/80">
                        ไปที่ Accounting Interface →
                    </Link>
                </div>
            </div>
        </div>
    );
}
