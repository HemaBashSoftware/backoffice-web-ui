import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { formatPhoneNumber } from '../../../../../shared/utils/format.utils';

import { BpmCustomerService } from '../../../services/customer.service';
import { TenantModel, CustomerRecordStatus, CustomerRecordStatusLabel } from '../../../models/customer.model';
import { BaseCrudDetailComponent } from '../../../../../shared/classes/base-crud-detail.component';
import { ICrudService } from '../../../../../shared/models/crud-service.interface';
import { CrudDetailPageComponent } from '../../../../../shared/components/crud-detail-page/crud-detail-page.component';
import { InfoCardComponent } from '../../../../../shared/components/info-card/info-card.component';

@Component({
    selector: 'app-bpm-customer-detail',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, TextareaModule, CrudDetailPageComponent, InfoCardComponent
    ],
    templateUrl: './customer-detail.component.html',
    styles: [`
        .section-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--p-primary-color); border-bottom: 2px solid var(--p-primary-color); padding-bottom: 0.3rem; margin-bottom: 0.75rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
        .field { display: flex; flex-direction: column; gap: 0.3rem; }
        .field label { font-size: 0.82rem; font-weight: 600; color: var(--text-color-secondary); }
        .req { color: red; }
        .err { color: red; font-size: 0.78rem; }
    `]
})
export class BpmCustomerDetailComponent extends BaseCrudDetailComponent<TenantModel> {
    
    statusOptions = Object.values(CustomerRecordStatus)
        .filter(v => typeof v === 'number')
        .map(v => ({ label: CustomerRecordStatusLabel[v as CustomerRecordStatus], value: v as number }));

    constructor(
        private service: BpmCustomerService,
        private fb: FormBuilder,
    ) {
        super();
    }

    protected getService(): ICrudService<TenantModel> {
        return this.service;
    }

    protected getEntityName(): string {
        return 'Firma';
    }

    protected buildForm() {
        this.editForm = this.fb.group({
            id: [0],
            companyName: ['', Validators.required],
            taxNo: ['', Validators.required],
            taxOffice: [''],
            phoneNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: [''],
            notes: [''],
        });
    }

    protected override prepareSubmitData(rawValue: any): any {
        const data = super.prepareSubmitData(rawValue);
        if (data.phoneNumber) {
            data.phoneNumber = formatPhoneNumber(data.phoneNumber);
        }
        return data;
    }
}
