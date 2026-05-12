export interface SupplierRequestItem {
  id: string;
  applicationId: string;
  companyName: string;
  email: string;
  status: string;
  submittedAt: string;
  attemptNumber: number;
  reviewedBy: string | null;
}

export interface SupplierRequestResponse {
  success: boolean;
  requests: SupplierRequestItem[];
}

// Registration request

export interface SupplierRegRequestItem {
  id: string;
  applicationId: string;
  companyName: string;
  email: string;
  vendorStatus: string;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
}

export interface SupplierRegRequestResponse {
  success: boolean;
  vendors: SupplierRegRequestItem[];
}
