'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Receipt,
    CheckSquare,
    PieChart,
    ShoppingCart,
    FileSearch,
    Users,
    Calculator,
    FileCheck
} from 'lucide-react';

const menuGroups = [
    {
        label: 'หลัก',
        items: [
            { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        ]
    },
    {
        label: 'ผู้ใช้งาน',
        items: [
            { href: '/purchase-requests', label: 'ใบขอซื้อ (PR)', icon: FileText },
            { href: '/expenses', label: 'เบิกค่าใช้จ่าย', icon: Receipt },
            { href: '/approvals', label: 'รออนุมัติ', icon: CheckSquare },
        ]
    },
    {
        label: 'จัดซื้อ',
        items: [
            { href: '/purchasing', label: 'คิวจัดซื้อ', icon: ShoppingCart },
            { href: '/purchasing/rfq', label: 'RFQ / เทียบราคา', icon: FileSearch },
            { href: '/purchasing/po', label: 'Purchase Orders', icon: FileCheck },
            { href: '/purchasing/vendors', label: 'ข้อมูล Vendor', icon: Users },
        ]
    },
    {
        label: 'บัญชี / การเงิน',
        items: [
            { href: '/finance', label: 'Finance Review', icon: PieChart },
            { href: '/accounting', label: 'Accounting Interface', icon: Calculator },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 flex flex-col z-10">
            <div className="h-16 flex items-center px-6 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        E
                    </div>
                    <span className="font-semibold text-lg text-slate-800">Expense Sys</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {group.label}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Demo Mode</p>
                    <p className="text-sm font-medium text-slate-700">สมชาย ผู้ขอซื้อ</p>
                </div>
            </div>
        </aside>
    );
}
