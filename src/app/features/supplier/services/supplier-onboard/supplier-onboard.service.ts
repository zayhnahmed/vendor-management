import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface PendingTask {
  relationshipId: string;
  buyerOrgId: string;
  buyerName?: string;
  status: string;
  createdAt?: string;
}

export interface OnboardingStatus {
  allStepsCompleted: boolean;
  currentStep: string;
  vendorStatus: string;
  nextStepToComplete: string;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierOnboardService {
  private http: HttpClient = inject(HttpClient);

  getPendingTasks() {
    return this.http.get<ApiResponse<PendingTask[]>>('/vendor-onboarding/pending-tasks');
  }

  getStatus(relationshipId: string) {
    return this.http.get<ApiResponse<OnboardingStatus>>(
      `/vendor-onboarding/relationships/${relationshipId}/status`,
    );
  }

  saveGeneralInfo(relationshipId: string, data: any) {
    return this.http.post<ApiResponse<any>>(
      `/vendor-onboarding/relationships/${relationshipId}/step1`,
      data,
    );
  }

  saveFinanceInfo(relationshipId: string, data: any) {
    return this.http.post<ApiResponse<any>>(
      `/vendor-onboarding/relationships/${relationshipId}/step2`,
      data,
    );
  }

  saveQualityInfo(relationshipId: string, data: any) {
    return this.http.post<ApiResponse<any>>(
      `/vendor-onboarding/relationships/${relationshipId}/step3`,
      data,
    );
  }

  submit(relationshipId: string) {
    return this.http.post<ApiResponse<any>>(
      `/vendor-onboarding/relationships/${relationshipId}/submit`,
      {},
    );
  }
}
