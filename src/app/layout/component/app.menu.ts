import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ActiveModuleService } from '../../core/services/active-module.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model(); let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu {
    model = computed<MenuItem[]>(() => {
        const mod = this.activeModuleService.activeModule();
        const prefix = mod ? `/${mod}` : '';

        return [
            {
                label: mod ? mod.toUpperCase() : 'Menü',
                items: [
                    { label: 'Dashboard',   icon: 'pi pi-fw pi-home',  routerLink: [`${prefix}`] },
                    { label: 'Müşteriler',  icon: 'pi pi-fw pi-users', routerLink: [`${prefix}/customer`] },
                ]
            },
            {
                label: 'Sistem',
                items: [
                    { label: 'Modül Seçimi', icon: 'pi pi-fw pi-th-large', routerLink: ['/'] },
                ]
            }
        ];
    });

    constructor(private activeModuleService: ActiveModuleService) {}
}
