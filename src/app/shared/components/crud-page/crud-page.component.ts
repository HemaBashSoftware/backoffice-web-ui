import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-crud-page',
    standalone: true,
    imports: [
        CommonModule, TableModule, ButtonModule, ToolbarModule, DialogModule,
        InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule,
        InputIconModule, TooltipModule, TagModule
    ],
    templateUrl: './crud-page.component.html',
    styles: [`
        ::ng-deep .section-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--p-primary-color); border-bottom: 2px solid var(--p-primary-color); padding-bottom: 0.3rem; margin-bottom: 0.75rem; }
        ::ng-deep .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
        ::ng-deep .form-grid-single { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.5rem; }
        ::ng-deep .field { display: flex; flex-direction: column; gap: 0.3rem; }
        ::ng-deep .field label { font-size: 0.82rem; font-weight: 600; color: var(--text-color-secondary); }
        ::ng-deep .req { color: red; }
        ::ng-deep .err { color: red; font-size: 0.78rem; }
    `]
})
export class CrudPageComponent {
    @Input() title: string = 'Kayıt';
    @Input() data: any[] = [];
    @Input() columns: { field: string, header: string, pipe?: string }[] = [];
    @Input() loading: boolean = false;
    @Input() isEdit: boolean = false;
    @Input() globalFilterFields: string[] = [];
    @Input() dialogWidth: string = '600px';
    
    // Temel bileşenden (BaseCrudComponent) gelen showDialog referansı
    @Input() showDialog: boolean = false;
    @Output() showDialogChange = new EventEmitter<boolean>();

    // Form geçerliliğini kontrol etmek için
    @Input() formInvalid: boolean = false;

    // Şablon referansları
    @Input() formTemplate!: TemplateRef<any>;
    @Input() customColumnsTemplate?: TemplateRef<any>;

    // Olaylar
    @Output() onNew = new EventEmitter<void>();
    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() onDetail = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<void>();
    @Output() onHideDialog = new EventEmitter<void>();

    onGlobalFilter(dt: Table, event: Event) {
        dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    closeDialog() {
        this.showDialog = false;
        this.showDialogChange.emit(this.showDialog);
        this.onHideDialog.emit();
    }

    // Helper method for generic active/passive status handling if needed
    getSeverity(status: number | undefined | null, isDeleted?: boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        if (isDeleted) return 'danger';
        if (status === 1 || status === undefined || status === null || status === 0) return 'success';
        if (status === 2 || status === 3) return 'danger';
        if (status === 4) return 'warn';
        if (status === 5) return 'contrast';
        return 'secondary';
    }

    getStatusLabel(status: number | undefined | null, isDeleted?: boolean): string {
        if (isDeleted) return 'Pasif';
        if (status === 1 || status === undefined || status === null || status === 0) return 'Aktif';
        if (status === 2) return 'Pasif';
        if (status === 3) return 'Ödenmemiş';
        if (status === 4) return 'Belge Yenileme Bekliyor';
        if (status === 5) return 'Askıya Alındı';
        return '-';
    }

    // Checks if the row should be faded based on standard conditions
    isInactiveRow(row: any): boolean {
        return row?.isDeleted === true || row?.recordStatus === 2 || row?.recordStatus === 3;
    }
}
