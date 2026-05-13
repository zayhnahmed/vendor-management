import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface VendorDashboardStats {
  openRfqs: number;
  pendingQuotes: number;
  activeOrders: number;
  invoices: {
    paid: number;
    pending: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VendorDashboardService {
  private readonly http = inject(HttpClient);

  getStats() {
    return this.http.get<{ success: boolean; data: VendorDashboardStats }>('/dashboard/vendor');
  }
}
