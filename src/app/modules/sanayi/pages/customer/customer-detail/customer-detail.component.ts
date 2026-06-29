import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { formatPhoneNumber } from '../../../../../shared/utils/format.utils';

import { SanayiCustomerService } from '../../../services/customer.service';
import { TenantModel, CustomerRecordStatus, CustomerRecordStatusLabel } from '../../../models/customer.model';
import { BaseCrudDetailComponent } from '../../../../../shared/classes/base-crud-detail.component';
import { ICrudService } from '../../../../../shared/models/crud-service.interface';
import { CrudDetailPageComponent } from '../../../../../shared/components/crud-detail-page/crud-detail-page.component';
import { InfoCardComponent } from '../../../../../shared/components/info-card/info-card.component';

@Component({
    selector: 'app-sanayi-customer-detail',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, CrudDetailPageComponent, InfoCardComponent
    ],
    templateUrl: './customer-detail.component.html',
})
export class SanayiCustomerDetailComponent extends BaseCrudDetailComponent<TenantModel> {
    
    statusOptions = Object.values(CustomerRecordStatus)
        .filter(v => typeof v === 'number')
        .map(v => ({ label: CustomerRecordStatusLabel[v as CustomerRecordStatus], value: v as number }));

    constructor(
        private service: SanayiCustomerService,
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
            id:          [0],
            companyName: ['', Validators.required],
            taxNo:       ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email:       ['', [Validators.required, Validators.email]],
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
