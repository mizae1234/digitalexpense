// ==================== STATUS ENUMS ====================

export type PRStatus =
    | 'DRAFT'
    | 'PENDING_MANAGER'
    | 'PENDING_AUTHORIZED'
    | 'PURCHASING'
    | 'PENDING_GR'
    | 'PENDING_FINANCE'
    | 'COMPLETED'
    | 'REJECTED';

export type ExpenseStatus =
    | 'DRAFT'
    | 'PENDING_MANAGER'
    | 'PENDING_AUTHORIZED'
    | 'PENDING_FINANCE'
    | 'COMPLETED'
    | 'REJECTED';

export type RFQStatus = 'OPEN' | 'EVALUATING' | 'AWARDED' | 'CANCELLED';

// ==================== CORE TYPES ====================

export interface User {
    id: string;
    name: string;
    role: 'REQUESTER' | 'MANAGER' | 'AUTHORIZED' | 'PURCHASING' | 'FINANCE';
    department: string;
    avatar: string;
}

export interface Vendor {
    id: string;
    code: string;
    name: string;
    contact: string;
    taxId: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface PRItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface ApprovalStep {
    role: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date?: string;
    approverName?: string;
    comment?: string;
}

export interface PurchaseRequest {
    id: string;
    requestDate: string;
    requesterId: string;
    requesterName: string;
    department: string;
    title: string;
    totalAmount: number;
    status: PRStatus;
    description: string;
    items: PRItem[];
    approvals: ApprovalStep[];
    rfqId?: string;
    poNumber?: string;
    grId?: string;
}

export interface Quotation {
    vendorId: string;
    vendorName: string;
    itemPrices: { itemId: string; price: number }[];
    totalPrice: number;
    notes?: string;
    submittedDate: string;
}

export interface RFQ {
    id: string;
    prId: string;
    prTitle: string;
    createdDate: string;
    dueDate: string;
    items: PRItem[];
    invitedVendors: string[]; // Vendor IDs
    quotations: Quotation[];
    selectedVendorId?: string;
    status: RFQStatus;
}

export interface GoodsReceipt {
    id: string;
    prId: string;
    receivedDate: string;
    receivedBy: string;
    items: { itemId: string; receivedQty: number; notes?: string }[];
    status: 'PENDING' | 'PARTIAL' | 'COMPLETE';
}

export type POStatus = 'DRAFT' | 'ISSUED' | 'DELIVERED' | 'CANCELLED';

export interface PurchaseOrder {
    id: string;           // PO-YYYY-XXX
    rfqId: string;        // อ้างอิง RFQ
    prId: string;         // อ้างอิง PR
    vendorId: string;     // Vendor ที่เลือก
    vendorName: string;
    createdDate: string;
    deliveryDate?: string;
    items: PRItem[];      // รายการสินค้า
    totalAmount: number;
    status: POStatus;
    notes?: string;
}

export interface Expense {
    id: string;
    date: string;
    requesterId: string;
    requesterName: string;
    category: 'TRAVEL' | 'TRAINING' | 'LABOR' | 'MEALS' | 'OTHER';
    amount: number;
    description: string;
    status: ExpenseStatus;
    merchant?: string;
    receiptUrl?: string;
    approvals: ApprovalStep[];
}

// ==================== MOCK DATA ====================

export const USERS: User[] = [
    { id: 'u1', name: 'สมชาย ผู้ขอซื้อ', role: 'REQUESTER', department: 'IT', avatar: 'https://i.pravatar.cc/150?u=u1' },
    { id: 'u2', name: 'สมหญิง หัวหน้า', role: 'MANAGER', department: 'IT', avatar: 'https://i.pravatar.cc/150?u=u2' },
    { id: 'u3', name: 'วิชัย ผู้อำนวยการ', role: 'AUTHORIZED', department: 'Management', avatar: 'https://i.pravatar.cc/150?u=u3' },
    { id: 'u4', name: 'พิมพ์ใจ ฝ่ายจัดซื้อ', role: 'PURCHASING', department: 'Purchasing', avatar: 'https://i.pravatar.cc/150?u=u4' },
    { id: 'u5', name: 'มานี ฝ่ายการเงิน', role: 'FINANCE', department: 'Finance', avatar: 'https://i.pravatar.cc/150?u=u5' },
];

export const MOCK_VENDORS: Vendor[] = [
    { id: 'v1', code: 'VND-001', name: 'บริษัท คอมพิวเตอร์ จำกัด', contact: 'คุณสมศักดิ์', taxId: '0105560012345', email: 'sales@computer.co.th', status: 'ACTIVE' },
    { id: 'v2', code: 'VND-002', name: 'ห้างหุ้นส่วน ออฟฟิศซัพพลาย', contact: 'คุณวิไล', taxId: '0105560023456', email: 'contact@officesupply.co.th', status: 'ACTIVE' },
    { id: 'v3', code: 'VND-003', name: 'บริษัท เฟอร์นิเจอร์โปร จำกัด', contact: 'คุณประสิทธิ์', taxId: '0105560034567', email: 'info@furniturepro.co.th', status: 'ACTIVE' },
];

export const MOCK_PRS: PurchaseRequest[] = [
    {
        id: 'PR-2024-001',
        requestDate: '2024-02-15',
        requesterId: 'u1',
        requesterName: 'สมชาย ผู้ขอซื้อ',
        department: 'IT',
        title: 'Laptop สำหรับพนักงานใหม่',
        totalAmount: 45000,
        status: 'PENDING_MANAGER',
        description: 'Laptop สำหรับ Developer ใหม่ ต้องการ spec สูงสำหรับงาน development',
        items: [
            { id: 'i1', description: 'MacBook Pro M3', quantity: 1, unitPrice: 42000, total: 42000 },
            { id: 'i2', description: 'Magic Mouse', quantity: 1, unitPrice: 3000, total: 3000 },
        ],
        approvals: [
            { role: 'หัวหน้า', status: 'PENDING' },
            { role: 'ผู้มีอำนาจ', status: 'PENDING' },
            { role: 'จัดซื้อ', status: 'PENDING' },
            { role: 'การเงิน', status: 'PENDING' },
        ]
    },
    {
        id: 'PR-2024-002',
        requestDate: '2024-02-10',
        requesterId: 'u1',
        requesterName: 'สมชาย ผู้ขอซื้อ',
        department: 'IT',
        title: 'เครื่องเขียนสำนักงาน',
        totalAmount: 2500,
        status: 'PURCHASING',
        description: 'เครื่องเขียนประจำเดือน',
        items: [
            { id: 'i3', description: 'กระดาษ A4', quantity: 5, unitPrice: 120, total: 600 },
            { id: 'i4', description: 'ปากกาและไฮไลท์', quantity: 10, unitPrice: 190, total: 1900 },
        ],
        approvals: [
            { role: 'หัวหน้า', status: 'APPROVED', date: '2024-02-11', approverName: 'สมหญิง หัวหน้า' },
            { role: 'ผู้มีอำนาจ', status: 'APPROVED', date: '2024-02-12', approverName: 'วิชัย ผู้อำนวยการ' },
            { role: 'จัดซื้อ', status: 'PENDING' },
            { role: 'การเงิน', status: 'PENDING' },
        ],
        rfqId: 'RFQ-2024-001'
    },
    {
        id: 'PR-2024-003',
        requestDate: '2024-02-05',
        requesterId: 'u1',
        requesterName: 'สมชาย ผู้ขอซื้อ',
        department: 'IT',
        title: 'เก้าอี้สำนักงาน',
        totalAmount: 15000,
        status: 'PENDING_GR',
        description: 'เก้าอี้ ergonomic สำหรับทีม',
        items: [
            { id: 'i5', description: 'เก้าอี้ Ergonomic', quantity: 3, unitPrice: 5000, total: 15000 },
        ],
        approvals: [
            { role: 'หัวหน้า', status: 'APPROVED', date: '2024-02-06', approverName: 'สมหญิง หัวหน้า' },
            { role: 'ผู้มีอำนาจ', status: 'APPROVED', date: '2024-02-07', approverName: 'วิชัย ผู้อำนวยการ' },
            { role: 'จัดซื้อ', status: 'APPROVED', date: '2024-02-08', approverName: 'พิมพ์ใจ ฝ่ายจัดซื้อ' },
            { role: 'การเงิน', status: 'PENDING' },
        ],
        poNumber: 'PO-2024-003'
    }
];

export const MOCK_RFQS: RFQ[] = [
    {
        id: 'RFQ-2024-001',
        prId: 'PR-2024-002',
        prTitle: 'เครื่องเขียนสำนักงาน',
        createdDate: '2024-02-12',
        dueDate: '2024-02-15',
        items: [
            { id: 'i3', description: 'กระดาษ A4', quantity: 5, unitPrice: 120, total: 600 },
            { id: 'i4', description: 'ปากกาและไฮไลท์', quantity: 10, unitPrice: 190, total: 1900 },
        ],
        invitedVendors: ['v1', 'v2'],
        quotations: [
            { vendorId: 'v1', vendorName: 'บริษัท คอมพิวเตอร์ จำกัด', itemPrices: [{ itemId: 'i3', price: 110 }, { itemId: 'i4', price: 180 }], totalPrice: 2350, submittedDate: '2024-02-14' },
            { vendorId: 'v2', vendorName: 'ห้างหุ้นส่วน ออฟฟิศซัพพลาย', itemPrices: [{ itemId: 'i3', price: 100 }, { itemId: 'i4', price: 170 }], totalPrice: 2200, submittedDate: '2024-02-13' },
        ],
        status: 'EVALUATING'
    }
];

export const MOCK_GRS: GoodsReceipt[] = [];

export const MOCK_POS: PurchaseOrder[] = [
    {
        id: 'PO-2024-001',
        rfqId: 'RFQ-2024-001',
        prId: 'PR-2024-003',
        vendorId: 'v3',
        vendorName: 'บริษัท เฟอร์นิเจอร์โปร จำกัด',
        createdDate: '2024-02-08',
        deliveryDate: '2024-02-15',
        items: [
            { id: 'i5', description: 'เก้าอี้ Ergonomic', quantity: 3, unitPrice: 5000, total: 15000 },
        ],
        totalAmount: 15000,
        status: 'ISSUED',
        notes: 'ส่งของที่อาคาร A ชั้น 3'
    }
];

export const MOCK_EXPENSES: Expense[] = [
    {
        id: 'EXP-2024-006',
        date: '2024-02-18',
        requesterId: 'u1',
        requesterName: 'สมชาย ผู้ขอซื้อ',
        category: 'TRAVEL',
        amount: 1200,
        description: 'ค่าแท็กซี่ไปพบลูกค้า',
        status: 'PENDING_MANAGER',
        merchant: 'Grab Taxi',
        approvals: [
            { role: 'หัวหน้า', status: 'PENDING' },
            { role: 'ผู้มีอำนาจ', status: 'PENDING' },
            { role: 'การเงิน', status: 'PENDING' },
        ]
    },
    {
        id: 'EXP-2024-005',
        date: '2024-02-10',
        requesterId: 'u1',
        requesterName: 'สมชาย ผู้ขอซื้อ',
        category: 'TRAINING',
        amount: 5000,
        description: 'คอร์สอบรม React Advanced',
        status: 'COMPLETED',
        merchant: 'Udemy',
        approvals: [
            { role: 'หัวหน้า', status: 'APPROVED', date: '2024-02-11', approverName: 'สมหญิง หัวหน้า' },
            { role: 'ผู้มีอำนาจ', status: 'APPROVED', date: '2024-02-12', approverName: 'วิชัย ผู้อำนวยการ' },
            { role: 'การเงิน', status: 'APPROVED', date: '2024-02-13', approverName: 'มานี ฝ่ายการเงิน' },
        ]
    }
];
