import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SupplierRegistrationModel } from '../../../request/models/supplier-registration.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierRegistrationService {
  private http: HttpClient = inject(HttpClient);

  registerSupplier(data: SupplierRegistrationModel) {
    return this.http.post('/registration-requests/submit', data);
  }
}
