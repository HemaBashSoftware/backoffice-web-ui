// Tenant modelini temsil eder — API'deki Tenants tablosuyla birebir eşleşir
export interface TenantJobModel {
    id: number;
    companyName: string;
    taxNo: string;
    phoneNumber: string;
    email: string;
    isDeleted: boolean;
    createdUserId?: number;
    lastUpdatedUserId?: number | null;
    deletedUserId?: number | null;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

// API'nin MaintenanceDto'suyla eşleşir — job-tracking-detail için
export interface MaintenanceJobDto {
    id: number;
    tenantId: number;
    vehicleId: number;
    customerId: number;
    vehicleKilometer: number;
    description: string;
    status: string;           // API değeri: "Bakımda", "Tamamlandı", "İptal" vs.
    totalLaborFee: number;
    totalProductFee: number;
    totalFee: number;
    discount: number;
    label: string;
    dateOpened: string;
    dateClosed?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    isDeleted: boolean;
    plate: string;            // JOIN: Vehicles.Plate
    fullName: string;         // JOIN: Customers.FullName
}

export interface MaintenanceOperation {
    id: number;
    maintenanceId: number;
    operationName: string;
    price: number;
}

export interface MaintenanceProduct {
    id: number;
    maintenanceId: number;
    productName: string;
    quantity: number;
    pricePerItem: number;
    productId: number;
}

export interface MaintenanceEmployeeEntry {
    id: number;
    employeeId: number;
    employeeName: string;
}

export interface MaintenanceDetailDto extends MaintenanceJobDto {
    products: MaintenanceProduct[];
    operations: MaintenanceOperation[];
    employees: MaintenanceEmployeeEntry[];
}

export interface CreateMaintenancePayload {
    vehicleId: number;
    customerId: number;
    vehicleKilometer: number;
    description: string;
    status: string;
    label: string;
    dateOpened: string;
}

export const MAINTENANCE_STATUS_OPTIONS = ['Bakımda', 'Tamamlandı', 'Beklemede', 'İptal'];
