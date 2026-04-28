'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/lib/demo-context';
import { Bell, Search, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
    REQUESTER: 'ผู้ขอซื้อ',
    MANAGER: 'หัวหน้า',
    AUTHORIZED: 'ผู้มีอำนาจอนุมัติ',
    PURCHASING: 'ฝ่ายจัดซื้อ',
    FINANCE: 'ฝ่ายการเงิน',
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export function TopBar() {
    const router = useRouter();
    const { currentUser } = useDemo();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    async function handleLogout() {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
            router.push('/login');
            router.refresh();
        }
    }

    const roleLabel = ROLE_LABELS[currentUser.role] ?? currentUser.role;

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
            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {getInitials(currentUser.name)}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium text-slate-900 leading-tight">{currentUser.name}</div>
                            <div className="text-xs text-slate-500 leading-tight">{roleLabel}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="text-sm font-medium text-slate-900">{currentUser.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{currentUser.email}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{roleLabel} · {currentUser.department}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            >
                                <LogOut className="w-4 h-4" />
                                {loggingOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
