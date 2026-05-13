import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type RfqStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';

export interface RfqItem {
  id: string;
  materialId: string;
  materialName?: string;
  quantity: number;
  unit?: string;
  specifications?: string;
  metadata?: Record<string, unknown>;
}

export interface Rfq {
  id: string;
  title: string;
  description?: string;
  currency?: string;
  status: RfqStatus;
  items: RfqItem[];
  deliveryDeadline?: string;
  submissionDeadline?: string;
  termsAndConditions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vendorCount?: number;
  quoteCount?: number;
}

export interface QuoteItem {
  rfqItemId: string;
  materialName?: string;
  unitPrice: number;
  quantity?: number;
  totalPrice?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface Quote {
  id: string;
  rfqId: string;
  vendorOrgId: string;
  vendorName?: string;
  items: QuoteItem[];
  totalAmount?: number;
  leadTimeDays?: number;
  validUntil?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateRfqDto {
  title: string;
  description?: string;
  currency?: string;
  deliveryDeadline?: string;
  submissionDeadline?: string;
  termsAndConditions?: string;
  items: {
    materialId: string;
    quantity: number;
    unit?: string;
    specifications?: string;
    metadata?: Record<string, unknown>;
  }[];
  metadata?: Record<string, unknown>;
}

export interface SubmitQuoteDto {
  items: { rfqItemId: string; unitPrice: number; notes?: string }[];
  leadTimeDays?: number;
  validUntil?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class RfqService {
  private readonly http = inject(HttpClient);

  create(data: CreateRfqDto) {
    return this.http.post<ApiResponse<Rfq>>('/rfqs', data);
  }

  listBuyer() {
    return this.http.get<ApiResponse<Rfq[]>>('/rfqs?role=buyer');
  }

  listVendor() {
    return this.http.get<ApiResponse<Rfq[]>>('/rfqs/vendor');
  }

  getById(id: string, role: 'buyer' | 'vendor' = 'buyer') {
    return this.http.get<ApiResponse<Rfq>>(`/rfqs/${id}?role=${role}`);
  }

  update(id: string, data: Partial<CreateRfqDto>) {
    return this.http.patch<ApiResponse<Rfq>>(`/rfqs/${id}`, data);
  }

  distribute(id: string, vendorOrgIds: string[]) {
    return this.http.post<ApiResponse<unknown>>(`/rfqs/${id}/distribute`, { vendorOrgIds });
  }

  getQuotes(id: string) {
    return this.http.get<ApiResponse<Quote[]>>(`/rfqs/${id}/quotes`);
  }

  award(id: string, quoteId: string) {
    return this.http.post<ApiResponse<unknown>>(`/rfqs/${id}/award`, { quoteId });
  }

  cancel(id: string) {
    return this.http.post<ApiResponse<unknown>>(`/rfqs/${id}/cancel`, {});
  }

  submitQuote(id: string, data: SubmitQuoteDto) {
    return this.http.post<ApiResponse<Quote>>(`/rfqs/${id}/quotes`, data);
  }

  markViewed(id: string) {
    return this.http.post<ApiResponse<unknown>>(`/rfqs/${id}/viewed`, {});
  }
}
