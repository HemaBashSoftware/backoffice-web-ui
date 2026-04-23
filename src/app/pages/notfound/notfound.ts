import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="flex flex-column align-items-center justify-content-center min-h-screen gap-4">
            <span class="text-8xl font-bold text-300">404</span>
            <p class="text-xl text-600">Sayfa bulunamadı.</p>
            <a routerLink="/" class="p-button p-component">Ana Sayfaya Dön</a>
        </div>
    `
})
export class Notfound {}
