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
import { ToolbarModule } from 'primeng/toolbar';

import { StandartNumberService } from '../../../services/definitions.service';
import { StandartNumber } from '../../../models/definitions.model';

@Component({
    selector: 'app-standart-number',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
              InputTextModule, ToastModule, ConfirmDialogModule, IconFieldModule, InputIconModule,
              ToolbarModule],
    template: `
    <p-toast /><p-confirmdialog />

    <p-toolbar styleClass="mb-4">
        <ng-template #start>
            <p-button label="Yeni" icon="pi pi-plus" severity="secondary" (onClick)="openNew()" />
        </ng-template>
        <ng-template #end>
            <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input pInputText placeholder="Ara..." (input)="dt.filterGlobal($any($event.target).value,'contains')" style="width:200px;" />
            </p-iconfield>
        </ng-template>
    </p-toolbar>

    <div class="card">
        <p-table #dt [value]="list" [columns]="cols" [loading]="loading" [globalFilterFields]="['standartNumber']"
                 [rowHover]="true" [paginator]="true" [rows]="15"
                 currentPageReportTemplate="{totalRecords} kayıttan {first} - {last} arası" [showCurrentPageReport]="true">
            <ng-template #header let-columns>
                <tr>
                    <th *ngFor="let col of columns" pSortableColumn="{{ col.field }}">
                        {{ col.header }} <p-sortIcon field="{{ col.field }}" />
                    </th>
                    <th style="width:90px; text-align:center;">İşlem</th>
                </tr>
            </ng-template>
            <ng-template #body let-row let-columns="columns">
                <tr>
                    <td *ngFor="let col of columns">{{ row[col.field] }}</td>
                    <td style="text-align:center;">
                        <div style="display:flex; gap:0.25rem; justify-content:center;">
                            <p-button icon="pi pi-pencil" severity="warn" [text]="true" [rounded]="true" (onClick)="openEdit(row)" />
                            <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="confirmDelete(row)" />
                        </div>
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr><td [attr.colspan]="cols.length + 1" style="text-align:center; padding:1.5rem; color:var(--text-color-secondary);">Kayıt bulunamadı.</td></tr>
            </ng-template>
        </p-table>
    </div>

    <p-dialog [(visible)]="showDialog" [modal]="true" [style]="{width:'420px'}"
              [header]="isEdit ? 'Düzenle' : 'Yeni Standart Numara'" [draggable]="false">
        <ng-template pTemplate="content">
            <div style="padding:0.5rem 0; display:flex; flex-direction:column; gap:0.35rem;">
                <label style="font-size:0.82rem; font-weight:600; color:var(--text-color-secondary);">Standart Numara <span style="color:red">*</span></label>
                <input pInputText [(ngModel)]="editValue" class="w-full" placeholder="ör. TS EN 1081" />
            </div>
        </ng-template>
        <ng-template pTemplate="footer">
            <p-button label="İptal" severity="secondary" [text]="true" (onClick)="showDialog = false" />
            <p-button [label]="isEdit ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" (onClick)="save()" />
        </ng-template>
    </p-dialog>
    `
})
export class StandartNumberComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    cols = [
        { field: 'id',             header: 'ID' },
        { field: 'standartNumber', header: 'Standart Numara' },
    ];

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
