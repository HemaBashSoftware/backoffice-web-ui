import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ysc-dashboard',
    standalone: true,
    imports: [CommonModule],
    styles: [`
        .stat-card {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .stat-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-color);
            line-height: 1;
        }
        .stat-label {
            font-size: 0.85rem;
            color: var(--text-color-secondary);
        }
        .stat-trend {
            font-size: 0.78rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            margin-top: 0.25rem;
        }
    `],
    template: `
        <div style="padding: 1.75rem;">

            <div style="margin-bottom: 2rem;">
                <h2 style="font-size:1.4rem; font-weight:700; color:var(--text-color); margin:0 0 0.3rem;">YSC Dashboard</h2>
                <p style="color:var(--text-color-secondary); font-size:0.875rem; margin:0;">Yönetim Sistemi Çözümleri</p>
            </div>

            <div style="margin-bottom: 1rem;">
                <span style="font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-color-secondary);">Müşteri Özeti</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1rem;">

                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(59,130,246,0.1);">
                        <i class="pi pi-users" style="color:#3b82f6;"></i>
                    </div>
                    <div>
                        <div class="stat-value">842</div>
                        <div class="stat-label">Toplam Müşteri</div>
                    </div>
                    <div class="stat-trend" style="color:#3b82f6;">
                        <i class="pi pi-arrow-up" style="font-size:0.7rem;"></i>
                        <span>Bu ay 11 yeni kayıt</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(16,185,129,0.1);">
                        <i class="pi pi-check-circle" style="color:#10b981;"></i>
                    </div>
                    <div>
                        <div class="stat-value">719</div>
                        <div class="stat-label">Aktif Müşteri</div>
                    </div>
                    <div class="stat-trend" style="color:#10b981;">
                        <i class="pi pi-arrow-up" style="font-size:0.7rem;"></i>
                        <span>%85.4 aktif oran</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:rgba(239,68,68,0.1);">
                        <i class="pi pi-times-circle" style="color:#ef4444;"></i>
                    </div>
                    <div>
                        <div class="stat-value">123</div>
                        <div class="stat-label">Pasif Müşteri</div>
                    </div>
                    <div class="stat-trend" style="color:#ef4444;">
                        <i class="pi pi-arrow-down" style="font-size:0.7rem;"></i>
                        <span>%14.6 pasif oran</span>
                    </div>
                </div>

            </div>
        </div>
    `
})
export class YscDashboardComponent {}
