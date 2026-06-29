import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatPhoneNumber } from '../../../../shared/utils/format.utils';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { BpmCustomerService } from '../../services/customer.service';
import { TenantModel } from '../../models/customer.model';
import { BaseCrudComponent } from '../../../../shared/classes/base-crud.component';
import { ICrudService } from '../../../../shared/models/crud-service.interface';
import { CrudPageComponent } from '../../../../shared/components/crud-page/crud-page.component';

@Component({
    selector: 'app-bpm-customer',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, TextareaModule, CrudPageComponent
    ],
    templateUrl: './customer.component.html',
})
export class BpmCustomerComponent extends BaseCrudComponent<TenantModel> {
    
    cols = [
        { field: 'companyName', header: 'Firma Adı' },
        { field: 'taxNo', header: 'Vergi No' },
        { field: 'phoneNumber', header: 'Telefon' },
        { field: 'email', header: 'E-Posta' }
    ];

    constructor(
        private service: BpmCustomerService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
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

    override ngOnInit() {
        super.ngOnInit();
        
        // Handle edit from query params if needed
        this.route.queryParams.subscribe(params => {
            const editId = params['edit'];
            if (editId) {
                this.service.getById(Number(editId)).subscribe(t => {
                    this.isEdit = true;
                    this.selectedItem = t;
                    this.form.patchValue(t);
                    this.showDialog = true;
                });
            }
        });
    }

    protected override prepareSubmitData(rawValue: any): any {
        const data = super.prepareSubmitData(rawValue);
        if (data.phoneNumber) {
            data.phoneNumber = formatPhoneNumber(data.phoneNumber);
        }
        return data;
    }

    goToDetail(row: TenantModel) {
        this.router.navigate(['/bpm/customer', row.id]);
    }
}
