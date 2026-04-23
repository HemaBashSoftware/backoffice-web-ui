import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { NotificationService } from '../../core/services/notification.service';
import { ActiveModuleService } from '../../core/services/active-module.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model(); let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model = computed<MenuItem[]>(() => {
        const mod = this.activeModuleService.activeModule();
        if (mod === 'bpm') return this.bpmMenu();
        if (mod === 'ysc') return this.yscMenu();
        if (mod === 'sanayi') return this.sanayiMenu();
        return this.rootMenu();
    });

    constructor(
        private notificationService: NotificationService,
        private activeModuleService: ActiveModuleService
    ) {
        this.notificationService.unreadCount$.subscribe(count => {
            // badge güncellemesi BPM menüsündeki bildirim öğesi için
        });
    }

    private rootMenu(): MenuItem[] {
        return [
            {
                label: 'BackOffice',
                items: [
                    { label: 'Ana Sayfa', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
        ];
    }

    private bpmMenu(): MenuItem[] {
        return [
            {
                label: 'BPM',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/bpm'] },
                    { label: 'Bildirimler', icon: 'pi pi-fw pi-bell', routerLink: ['/notifications'] },
                    { label: 'Müşteriler', icon: 'pi pi-fw pi-users', routerLink: ['/bpm/customer'] },
                    { label: 'Ürünler', icon: 'pi pi-fw pi-box', routerLink: ['/bpm/product'] },
                    { label: 'Ürün Teslimi', icon: 'pi pi-fw pi-inbox', routerLink: ['/bpm/product-incoming'] },
                    { label: 'Takvim', icon: 'pi pi-fw pi-calendar', routerLink: ['/bpm/reminder'] },
                    { label: 'Stok Yönetimi', icon: 'pi pi-fw pi-box', routerLink: ['/bpm/stock/movements'] },
                    { label: 'Siparişler', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/bpm/order'] },
                    { label: 'Gelir & Gider', icon: 'pi pi-fw pi-dollar', routerLink: ['/bpm/transaction'] },
                    { label: 'Faturalar', icon: 'pi pi-fw pi-file', routerLink: ['/bpm/invoice'] },
                    { label: 'Teklifler', icon: 'pi pi-fw pi-file-o', routerLink: ['/bpm/offer'] },
                    { label: 'Servis Talepleri', icon: 'pi pi-fw pi-wrench', routerLink: ['/bpm/service-request'] },
                ]
            },
            {
                label: 'Sistem',
                items: [
                    { label: 'Sistem Hareketleri', icon: 'pi pi-fw pi-history', routerLink: ['/activity-log'] },
                    { label: 'Profilim', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
                    { label: 'Çalışanlar', icon: 'pi pi-fw pi-id-card', routerLink: ['/bpm/employees'] },
                    { label: 'Şirket Ayarları', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/tenant'] },
                    { separator: true } as MenuItem,
                    { label: 'Modül Seçimi', icon: 'pi pi-fw pi-th-large', routerLink: ['/'] },
                ]
            }
        ];
    }

    private yscMenu(): MenuItem[] {
        return [
            {
                label: 'YSC',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/ysc'] },
                    { label: 'Raporlar', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/ysc/reports'] },
                    { label: 'Kullanıcılar', icon: 'pi pi-fw pi-users', routerLink: ['/ysc/users'] },
                    { label: 'Ayarlar', icon: 'pi pi-fw pi-cog', routerLink: ['/ysc/settings'] },
                ]
            },
            {
                label: 'Sistem',
                items: [
                    { label: 'Profilim', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
                    { separator: true } as MenuItem,
                    { label: 'Modül Seçimi', icon: 'pi pi-fw pi-th-large', routerLink: ['/'] },
                ]
            }
        ];
    }

    private sanayiMenu(): MenuItem[] {
        return [
            {
                label: 'Sanayi',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/sanayi'] },
                    { label: 'Üretim', icon: 'pi pi-fw pi-cog', routerLink: ['/sanayi/production'] },
                    { label: 'Stok', icon: 'pi pi-fw pi-box', routerLink: ['/sanayi/stock'] },
                    { label: 'Tedarik', icon: 'pi pi-fw pi-truck', routerLink: ['/sanayi/supply'] },
                ]
            },
            {
                label: 'Sistem',
                items: [
                    { label: 'Profilim', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
                    { separator: true } as MenuItem,
                    { label: 'Modül Seçimi', icon: 'pi pi-fw pi-th-large', routerLink: ['/'] },
                ]
            }
        ];
    }
}
