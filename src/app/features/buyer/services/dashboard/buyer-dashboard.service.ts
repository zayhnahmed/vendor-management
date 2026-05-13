import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface BuyerDashboardStats {
  totalRfqs: number;
  openRfqs: number;
  pendingReview: number;
  approvedVendors: number;
  totalVendors: number;
  newVendors: number;
  approvalRate: string;
  purchaseOrders: {
    total: number;
    active: number;
  };
  invoices: {
    paid: number;
    pending: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BuyerDashboardService {
  private readonly http = inject(HttpClient);

  getStats() {
    return this.http.get<{ success: boolean; data: BuyerDashboardStats }>('/dashboard/buyer');
  }
}
