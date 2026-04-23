export interface Payment {
    id: number;
    tenantId: number;
    customerId: number;
    totalAmount: number;
    paymentMethod: string;
    isPayed: boolean;
    payedDate?: Date;
    payedAmount: number;
    address: string;
    notes: string;
    assignedUserId?: number;
    assignedUserName?: string;
    createdUserId: number;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
}



export interface OutgoingInvoice {
    id: number;
    tenantId: number;
    customerId: number;
    invoiceNo: string;
    referenceId: number;
    tckn: string;
    taxNumber: string;
    taxOffice: string;
    officialFirmName: string;
    paymentMethod: string;
    status: string;
    discount: number;
    taxTotal: number;
    subTotal: number;
    totalAmount: number;
    detail: string;
    date: Date;
    createdUserId: number;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
}

export interface ServiceRequest {
    id: number;
    tenantId: number;
    customerId: number;
    status: string;
    requestType: string;
    assignedEmployee: string;
    scheduledDate?: Date;
    completedDate?: Date;
    notes: string;
    createdUserId: number;
    createdAt: Date;
    updatedAt?: Date;
    isDeleted: boolean;
}
