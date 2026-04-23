import { Routes } from '@angular/router';
import { YscDashboardComponent } from './pages/dashboard/ysc-dashboard.component';

export default [
    { path: '', component: YscDashboardComponent },
    { path: 'customer', loadComponent: () => import('./pages/customer/customer.component').then(m => m.YscCustomerComponent) },
    { path: 'customer/:id', loadComponent: () => import('./pages/customer/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },
    { path: 'definitions/ysc-types', loadComponent: () => import('./pages/definitions/ysc-type/ysc-type.component').then(m => m.YscTypeComponent) },
    { path: 'definitions/standart-numbers', loadComponent: () => import('./pages/definitions/standart-number/standart-number.component').then(m => m.StandartNumberComponent) },
] as Routes;
