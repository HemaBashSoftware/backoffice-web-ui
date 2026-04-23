// Create Commands

// Sipariş Oluşturma (CreatePaymentCommand)
export interface CreatePaymentCommand {
    customerId: number;
    address: string;
    notes: string;
    totalAmount: number;

    // Payment Info
    isPayed: boolean;
    payedAmount: number;
    paymentMethod: string;
    payedDate?: Date;

    paymentItems: PaymentItemDto[];
}

export interface PaymentItemDto {
    productId: number;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
    notes: string;
}

// Tahsilat/Ödeme Geçmişi (PaymentPayHistory)
export interface CreatePaymentPayHistoryCommand {
    paymentId?: number; // Opsiyonel, direkt cariye ödeme ise null olabilir
    customerId: number;
    amount: number;
    date: Date;
    paymentMethod: string; // Havale, Nakit vs.
    notes: string;
    direction: 'IN' | 'OUT'; // Para girişi mi çıkışı mı
}
export interface CreateOutgoingInvoiceCommand {
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
}

export interface CreateServiceRequestCommand {
    customerId: number;
    status: string;
    requestType: string;
    assignedEmployee: string;
    scheduledDate?: Date;
    notes: string;
}

export interface CreateOutgoingInvoiceCommand {
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
}

export interface CreateServiceRequestCommand {
    customerId: number;
    status: string;
    requestType: string;
    assignedEmployee: string;
    scheduledDate?: Date;
    notes: string;
}
