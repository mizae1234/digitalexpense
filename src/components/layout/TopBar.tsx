'use client';

import { useDemo } from '@/lib/demo-context';
import { Bell, Search, ChevronDown } from 'lucide-react';

export function TopBar() {
    const { currentUserRole, setCurrentUserRole } = useDemo();

    const roles = [
        { value: 'REQUESTER', label: 'ผู้ขอซื้อ' },
        { value: 'MANAGER', label: 'หัวหน้า' },
        { value: 'AUTHORIZED', label: 'ผู้มีอำนาจอนุมัติ' },
        { value: 'PURCHASING', label: 'ฝ่ายจัดซื้อ' },
        { value: 'FINANCE', label: 'ฝ่ายการเงิน' },
    ];

    return (
        <header className="h-16 bg-white border-b border-slate-200 fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6">
            {/* Search */}
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="ค้นหา..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Role Switcher */}
                <div className="relative">
                    <label className="text-xs text-slate-400 block mb-1">สลับบทบาท (Demo)</label>
                    <div className="relative">
                        <select
                            value={currentUserRole}
                            onChange={(e) => setCurrentUserRole(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                    </div>
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
