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

import { YscTypeService } from '../../../services/definitions.service';
import { YscType } from '../../../models/definitions.model';

@Component({
    selector: 'app-ysc-type',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
              InputTextModule, ToastModule, ConfirmDialogModule, IconFieldModule, InputIconModule],
    template: `
    <p-toast /><p-confirmdialog />
    <div style="padding:1.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">
            <div>
                <h2 style="font-size:1.3rem; font-weight:700; color:var(--text-color); margin:0 0 0.2rem;">YSC Tipi Tanımları</h2>
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

        <p-table #dt [value]="list" [loading]="loading" [globalFilterFields]="['name']"
                 [paginator]="true" [rows]="15" styleClass="p-datatable-sm p-datatable-gridlines">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="name">Ad <p-sortIcon field="name" /></th>
                    <th style="width:90px; text-align:center;">İşlem</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
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

    <p-dialog [(visible)]="showDialog" [modal]="true" [style]="{width:'400px'}"
              [header]="isEdit ? 'Düzenle' : 'Yeni YSC Tipi'" [draggable]="false">
        <div style="padding:0.5rem 0; display:flex; flex-direction:column; gap:0.35rem;">
            <label style="font-size:0.82rem; font-weight:600; color:var(--text-color-secondary);">Ad <span style="color:red">*</span></label>
            <input pInputText [(ngModel)]="editName" class="w-full" placeholder="YSC Tipi adı" />
        </div>
        <ng-template #footer>
            <p-button label="İptal" severity="secondary" [text]="true" (onClick)="showDialog = false" />
            <p-button [label]="isEdit ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" (onClick)="save()" />
        </ng-template>
    </p-dialog>
    `
})
export class YscTypeComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

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
