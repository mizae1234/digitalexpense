'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo-context';
import { Plus, Edit2, Trash2, Building2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VendorManagementPage() {
    const { vendors, addVendor, updateVendor } = useDemo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<any>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        contact: '',
        taxId: '',
        email: '',
        status: 'ACTIVE'
    });

    const handleOpenModal = (vendor?: any) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData(vendor);
        } else {
            setEditingVendor(null);
            setFormData({ code: '', name: '', contact: '', taxId: '', email: '', status: 'ACTIVE' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVendor) {
            updateVendor(editingVendor.id, formData);
        } else {
            await addVendor(formData);
        }
        setIsModalOpen(false);
        setEditingVendor(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ข้อมูล Vendor</h1>
                    <p className="text-slate-500">จัดการรายชื่อผู้ขาย / ผู้ให้บริการ</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่ม Vendor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {vendors.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ยังไม่มีข้อมูล Vendor</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-500">รหัส</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">ชื่อบริษัท</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">ผู้ติดต่อ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">เลขประจำตัวผู้เสียภาษี</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">อีเมล</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">สถานะ</th>
                                    <th className="px-6 py-3 font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {vendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{vendor.code}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Building2 className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <span className="font-medium text-slate-900">{vendor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{vendor.contact}</td>
                                        <td className="px-6 py-4 text-slate-600">{vendor.taxId}</td>
                                        <td className="px-6 py-4 text-slate-600">{vendor.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                vendor.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {vendor.status === 'ACTIVE' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleOpenModal(vendor)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingVendor ? 'แก้ไขข้อมูล Vendor' : 'เพิ่ม Vendor ใหม่'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">รหัส Vendor</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="VND-XXX"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">สถานะ</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="ACTIVE">ใช้งาน</option>
                                        <option value="INACTIVE">ไม่ใช้งาน</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">ชื่อบริษัท</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="บริษัท XXX จำกัด"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">ผู้ติดต่อ</label>
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">อีเมล</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">เลขประจำตัวผู้เสียภาษี</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                                >
                                    <Check className="w-4 h-4" />
                                    {editingVendor ? 'บันทึก' : 'เพิ่ม Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
