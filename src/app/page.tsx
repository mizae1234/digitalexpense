'use client';

import { useDemo } from '@/lib/demo-context';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  FileText,
  Receipt,
  ArrowRight,
  AlertCircle,
  ShoppingCart,
  Package
} from 'lucide-react';

export default function DashboardPage() {
  const { purchaseRequests, expenses, currentUserRole } = useDemo();

  // Calculate stats
  const pendingPRs = purchaseRequests.filter(pr => !['COMPLETED', 'REJECTED'].includes(pr.status)).length;
  const pendingExpenses = expenses.filter(e => !['COMPLETED', 'REJECTED'].includes(e.status)).length;
  const purchasingQueue = purchaseRequests.filter(pr => pr.status === 'PURCHASING').length;
  const pendingGR = purchaseRequests.filter(pr => pr.status === 'PENDING_GR').length;

  // My Pendings (based on role)
  const myPendingTasks = purchaseRequests.filter(pr => {
    if (currentUserRole === 'MANAGER' && pr.status === 'PENDING_MANAGER') return true;
    if (currentUserRole === 'AUTHORIZED' && pr.status === 'PENDING_AUTHORIZED') return true;
    if (currentUserRole === 'PURCHASING' && pr.status === 'PURCHASING') return true;
    if (currentUserRole === 'FINANCE' && pr.status === 'PENDING_FINANCE') return true;
    return false;
  }).length + expenses.filter(e => {
    if (currentUserRole === 'MANAGER' && e.status === 'PENDING_MANAGER') return true;
    if (currentUserRole === 'AUTHORIZED' && e.status === 'PENDING_AUTHORIZED') return true;
    if (currentUserRole === 'FINANCE' && e.status === 'PENDING_FINANCE') return true;
    return false;
  }).length;

  const totalSpend = purchaseRequests.filter(pr => pr.status === 'COMPLETED').reduce((sum, pr) => sum + pr.totalAmount, 0) +
    expenses.filter(e => e.status === 'COMPLETED').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">ยินดีต้อนรับ, <span className="text-primary font-medium">{currentUserRole}</span></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">รอดำเนินการ</p>
              <h3 className="text-2xl font-bold text-slate-900">{myPendingTasks}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">ยอดใช้จ่ายเดือนนี้</p>
              <h3 className="text-2xl font-bold text-slate-900">฿{totalSpend.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">คิวจัดซื้อ</p>
              <h3 className="text-2xl font-bold text-slate-900">{purchasingQueue}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">รอรับสินค้า</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingGR}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">ใบขอซื้อล่าสุด</h3>
            <Link href="/purchase-requests" className="text-sm text-primary hover:text-primary/80 font-medium">ดูทั้งหมด</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {purchaseRequests.slice(0, 5).map(pr => (
              <Link key={pr.id} href={`/purchase-requests/${pr.id}`} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{pr.title}</p>
                    <p className="text-xs text-slate-500">{pr.requesterName} • {pr.requestDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">฿{pr.totalAmount.toLocaleString()}</p>
                  <span className="text-xs text-slate-500">{pr.status.replace(/_/g, ' ')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">สร้างรายการใหม่</h3>
            <p className="text-primary-foreground/90 text-sm mb-6">สร้างใบขอซื้อหรือเบิกค่าใช้จ่าย</p>

            <div className="space-y-3">
              <Link href="/purchase-requests/new" className="block w-full text-center py-2 bg-white text-primary font-medium rounded-lg hover:bg-slate-50 transition-colors">
                สร้างใบขอซื้อ
              </Link>
              <Link href="/expenses/new" className="block w-full text-center py-2 bg-primary-foreground/10 text-white font-medium rounded-lg hover:bg-primary-foreground/20 transition-colors border border-white/20">
                เบิกค่าใช้จ่าย
              </Link>
            </div>
          </div>

          {myPendingTasks > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-900">รอการดำเนินการ</h3>
                  <p className="text-sm text-amber-800 mt-1">คุณมี {myPendingTasks} รายการที่รอดำเนินการ</p>
                  <Link href="/approvals" className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 mt-3 hover:text-amber-900">
                    ไปที่หน้าอนุมัติ <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
