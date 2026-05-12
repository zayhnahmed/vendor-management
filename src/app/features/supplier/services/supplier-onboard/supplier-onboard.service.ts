import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SupplierGeneralInfoModel } from '../../../request/models/suppplier-general-info.model';
import { SupplierFinanceInfoModel } from '../../../request/models/supplier-finance-info.model';
import { SupplierQualityInfoModel } from '../../../request/models/supplier-quality-info.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierOnboardService {
  private http: HttpClient = inject(HttpClient);

  getStatus() {
    return this.http.get<any>('/onboarding/status');
  }

  getPrefillData() {
    return this.http.get<any>('/onboarding/prefill');
  }

  getGeneralInfo() {
    return this.http
      .get('/onboarding/step1/data')
      .pipe(map((response: any) => response.data as SupplierGeneralInfoModel));
  }

  saveGeneralInfo(data: SupplierGeneralInfoModel) {
    return this.http.post('/onboarding/step1', data);
  }

  updateGeneralInfo(data: SupplierGeneralInfoModel) {
    return this.http.post('/onboarding/step1/update', data);
  }

  getFinanceInfo() {
    return this.http
      .get('/onboarding/step2/data')
      .pipe(map((response: any) => response.data as SupplierFinanceInfoModel));
  }

  saveFinanceInfo(data: SupplierFinanceInfoModel) {
    return this.http.post('/onboarding/step2', data);
  }

  updateFinanceInfo(data: SupplierFinanceInfoModel) {
    return this.http.post('/onboarding/step2/update', data);
  }

  getQualityInfo() {
    return this.http
      .get('/onboarding/step3/data')
      .pipe(map((response: any) => response.data as SupplierQualityInfoModel));
  }

  saveQualityInfo(data: SupplierQualityInfoModel) {
    return this.http.post('/onboarding/step3/save', data);
  }

  updateQualityInfo(data: SupplierQualityInfoModel) {
    return this.http.post('/onboarding/step3/update', data);
  }

  submitFinalInfo(data: SupplierQualityInfoModel) {
    return this.http.post('/onboarding/step3/submit', data);
  }
}
