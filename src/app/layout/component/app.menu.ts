import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Servis Takip',
                items: [
                    {
                        label: 'Ana Sayfa',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    },
                    {
                        label: 'Bildirimler',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/notifications'],
                        badge: ''
                    },
                    {
                        label: 'Müşteriler',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/customer']
                    },
                    {
                        label: 'Ürünler',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/product']
                    },
                    {
                        label: 'Ürün Teslimi',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['/product-incoming']
                    },
                    {
                        label: 'Takvim',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/reminder']
                    },
                    {
                        label: 'Stok Yönetimi',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/stock/movements']
                    },
                    {
                        label: 'Siparişler',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/order']
                    },
                    {
                        label: 'Gelir & Gider',
                        icon: 'pi pi-fw pi-dollar',
                        routerLink: ['/transaction']
                    },
                    {
                        label: 'Faturalar',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/invoice']
                    },
                    {
                        label: 'Teklifler',
                        icon: 'pi pi-fw pi-file-o',
                        routerLink: ['/offer']
                    },
                    {
                        label: 'Servis Talepleri',
                        icon: 'pi pi-fw pi-wrench',
                        routerLink: ['/service-request']
                    },
                    {
                        label: 'Fatura Kes',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/invoice/create']
                    }
                ]
            },
            {
                label: 'Tanımlar',
                items: [
                    {
                        label: 'Ürün Kategori Tanımlama',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/definitions/product-categories']
                    },
                    {
                        label: 'Tedarikçiler',
                        icon: 'pi pi-fw pi-truck',
                        routerLink: ['/definitions/vendors']
                    },
                    {
                        label: 'Servis Talep Tipleri',
                        icon: 'pi pi-fw pi-wrench',
                        routerLink: ['/definitions/service-request-types']
                    },
                    {
                        label: 'Gelir & Gider Kategori Tanımlama',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/definitions/transaction-categories']
                    }
                ]
            },
            {
                label: 'Sistem',
                items: [
                    {
                        label: 'Sistem Hareketleri',
                        icon: 'pi pi-fw pi-history',
                        routerLink: ['/activity-log']
                    },
                    {
                        label: 'Şirket Ayarları',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/admin/tenant']
                    },
                    {
                        label: 'Profilim',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/profile']
                    },
                    {
                        label: 'Çalışanlar',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/employees']
                    }
                ]
            }
        ];

        this.notificationService.unreadCount$.subscribe(count => {
            const homeGroup = this.model.find(x => x.label === 'Servis Takip');
            if (homeGroup && homeGroup.items) {
                const noteItem = (homeGroup.items as MenuItem[]).find(x => x.label === 'Bildirimler');
                if (noteItem) {
                    noteItem.badge = count > 0 ? count.toString() : '';
                }
            }
        });
    }
}