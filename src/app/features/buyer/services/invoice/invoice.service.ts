import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export interface Invoice {
  id: string;
  purchaseOrderId: string;
  poNumber?: string;
  vendorOrgId?: string;
  vendorName?: string;
  buyerOrgId?: string;
  buyerName?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  purchaseOrderId: string;
  amount: number;
  currency?: string;
  dueDate?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInvoiceDto {
  status?: InvoiceStatus;
  amount?: number;
  dueDate?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);

  create(data: CreateInvoiceDto) {
    return this.http.post<ApiResponse<Invoice>>('/invoices', data);
  }

  list(role: 'buyer' | 'vendor', status?: InvoiceStatus) {
    const params: Record<string, string> = { role };
    if (status) params['status'] = status;
    return this.http.get<ApiResponse<Invoice[]>>('/invoices', { params });
  }

  getById(id: string, role: 'buyer' | 'vendor') {
    return this.http.get<ApiResponse<Invoice>>(`/invoices/${id}`, {
      params: { role },
    });
  }

  update(id: string, data: UpdateInvoiceDto) {
    return this.http.patch<ApiResponse<Invoice>>(`/invoices/${id}`, data);
  }

  pay(id: string) {
    return this.http.post<ApiResponse<Invoice>>(`/invoices/${id}/pay`, {});
  }

  cancel(id: string) {
    return this.http.post<ApiResponse<Invoice>>(`/invoices/${id}/cancel`, {});
  }
}
