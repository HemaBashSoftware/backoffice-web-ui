import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-ysc-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="p-4">
            <div class="mb-5">
                <h2 class="text-3xl font-bold text-900 mb-1">YSC</h2>
                <p class="text-600">Yönetim Sistemi Çözümleri</p>
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
export class YscDashboardComponent {
    quickLinks = [
        { label: 'Raporlar', sub: 'Analitik & raporlar', icon: 'pi pi-chart-bar', route: '/ysc/reports', color: 'bg-green-100 text-green-600' },
        { label: 'Kullanıcılar', sub: 'Kullanıcı yönetimi', icon: 'pi pi-users', route: '/ysc/users', color: 'bg-blue-100 text-blue-600' },
        { label: 'Ayarlar', sub: 'Sistem ayarları', icon: 'pi pi-cog', route: '/ysc/settings', color: 'bg-gray-100 text-gray-600' },
    ];

    constructor(public router: Router) {}
}
