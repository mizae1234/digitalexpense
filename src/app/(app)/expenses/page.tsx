'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import { Plus, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExpenseListPage() {
    const { expenses } = useDemo();

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            'PENDING_MANAGER': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'รอหัวหน้า' },
            'PENDING_AUTHORIZED': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'รอผู้มีอำนาจ' },
            'PENDING_FINANCE': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'รอการเงิน' },
            'COMPLETED': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'เสร็จสิ้น' },
            'REJECTED': { bg: 'bg-red-50', text: 'text-red-700', label: 'ไม่อนุมัติ' },
        };
        const s = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-700', label: status };
        return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", s.bg, s.text)}>{s.label}</span>;
    };

    const getCategoryLabel = (cat: string) => {
        const map: Record<string, string> = {
            'TRAVEL': 'เดินทาง',
            'TRAINING': 'อบรม',
            'LABOR': 'ค่าแรง',
            'MEALS': 'อาหาร',
            'OTHER': 'อื่นๆ'
        };
        return map[cat] || cat;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">เบิกค่าใช้จ่าย</h1>
                    <p className="text-slate-500">รายการเบิกค่าใช้จ่ายทั้งหมด</p>
                </div>
                <Link
                    href="/expenses/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    เบิกค่าใช้จ่ายใหม่
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {expenses.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ยังไม่มีรายการ</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-500">เลขที่</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">วันที่</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">หมวดหมู่</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">รายละเอียด</th>
                                    <th className="px-6 py-3 font-medium text-slate-500 text-right">จำนวนเงิน</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">สถานะ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {expenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-primary">
                                            <Link href={`/expenses/${exp.id}`}>{exp.id}</Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{exp.date}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                                {getCategoryLabel(exp.category)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-900">{exp.description}</td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900">฿{exp.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(exp.status)}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/expenses/${exp.id}`}
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
