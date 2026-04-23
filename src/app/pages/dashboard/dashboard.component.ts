import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

interface ModuleCard {
    id: string;
    label: string;
    description: string;
    icon: string;
    route: string;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="flex flex-column align-items-center justify-content-center min-h-screen p-5">
            <div class="text-center mb-6">
                <h1 class="text-4xl font-bold text-900 mb-2">BackOffice</h1>
                <p class="text-600 text-lg">Erişmek istediğiniz modülü seçin</p>
            </div>

            <div class="grid">
                @for (card of modules; track card.id) {
                    <div class="col-12 md:col-4 p-3">
                        <p-card styleClass="module-card cursor-pointer hover:shadow-6 transition-all transition-duration-200"
                            (click)="navigate(card.route)">
                            <div class="flex flex-column align-items-center text-center p-4 gap-4">
                                <div class="border-round-xl p-4" [ngClass]="card.color">
                                    <i [class]="card.icon" style="font-size: 2.5rem;"></i>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-900 mb-2">{{ card.label }}</h2>
                                    <p class="text-600 m-0">{{ card.description }}</p>
                                </div>
                                <p-button
                                    label="Giriş Yap"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    [outlined]="true"
                                    (onClick)="navigate(card.route)" />
                            </div>
                        </p-card>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep .module-card {
            border-radius: 1rem;
            border: 1px solid var(--surface-200);
        }
        :host ::ng-deep .module-card:hover {
            border-color: var(--primary-color);
        }
    `]
})
export class DashboardComponent {
    modules: ModuleCard[] = [
        {
            id: 'bpm',
            label: 'BPM',
            description: 'İş Süreçleri Yönetimi — Müşteri, sipariş, fatura ve servis takibi',
            icon: 'pi pi-sitemap',
            route: '/bpm',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 'ysc',
            label: 'YSC',
            description: 'Yönetim Sistemi Çözümleri — Raporlama ve analiz araçları',
            icon: 'pi pi-chart-bar',
            route: '/ysc',
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 'sanayi',
            label: 'Sanayi',
            description: 'Sanayi Operasyonları — Üretim ve stok yönetimi',
            icon: 'pi pi-cog',
            route: '/sanayi',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    constructor(private router: Router) {}

    navigate(route: string) {
        this.router.navigateByUrl(route);
    }
}
