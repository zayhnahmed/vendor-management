import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface VendorOnboardingStatus {
  allStepsCompleted: boolean;
  currentStep: string;
  vendorStatus: string;
  nextStepToComplete: string;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
  generalInfo?: Record<string, unknown>;
  financialInfo?: Record<string, unknown>;
  complianceInfo?: Record<string, unknown>;
}

export interface VendorConnection {
  id: string;
  relationshipType: string;
  status: string;
  vendorOrgId?: string;
  vendorName?: string;
  buyerOrgId?: string;
  buyerName?: string;
  targetOrgId?: string;
  targetOrgName?: string;
  sourceOrgId?: string;
  sourceOrgName?: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
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
export class VendorOnboardingService {
  private readonly http = inject(HttpClient);

  /**
   * List all active vendor connections (buyer sees their vendors).
   * Each connection's `id` is the relationshipId used for onboarding endpoints.
   */
  listVendorConnections() {
    return this.http.get<ApiResponse<VendorConnection[]>>('/connections', {
      params: { type: 'VENDOR_OF' },
    });
  }

  /**
   * Get onboarding status for a specific relationship (buyer view).
   */
  getStatus(relationshipId: string) {
    return this.http.get<ApiResponse<VendorOnboardingStatus>>(
      `/vendor-onboarding/relationships/${relationshipId}/status`,
    );
  }

  /**
   * Approve the vendor's onboarding submission.
   */
  approve(relationshipId: string) {
    return this.http.patch<ApiResponse<unknown>>(
      `/vendor-onboarding/relationships/${relationshipId}/approve`,
      {},
    );
  }

  /**
   * Reject the vendor's onboarding submission with a reason.
   */
  reject(relationshipId: string, reason: string) {
    return this.http.patch<ApiResponse<unknown>>(
      `/vendor-onboarding/relationships/${relationshipId}/reject`,
      { reason },
    );
  }
}
