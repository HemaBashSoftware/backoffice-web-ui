import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';

import { SanayiCustomerService } from '../../services/customer.service';
import { TenantModel, CustomerRecordStatus } from '../../models/customer.model';
import { BaseCrudComponent } from '../../../../shared/classes/base-crud.component';
import { ICrudService } from '../../../../shared/models/crud-service.interface';
import { CrudPageComponent } from '../../../../shared/components/crud-page/crud-page.component';

@Component({
    selector: 'app-sanayi-customer',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, CrudPageComponent
    ],
    templateUrl: './customer.component.html',
})
export class SanayiCustomerComponent extends BaseCrudComponent<TenantModel> {
    
    cols = [
        { field: 'companyName', header: 'Firma Adı' },
        { field: 'taxNo', header: 'Vergi No' },
        { field: 'phoneNumber', header: 'Telefon' },
        { field: 'email', header: 'E-Posta' }
    ];

    constructor(
        private service: SanayiCustomerService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { 
        super();
    }

    protected getService(): ICrudService<TenantModel> {
        return this.service;
    }

    protected getEntityName(): string {
        return 'Müşteri';
    }

    protected buildForm() {
        this.form = this.fb.group({
            id:          [0],
            companyName: ['', Validators.required],
            taxNo:       ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email:       ['', [Validators.required, Validators.email]],
            recordStatus:[CustomerRecordStatus.ACTIVE],
        });
    }

    override ngOnInit() {
        super.ngOnInit();
        
        this.route.queryParams.subscribe(params => {
            const editId = params['edit'];
            if (editId) {
                this.service.getById(Number(editId)).subscribe((t: any) => {
                    this.isEdit = true;
                    this.selectedItem = t;
                    this.form.patchValue(t);
                    this.showDialog = true;
                });
            }
        });
    }

    protected override onAfterOpenNew() {
        this.form.patchValue({ recordStatus: CustomerRecordStatus.ACTIVE });
    }

    formatPhoneNumber(phone: string): string {
        if (!phone) return phone;
        let cleaned = phone.replace(/\D/g, '');

        if (cleaned.length === 10) {
            cleaned = '90' + cleaned;
        } 
        else if (cleaned.length === 11 && cleaned.startsWith('0')) {
            cleaned = '90' + cleaned.substring(1);
        }

        const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
        }
        return phone; 
    }

    protected override prepareSubmitData(rawValue: any): any {
        const data = super.prepareSubmitData(rawValue);
        if (data.phoneNumber) {
            data.phoneNumber = this.formatPhoneNumber(data.phoneNumber);
        }
        if (!this.isEdit) {
            data.recordStatus = CustomerRecordStatus.ACTIVE;
        }
        return data;
    }

    protected override getDeletePayload(item: TenantModel): any {
        return item; // Sanayi API uses entire object for delete
    }

    goToDetail(row: TenantModel) {
        this.router.navigate(['/sanayi/customer', row.id]);
    }
}