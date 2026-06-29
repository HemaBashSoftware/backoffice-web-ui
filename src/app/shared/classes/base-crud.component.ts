import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ICrudService } from '../models/crud-service.interface';

@Component({
    template: ''
})
export abstract class BaseCrudComponent<T extends { id?: number | string, name?: string, companyName?: string }> implements OnInit {
    list: T[] = [];
    loading = false;
    showDialog = false;
    isEdit = false;
    selectedItem: T | null = null;
    form!: FormGroup;

    protected abstract getService(): ICrudService<T>;
    protected abstract buildForm(): void;
    protected abstract getEntityName(): string;
    
    // Optional hook if they want to override the fetch mapping (like data.items vs array)
    protected mapListData(data: any): T[] {
        return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
    }

    protected messageService = inject(MessageService);
    protected confirmationService = inject(ConfirmationService);

    ngOnInit() {
        this.buildForm();
        this.loadList();
    }

    loadList() {
        this.loading = true;
        this.getService().getAll().subscribe({
            next: (data: any) => {
                this.list = this.mapListData(data);
                this.loading = false;
            },
            error: (err: any) => {
                this.loading = false;
                const detail = err?.status === 401
                    ? 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.'
                    : err?.status === 403
                    ? 'Bu işlemi yapmaya yetkiniz yok.'
                    : `API Hatası (${err?.status ?? '?'}): ${this.getEntityName()} listesi yüklenemedi.`;
                this.messageService.add({ severity: 'error', summary: 'Hata', detail });
            }
        });
    }

    openNew() {
        this.isEdit = false;
        this.selectedItem = null;
        this.form.reset({ id: 0 }); // Most forms have ID 0 initially. Module can override this if needed
        this.onAfterOpenNew();
        this.showDialog = true;
    }

    // Hook for specific logic
    protected onAfterOpenNew() { }

    openEdit(item: T) {
        this.isEdit = true;
        this.selectedItem = item;
        this.getService().getById(item.id!).subscribe({
            next: (data: T) => {
                this.form.patchValue(data);
                this.onAfterOpenEdit(data);
                this.showDialog = true;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kayıt yüklenemedi.' });
            }
        });
    }

    // Hook for specific patch logic (e.g., YSC cascaded dropdowns)
    protected onAfterOpenEdit(data: T) { }

    protected prepareSubmitData(rawValue: any): any {
        if (this.isEdit && this.selectedItem) {
            return { ...this.selectedItem, ...rawValue };
        }
        return { ...rawValue };
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const data = this.prepareSubmitData(this.form.getRawValue());
        const req = this.isEdit ? this.getService().update(data) : this.getService().add(data);
        
        req.subscribe({
            next: () => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Başarılı', 
                    detail: this.isEdit ? `${this.getEntityName()} bilgileri güncellendi.` : `${this.getEntityName()} başarıyla eklendi.` 
                });
                this.showDialog = false;
                this.loadList();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem sırasında bir hata oluştu.' })
        });
    }

    protected getDeletePayload(item: T): any {
        return item.id;
    }

    confirmDelete(item: T) {
        const name = item.name || item.companyName || 'Bu kayıt';
        this.confirmationService.confirm({
            message: `<strong>${name}</strong> ${this.getEntityName().toLowerCase()} pasife alınacak. Emin misiniz?`,
            header: 'Pasife Alma Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Pasife Al',
            rejectLabel: 'İptal',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.getService().delete(this.getDeletePayload(item)).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Pasife Alındı', detail: `${this.getEntityName()} pasife alındı.` });
                        this.loadList();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Pasife alma işlemi başarısız.' })
                });
            }
        });
    }

    get f() { return this.form.controls; }
}
