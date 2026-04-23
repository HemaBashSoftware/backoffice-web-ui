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

import { YscTypeService } from '../../../services/definitions.service';
import { YscType } from '../../../models/definitions.model';

@Component({
    selector: 'app-ysc-type',
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
        <p-table #dt [value]="list" [columns]="cols" [loading]="loading" [globalFilterFields]="['name']"
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

    <p-dialog [(visible)]="showDialog" [modal]="true" [style]="{width:'400px'}"
              [header]="isEdit ? 'Düzenle' : 'Yeni YSC Tipi'" [draggable]="false">
        <ng-template pTemplate="content">
            <div style="padding:0.5rem 0; display:flex; flex-direction:column; gap:0.35rem;">
                <label style="font-size:0.82rem; font-weight:600; color:var(--text-color-secondary);">Ad <span style="color:red">*</span></label>
                <input pInputText [(ngModel)]="editName" class="w-full" placeholder="YSC Tipi adı" />
            </div>
        </ng-template>
        <ng-template pTemplate="footer">
            <p-button label="İptal" severity="secondary" [text]="true" (onClick)="showDialog = false" />
            <p-button [label]="isEdit ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" (onClick)="save()" />
        </ng-template>
    </p-dialog>
    `
})
export class YscTypeComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    cols = [
        { field: 'id',   header: 'ID' },
        { field: 'name', header: 'Ad' },
    ];

    list: YscType[] = [];
    loading = false;
    showDialog = false;
    isEdit = false;
    editName = '';
    editId = 0;

    constructor(
        private service: YscTypeService,
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

    openNew() { this.isEdit = false; this.editName = ''; this.editId = 0; this.showDialog = true; }

    openEdit(row: YscType) { this.isEdit = true; this.editId = row.id; this.editName = row.name; this.showDialog = true; }

    save() {
        if (!this.editName.trim()) { this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Ad zorunludur.' }); return; }
        const req = this.isEdit
            ? this.service.update({ id: this.editId, name: this.editName, recordDate: '', isDeleted: false })
            : this.service.add({ name: this.editName });
        req.subscribe({
            next: () => { this.messageService.add({ severity: 'success', summary: 'Kaydedildi' }); this.showDialog = false; this.load(); },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız.' })
        });
    }

    confirmDelete(row: YscType) {
        this.confirmationService.confirm({
            message: `<strong>${row.name}</strong> silinecek. Emin misiniz?`,
            header: 'Silme Onayı', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil', rejectLabel: 'İptal', acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.service.delete(row.id).subscribe({
                next: () => { this.messageService.add({ severity: 'success', summary: 'Silindi' }); this.load(); },
                error: () => this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Silinemedi.' })
            })
        });
    }
}
