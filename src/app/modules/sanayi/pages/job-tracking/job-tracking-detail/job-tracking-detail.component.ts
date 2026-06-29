import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobTrackingDetailService } from '../../../services/job-tracking-detail.service';
import { JobTrackingService } from '../../../services/job-tracking.service';
import { SanayiVehicleService } from '../../../services/vehicle.service';
import { SanayiEmployeeService } from '../../../services/employee.service';
import { TenantJobModel, MaintenanceJobDto, MAINTENANCE_STATUS_OPTIONS } from '../../../models/job-tracking.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Employee } from '../../../models/employee.model';

@Component({
    selector: 'app-sanayi-job-tracking-detail',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        TableModule, ButtonModule, ToolbarModule,
        ConfirmDialogModule, ToastModule, DialogModule,
        InputTextModule, DropdownModule, InputNumberModule, InputTextareaModule, TabViewModule
    ],
    templateUrl: './job-tracking-detail.component.html',
    styles: [`
        ::ng-deep .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
        ::ng-deep .field { display: flex; flex-direction: column; gap: 0.3rem; }
        ::ng-deep .field label { font-size: 0.82rem; font-weight: 600; color: var(--text-color-secondary); }
        ::ng-deep .req { color: red; }
    `]
})
export class SanayiJobTrackingDetailComponent implements OnInit {
    firmId!: number;
    firmData?: TenantJobModel;

    allJobs: MaintenanceJobDto[] = [];
    jobHistoryList: MaintenanceJobDto[] = [];
    loading = false;
    activeFilter: 'all' | 'ongoing' = 'all';

    ongoingCount = 0;
    totalCompletedCount = 0;

    // CRUD state
    showJobDialog = false;
    isEditJob = false;
    jobForm!: FormGroup;
    selectedJob: MaintenanceJobDto | null = null;
    vehicles: Vehicle[] = [];
    statusOptions = MAINTENANCE_STATUS_OPTIONS.map(s => ({ label: s, value: s }));

    // --- Sub Entities Management ---
    showSubDialog = false;
    selectedDetailJob: any = null;
    operations: any[] = [];
    products: any[] = [];
    employees: any[] = [];
    
    // Operation form
    operationForm!: FormGroup;
    isEditOperation = false;
    showOperationDialog = false;
    selectedOperation: any = null;

    // Product form
    productForm!: FormGroup;
    isEditProduct = false;
    showProductDialog = false;
    selectedProduct: any = null;

    // Employee form
    employeeForm!: FormGroup;
    showEmployeeDialog = false;
    availableEmployees: Employee[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private jobTrackingDetailService: JobTrackingDetailService,
        private jobTrackingService: JobTrackingService,
        private vehicleService: SanayiVehicleService,
        private employeeService: SanayiEmployeeService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.buildForm();
        this.buildSubForms();
        this.route.paramMap.subscribe(params => {
            const idParam = params.get('id');
            if (idParam) {
                this.firmId = Number(idParam);
                this.loadFirmDetails();
            }
        });
        this.employeeService.getAll().subscribe(emps => {
            this.availableEmployees = emps.filter(e => !e.isDeleted);
        });
    }

    buildForm() {
        this.jobForm = this.fb.group({
            id:               [0],
            vehicleId:        [null, Validators.required],
            customerId:       [null],
            vehicleKilometer: [0, Validators.required],
            description:      [''],
            status:           ['Bakımda', Validators.required],
            label:            [''],
            dateOpened:       [new Date().toISOString().substring(0, 10)],
            dateClosed:       [null],
            totalLaborFee:    [0],
            totalProductFee:  [0],
            totalFee:         [0],
            discount:         [0],
        });
    }

    buildSubForms() {
        this.operationForm = this.fb.group({
            id: [0],
            maintenanceId: [0],
            operationName: ['', Validators.required],
            price: [0, Validators.required]
        });

        this.productForm = this.fb.group({
            id: [0],
            maintenanceId: [0],
            productName: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            pricePerItem: [0, Validators.required],
            productId: [0] // Optional or fixed to 0 if not linked
        });

        this.employeeForm = this.fb.group({
            employeeId: [null, Validators.required]
        });
    }

    loadFirmDetails() {
        this.loading = true;

        forkJoin({
            firm:         this.jobTrackingService.getTenantById(this.firmId).pipe(catchError(() => of(undefined as TenantJobModel | undefined))),
            maintenances: this.jobTrackingDetailService.getAllMaintenances().pipe(catchError(() => of([] as MaintenanceJobDto[]))),
            vehicles:     this.vehicleService.getAll().pipe(catchError(() => of([] as Vehicle[])))
        }).subscribe({
            next: ({ firm, maintenances, vehicles }) => {
                if (!firm) {
                    this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Firma bilgisi bulunamadı.' });
                } else {
                    this.firmData = firm;
                }

                this.allJobs = maintenances.filter(m => !m.isDeleted && m.customerId === this.firmId);
                this.vehicles = vehicles.filter(v => v.customerId === this.firmId && !v.isDeleted);
                
                this.calculateMetrics();
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    calculateMetrics() {
        this.ongoingCount = this.allJobs.filter(j => j.status === 'Bakımda' || j.status === 'Beklemede').length;
        this.totalCompletedCount = this.allJobs.filter(j => j.status !== 'Bakımda' && j.status !== 'Beklemede').length;
    }

    applyFilter() {
        if (this.activeFilter === 'ongoing') {
            this.jobHistoryList = this.allJobs.filter(j => j.status === 'Bakımda' || j.status === 'Beklemede');
        } else {
            this.jobHistoryList = [...this.allJobs];
        }
    }

    setFilter(filter: 'all' | 'ongoing') {
        this.activeFilter = filter;
        this.applyFilter();
    }

    getDisplayStatus(status: string): string {
        return status;
    }

    isOngoing(status: string): boolean {
        return status === 'Bakımda' || status === 'Beklemede';
    }

    goBack() {
        this.router.navigate(['/sanayi/job-tracking']);
    }

    openNewJob() {
        this.isEditJob = false;
        this.selectedJob = null;
        this.jobForm.reset({
            id: 0,
            vehicleId:        null,
            customerId:       this.firmId,
            vehicleKilometer: 0,
            status:           'Bakımda',
            dateOpened:       new Date().toISOString().substring(0, 10),
            description:      '',
            label:            '',
            totalLaborFee:    0,
            totalProductFee:  0,
            totalFee:         0,
            discount:         0
        });
        this.showJobDialog = true;
    }

    openEditJob(row: MaintenanceJobDto) {
        this.isEditJob = true;
        this.selectedJob = row;
        
        let dOpened = row.dateOpened;
        if(dOpened && dOpened.length > 10) dOpened = dOpened.substring(0, 10);
        let dClosed = row.dateClosed;
        if(dClosed && dClosed.length > 10) dClosed = dClosed.substring(0, 10);

        this.jobForm.patchValue({
            ...row,
            dateOpened: dOpened,
            dateClosed: dClosed
        });
        this.showJobDialog = true;
    }

    saveJob() {
        if (this.jobForm.invalid) { 
            this.jobForm.markAllAsTouched(); 
            return; 
        }
        
        const val = this.jobForm.getRawValue();
        val.customerId = this.firmId; // Ensure customerId is correct
        
        const req = this.isEditJob
            ? this.jobTrackingDetailService.update({ ...this.selectedJob, ...val })
            : this.jobTrackingDetailService.add(val);
            
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İş emri kaydedildi.' });
                this.showJobDialog = false;
                this.loadFirmDetails();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDeleteJob(row: MaintenanceJobDto) {
        this.confirmationService.confirm({
            message: `<strong>${row.label || row.plate}</strong> iş emri silinecek. Emin misiniz?`,
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.jobTrackingDetailService.delete(row.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Silindi' });
                    this.loadFirmDetails();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata' })
            })
        });
    }

    // --- Sub Entities Management ---

    openManageJob(job: MaintenanceJobDto) {
        this.loading = true;
        this.jobTrackingDetailService.getById(job.id).subscribe({
            next: (res) => {
                this.selectedDetailJob = res;
                this.operations = res.operations || [];
                this.products = res.products || [];
                this.employees = res.employees || [];
                this.showSubDialog = true;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İş detayları alınamadı.' });
            }
        });
    }

    // --- Operation CRUD ---
    openNewOperation() {
        this.isEditOperation = false;
        this.selectedOperation = null;
        this.operationForm.reset({ id: 0, maintenanceId: this.selectedDetailJob.id, operationName: '', price: 0 });
        this.showOperationDialog = true;
    }
    openEditOperation(op: any) {
        this.isEditOperation = true;
        this.selectedOperation = op;
        this.operationForm.patchValue(op);
        this.showOperationDialog = true;
    }
    saveOperation() {
        if(this.operationForm.invalid) { this.operationForm.markAllAsTouched(); return; }
        const val = this.operationForm.getRawValue();
        const req = this.isEditOperation ? this.jobTrackingDetailService.updateOperation(val) : this.jobTrackingDetailService.addOperation(val);
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İşlem kaydedildi.' });
                this.showOperationDialog = false;
                this.openManageJob(this.selectedDetailJob);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Hata oluştu.' })
        });
    }
    deleteOperation(op: any) {
        this.confirmationService.confirm({
            message: 'Bu işlemi silmek istediğinize emin misiniz?',
            accept: () => {
                this.jobTrackingDetailService.deleteOperation(op.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.' });
                        this.openManageJob(this.selectedDetailJob);
                    }
                });
            }
        });
    }

    // --- Product CRUD ---
    openNewProduct() {
        this.isEditProduct = false;
        this.selectedProduct = null;
        this.productForm.reset({ id: 0, maintenanceId: this.selectedDetailJob.id, productName: '', quantity: 1, pricePerItem: 0, productId: 0 });
        this.showProductDialog = true;
    }
    openEditProduct(prod: any) {
        this.isEditProduct = true;
        this.selectedProduct = prod;
        this.productForm.patchValue(prod);
        this.showProductDialog = true;
    }
    saveProduct() {
        if(this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
        const val = this.productForm.getRawValue();
        const req = this.isEditProduct ? this.jobTrackingDetailService.updateProduct(val) : this.jobTrackingDetailService.addProduct(val);
        req.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün kaydedildi.' });
                this.showProductDialog = false;
                this.openManageJob(this.selectedDetailJob);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Hata oluştu.' })
        });
    }
    deleteProduct(prod: any) {
        this.confirmationService.confirm({
            message: 'Bu ürünü silmek istediğinize emin misiniz?',
            accept: () => {
                this.jobTrackingDetailService.deleteProduct(prod.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.' });
                        this.openManageJob(this.selectedDetailJob);
                    }
                });
            }
        });
    }

    // --- Employee CRUD ---
    openNewEmployee() {
        this.employeeForm.reset({ employeeId: null });
        this.showEmployeeDialog = true;
    }
    saveEmployee() {
        if(this.employeeForm.invalid) { this.employeeForm.markAllAsTouched(); return; }
        const val = this.employeeForm.getRawValue();
        val.maintenanceId = this.selectedDetailJob.id;
        this.jobTrackingDetailService.addEmployee(val).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Çalışan eklendi.' });
                this.showEmployeeDialog = false;
                this.openManageJob(this.selectedDetailJob);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Hata oluştu.' })
        });
    }
    deleteEmployee(emp: any) {
        this.confirmationService.confirm({
            message: 'Bu çalışanı görevden almak istediğinize emin misiniz?',
            accept: () => {
                this.jobTrackingDetailService.deleteEmployee(emp.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.' });
                        this.openManageJob(this.selectedDetailJob);
                    }
                });
            }
        });
    }
}
