import { Routes } from '@angular/router';
import { SupplierLayout } from './layouts/supplier.layout/supplier.layout';
import { SupplierOnboardPage } from './features/supplier/pages/supplier-onboard.page/supplier-onboard.page';
import { SupplierRegisterPage } from './features/supplier/pages/supplier-register.page/supplier-register.page';
import { authGuard } from './core/guards/auth/auth-guard';
import { BuyerLayout } from './layouts/buyer.layout/buyer.layout';
import { supplierGuard } from './core/guards/supplier/supplier-guard';
import { buyerGuard } from './core/guards/buyer/buyer-guard';
import { supplierOnboardGuard } from './core/guards/supplier/supplier-onboard-guard';
import { SupplierWaitingReviewPage } from './features/supplier/pages/supplier-waiting-review.page/supplier-waiting-review.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'supplier',
    pathMatch: 'full',
  },
  {
    path: 'supplier',
    component: SupplierLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/supplier/supplier.routes').then((m) => m.routes),
      },
    ],
    canActivate: [authGuard, supplierGuard],
  },
  {
    path: 'buyer',
    component: BuyerLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/buyer/buyer.routes').then((m) => m.routes),
      },
    ],
    canActivate: [authGuard, buyerGuard],
  },
  {
    path: 'supplier/onboard',
    component: SupplierOnboardPage,
    canActivate: [supplierOnboardGuard],
  },
  {
    path: 'supplier/onboard/waiting',
    component: SupplierWaitingReviewPage,
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'auth/register/supplier',
    component: SupplierRegisterPage,
  },
  {
    path: 'error',
    loadChildren: () => import('./features/error/error.routes').then((m) => m.routes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/pages/not-found.page/not-found.page').then((m) => m.NotFoundPage),
  },
];
