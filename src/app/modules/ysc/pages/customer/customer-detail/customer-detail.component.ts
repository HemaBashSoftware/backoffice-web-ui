import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';

import { YscCustomerService } from '../../../services/customer.service';
import { CustomerAddressService } from '../../../services/customer-address.service';
import { CustomerContactService } from '../../../services/customer-contact.service';
import { AddressLookupService } from '../../../services/address-lookup.service';
import {
    Customer, CustomerAddressDetail, CustomerContactDetail,
    CustomerRecordStatus, CustomerRecordStatusLabel, CustomerRecordStatusSeverity
} from '../../../models/customer.model';
import { Province, District, Neighbourhood } from '../../../models/address-lookup.model';

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        TableModule, ButtonModule, TagModule, TabsModule,
        DialogModule, InputTextModule, SelectModule, TextareaModule,
        InputNumberModule, ToastModule, ConfirmDialogModule,
    ],
    templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit {
    addrCols = [
        { field: 'label',       header: 'Etiket' },
        { field: 'fullAddress', header: 'Tam Adres' },
        { field: 'street',      header: 'Sokak' },
    ];

    contactCols = [
        { field: 'role',  header: 'Görevi' },
        { field: 'phone', header: 'Telefon' },
        { field: 'email', header: 'E-posta' },
        { field: 'notes', header: 'Notlar' },
    ];

    customer: Customer | null = null;
    addresses: CustomerAddressDetail[] = [];
    contacts: CustomerContactDetail[] = [];
    loading = false;

    // Status
    statusOptions: SelectItem[] = [];
    showStatusDialog = false;
    selectedStatus: CustomerRecordStatus = CustomerRecordStatus.ACTIVE;
    StatusLabel = CustomerRecordStatusLabel;
    StatusSeverity = CustomerRecordStatusSeverity;
    StatusEnum = CustomerRecordStatus;

    // Address dialog
    showAddrDialog = false;
    isEditAddr = false;
    addrForm!: FormGroup;
    provinces: Province[] = [];
    districts: District[] = [];
    neighbourhoods: Neighbourhood[] = [];

    // Contact dialog
    showContactDialog = false;
    isEditContact = false;
    contactForm!: FormGroup;

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private fb: FormBuilder,
        private customerService: YscCustomerService,
        private addressService: CustomerAddressService,
        private contactService: CustomerContactService,
        private lookupService: AddressLookupService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.buildForms();
        this.loadAll(id);
        this.lookupService.getProvinces().subscribe(p => this.provinces = p);
        this.statusOptions = Object.values(CustomerRecordStatus)
            .filter(v => typeof v === 'number')
            .map(v => ({ label: CustomerRecordStatusLabel[v as CustomerRecordStatus], value: v }));
    }

    loadAll(id: number) {
        this.loading = true;
        forkJoin({
            customer: this.customerService.getById(id),
            addresses: this.addressService.getByCustomer(id),
            contacts: this.contactService.getByCustomer(id),
        }).subscribe({
            next: ({ customer, addresses, contacts }) => {
                this.customer = customer;
                this.selectedStatus = customer.recordStatus;
                this.addresses = addresses;
                this.contacts = contacts;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Veriler yüklenemedi.' });
            }
        });
    }

    // ── Status ──────────────────────────────────────────────────────────────

    openStatusDialog() {
        this.selectedStatus = this.customer!.recordStatus;
        this.showStatusDialog = true;
    }

    saveStatus() {
        this.customerService.updateStatus(this.customer!, this.selectedStatus).subscribe({
            next: () => {
                this.customer!.recordStatus = this.selectedStatus;
                this.messageService.add({ severity: 'success', summary: 'Güncellendi', detail: 'Müşteri durumu güncellendi.' });
                this.showStatusDialog = false;
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Durum güncellenemedi.' })
        });
    }

    // ── Address ──────────────────────────────────────────────────────────────

    buildForms() {
        this.addrForm = this.fb.group({
            id: [0], customerId: [0],
            label: [''], provinceId: [null],
            districtId: [{ value: null, disabled: true }],
            neighbourhoodId: [{ value: null, disabled: true }],
            street: [''], buildingNo: [''], doorNo: [''],
            postalCode: [null], fullAddress: [''],
        });
        this.contactForm = this.fb.group({
            id: [0], customerId: [0],
            role: [''], name: [''], surname: [''],
            email: [''], phone: [''], notes: [''],
        });
    }

    openNewAddr() {
        this.isEditAddr = false;
        this.addrForm.reset({ id: 0, customerId: this.customer!.id });
        this.districts = []; this.neighbourhoods = [];
        this.addrForm.get('districtId')!.disable();
        this.addrForm.get('neighbourhoodId')!.disable();
        this.showAddrDialog = true;
    }

    openEditAddr(addr: CustomerAddressDetail) {
        this.isEditAddr = true;
        this.addrForm.patchValue({ ...addr });
        if (addr.provinceId) {
            this.onAddrProvinceChange(addr.provinceId, addr.districtId);
        }
        this.showAddrDialog = true;
    }

    onAddrProvinceChange(provinceId: number, patchDistrictId?: number) {
        this.districts = []; this.neighbourhoods = [];
        const dCtrl = this.addrForm.get('districtId')!;
        const nCtrl = this.addrForm.get('neighbourhoodId')!;
        dCtrl.setValue(null); nCtrl.setValue(null);
        dCtrl.disable(); nCtrl.disable();
        if (!provinceId) return;
        this.lookupService.getDistricts(provinceId).subscribe(d => {
            this.districts = d;
            dCtrl.enable();
            if (patchDistrictId) {
                dCtrl.setValue(patchDistrictId);
                this.lookupService.getNeighbourhoods(patchDistrictId).subscribe(n => {
                    this.neighbourhoods = n;
                    nCtrl.enable();
                    this.addrForm.patchValue({ neighbourhoodId: this.addrForm.value.neighbourhoodId });
                });
            }
        });
    }

    onAddrDistrictChange(districtId: number) {
        this.neighbourhoods = [];
        const nCtrl = this.addrForm.get('neighbourhoodId')!;
        nCtrl.setValue(null); nCtrl.disable();
        if (!districtId) return;
        this.lookupService.getNeighbourhoods(districtId).subscribe(n => {
            this.neighbourhoods = n;
            nCtrl.enable();
        });
    }

    saveAddr() {
        const val = this.addrForm.getRawValue();
        const req = this.isEditAddr ? this.addressService.update(val) : this.addressService.add(val);
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Kaydedildi' });
                this.showAddrDialog = false;
                this.addressService.getByCustomer(this.customer!.id).subscribe(d => this.addresses = d);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDeleteAddr(addr: CustomerAddressDetail) {
        this.confirmationService.confirm({
            message: 'Bu adres silinecek. Emin misiniz?',
            header: 'Silme Onayı', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil', rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.addressService.delete(addr.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Silindi' });
                    this.addresses = this.addresses.filter(a => a.id !== addr.id);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Silinemedi.' })
            })
        });
    }

    // ── Contact ──────────────────────────────────────────────────────────────

    openNewContact() {
        this.isEditContact = false;
        this.contactForm.reset({ id: 0, customerId: this.customer!.id });
        this.showContactDialog = true;
    }

    openEditContact(c: CustomerContactDetail) {
        this.isEditContact = true;
        this.contactForm.patchValue(c);
        this.showContactDialog = true;
    }

    saveContact() {
        const val = this.contactForm.value;
        const req = this.isEditContact ? this.contactService.update(val) : this.contactService.add(val);
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Kaydedildi' });
                this.showContactDialog = false;
                this.contactService.getByCustomer(this.customer!.id).subscribe(d => this.contacts = d);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDeleteContact(c: CustomerContactDetail) {
        this.confirmationService.confirm({
            message: 'Bu kişi silinecek. Emin misiniz?',
            header: 'Silme Onayı', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil', rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.contactService.delete(c.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Silindi' });
                    this.contacts = this.contacts.filter(x => x.id !== c.id);
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Silinemedi.' })
            })
        });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    getSeverity(status: CustomerRecordStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const map: Record<number, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
            1: 'success', 2: 'secondary', 3: 'danger', 4: 'warn', 5: 'contrast'
        };
        return map[status] ?? 'secondary';
    }

    getStatusLabel(status: CustomerRecordStatus): string {
        return CustomerRecordStatusLabel[status] ?? '-';
    }

    goBack() { this.router.navigate(['/ysc/customer']); }
}
