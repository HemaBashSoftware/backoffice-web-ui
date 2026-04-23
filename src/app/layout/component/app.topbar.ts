import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/img/hema_logo.jpg" alt="logo"
                     style="height:28px; border-radius:5px; object-fit:contain;" />
                <span>BackOffice</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()"
                    [title]="layoutService.isDarkTheme() ? 'Açık tema' : 'Koyu tema'">
                <i [class]="layoutService.isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"></i>
            </button>

            <a routerLink="/profile" class="layout-topbar-action" title="Profil">
                <i class="pi pi-user"></i>
            </a>

            <button type="button" class="layout-topbar-action" (click)="logout()" title="Çıkış">
                <i class="pi pi-sign-out"></i>
            </button>
        </div>
    </div>`
})
export class AppTopbar {
    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update(s => ({ ...s, darkTheme: !s.darkTheme }));
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
    }
}
