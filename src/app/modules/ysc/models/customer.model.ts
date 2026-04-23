export enum CustomerRecordStatus {
    ACTIVE = 1,
    PASIVE = 2,
    UNPAID = 3,
    RENEWAL_PENDING = 4,
    SUSPENDED = 5,
}

export const CustomerRecordStatusLabel: Record<CustomerRecordStatus, string> = {
    [CustomerRecordStatus.ACTIVE]:           'Aktif',
    [CustomerRecordStatus.PASIVE]:           'Pasif',
    [CustomerRecordStatus.UNPAID]:           'Ödenmemiş',
    [CustomerRecordStatus.RENEWAL_PENDING]:  'Belge Yenileme Bekliyor',
    [CustomerRecordStatus.SUSPENDED]:        'Askıya Alındı',
};

export const CustomerRecordStatusSeverity: Record<CustomerRecordStatus, string> = {
    [CustomerRecordStatus.ACTIVE]:           'success',
    [CustomerRecordStatus.PASIVE]:           'secondary',
    [CustomerRecordStatus.UNPAID]:           'danger',
    [CustomerRecordStatus.RENEWAL_PENDING]:  'warn',
    [CustomerRecordStatus.SUSPENDED]:        'contrast',
};

export class CustomerAddress {
    label: string = '';
    provinceId: number = 0;
    districtId: number = 0;
    neighbourhoodId: number = 0;
    street: string = '';
    buildingNo: string = '';
    doorNo: string = '';
    postalCode: number = 0;
    fullAddress: string = '';
}

export class CustomerContact {
    role: string = '';
    name: string = '';
    surname: string = '';
    email: string = '';
    phone: string = '';
    notes: string = '';
}

export class Customer {
    id: number = 0;
    name: string = '';
    taxNumber: number = 0;
    faxNumber: string = '';
    officialFirmName: string = '';
    ceCertificateNo: string = '';
    tsNo: string = '';
    tseNo: string = '';
    hybNo: string = '';
    dybNo: string = '';
    taxOffice: string = '';
    firmNo: string = '';
    firmOfficial: string = '';
    recordStatus: CustomerRecordStatus = CustomerRecordStatus.ACTIVE;
    tseCertificateExpireDate: string | null = null;
    hybCertificateExpireDate: string | null = null;
    customerAddress: CustomerAddress = new CustomerAddress();
    customerContact: CustomerContact = new CustomerContact();
}

// Detail sayfası için ayrı adres ve kişi modelleri
export class CustomerAddressDetail {
    id: number = 0;
    customerId: number = 0;
    label: string = '';
    provinceId: number = 0;
    districtId: number = 0;
    neighbourhoodId: number = 0;
    street: string = '';
    buildingNo: string = '';
    doorNo: string = '';
    postalCode: number = 0;
    fullAddress: string = '';
}

export class CustomerContactDetail {
    id: number = 0;
    customerId: number = 0;
    role: string = '';
    name: string = '';
    surname: string = '';
    email: string = '';
    phone: string = '';
    notes: string = '';
}
