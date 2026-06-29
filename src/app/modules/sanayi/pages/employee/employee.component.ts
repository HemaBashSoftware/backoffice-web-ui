import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SanayiEmployeeService } from '../../services/employee.service';
import { Employee, EMPLOYEE_ROLE_OPTIONS, EMPLOYEE_STATUS_OPTIONS } from '../../models/employee.model';
import { BaseCrudComponent } from '../../../../shared/classes/base-crud.component';
import { ICrudService } from '../../../../shared/models/crud-service.interface';
import { CrudPageComponent } from '../../../../shared/components/crud-page/crud-page.component';
import { formatPhoneNumber } from '../../../../shared/utils/format.utils';

@Component({
    selector: 'app-sanayi-employee',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, DropdownModule, CrudPageComponent
    ],
    templateUrl: './employee.component.html'
})
export class SanayiEmployeeComponent extends BaseCrudComponent<Employee> {
    
    cols = [
        { field: 'fullName',     header: 'Ad Soyad' },
        { field: 'role',         header: 'Görev' },
        { field: 'phone',        header: 'Telefon' },
        { field: 'emailAddress', header: 'E-Posta' },
        { field: 'status',       header: 'Durum' }
    ];

    roleOptions = EMPLOYEE_ROLE_OPTIONS.map(r => ({ label: r, value: r }));
    statusOptions = EMPLOYEE_STATUS_OPTIONS.map(s => ({ label: s, value: s }));

    constructor(
        private service: SanayiEmployeeService,
        private fb: FormBuilder
    ) { 
        super();
    }

    protected getService(): ICrudService<Employee> {
        return this.service;
    }

    protected getEntityName(): string {
        return 'Çalışan';
    }

    protected buildForm() {
        this.form = this.fb.group({
            id:           [0],
            fullName:     ['', Validators.required],
            phone:        ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            role:         ['Usta', Validators.required],
            status:       ['Aktif', Validators.required],
        });
    }

    protected override prepareSubmitData(rawValue: any): any {
        const data = super.prepareSubmitData(rawValue);
        if (data.phone) data.phone = formatPhoneNumber(data.phone);
        return data;
    }

    protected override getDeletePayload(item: Employee): any {
        return item; // Send full object if needed, though service sends { id: item.id } by default.
    }
}
