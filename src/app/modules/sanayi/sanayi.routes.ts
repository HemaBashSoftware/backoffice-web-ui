import { Routes } from '@angular/router';

export default [
    { path: '',         loadComponent: () => import('./pages/dashboard/sanayi-dashboard.component').then(m => m.SanayiDashboardComponent) },
    { path: 'customer', loadComponent: () => import('./pages/customer/customer.component').then(m => m.SanayiCustomerComponent) },
    { path: 'customer/:id', loadComponent: () => import('./pages/customer/customer-detail/customer-detail.component').then(m => m.SanayiCustomerDetailComponent) },
    { path: 'job-tracking', loadComponent: () => import('./pages/job-tracking/job-tracking.component').then(m => m.SanayiJobTrackingComponent) },
    { path: 'job-tracking/:id', loadComponent: () => import('./pages/job-tracking/job-tracking-detail/job-tracking-detail.component').then(m => m.SanayiJobTrackingDetailComponent) },
    { path: 'vehicle', loadComponent: () => import('./pages/vehicle/vehicle.component').then(m => m.SanayiVehicleComponent) },
    { path: 'vehicle/:id', loadComponent: () => import('./pages/vehicle/vehicle-detail/vehicle-detail.component').then(m => m.SanayiVehicleDetailComponent) },
    { path: 'employee', loadComponent: () => import('./pages/employee/employee.component').then(m => m.SanayiEmployeeComponent) },
] as Routes;
