import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ModuleCard {
    id: string;
    label: string;
    description: string;
    icon: string;
    route: string;
    accent: string;
    iconBg: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
            background: var(--surface-ground);
        }

        .module-card {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 16px;
            padding: 2rem;
            cursor: pointer;
            transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        .module-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }

        .module-card:hover .card-arrow {
            transform: translateX(4px);
            opacity: 1;
        }

        .card-icon-wrap {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .card-arrow {
            opacity: 0.4;
            transition: transform 0.18s ease, opacity 0.18s ease;
            font-size: 0.875rem;
            color: var(--text-color-secondary);
        }

        .topbar {
            position: sticky;
            top: 0;
            z-index: 10;
            background: var(--surface-card);
            border-bottom: 1px solid var(--surface-border);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logout-btn {
            background: none;
            border: 1px solid var(--surface-border);
            border-radius: 8px;
            padding: 0.4rem 0.9rem;
            cursor: pointer;
            color: var(--text-color-secondary);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            transition: background 0.15s, color 0.15s;
        }

        .logout-btn:hover {
            background: var(--surface-hover);
            color: var(--text-color);
        }
    `],
    template: `
        <!-- Üst Bar -->
        <div class="topbar">
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <img src="assets/img/hema_logo.jpg" alt="logo" style="height:32px; border-radius:6px;" />
                <span style="font-weight:700; font-size:1rem; color:var(--text-color);">HemaBash Software</span>
                <span style="color:var(--surface-border); margin:0 0.25rem;">|</span>
                <span style="font-size:0.875rem; color:var(--text-color-secondary);">BackOffice</span>
            </div>
            <button class="logout-btn" (click)="logout()">
                <i class="pi pi-sign-out"></i>
                Çıkış
            </button>
        </div>

        <!-- İçerik -->
        <div style="max-width:900px; margin:0 auto; padding:3rem 1.5rem;">

            <div style="margin-bottom:2.5rem;">
                <h1 style="font-size:1.75rem; font-weight:700; color:var(--text-color); margin:0 0 0.5rem;">
                    Modül Seçimi
                </h1>
                <p style="color:var(--text-color-secondary); font-size:0.95rem; margin:0;">
                    Çalışmak istediğiniz modülü seçin.
                </p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.25rem;">
                @for (card of modules; track card.id) {
                    <div class="module-card" (click)="navigate(card.route)">
                        <div style="display:flex; align-items:flex-start; justify-content:space-between;">
                            <div class="card-icon-wrap" [style]="card.iconBg">
                                <i [class]="card.icon" [style]="'color:' + card.accent"></i>
                            </div>
                            <i class="pi pi-arrow-right card-arrow"></i>
                        </div>
                        <div>
                            <div style="font-size:1.15rem; font-weight:700; color:var(--text-color); margin-bottom:0.35rem;">
                                {{ card.label }}
                            </div>
                            <div style="font-size:0.85rem; color:var(--text-color-secondary); line-height:1.5;">
                                {{ card.description }}
                            </div>
                        </div>
                    </div>
                }
            </div>

        </div>
    `
})
export class DashboardComponent {
    modules: ModuleCard[] = [
        {
            id: 'bpm',
            label: 'BPM',
            description: 'İş Süreçleri Yönetimi — müşteri, sipariş, fatura ve servis takibi.',
            icon: 'pi pi-sitemap',
            route: '/bpm',
            accent: '#3b82f6',
            iconBg: 'background:rgba(59,130,246,0.1);'
        },
        {
            id: 'ysc',
            label: 'YSC',
            description: 'Yönetim Sistemi Çözümleri — raporlama ve analiz araçları.',
            icon: 'pi pi-chart-bar',
            route: '/ysc',
            accent: '#10b981',
            iconBg: 'background:rgba(16,185,129,0.1);'
        },
        {
            id: 'sanayi',
            label: 'Sanayi',
            description: 'Sanayi Operasyonları — üretim ve stok yönetimi.',
            icon: 'pi pi-cog',
            route: '/sanayi',
            accent: '#f59e0b',
            iconBg: 'background:rgba(245,158,11,0.1);'
        }
    ];

    constructor(private router: Router) {}

    navigate(route: string) {
        this.router.navigateByUrl(route);
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/auth/login');
    }
}
