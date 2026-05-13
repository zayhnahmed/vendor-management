import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupplierOnboardService {
  private http = inject(HttpClient);

  getPendingTasks() {
    return this.http.get<any>('/vendor-onboarding/pending-tasks');
  }

  getStatus(relationshipId: string) {
    return this.http.get<any>(`/vendor-onboarding/relationships/${relationshipId}/status`);
  }

  saveStep1(relationshipId: string, data: any) {
    return this.http.post(`/vendor-onboarding/relationships/${relationshipId}/step1`, data);
  }

  saveStep2(relationshipId: string, data: any) {
    return this.http.post(`/vendor-onboarding/relationships/${relationshipId}/step2`, data);
  }

  saveStep3(relationshipId: string, data: any) {
    return this.http.post(`/vendor-onboarding/relationships/${relationshipId}/step3`, data);
  }

  submit(relationshipId: string) {
    return this.http.post(`/vendor-onboarding/relationships/${relationshipId}/submit`, {});
  }
}
