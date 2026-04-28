'use client';

import { useParams } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import { ArrowLeft, Check, X, Receipt } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ExpenseStatus } from '@/lib/mock-data';

export default function ExpenseDetailPage() {
    const params = useParams();
    const { expenses, updateExpenseStatus, currentUserRole } = useDemo();

    const id = params?.id as string;
    const expense = expenses.find(e => e.id === id);

    if (!expense) {
        return <div className="p-8 text-center text-slate-500">ไม่พบรายการค่าใช้จ่าย</div>;
    }

    const getNextStatus = (): ExpenseStatus | null => {
        switch (currentUserRole) {
            case 'MANAGER':
                return expense.status === 'PENDING_MANAGER' ? 'PENDING_AUTHORIZED' : null;
            case 'AUTHORIZED':
                return expense.status === 'PENDING_AUTHORIZED' ? 'PENDING_FINANCE' : null;
            case 'FINANCE':
                return expense.status === 'PENDING_FINANCE' ? 'COMPLETED' : null;
            default:
                return null;
        }
    };

    const canApprove = getNextStatus() !== null;

    const handleApprove = () => {
        const nextStatus = getNextStatus();
        if (nextStatus) {
            updateExpenseStatus(id, nextStatus, currentUserRole);
        }
    };

    const handleReject = () => {
        updateExpenseStatus(id, 'REJECTED', currentUserRole);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            'PENDING_MANAGER': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'รอหัวหน้าอนุมัติ' },
            'PENDING_AUTHORIZED': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'รอผู้มีอำนาจอนุมัติ' },
            'PENDING_FINANCE': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'รอการเงินตรวจสอบ' },
            'COMPLETED': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'เสร็จสิ้น' },
            'REJECTED': { bg: 'bg-red-50', text: 'text-red-700', label: 'ไม่อนุมัติ' },
        };
        const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-700', label: status };
        return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", s.bg, s.text)}>{s.label}</span>;
    };

    const getCategoryLabel = (cat: string) => {
        const map: Record<string, string> = {
            'TRAVEL': 'ค่าเดินทาง',
            'TRAINING': 'ค่าอบรม',
            'LABOR': 'ค่าแรง',
            'MEALS': 'ค่าอาหาร',
            'OTHER': 'อื่นๆ'
        };
        return map[cat] || cat;
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/expenses"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{expense.id}</h1>
                            {getStatusBadge(expense.status)}
                        </div>
                        <p className="text-slate-500">{getCategoryLabel(expense.category)}</p>
                    </div>
                </div>

                {canApprove && (
                    <div className="flex gap-2">
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
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Receipt className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{expense.description}</h2>
                            <p className="text-primary text-2xl font-bold">฿{expense.amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500 block mb-1">ผู้ขอเบิก</span>
                            <span className="font-medium text-slate-900">{expense.requesterName}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">วันที่เกิดค่าใช้จ่าย</span>
                            <span className="font-medium text-slate-900">{expense.date}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">หมวดหมู่</span>
                            <span className="font-medium text-slate-900">{getCategoryLabel(expense.category)}</span>
                        </div>
                        {expense.merchant && (
                            <div>
                                <span className="text-slate-500 block mb-1">ร้านค้า/ผู้ให้บริการ</span>
                                <span className="font-medium text-slate-900">{expense.merchant}</span>
                            </div>
                        )}
                    </div>

                    {/* Mock Receipt Preview */}
                    <div className="pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-500 block mb-2">ใบเสร็จแนบ</span>
                        <div className="bg-slate-100 rounded-lg aspect-[4/3] flex items-center justify-center text-slate-400">
                            <span className="text-sm">ตัวอย่างใบเสร็จ (Demo)</span>
                        </div>
                    </div>
                </div>

                {/* Approval Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900">ขั้นตอนการอนุมัติ</h2>
                    <div className="space-y-4">
                        {expense.approvals?.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5',
                                    step.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                        step.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                            'bg-slate-100 text-slate-400'
                                )}>
                                    {step.status === 'APPROVED' ? '✓' : step.status === 'REJECTED' ? '✗' : idx + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{step.role}</p>
                                    {step.approverName && (
                                        <p className="text-xs text-slate-500">{step.approverName} • {step.date}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
