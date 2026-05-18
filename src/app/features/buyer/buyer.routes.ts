import { Routes } from '@angular/router';
import { BuyerDashboardPage } from './pages/buyer-dashboard.page/buyer-dashboard.page';
import { BuyerRequestsPage } from './pages/buyer-requests.page/buyer-requests.page';
import { SupplierRequestPage } from './pages/supplier-request.page/supplier-request.page';
import { SupplierRegRequestPage } from './pages/supplier-reg-request.page/supplier-reg-request.page';
import { SupplierRequestViewPage } from '../request/pages/supplier-request-view.page/supplier-request-view.page';
import { SupplierRegRequestViewPage } from '../request/pages/supplier-reg-request-view.page/supplier-reg-request-view.page';
import { RfqListPage } from './pages/rfq-list.page/rfq-list.page';
import { RfqCreatePage } from './pages/rfq-create.page/rfq-create.page';
import { RfqDetailPage } from './pages/rfq-detail.page/rfq-detail.page';
import { PoListPage } from './pages/po-list.page/po-list.page';
import { PoCreatePage } from './pages/po-create.page/po-create.page';
import { PoDetailPage } from './pages/po-detail.page/po-detail.page';
import { VendorOnboardingListPage } from './pages/vendor-onboarding-list.page/vendor-onboarding-list.page';
import { VendorOnboardingDetailPage } from './pages/vendor-onboarding-detail.page/vendor-onboarding-detail.page';
import { BuyerInvoiceListPage } from './pages/invoice-list.page/invoice-list.page';
import { BuyerInvoiceDetailPage } from './pages/invoice-detail.page/invoice-detail.page';

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
  {
    path: 'rfqs',
    component: RfqListPage,
  },
  {
    path: 'rfqs/create',
    component: RfqCreatePage,
  },
  {
    path: 'rfqs/:id',
    component: RfqDetailPage,
  },
  {
    path: 'purchase-orders',
    component: PoListPage,
  },
  {
    path: 'purchase-orders/create',
    component: PoCreatePage,
  },
  {
    path: 'purchase-orders/:id',
    component: PoDetailPage,
  },
  {
    path: 'vendor-onboarding',
    component: VendorOnboardingListPage,
  },
  {
    path: 'vendor-onboarding/:id',
    component: VendorOnboardingDetailPage,
  },
  {
    path: 'invoices',
    component: BuyerInvoiceListPage,
  },
  {
    path: 'invoices/:id',
    component: BuyerInvoiceDetailPage,
  },
];
