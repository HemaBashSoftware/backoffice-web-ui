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

        const systemItem: MenuItem = {
            label: 'Sistem',
            items: [
                { label: 'Modül Seçimi', icon: 'pi pi-fw pi-th-large', routerLink: ['/'] },
            ]
        };

        if (mod === 'ysc') {
            return [
                {
                    label: 'YSC',
                    items: [
                        { label: 'Dashboard',  icon: 'pi pi-fw pi-home',  routerLink: ['/ysc'] },
                        { label: 'Müşteriler', icon: 'pi pi-fw pi-users', routerLink: ['/ysc/customer'] },
                    ]
                },
                {
                    label: 'Tanım',
                    items: [
                        { label: 'YSC Tipleri',        icon: 'pi pi-fw pi-tags',   routerLink: ['/ysc/definitions/ysc-types'] },
                        { label: 'Standart Numaralar', icon: 'pi pi-fw pi-hashtag', routerLink: ['/ysc/definitions/standart-numbers'] },
                    ]
                },
                systemItem,
            ];
        }

        return [
            {
                label: mod ? mod.toUpperCase() : 'Menü',
                items: [
                    { label: 'Dashboard',  icon: 'pi pi-fw pi-home',  routerLink: [prefix || '/'] },
                    { label: 'Müşteriler', icon: 'pi pi-fw pi-users', routerLink: [`${prefix}/customer`] },
                ]
            },
            systemItem,
        ];
    });

    constructor(private activeModuleService: ActiveModuleService) {}
}
