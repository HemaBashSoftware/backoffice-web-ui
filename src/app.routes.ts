import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    // Modül seçim ekranı — AppLayout yok, tam sayfa
    { path: '', component: DashboardComponent },

    // Modüller — AppLayout içinde (sidebar + topbar)
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'bpm',    loadChildren: () => import('./app/modules/bpm/bpm.routes') },
            { path: 'ysc',    loadChildren: () => import('./app/modules/ysc/ysc.routes') },
            { path: 'sanayi', loadChildren: () => import('./app/modules/sanayi/sanayi.routes') },
        ]
    },

    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
