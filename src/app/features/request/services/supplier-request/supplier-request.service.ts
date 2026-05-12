import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  SupplierRegReqDetailApiResponse,
  SupplierReqDetailApiResponse,
} from '../../../request/models/supplier-registration.model';
import {
  SupplierRegRequestResponse,
  SupplierRequestResponse,
} from '../../models/supplier-request-item.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierRequestService {
  private http: HttpClient = inject(HttpClient);

  getRequests(page: number, limit: number) {
    return this.http.get<SupplierRequestResponse>(`/admin/requests?page=${page}&limit=${limit}`);
  }

  getRegistrationRequests(page: number, limit: number) {
    return this.http.get<SupplierRegRequestResponse>(
      `/admin/vendors/pending?page=${page}&limit=${limit}`,
    );
  }

  getSupplierRequestsByApplicationId(applicationId: string) {
    return this.http.get<SupplierReqDetailApiResponse>(`/admin/requests/${applicationId}`);
  }

  getSupplierDetailById(id: string) {
    return this.http.get<SupplierRegReqDetailApiResponse>(`/admin/vendors/${id}`);
  }

  approveApplicationRequest(id: string) {
    return this.http.post('/admin/requests/approve', {
      applicationId: id,
      notes: 'Welcome to our vendor program!',
    });
  }

  approveRegistrationRequest(id: string) {
    return this.http.post('/admin/vendors/approve', {
      userId: id,
      notes: 'Thank you',
    });
  }
}
