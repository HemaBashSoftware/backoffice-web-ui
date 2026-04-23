import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-bpm-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="p-4">
            <div class="mb-5">
                <h2 class="text-3xl font-bold text-900 mb-1">BPM</h2>
                <p class="text-600">İş Süreçleri Yönetimi</p>
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
export class BpmDashboardComponent {
    quickLinks = [
        { label: 'Müşteriler', sub: 'Müşteri listesi & CRUD', icon: 'pi pi-users', route: '/bpm/customer', color: 'bg-blue-100 text-blue-600' },
        { label: 'Siparişler', sub: 'Sipariş yönetimi', icon: 'pi pi-shopping-cart', route: '/bpm/order', color: 'bg-green-100 text-green-600' },
        { label: 'Faturalar', sub: 'Alış / Satış faturaları', icon: 'pi pi-file', route: '/bpm/invoice', color: 'bg-purple-100 text-purple-600' },
        { label: 'Teklifler', sub: 'Teklif yönetimi', icon: 'pi pi-file-o', route: '/bpm/offer', color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Servis Talepleri', sub: 'Talep takibi', icon: 'pi pi-wrench', route: '/bpm/service-request', color: 'bg-orange-100 text-orange-600' },
        { label: 'Stok', sub: 'Stok yönetimi', icon: 'pi pi-box', route: '/bpm/stock', color: 'bg-teal-100 text-teal-600' },
        { label: 'Çalışanlar', sub: 'Personel yönetimi', icon: 'pi pi-id-card', route: '/bpm/employees', color: 'bg-pink-100 text-pink-600' },
        { label: 'Raporlar', sub: 'Gelir & Gider', icon: 'pi pi-chart-line', route: '/bpm/transaction', color: 'bg-indigo-100 text-indigo-600' },
    ];

    constructor(public router: Router) {}
}
