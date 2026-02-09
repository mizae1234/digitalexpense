import {
    PurchaseRequest, Expense, Vendor, RFQ, GoodsReceipt,
    MOCK_PRS, MOCK_EXPENSES, MOCK_VENDORS, MOCK_RFQS, MOCK_GRS
} from './mock-data';

// In-memory stores
let serverPrs = [...MOCK_PRS];
let serverExpenses = [...MOCK_EXPENSES];
let serverVendors = [...MOCK_VENDORS];
let serverRfqs = [...MOCK_RFQS];
let serverGrs = [...MOCK_GRS];

// ID generators
const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const db = {
    prs: {
        getAll: () => serverPrs,
        getById: (id: string) => serverPrs.find(p => p.id === id),
        create: (pr: Omit<PurchaseRequest, 'id' | 'status' | 'approvals'>) => {
            const newPr: PurchaseRequest = {
                ...pr,
                id: `PR-2024-${String(serverPrs.length + 1).padStart(3, '0')}`,
                status: 'PENDING_MANAGER',
                approvals: [
                    { role: 'หัวหน้า', status: 'PENDING' },
                    { role: 'ผู้มีอำนาจ', status: 'PENDING' },
                    { role: 'จัดซื้อ', status: 'PENDING' },
                    { role: 'การเงิน', status: 'PENDING' },
                ]
            };
            serverPrs = [newPr, ...serverPrs];
            return newPr;
        },
        update: (id: string, updates: Partial<PurchaseRequest>) => {
            serverPrs = serverPrs.map(p => p.id === id ? { ...p, ...updates } : p);
            return serverPrs.find(p => p.id === id);
        }
    },

    expenses: {
        getAll: () => serverExpenses,
        getById: (id: string) => serverExpenses.find(e => e.id === id),
        create: (exp: Omit<Expense, 'id' | 'status' | 'approvals'>) => {
            const newExp: Expense = {
                ...exp,
                id: `EXP-2024-${String(serverExpenses.length + 1).padStart(3, '0')}`,
                status: 'PENDING_MANAGER',
                approvals: [
                    { role: 'หัวหน้า', status: 'PENDING' },
                    { role: 'ผู้มีอำนาจ', status: 'PENDING' },
                    { role: 'การเงิน', status: 'PENDING' },
                ]
            };
            serverExpenses = [newExp, ...serverExpenses];
            return newExp;
        },
        update: (id: string, updates: Partial<Expense>) => {
            serverExpenses = serverExpenses.map(e => e.id === id ? { ...e, ...updates } : e);
            return serverExpenses.find(e => e.id === id);
        }
    },

    vendors: {
        getAll: () => serverVendors,
        getById: (id: string) => serverVendors.find(v => v.id === id),
        create: (vendor: Omit<Vendor, 'id'>) => {
            const newVendor: Vendor = {
                ...vendor,
                id: genId('v'),
            };
            serverVendors = [newVendor, ...serverVendors];
            return newVendor;
        },
        update: (id: string, updates: Partial<Vendor>) => {
            serverVendors = serverVendors.map(v => v.id === id ? { ...v, ...updates } : v);
            return serverVendors.find(v => v.id === id);
        },
        delete: (id: string) => {
            serverVendors = serverVendors.filter(v => v.id !== id);
        }
    },

    rfqs: {
        getAll: () => serverRfqs,
        getById: (id: string) => serverRfqs.find(r => r.id === id),
        getByPrId: (prId: string) => serverRfqs.find(r => r.prId === prId),
        create: (rfq: Omit<RFQ, 'id' | 'status' | 'quotations'>) => {
            const newRfq: RFQ = {
                ...rfq,
                id: `RFQ-2024-${String(serverRfqs.length + 1).padStart(3, '0')}`,
                status: 'OPEN',
                quotations: []
            };
            serverRfqs = [newRfq, ...serverRfqs];
            return newRfq;
        },
        update: (id: string, updates: Partial<RFQ>) => {
            serverRfqs = serverRfqs.map(r => r.id === id ? { ...r, ...updates } : r);
            return serverRfqs.find(r => r.id === id);
        }
    },

    grs: {
        getAll: () => serverGrs,
        getById: (id: string) => serverGrs.find(g => g.id === id),
        getByPrId: (prId: string) => serverGrs.find(g => g.prId === prId),
        create: (gr: Omit<GoodsReceipt, 'id'>) => {
            const newGr: GoodsReceipt = {
                ...gr,
                id: `GR-2024-${String(serverGrs.length + 1).padStart(3, '0')}`,
            };
            serverGrs = [newGr, ...serverGrs];
            return newGr;
        },
        update: (id: string, updates: Partial<GoodsReceipt>) => {
            serverGrs = serverGrs.map(g => g.id === id ? { ...g, ...updates } : g);
            return serverGrs.find(g => g.id === id);
        }
    }
};
