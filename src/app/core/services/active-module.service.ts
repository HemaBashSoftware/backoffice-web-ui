import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type ActiveModule = 'bpm' | 'ysc' | 'sanayi' | null;

@Injectable({ providedIn: 'root' })
export class ActiveModuleService {
    activeModule = signal<ActiveModule>(null);

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe((e) => {
                const url = e.urlAfterRedirects;
                if (url.startsWith('/bpm')) this.activeModule.set('bpm');
                else if (url.startsWith('/ysc')) this.activeModule.set('ysc');
                else if (url.startsWith('/sanayi')) this.activeModule.set('sanayi');
                else this.activeModule.set(null);
            });
    }
}
