import { Routes } from '@angular/router';
import { BpmDashboardComponent } from './pages/dashboard/bpm-dashboard.component';

export default [
    { path: '', component: BpmDashboardComponent },
    { path: 'customer', loadComponent: () => import('./pages/customer/customer.component').then(m => m.BpmCustomerComponent) },
    { path: 'customer/:id', loadComponent: () => import('./pages/customer/customer-detail/customer-detail.component').then(m => m.BpmCustomerDetailComponent) }
] as Routes;
