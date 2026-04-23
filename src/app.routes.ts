import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'admin', loadChildren: () => import('./app/pages/admin/admin.routes') },
            { path: 'customer', loadChildren: () => import('./app/pages/customer/customer.routes') },
            { path: 'product', loadChildren: () => import('./app/pages/product/product.routes') },
            { path: 'transaction', loadChildren: () => import('./app/pages/transaction/transaction.routes') },
            { path: 'invoice', loadChildren: () => import('./app/pages/invoice/invoice.routes') },
            { path: 'reminder', loadChildren: () => import('./app/pages/reminder/reminder.routes') },
            { path: 'notifications', loadChildren: () => import('./app/pages/notification/notification.routes').then(m => m.NOTIFICATION_ROUTES) },
            { path: 'activity-log', loadChildren: () => import('./app/pages/activity-log/activity-log.routes') },
            { path: 'definitions', loadChildren: () => import('./app/pages/definitions/definitions.routes') },
            { path: 'stock', loadChildren: () => import('./app/pages/stock/stock.routes').then(m => m.stockRoutes) },
            { path: 'product-incoming', loadChildren: () => import('./app/pages/product-incoming/product-incoming.routes') },
            { path: 'order', loadChildren: () => import('./app/pages/order/order.routes') },
            { path: 'offer', loadChildren: () => import('./app/pages/offer/offer.routes') },
            { path: 'service-request', loadChildren: () => import('./app/pages/service-request/service-request.routes') },
            { path: 'employees', loadChildren: () => import('./app/pages/employees/employees.routes') },
            { path: 'profile', loadChildren: () => import('./app/pages/profile/profile.routes') },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: 'print/:type/:id',
        loadComponent: () => import('./app/pages/print/print-document.component').then(m => m.PrintDocumentComponent)
    },
    { path: '**', redirectTo: '/notfound' }
];


