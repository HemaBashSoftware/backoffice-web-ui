export enum CustomerRecordStatus {
    ACTIVE = 1,
    PASSIVE = 2,
    UNPAID = 3,
    WAITING_RENEWAL = 4,
    SUSPENDED = 5
}

export const CustomerRecordStatusLabel: Record<number, string> = {
    [CustomerRecordStatus.ACTIVE]: 'Aktif',
    [CustomerRecordStatus.PASSIVE]: 'Pasif',
    [CustomerRecordStatus.UNPAID]: 'Ödenmemiş',
    [CustomerRecordStatus.WAITING_RENEWAL]: 'Belge Yenileme Bekliyor',
    [CustomerRecordStatus.SUSPENDED]: 'Askıya Alındı'
};

export const CustomerRecordStatusSeverity: Record<number, string> = {
    [CustomerRecordStatus.ACTIVE]: 'success',
    [CustomerRecordStatus.PASSIVE]: 'danger',
    [CustomerRecordStatus.UNPAID]: 'danger',
    [CustomerRecordStatus.WAITING_RENEWAL]: 'warn',
    [CustomerRecordStatus.SUSPENDED]: 'contrast'
};

export class TenantModel {
    id: number = 0;
    companyName: string = '';
    phoneNumber: string = '';
    email: string = '';
    taxNo: string = '';
    taxOffice: string = '';
    address: string = '';
    notes: string = '';
    logo?: string;
    recordStatus: number = CustomerRecordStatus.ACTIVE;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
