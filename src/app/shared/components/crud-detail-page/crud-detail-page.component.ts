import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-crud-detail-page',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, TagModule, SelectModule, FormsModule],
    templateUrl: './crud-detail-page.component.html'
})
export class CrudDetailPageComponent {
    @Input() title: string = '';
    @Input() loading: boolean = false;
    
    // Header Status properties
    @Input() status: number = 1;
    @Input() isDeleted: boolean = false;

    // Status Dialog properties
    @Input() showStatusDialog: boolean = false;
    @Input() selectedStatus: number = 1;
    @Input() statusOptions: { label: string, value: number }[] = [];
    @Output() showStatusDialogChange = new EventEmitter<boolean>();
    @Output() selectedStatusChange = new EventEmitter<number>();
    
    // Edit Dialog properties
    @Input() showEditDialog: boolean = false;
    @Input() editDialogWidth: string = '600px';
    @Input() formInvalid: boolean = false;
    @Output() showEditDialogChange = new EventEmitter<boolean>();

    // Templates
    @Input() quickInfoTemplate?: TemplateRef<any>;
    @Input() contentTemplate?: TemplateRef<any>;
    @Input() editFormTemplate!: TemplateRef<any>;

    // Events
    @Output() onBack = new EventEmitter<void>();
    @Output() onSaveStatus = new EventEmitter<number>();
    @Output() onSaveEdit = new EventEmitter<void>();

    // Status mapping for tags (shared standard)
    getSeverity(status: number, isDeleted?: boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        if (isDeleted) return 'danger';
        if (status === 1 || status === undefined || status === null || status === 0) return 'success';
        if (status === 2 || status === 3) return 'danger';
        if (status === 4) return 'warn';
        if (status === 5) return 'contrast';
        return 'secondary';
    }

    getStatusLabel(status: number, isDeleted?: boolean): string {
        if (isDeleted) return 'Pasif';
        if (status === 1 || status === undefined || status === null || status === 0) return 'Aktif';
        if (status === 2) return 'Pasif';
        if (status === 3) return 'Ödenmemiş';
        if (status === 4) return 'Belge Yenileme Bekliyor';
        if (status === 5) return 'Askıya Alındı';
        return '-';
    }
}
