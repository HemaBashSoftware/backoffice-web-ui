import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { SanayiVehicleService } from '../../services/vehicle.service';
import { VehicleFeatureService } from '../../services/vehicle-feature.service';
import { JobTrackingService } from '../../services/job-tracking.service';
import { Vehicle, VehicleFeature, FUEL_OPTIONS, GEAR_OPTIONS } from '../../models/vehicle.model';
import { MaintenanceJobDto } from '../../models/job-tracking.model';
import { BaseCrudDetailComponent } from '../../../../shared/classes/base-crud-detail.component';
import { CrudDetailPageComponent } from '../../../../shared/components/crud-detail-page/crud-detail-page.component';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SanayiCustomerService } from '../../services/customer.service';

@Component({
    selector: 'app-sanayi-vehicle-detail',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        InputTextModule, DropdownModule, InputNumberModule,
        TableModule, ButtonModule, TabViewModule, DialogModule,
        CrudDetailPageComponent, InfoCardComponent
    ],
    templateUrl: './vehicle-detail.component.html',
    styles: [`
        .section-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--p-primary-color); border-bottom: 2px solid var(--p-primary-color); padding-bottom: 0.3rem; margin-bottom: 0.75rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
        .field { display: flex; flex-direction: column; gap: 0.3rem; }
        .field label { font-size: 0.82rem; font-weight: 600; color: var(--text-color-secondary); }
        .req { color: red; }
        .err { color: red; font-size: 0.78rem; }
    `]
})
export class SanayiVehicleDetailComponent extends BaseCrudDetailComponent<Vehicle> {
    
    features: VehicleFeature[] = [];
    maintenances: MaintenanceJobDto[] = [];
    
    fuelOptions = FUEL_OPTIONS.map(f => ({ label: f, value: f }));
    gearOptions = GEAR_OPTIONS.map(g => ({ label: g, value: g }));
    customers: any[] = [];

    // Feature Dialog state
    showFeatureDialog = false;
    isEditFeature = false;
    featureForm!: FormGroup;
    selectedFeature: VehicleFeature | null = null;

    constructor(
        private vehicleService: SanayiVehicleService,
        private featureService: VehicleFeatureService,
        private maintenanceService: JobTrackingService,
        private customerService: SanayiCustomerService,
        private fb: FormBuilder,
        private msg: MessageService,
        private confirm: ConfirmationService
    ) {
        super();
        this.statusOptions = [
            { label: 'Aktif', value: 1 },
            { label: 'Pasif', value: 2 }
        ];
    }

    override ngOnInit() {
        super.ngOnInit();
        this.buildFeatureForm();
        this.customerService.getAll().subscribe(res => {
            this.customers = res;
        });
    }

    protected override loadDetailLogic(id: number) {
        this.loading = true;
        forkJoin({
            vehicle:      this.vehicleService.getById(id).pipe(catchError(() => of(null))),
            features:     this.featureService.getByVehicleId(id).pipe(catchError(() => of([]))),
            maintenances: this.maintenanceService.getAllMaintenances().pipe(catchError(() => of([]))) // Filtered locally since no getByVehicleId endpoint
        }).subscribe({
            next: (res) => {
                if (res.vehicle) {
                    this.item = res.vehicle;
                    this.selectedStatus = this.item.isDeleted ? 2 : 1;
                    this.buildEditForm();
                    this.editForm.patchValue(this.item);
                } else {
                    this.msg.add({ severity: 'error', summary: 'Hata', detail: 'Araç bulunamadı.' });
                }
                
                this.features = res.features || [];
                // API has no getlistbyvehicleid for job-tracking service, so filter locally
                this.maintenances = (res.maintenances || []).filter(m => m.vehicleId === id);
                
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Hata', detail: 'Araç yüklenemedi.' });
            }
        });
    }

    protected override buildEditForm() {
        this.editForm = this.fb.group({
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
            isDeleted:      [false]
        });
    }

    protected override saveEditLogic() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const val = this.editForm.getRawValue();
        const payload = { ...this.item, ...val };

        this.vehicleService.update(payload).subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Başarılı', detail: 'Araç güncellendi.' });
                this.showEditDialog = false;
                this.loadDetail(this.item!.id);
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Hata', detail: 'Güncelleme başarısız.' });
            }
        });
    }

    protected override saveStatusLogic(status: number) {
        if (!this.item) return;
        this.loading = true;
        
        // Status 1 = Active, 2 = Deleted (Passive)
        const isDeleted = status === 2;
        const payload = { ...this.item, isDeleted: isDeleted };
        
        this.vehicleService.update(payload).subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Başarılı', detail: 'Durum güncellendi.' });
                this.showStatusDialog = false;
                this.loadDetail(this.item!.id);
            },
            error: () => {
                this.loading = false;
                this.msg.add({ severity: 'error', summary: 'Hata', detail: 'Durum güncellenemedi.' });
            }
        });
    }

    // --- Feature CRUD ---

    buildFeatureForm() {
        this.featureForm = this.fb.group({
            id: [0],
            vehicleId: [0],
            featureKey: ['', Validators.required],
            featureValue: ['', Validators.required]
        });
    }

    openNewFeature() {
        this.isEditFeature = false;
        this.selectedFeature = null;
        this.featureForm.reset({
            id: 0,
            vehicleId: this.item?.id,
            featureKey: '',
            featureValue: ''
        });
        this.showFeatureDialog = true;
    }

    openEditFeature(f: VehicleFeature) {
        this.isEditFeature = true;
        this.selectedFeature = f;
        this.featureForm.patchValue(f);
        this.showFeatureDialog = true;
    }

    saveFeature() {
        if (this.featureForm.invalid) {
            this.featureForm.markAllAsTouched();
            return;
        }
        
        const val = this.featureForm.getRawValue();
        const req = this.isEditFeature
            ? this.featureService.update(val)
            : this.featureService.add(val);
            
        req.subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Başarılı', detail: 'Özellik kaydedildi.' });
                this.showFeatureDialog = false;
                if (this.item?.id) this.loadDetail(this.item.id);
            },
            error: () => this.msg.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDeleteFeature(f: VehicleFeature) {
        this.confirm.confirm({
            message: `<strong>${f.featureKey}</strong> özelliği silinecek. Emin misiniz?`,
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.featureService.delete(f.id).subscribe({
                    next: () => {
                        this.msg.add({ severity: 'success', summary: 'Başarılı', detail: 'Özellik silindi.' });
                        if (this.item?.id) this.loadDetail(this.item.id);
                    },
                    error: () => this.msg.add({ severity: 'error', summary: 'Hata', detail: 'Silinemedi.' })
                });
            }
        });
    }
}
