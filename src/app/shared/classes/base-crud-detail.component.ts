import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ICrudService } from '../models/crud-service.interface';

@Component({
    template: ''
})
export abstract class BaseCrudDetailComponent<T extends { id?: number | string }> implements OnInit {
    item: T | null = null;
    loading = false;

    // Status Dialog
    showStatusDialog = false;
    selectedStatus: number = 1;

    // Edit Dialog
    showEditDialog = false;
    editForm!: FormGroup;

    protected route = inject(ActivatedRoute);
    protected router = inject(Router);
    protected messageService = inject(MessageService);
    protected confirmationService = inject(ConfirmationService);

    protected abstract getService(): ICrudService<T>;
    protected abstract buildForm(): void;
    protected abstract getEntityName(): string;
    
    // YSC vs uses complex relations fetching, so we allow overriding
    protected loadDetailLogic(id: number) {
        this.loading = true;
        this.getService().getById(id).subscribe({
            next: (data) => {
                this.item = data;
                this.onAfterLoadDetail(data);
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: `${this.getEntityName()} detayları yüklenemedi.` });
            }
        });
    }

    protected onAfterLoadDetail(data: T) {
        // Abstract hook to set initial status or load other things
        const rec = data as any;
        this.selectedStatus = rec?.isDeleted ? 2 : (rec?.recordStatus || 1);
    }

    ngOnInit() {
        this.buildForm();
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadDetailLogic(id);
        }
    }

    openStatusDialog() {
        if (!this.item) return;
        const rec = this.item as any;
        this.selectedStatus = rec?.isDeleted ? 2 : (rec?.recordStatus || 1);
        this.showStatusDialog = true;
    }

    saveStatus(newStatus: number) {
        if (!this.item) return;
        
        const service = this.getService() as any;
        if (service.updateStatus) {
            service.updateStatus(this.item, newStatus).subscribe({
                next: () => {
                    const rec = this.item as any;
                    rec.recordStatus = newStatus;
                    rec.isDeleted = (newStatus === 2 || newStatus === 3);
                    this.messageService.add({ severity: 'success', summary: 'Güncellendi', detail: 'Durum güncellendi.' });
                    this.showStatusDialog = false;
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Durum güncellenemedi.' })
            });
        }
    }

    openEdit() {
        if (!this.item) return;
        this.editForm.patchValue(this.item);
        this.onAfterOpenEdit(this.item);
        this.showEditDialog = true;
    }

    protected onAfterOpenEdit(data: T) {}

    protected prepareSubmitData(rawValue: any): any {
        return { ...this.item, ...rawValue };
    }

    saveEdit() {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        const data = this.prepareSubmitData(this.editForm.getRawValue());
        this.getService().update(data).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: `${this.getEntityName()} güncellendi.` });
                this.showEditDialog = false;
                this.loadDetailLogic(data.id);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Güncelleme başarısız.' })
        });
    }

    goBack(path: string) {
        this.router.navigate([path]);
    }
}
