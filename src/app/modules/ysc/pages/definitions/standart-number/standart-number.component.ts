import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';

import { StandartNumberService } from '../../../services/definitions.service';
import { StandartNumber } from '../../../models/definitions.model';

@Component({
    selector: 'app-standart-number',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
              InputTextModule, ToastModule, ConfirmDialogModule, IconFieldModule, InputIconModule],
    template: `
    <p-toast /><p-confirmdialog />
    <div style="padding:1.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
            <div>
                <h2 style="font-size:1.3rem; font-weight:700; color:var(--text-color); margin:0 0 0.2rem;">Standart Numara Tanımları</h2>
                <p style="color:var(--text-color-secondary); font-size:0.85rem; margin:0;">{{ list.length }} kayıt</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText placeholder="Ara..." (input)="dt.filterGlobal($any($event.target).value,'contains')" style="width:200px;" />
                </p-iconfield>
                <p-button label="Yeni" icon="pi pi-plus" (onClick)="openNew()" />
            </div>
        </div>

        <p-table #dt [value]="list" [loading]="loading" [globalFilterFields]="['standartNumber']"
                 [paginator]="true" [rows]="15" styleClass="p-datatable-sm p-datatable-gridlines">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="standartNumber">Standart Numara <p-sortIcon field="standartNumber" /></th>
                    <th style="width:90px; text-align:center;">İşlem</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.id }}</td>
                    <td>{{ row.standartNumber }}</td>
                    <td style="text-align:center;">
                        <div style="display:flex; gap:0.25rem; justify-content:center;">
                            <p-button icon="pi pi-pencil" severity="warn" [text]="true" [rounded]="true" (onClick)="openEdit(row)" />
                            <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="confirmDelete(row)" />
                        </div>
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr><td colspan="3" style="text-align:center; padding:1.5rem; color:var(--text-color-secondary);">Kayıt bulunamadı.</td></tr>
            </ng-template>
        </p-table>
    </div>

    <p-dialog [(visible)]="showDialog" [modal]="true" [style]="{width:'420px'}"
              [header]="isEdit ? 'Düzenle' : 'Yeni Standart Numara'" [draggable]="false">
        <div style="padding:0.5rem 0; display:flex; flex-direction:column; gap:0.35rem;">
            <label style="font-size:0.82rem; font-weight:600; color:var(--text-color-secondary);">Standart Numara <span style="color:red">*</span></label>
            <input pInputText [(ngModel)]="editValue" class="w-full" placeholder="ör. TS EN 1081" />
        </div>
        <ng-template #footer>
            <p-button label="İptal" severity="secondary" [text]="true" (onClick)="showDialog = false" />
            <p-button [label]="isEdit ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" (onClick)="save()" />
        </ng-template>
    </p-dialog>
    `
})
export class StandartNumberComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    list: StandartNumber[] = [];
    loading = false;
    showDialog = false;
    isEdit = false;
    editValue = '';
    editId = 0;

    constructor(
        private service: StandartNumberService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.service.getAll().subscribe({
            next: d => { this.list = d; this.loading = false; },
            error: () => { this.loading = false; this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Yüklenemedi.' }); }
        });
    }

    openNew() { this.isEdit = false; this.editValue = ''; this.editId = 0; this.showDialog = true; }

    openEdit(row: StandartNumber) { this.isEdit = true; this.editId = row.id; this.editValue = row.standartNumber; this.showDialog = true; }

    save() {
        if (!this.editValue.trim()) { this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Standart numara zorunludur.' }); return; }
        const req = this.isEdit
            ? this.service.update({ id: this.editId, standartNumber: this.editValue, recordDate: '', isDeleted: false })
            : this.service.add({ standartNumber: this.editValue });
        req.subscribe({
            next: () => { this.messageService.add({ severity: 'success', summary: 'Kaydedildi' }); this.showDialog = false; this.load(); },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDelete(row: StandartNumber) {
        this.confirmationService.confirm({
            message: `<strong>${row.standartNumber}</strong> silinecek. Emin misiniz?`,
            header: 'Silme Onayı', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil', rejectLabel: 'İptal', acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.service.delete(row.id).subscribe({
                next: () => { this.messageService.add({ severity: 'success', summary: 'Silindi' }); this.load(); },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Silinemedi.' })
            })
        });
    }
}
