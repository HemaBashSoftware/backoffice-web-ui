import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { formatPhoneNumber } from '../../../../shared/utils/format.utils';
import { JobTrackingService } from '../../services/job-tracking.service';
import { JobTrackingDetailService } from '../../services/job-tracking-detail.service';
import { TenantJobModel, MaintenanceJobDto } from '../../models/job-tracking.model';

// Ana listede gösterilecek birleşik satır tipi
export interface JobTrackingRow extends TenantJobModel {
    ongoingJobsCount: number;
    totalCompletedCount: number;
    totalJobsCount: number;
}

@Component({
    selector: 'app-sanayi-job-tracking',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        TableModule, ButtonModule, ToolbarModule, DialogModule, InputTextModule,
        ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule, TooltipModule,
        TagModule
    ],
    templateUrl: './job-tracking.component.html',
})
export class SanayiJobTrackingComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    list: JobTrackingRow[] = [];
    loading = false;
    showDialog = false;
    isEdit = false;
    selectedFirm: TenantJobModel | null = null;
    form!: FormGroup;

    // Üst özet kartlar
    activeFirmsCount = 0;
    totalOngoingJobs = 0;
    totalCompletedJobs = 0;
    totalLifetimeJobs = 0;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private jobTrackingService: JobTrackingService,
        private jobTrackingDetailService: JobTrackingDetailService
    ) {}

    ngOnInit() {
        this.buildForm();
        this.loadList();
    }

    buildForm() {
        this.form = this.fb.group({
            id:          [0],
            companyName: ['', Validators.required],
            taxNo:       ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email:       ['', [Validators.required, Validators.email]],
        });
    }

    loadList() {
        this.loading = true;

        // forkJoin ile her iki isteği paralel çek; hata olursa boş dizi döndür
        forkJoin({
            tenants:      this.jobTrackingService.getAllTenants().pipe(catchError(() => of([] as TenantJobModel[]))),
            maintenances: this.jobTrackingDetailService.getAllMaintenances().pipe(catchError(() => of([] as MaintenanceJobDto[])))
        }).subscribe({
            next: ({ tenants, maintenances }) => {
                const activeTenants = tenants.filter(t => !t.isDeleted);

                this.list = activeTenants.map(tenant => {
                    const tenantJobs = maintenances.filter(m => !m.isDeleted && m.tenantId === tenant.id);
                    const ongoing = tenantJobs.filter(m => m.status === 'Bakımda').length;
                    const completed = tenantJobs.filter(m => m.status !== 'Bakımda').length;
                    const total = tenantJobs.length;

                    return {
                        ...tenant,
                        ongoingJobsCount: ongoing,
                        totalCompletedCount: completed,
                        totalJobsCount: total
                    } as JobTrackingRow;
                });

                this.calculateMetrics();
                this.loading = false;
            },
            error: () => {
                // forkJoin hataları catchError ile sıfırlanacağı için buraya normalde düşmez
                this.loading = false;
            }
        });
    }

    calculateMetrics() {
        this.activeFirmsCount = this.list.filter(f => !f.isDeleted).length;
        this.totalOngoingJobs = this.list.reduce((s, f) => s + f.ongoingJobsCount, 0);
        this.totalCompletedJobs = this.list.reduce((s, f) => s + f.totalCompletedCount, 0); // Kullanıcı her zaman toplam biten işleri görmek istiyor
        this.totalLifetimeJobs = this.list.reduce((s, f) => s + f.totalJobsCount, 0);
    }

    openNew() {
        this.isEdit = false;
        this.selectedFirm = null;
        this.form.reset({ id: 0 });
        this.showDialog = true;
    }

    openEdit(row: TenantJobModel) {
        this.isEdit = true;
        this.selectedFirm = row;
        this.form.patchValue(row);
        this.showDialog = true;
    }


    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const val = this.form.getRawValue();
        if (val.phoneNumber) val.phoneNumber = formatPhoneNumber(val.phoneNumber);

        if (this.isEdit && this.selectedFirm) {
            const payload: TenantJobModel = { ...this.selectedFirm, ...val };
            this.jobTrackingService.updateTenant(payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Firma güncellendi.' });
                    this.showDialog = false;
                    this.loadList();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Güncelleme başarısız.' })
            });
        } else {
            const payload = {
                companyName: val.companyName,
                taxNo: val.taxNo,
                phoneNumber: val.phoneNumber,
                email: val.email
            };
            this.jobTrackingService.addTenant(payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Yeni firma eklendi.' });
                    this.showDialog = false;
                    this.loadList();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kayıt başarısız.' })
            });
        }
    }

    confirmDelete(row: TenantJobModel) {
        this.confirmationService.confirm({
            message: `<strong>${row.companyName}</strong> firması pasife alınacak. Emin misiniz?`,
            header: 'Pasife Alma Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Pasife Al',
            rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.jobTrackingService.deleteTenant(row).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'İşlem Başarılı', detail: 'Firma pasife alındı.' });
                        this.loadList();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
                });
            }
        });
    }

    goToDetail(id: number) {
        this.router.navigate(['/sanayi/job-tracking', id]);
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    get f() { return this.form.controls; }

    getSeverity(row: JobTrackingRow): 'success' | 'danger' | 'secondary' {
        if (row.isDeleted) return 'danger';
        return 'success';
    }

    getStatusLabel(row: JobTrackingRow): string {
        return row.isDeleted ? 'Pasif' : 'Aktif';
    }
}
