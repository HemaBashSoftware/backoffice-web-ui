import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

import { SanayiVehicleService } from '../../services/vehicle.service';
import { SanayiCustomerService } from '../../services/customer.service';
import { Vehicle, FUEL_OPTIONS, GEAR_OPTIONS } from '../../models/vehicle.model';
import { TenantModel } from '../../models/customer.model';
import { BaseCrudComponent } from '../../../../shared/classes/base-crud.component';
import { ICrudService } from '../../../../shared/models/crud-service.interface';
import { CrudPageComponent } from '../../../../shared/components/crud-page/crud-page.component';

@Component({
    selector: 'app-sanayi-vehicle',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, DropdownModule, InputNumberModule, CrudPageComponent
    ],
    templateUrl: './vehicle.component.html'
})
export class SanayiVehicleComponent extends BaseCrudComponent<Vehicle> {
    
    cols = [
        { field: 'plate',            header: 'Plaka' },
        { field: 'brand',            header: 'Marka' },
        { field: 'model',            header: 'Model' },
        { field: 'year',             header: 'Yıl' },
        { field: 'fuelType',         header: 'Yakıt' },
        { field: 'kilometer',        header: 'KM' },
        { field: 'customerFullName', header: 'Müşteri' }
    ];

    fuelOptions = FUEL_OPTIONS.map(f => ({ label: f, value: f }));
    gearOptions = GEAR_OPTIONS.map(g => ({ label: g, value: g }));
    customers: TenantModel[] = [];

    constructor(
        private service: SanayiVehicleService,
        private customerService: SanayiCustomerService,
        private fb: FormBuilder,
        private router: Router
    ) { 
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.customerService.getAll().subscribe(res => {
            this.customers = res.filter(c => !c.isDeleted);
        });
    }

    protected getService(): ICrudService<Vehicle> {
        return this.service;
    }

    protected getEntityName(): string {
        return 'Araç';
    }

    protected buildForm() {
        this.form = this.fb.group({
            id:             [0],
            customerId:     [null, Validators.required],
            plate:          ['', Validators.required],
            brand:          ['', Validators.required],
            model:          ['', Validators.required],
            year:           [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
            gear:           ['Manuel', Validators.required],
            engineCapacity: [''],
            kilometer:      [0, Validators.min(0)],
            fuelType:       ['Benzin', Validators.required],
        });
    }

    protected override getDeletePayload(item: Vehicle): any {
        return item; // Sanayi API uses entire object for delete
    }

    goToDetail(row: Vehicle) {
        this.router.navigate(['/sanayi/vehicle', row.id]);
    }
}
