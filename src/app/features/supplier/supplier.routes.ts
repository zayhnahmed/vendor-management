import { Routes } from '@angular/router';
import { SupplierDashboardPage } from './pages/supplier-dashboard.page/supplier-dashboard.page';
import { SupplierRfqListPage } from './pages/rfq-list.page/rfq-list.page';
import { SupplierRfqDetailPage } from './pages/rfq-detail.page/rfq-detail.page';
import { SupplierPoListPage } from './pages/po-list.page/po-list.page';
import { SupplierPoDetailPage } from './pages/po-detail.page/po-detail.page';

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
  {
    path: 'purchase-orders',
    component: SupplierPoListPage,
  },
  {
    path: 'purchase-orders/:id',
    component: SupplierPoDetailPage,
  },
];
