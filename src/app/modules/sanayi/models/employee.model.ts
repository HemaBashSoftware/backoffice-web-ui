export interface ActiveTask {
    plate: string;   // araç plakası
    job: string;     // görev adı
}

export interface Employee {
    id: number;
    tenantId?: number;
    fullName: string;
    phone: string;
    emailAddress: string;
    role: string;
    status: string;       // "Aktif" | "Pasif"
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    activeTasks?: ActiveTask[];  // EmployeeListDto'dan gelen join verisi
}

export const EMPLOYEE_STATUS_OPTIONS = ['Aktif', 'İzinli', 'Pasif'];
export const EMPLOYEE_ROLE_OPTIONS   = ['Usta', 'Çırak', 'Yönetici', 'Muhasebe', 'Diğer'];
