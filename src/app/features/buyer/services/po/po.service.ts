import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type PoStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'ACKNOWLEDGED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'INVOICED';

export interface PoItem {
  id: string;
  materialId: string;
  materialName?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  totalPrice?: number;
  deliveredQty?: number;
  metadata?: Record<string, unknown>;
}

export interface Shipment {
  id: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  status: PoStatus;
  vendorOrgId: string;
  vendorName?: string;
  buyerOrgId?: string;
  buyerName?: string;
  rfqId?: string;
  quoteId?: string;
  items: PoItem[];
  shipments?: Shipment[];
  deliveryDeadline?: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePoFromRfqDto {
  rfqId: string;
  quoteId: string;
  deliveryDeadline?: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
}

export interface CreatePoItemDto {
  materialId: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}

export interface CreateManualPoDto {
  vendorOrgId: string;
  items: CreatePoItemDto[];
  deliveryDeadline?: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
}

export interface UpdatePoDto {
  status?: PoStatus;
  deliveryDeadline?: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
}

export interface CreateShipmentDto {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
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
export class PoService {
  private readonly http = inject(HttpClient);

  createFromRfq(data: CreatePoFromRfqDto) {
    return this.http.post<ApiResponse<PurchaseOrder>>('/purchase-orders/from-rfq', data);
  }

  createManual(data: CreateManualPoDto) {
    return this.http.post<ApiResponse<PurchaseOrder>>('/purchase-orders/manual', data);
  }

  list(role: 'buyer' | 'vendor', status?: PoStatus) {
    const params: Record<string, string> = { role };
    if (status) params['status'] = status;
    return this.http.get<ApiResponse<PurchaseOrder[]>>('/purchase-orders', { params });
  }

  getById(id: string, role: 'buyer' | 'vendor') {
    return this.http.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`, {
      params: { role },
    });
  }

  update(id: string, data: UpdatePoDto) {
    return this.http.patch<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`, data);
  }

  issue(id: string) {
    return this.http.post<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/issue`, {});
  }

  acknowledge(id: string) {
    return this.http.post<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/acknowledge`, {});
  }

  addShipment(id: string, data: CreateShipmentDto) {
    return this.http.post<ApiResponse<Shipment>>(`/purchase-orders/${id}/shipments`, data);
  }

  deliver(id: string) {
    return this.http.post<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/deliver`, {});
  }

  cancel(id: string, role: 'buyer' | 'vendor') {
    return this.http.post<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/cancel`, {}, {
      params: { role },
    });
  }

  recordPartialDelivery(id: string, itemId: string, data: { deliveredQty: number }) {
    return this.http.patch<ApiResponse<PoItem>>(
      `/purchase-orders/${id}/items/${itemId}/delivery`,
      data,
    );
  }
}
