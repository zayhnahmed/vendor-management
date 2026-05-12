import { SupplierStatus } from '../../../core/enums/user.enum';
import { SupplierFinanceInfoModel } from './supplier-finance-info.model';
import { SupplierQualityInfoModel } from './supplier-quality-info.model';
import { SupplierGeneralInfoModel } from './suppplier-general-info.model';

type SupplierStepDataMap = {
  1: SupplierGeneralInfoModel;
  2: SupplierFinanceInfoModel;
  3: SupplierQualityInfoModel;
};

export type SupplierStepData<T extends 1 | 2 | 3> = SupplierStepDataMap[T];

export interface SupplierModel {
  id: string;
  email: string;
  name: string;
  vendorUid: string;
  companyName: string;
  createdAt: string; // ISO
  onboardingCompletedAt: string | null;
  vendorStatus: SupplierStatus;
}
