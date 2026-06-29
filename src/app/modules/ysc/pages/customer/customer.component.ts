import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';

import { YscCustomerService } from '../../services/customer.service';
import { AddressLookupService } from '../../services/address-lookup.service';
import { Customer } from '../../models/customer.model';
import { Province, District, Neighbourhood } from '../../models/address-lookup.model';
import { BaseCrudComponent } from '../../../../shared/classes/base-crud.component';
import { ICrudService } from '../../../../shared/models/crud-service.interface';
import { CrudPageComponent } from '../../../../shared/components/crud-page/crud-page.component';

@Component({
    selector: 'app-ysc-customer',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, SelectModule, TextareaModule, DatePickerModule, InputNumberModule,
        CrudPageComponent
    ],
    templateUrl: './customer.component.html',
})
export class YscCustomerComponent extends BaseCrudComponent<Customer> {
    
    cols = [
        { field: 'name',         header: 'Firma Adı' },
        { field: 'taxNumber',    header: 'Vergi No' },
        { field: 'taxOffice',    header: 'Vergi Dairesi' },
        { field: 'firmOfficial', header: 'Yetkili' },
    ];

    provinces: Province[] = [];
    districts: District[] = [];
    neighbourhoods: Neighbourhood[] = [];

    constructor(
        private router: Router,
        private service: YscCustomerService,
        private addressService: AddressLookupService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
    ) {
        super();
    }

    protected getService(): ICrudService<Customer> {
        return this.service;
    }

    protected getEntityName(): string {
        return 'Müşteri';
    }

    protected buildForm() {
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
            recordStatus: [1]
        });
    }

    override ngOnInit() {
        super.ngOnInit();
        this.addressService.getProvinces().subscribe(data => this.provinces = data);

        this.route.queryParams.subscribe(params => {
            const editId = params['edit'];
            if (editId) {
                this.service.getById(Number(editId)).subscribe(c => this.openEdit(c));
            }
        });
    }

    protected override onAfterOpenNew() {
        this.districts = [];
        this.neighbourhoods = [];
    }

    protected override onAfterOpenEdit(data: Customer) {
        // Önce adres dışı alanları patch et
        this.form.patchValue({ ...data, customerAddress: null });
        const addr = data.customerAddress;
        if (addr?.provinceId) {
            // Cascade: il → ilçe → mahalle
            this.onProvinceChange(addr.provinceId, addr.districtId ?? undefined);
            if (addr.districtId) {
                this.addressService.getNeighbourhoods(addr.districtId).subscribe(nhoods => {
                    this.neighbourhoods = nhoods;
                    this.form.get('customerAddress.neighbourhoodId')!.enable();
                    this.form.get('customerAddress.neighbourhoodId')!.setValue(addr.neighbourhoodId ?? null);
                });
            }
            // Geri kalan adres alanlarını patch et
            this.form.get('customerAddress')!.patchValue({
                label: addr.label,
                street: addr.street,
                buildingNo: addr.buildingNo,
                doorNo: addr.doorNo,
                postalCode: addr.postalCode,
                fullAddress: addr.fullAddress,
            });
        }
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

    goToDetail(row: Customer) {
        this.router.navigate(['/ysc/customer', row.id]);
    }

    get addrForm() { return this.form.get('customerAddress') as FormGroup; }
    get contactForm() { return this.form.get('customerContact') as FormGroup; }
}
