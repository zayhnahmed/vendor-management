import { Routes } from '@angular/router';
import { BuyerDashboardPage } from './pages/buyer-dashboard.page/buyer-dashboard.page';
import { BuyerRequestsPage } from './pages/buyer-requests.page/buyer-requests.page';
import { SupplierRequestPage } from './pages/supplier-request.page/supplier-request.page';
import { SupplierRegRequestPage } from './pages/supplier-reg-request.page/supplier-reg-request.page';
import { SupplierRequestViewPage } from '../request/pages/supplier-request-view.page/supplier-request-view.page';
import { SupplierRegRequestViewPage } from '../request/pages/supplier-reg-request-view.page/supplier-reg-request-view.page';

export const routes: Routes = [
  {
    path: '',
    component: BuyerDashboardPage,
  },
  {
    path: 'requests',
    component: BuyerRequestsPage,
  },
  {
    path: 'application-requests',
    component: SupplierRequestPage,
  },
  {
    path: 'registration-requests',
    component: SupplierRegRequestPage,
  },
  {
    path: 'application-requests/:id',
    component: SupplierRequestViewPage,
  },
  {
    path: 'registration-requests/:id',
    component: SupplierRegRequestViewPage,
  },
];
