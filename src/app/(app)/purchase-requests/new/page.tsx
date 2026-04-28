'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import Link from 'next/link';

export default function NewPurchaseRequestPage() {
    const router = useRouter();
    const { addPR, currentUserRole } = useDemo();

    const [formData, setFormData] = useState({
        title: '',
        department: 'IT',
        description: '',
        requesterName: 'Demo Requester',
        requesterId: 'u1'
    });

    const [items, setItems] = useState([
        { id: 1, description: '', quantity: 1, unitPrice: 0 }
    ]);

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const handleItemChange = (id: number, field: string, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const prData = {
            ...formData,
            totalAmount,
            items: items.map(i => ({ ...i, total: i.quantity * i.unitPrice }))
        };
        await addPR(prData);
        router.push('/purchase-requests');
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/purchase-requests"
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">New Purchase Request</h1>
                    <p className="text-slate-500">Create a new request for goods or services.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">General Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Request Title <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Q1 Office Supplies"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="IT">IT Department</option>
                                <option value="HR">Human Resources</option>
                                <option value="Sales">Sales & Marketing</option>
                                <option value="Ops">Operations</option>
                            </select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description / Justification</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Explain the need for this purchase..."
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">Line Items</h2>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className="pt-2 text-slate-400 text-sm w-6">{index + 1}.</div>
                                <div className="flex-1 space-y-1">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Item description"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="w-24 space-y-1">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="w-32 space-y-1">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Unit Price"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="w-32 pt-2 text-right font-medium text-slate-900">
                                    ฿{(item.quantity * item.unitPrice).toLocaleString()}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-4">
                        <span className="text-slate-600 font-medium">Total Amount</span>
                        <span className="text-xl font-bold text-primary">฿{totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/purchase-requests"
                        className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
}
