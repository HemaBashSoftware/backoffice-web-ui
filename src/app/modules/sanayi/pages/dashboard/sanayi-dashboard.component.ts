import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-sanayi-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="p-4">
            <div class="mb-5">
                <h2 class="text-3xl font-bold text-900 mb-1">Sanayi</h2>
                <p class="text-600">Sanayi Operasyonları</p>
            </div>

            <div class="grid">
                @for (item of quickLinks; track item.route) {
                    <div class="col-12 sm:col-6 lg:col-3 p-2">
                        <p-card styleClass="cursor-pointer hover:shadow-4 transition-all transition-duration-200"
                            (click)="router.navigateByUrl(item.route)">
                            <div class="flex align-items-center gap-3">
                                <div class="border-round p-3" [ngClass]="item.color">
                                    <i [class]="item.icon" style="font-size: 1.5rem;"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-900">{{ item.label }}</div>
                                    <div class="text-sm text-600">{{ item.sub }}</div>
                                </div>
                            </div>
                        </p-card>
                    </div>
                }
            </div>
        </div>
    `
})
export class SanayiDashboardComponent {
    quickLinks = [
        { label: 'Üretim', sub: 'Üretim takibi', icon: 'pi pi-cog', route: '/sanayi/production', color: 'bg-orange-100 text-orange-600' },
        { label: 'Stok', sub: 'Ham madde & ürün stok', icon: 'pi pi-box', route: '/sanayi/stock', color: 'bg-teal-100 text-teal-600' },
        { label: 'Tedarik', sub: 'Tedarikçi yönetimi', icon: 'pi pi-truck', route: '/sanayi/supply', color: 'bg-purple-100 text-purple-600' },
    ];

    constructor(public router: Router) {}
}
