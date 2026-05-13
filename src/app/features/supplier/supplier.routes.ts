import { Routes } from '@angular/router';
import { SupplierDashboardPage } from './pages/supplier-dashboard.page/supplier-dashboard.page';
import { SupplierRfqListPage } from './pages/rfq-list.page/rfq-list.page';
import { SupplierRfqDetailPage } from './pages/rfq-detail.page/rfq-detail.page';

export const routes: Routes = [
  {
    path: '',
    component: SupplierDashboardPage,
  },
  {
    path: 'rfqs',
    component: SupplierRfqListPage,
  },
  {
    path: 'rfqs/:id',
    component: SupplierRfqDetailPage,
  },
];
