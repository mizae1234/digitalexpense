'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    PurchaseRequest, Expense, Vendor, RFQ, GoodsReceipt, PurchaseOrder,
    PRStatus, ExpenseStatus
} from './mock-data';

interface DemoContextType {
    // Data
    purchaseRequests: PurchaseRequest[];
    expenses: Expense[];
    vendors: Vendor[];
    rfqs: RFQ[];
    grs: GoodsReceipt[];
    purchaseOrders: PurchaseOrder[];

    // Actions
    addPR: (data: any) => Promise<void>;
    addExpense: (data: any) => Promise<void>;
    updatePRStatus: (id: string, newStatus: PRStatus, role: string) => void;
    updateExpenseStatus: (id: string, newStatus: ExpenseStatus, role: string) => void;

    // Vendor actions
    addVendor: (data: any) => Promise<void>;
    updateVendor: (id: string, data: Partial<Vendor>) => void;

    // RFQ actions
    addRFQ: (data: any) => Promise<void>;
    updateRFQ: (id: string, data: Partial<RFQ>) => void;

    // GR actions
    createGR: (prId: string, data: any) => Promise<void>;

    // PO actions
    createPO: (rfqId: string, data: any) => Promise<PurchaseOrder>;
    updatePO: (id: string, data: Partial<PurchaseOrder>) => void;

    // User context
    currentUserRole: string;
    setCurrentUserRole: (role: string) => void;

    // Refetch
    refetch: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [grs, setGrs] = useState<GoodsReceipt[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState('MANAGER');

    const fetchData = async () => {
        try {
            const [prRes, expRes, vendorRes, rfqRes, poRes] = await Promise.all([
                fetch('/api/purchase-requests'),
                fetch('/api/expenses'),
                fetch('/api/vendors'),
                fetch('/api/rfqs'),
                fetch('/api/purchase-orders')
            ]);
            setPurchaseRequests(await prRes.json());
            setExpenses(await expRes.json());
            setVendors(await vendorRes.json());
            setRfqs(await rfqRes.json());
            setPurchaseOrders(await poRes.json());
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // PR Actions
    const addPR = async (prData: any) => {
        const res = await fetch('/api/purchase-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prData),
        });
        const newPr = await res.json();
        setPurchaseRequests(prev => [newPr, ...prev]);
    };

    const updatePRStatus = (id: string, newStatus: PRStatus, role: string) => {
        setPurchaseRequests(prev => prev.map(pr => {
            if (pr.id !== id) return pr;

            const updatedApprovals = pr.approvals.map(a => {
                const roleMap: Record<string, string> = {
                    'MANAGER': 'หัวหน้า',
                    'AUTHORIZED': 'ผู้มีอำนาจ',
                    'PURCHASING': 'จัดซื้อ',
                    'FINANCE': 'การเงิน'
                };
                if (a.role === roleMap[role]) {
                    return {
                        ...a,
                        status: newStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED',
                        date: new Date().toISOString().split('T')[0],
                        approverName: 'Current User'
                    };
                }
                return a;
            });

            return { ...pr, status: newStatus, approvals: updatedApprovals as any };
        }));
    };

    // Expense Actions
    const addExpense = async (expData: any) => {
        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expData),
        });
        const newExp = await res.json();
        setExpenses(prev => [newExp, ...prev]);
    };

    const updateExpenseStatus = (id: string, newStatus: ExpenseStatus, role: string) => {
        setExpenses(prev => prev.map(exp => {
            if (exp.id !== id) return exp;

            const updatedApprovals = exp.approvals.map(a => {
                const roleMap: Record<string, string> = {
                    'MANAGER': 'หัวหน้า',
                    'AUTHORIZED': 'ผู้มีอำนาจ',
                    'FINANCE': 'การเงิน'
                };
                if (a.role === roleMap[role]) {
                    return {
                        ...a,
                        status: newStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED',
                        date: new Date().toISOString().split('T')[0],
                        approverName: 'Current User'
                    };
                }
                return a;
            });

            return { ...exp, status: newStatus, approvals: updatedApprovals as any };
        }));
    };

    // Vendor Actions
    const addVendor = async (vendorData: any) => {
        const res = await fetch('/api/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorData),
        });
        const newVendor = await res.json();
        setVendors(prev => [newVendor, ...prev]);
    };

    const updateVendor = (id: string, data: Partial<Vendor>) => {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    };

    // RFQ Actions
    const addRFQ = async (rfqData: any) => {
        const res = await fetch('/api/rfqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rfqData),
        });
        const newRfq = await res.json();
        setRfqs(prev => [newRfq, ...prev]);
    };

    const updateRFQ = (id: string, data: Partial<RFQ>) => {
        setRfqs(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    // GR Actions
    const createGR = async (prId: string, grData: any) => {
        const res = await fetch('/api/goods-receipts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prId, ...grData }),
        });
        const newGr = await res.json();
        setGrs(prev => [newGr, ...prev]);
        // Update PR status
        updatePRStatus(prId, 'PENDING_FINANCE', 'PURCHASING');
    };

    // PO Actions
    const createPO = async (rfqId: string, poData: any): Promise<PurchaseOrder> => {
        const res = await fetch('/api/purchase-orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rfqId, ...poData }),
        });
        const newPo = await res.json();
        setPurchaseOrders(prev => [newPo, ...prev]);
        // Update PR with PO number
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq) {
            setPurchaseRequests(prev => prev.map(pr =>
                pr.id === rfq.prId ? { ...pr, poNumber: newPo.id } : pr
            ));
        }
        return newPo;
    };

    const updatePO = (id: string, data: Partial<PurchaseOrder>) => {
        setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, ...data } : po));
    };

    return (
        <DemoContext.Provider value={{
            purchaseRequests,
            expenses,
            vendors,
            rfqs,
            grs,
            purchaseOrders,
            addPR,
            addExpense,
            updatePRStatus,
            updateExpenseStatus,
            addVendor,
            updateVendor,
            addRFQ,
            updateRFQ,
            createGR,
            createPO,
            updatePO,
            currentUserRole,
            setCurrentUserRole,
            refetch: fetchData
        }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
