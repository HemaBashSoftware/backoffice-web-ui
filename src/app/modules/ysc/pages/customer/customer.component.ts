import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { Router } from '@angular/router';
import { YscCustomerService } from '../../services/customer.service';
import { AddressLookupService } from '../../services/address-lookup.service';
import { Customer } from '../../models/customer.model';
import { Province } from '../../models/address-lookup.model';
import { District } from '../../models/address-lookup.model';
import { Neighbourhood } from '../../models/address-lookup.model';

@Component({
    selector: 'app-ysc-customer',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        TableModule, ButtonModule, ToolbarModule, DialogModule, InputTextModule,
        SelectModule, TextareaModule, ConfirmDialogModule, ToastModule,
        DatePickerModule, InputNumberModule,
        IconFieldModule, InputIconModule,
    ],
    templateUrl: './customer.component.html',
})
export class YscCustomerComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    cols = [
        { field: 'name',         header: 'Firma Adı' },
        { field: 'taxNumber',    header: 'Vergi No' },
        { field: 'taxOffice',    header: 'Vergi Dairesi' },
        { field: 'firmOfficial', header: 'Yetkili' },
    ];

    list: Customer[] = [];
    loading = false;
    showDialog = false;
    isEdit = false;

    form!: FormGroup;

    provinces: Province[] = [];
    districts: District[] = [];
    neighbourhoods: Neighbourhood[] = [];

    constructor(
        private router: Router,
        private service: YscCustomerService,
        private addressService: AddressLookupService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        this.buildForm();
        this.loadList();
        this.addressService.getProvinces().subscribe(data => this.provinces = data);
    }

    buildForm() {
        this.form = this.fb.group({
            id: [0],
            name: ['', Validators.required],
            taxNumber: [null, Validators.required],
            taxOffice: [''],
            faxNumber: [''],
            officialFirmName: [''],
            firmNo: [''],
            firmOfficial: [''],
            ceCertificateNo: [''],
            tsNo: [''],
            tseNo: [''],
            hybNo: [''],
            dybNo: [''],
            tseCertificateExpireDate: [null],
            hybCertificateExpireDate: [null],
            customerAddress: this.fb.group({
                label: [''],
                provinceId: [null],
                districtId: [{ value: null, disabled: true }],
                neighbourhoodId: [{ value: null, disabled: true }],
                street: [''],
                buildingNo: [''],
                doorNo: [''],
                postalCode: [null],
                fullAddress: [''],
            }),
            customerContact: this.fb.group({
                role: [''],
                name: [''],
                surname: [''],
                email: [''],
                phone: [''],
                notes: [''],
            }),
        });
    }

    loadList() {
        this.loading = true;
        this.service.getAll().subscribe({
            next: data => { this.list = data; this.loading = false; },
            error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Veriler yüklenemedi.' }); }
        });
    }

    openNew() {
        this.isEdit = false;
        this.form.reset({ id: 0 });
        this.districts = [];
        this.neighbourhoods = [];
        this.showDialog = true;
    }

    openEdit(customer: Customer) {
        this.isEdit = true;
        this.service.getById(customer.id).subscribe({
            next: data => {
                // Önce adres dışı alanları patch et
                this.form.patchValue({ ...data, customerAddress: null });
                const addr = data.customerAddress;
                if (addr?.provinceId) {
                    // Cascade: il → ilçe → mahalle; her adım bir önceki yüklenince patch yapar
                    this.onProvinceChange(addr.provinceId, addr.districtId ?? undefined);
                    // neighbourhoodId, onDistrictChange içinde districts yüklenince patch edilir
                    // Mahalle ayrıca beklemeli çünkü getNeighbourhoods async
                    if (addr.districtId) {
                        this.addressService.getNeighbourhoods(addr.districtId).subscribe(nhoods => {
                            this.neighbourhoods = nhoods;
                            this.form.get('customerAddress.neighbourhoodId')!.enable();
                            this.form.get('customerAddress.neighbourhoodId')!.setValue(addr.neighbourhoodId ?? null);
                        });
                    }
                    // Geri kalan adres alanlarını direkt patch et
                    this.form.get('customerAddress')!.patchValue({
                        label: addr.label,
                        street: addr.street,
                        buildingNo: addr.buildingNo,
                        doorNo: addr.doorNo,
                        postalCode: addr.postalCode,
                        fullAddress: addr.fullAddress,
                    });
                }
                this.showDialog = true;
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kayıt yüklenemedi.' })
        });
    }

    onProvinceChange(provinceId: number, patchDistrictId?: number) {
        this.districts = [];
        this.neighbourhoods = [];
        const districtCtrl = this.form.get('customerAddress.districtId')!;
        const neighbourCtrl = this.form.get('customerAddress.neighbourhoodId')!;
        districtCtrl.setValue(null);
        neighbourCtrl.setValue(null);
        districtCtrl.disable();
        neighbourCtrl.disable();
        if (!provinceId) return;
        this.addressService.getDistricts(provinceId).subscribe(data => {
            this.districts = data;
            districtCtrl.enable();
            if (patchDistrictId) {
                districtCtrl.setValue(patchDistrictId);
                this.onDistrictChange(patchDistrictId, undefined, true);
            }
        });
    }

    onDistrictChange(districtId: number, event?: unknown, silent = false) {
        this.neighbourhoods = [];
        const neighbourCtrl = this.form.get('customerAddress.neighbourhoodId')!;
        if (!silent) neighbourCtrl.setValue(null);
        neighbourCtrl.disable();
        if (!districtId) return;
        this.addressService.getNeighbourhoods(districtId).subscribe(data => {
            this.neighbourhoods = data;
            neighbourCtrl.enable();
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const data = this.form.getRawValue() as Customer;
        const req = this.isEdit ? this.service.update(data) : this.service.add(data);
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: this.isEdit ? 'Güncellendi.' : 'Eklendi.' });
                this.showDialog = false;
                this.loadList();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDelete(customer: Customer) {
        this.confirmationService.confirm({
            message: `<strong>${customer.name}</strong> silinecek. Emin misiniz?`,
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.service.delete(customer.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Silindi', detail: 'Müşteri silindi.' });
                        this.loadList();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Silme başarısız.' })
                });
            }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    goToDetail(id: number) { this.router.navigate(['/ysc/customer', id]); }

    get addrForm() { return this.form.get('customerAddress') as FormGroup; }
    get contactForm() { return this.form.get('customerContact') as FormGroup; }
    get f() { return this.form.controls; }
}
