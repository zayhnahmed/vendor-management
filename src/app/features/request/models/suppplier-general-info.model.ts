import { BusinessType, EntityType } from '../../../core/enums/business.enum';

export interface SupplierGeneralInfoModel {
  companyLegalName: string;
  companyRegistrationNumber: string;
  tradeName: string;
  yearOfEstablishment: number;
  countryOfRegistration: string;
  companyWebsite: string;

  entityType: EntityType;
  businessType: BusinessType[];

  registeredAddress: string;
  operationalAddress: string;
  isOperationalSame: boolean;

  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  designation: string;

  alternateContactName: string;
  alternateContactPhone: string;

  completedAt: string;
  createdAt: string;
  updatedAt: string;
}
