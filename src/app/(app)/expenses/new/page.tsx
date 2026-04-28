'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import { ArrowLeft, Upload, Check, Send } from 'lucide-react';
import Link from 'next/link';

export default function NewExpensePage() {
    const router = useRouter();
    const { addExpense } = useDemo();

    const [formData, setFormData] = useState({
        description: '',
        category: 'TRAVEL',
        amount: '',
        merchant: '',
        date: new Date().toISOString().split('T')[0],
        requesterName: 'Demo Requester',
        requesterId: 'u1'
    });

    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const expenseData = {
            ...formData,
            amount: parseFloat(formData.amount) || 0,
            receiptUrl: file ? URL.createObjectURL(file) : undefined // Minimal simulation
        };
        await addExpense(expenseData);
        router.push('/expenses');
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/expenses"
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">New Expense Claim</h1>
                    <p className="text-slate-500">Submit a receipt for reimbursement.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g. Flight to Singapore for Tech Conference"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="TRAVEL">Travel</option>
                                <option value="TRAINING">Training / Education</option>
                                <option value="LABOR">Labor</option>
                                <option value="MEALS">Meals & Entertainment</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Date Incurred</label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Merchant / Vendor</label>
                            <input
                                required
                                type="text"
                                value={formData.merchant}
                                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                                placeholder="e.g. Uber, Hilton, Amazon"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Amount (THB) <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-sm font-medium text-slate-700 block mb-2">Receipt Upload (Optional)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept="image/*,.pdf"
                            />
                            {file ? (
                                <div className="flex flex-col items-center text-emerald-600">
                                    <Check className="w-8 h-8 mb-2" />
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="font-medium text-slate-600">Drop your receipt here, or browse</p>
                                    <p className="text-xs mt-1">Supports JPG, PNG, PDF</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href="/expenses"
                            className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Submit Claim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
