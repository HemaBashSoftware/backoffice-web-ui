import { Routes } from '@angular/router';
import { BpmDashboardComponent } from './pages/dashboard/bpm-dashboard.component';

export default [
    { path: '', component: BpmDashboardComponent },
    // Feature sayfaları eklenince buraya gelecek:
    // { path: 'customer', loadChildren: () => import('./pages/customer/customer.routes') },
] as Routes;
