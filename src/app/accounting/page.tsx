'use client';

import { useDemo } from '@/lib/demo-context';
import { Download, FileSpreadsheet, CheckCircle2, Clock } from 'lucide-react';

export default function AccountingInterfacePage() {
    const { purchaseRequests, expenses } = useDemo();

    // Items ready for accounting interface (COMPLETED status)
    const completedPRs = purchaseRequests.filter(pr => pr.status === 'COMPLETED');
    const completedExpenses = expenses.filter(e => e.status === 'COMPLETED');

    const handleExport = (type: 'pr' | 'expense') => {
        // Mock export - in real app would generate CSV/Excel
        alert(`Mock: Exporting ${type === 'pr' ? 'Purchase Requests' : 'Expenses'} to Accounting System`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Accounting Interface</h1>
                <p className="text-slate-500">ส่งข้อมูลเข้าระบบบัญชี</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">ใบขอซื้อพร้อมส่ง</p>
                                <h3 className="text-2xl font-bold text-slate-900">{completedPRs.length} รายการ</h3>
                            </div>
                        </div>
                        <button
                            onClick={() => handleExport('pr')}
                            disabled={completedPRs.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    {completedPRs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                            {completedPRs.slice(0, 3).map(pr => (
                                <div key={pr.id} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{pr.id} - {pr.title}</span>
                                    <span className="font-medium">฿{pr.totalAmount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">ค่าใช้จ่ายพร้อมส่ง</p>
                                <h3 className="text-2xl font-bold text-slate-900">{completedExpenses.length} รายการ</h3>
                            </div>
                        </div>
                        <button
                            onClick={() => handleExport('expense')}
                            disabled={completedExpenses.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    {completedExpenses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                            {completedExpenses.slice(0, 3).map(exp => (
                                <div key={exp.id} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{exp.id} - {exp.description}</span>
                                    <span className="font-medium">฿{exp.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Export History (Mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">ประวัติการส่งข้อมูล</h3>
                </div>
                <div className="p-6 text-center text-slate-400 text-sm italic">
                    ระบบจะแสดงประวัติการส่งข้อมูลเข้าระบบบัญชีที่นี่ (Demo)
                </div>
            </div>
        </div>
    );
}
