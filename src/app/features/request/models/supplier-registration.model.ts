import { BusinessType, EntityType } from '../../../core/enums/business.enum';
import { RegRequestStatus, UserRole } from '../../../core/enums/user.enum';
import { CompanyInformation, CompanyLocalContent } from '../../../core/models/company-info.model';
import { PointOfContact } from '../../../core/models/point-of-contact.model';
import { SupplierModel, SupplierStepData } from './suplier-detail.model';

export interface SupplierRegistrationModel {
  entityType: EntityType;
  businessType: BusinessType;
  companyInformation: CompanyInformation;
  pointOfContact: PointOfContact;
  scopeOfServices: string[];
  localContent: CompanyLocalContent;
  declarationAccepted: boolean;
  companyProfileUploadId: string;
  otherDocumentUploadId: string;
}

export interface SupplierReqDetailModel {
  id: string;
  applicationId: string;
  email: string;
  companyName: string;
  companyFullName: string;
  countryOfRegistration: string;
  registrationNumber: string;
  hqOfficeLocation: string;
  businessAddress: string;
  websiteUrl: string;
  turnoverLastYear: number;
  keyContactPerson: string;
  position: string;
  phoneNumber: string;
  mobileNumber: string;

  entityType: EntityType;
  businessType: BusinessType;
  scopeOfServices: string[];

  hasRegionalHQ: boolean;
  regionalHQCertificate: string | null;

  hasLocalContentCert: boolean;
  localContentCert: string | null;

  companyProfile: string;
  otherDocument: string;

  companyProfileUploadId: string;
  otherDocumentUploadId: string;

  declarationAccepted: boolean;
  declarationAcceptedAt: string; // ISO date

  status: RegRequestStatus;
  attemptNumber: number;

  previousRequestId: string | null;

  submittedAt: string; // ISO date
  lastUpdatedAt: string; // ISO date
  reviewedAt: string | null;
  reviewedBy: string | null;

  rejectionReason: string | null;
  adminNotes: string | null;

  userId: string | null;

  history: SupplierReqDetailHistory[];
}

export interface SupplierReqDetailHistory {
  id: string;
  applicationId: string;
  changedBy: UserRole;
  changedAt: string; // ISO date
  notes: string;
}

export interface SupplierReqDetailApiResponse {
  success: boolean;
  request: SupplierReqDetailModel;
}

export interface SupplierRegReqDetailApiResponse {
  success: boolean;
  user: SupplierModel;
  step1Data?: SupplierStepData<1>;
  step2Data?: SupplierStepData<2>;
  step3Data?: SupplierStepData<3>;
  registrationRequest: SupplierReqDetailModel;
}
