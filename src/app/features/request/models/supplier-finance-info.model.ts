export interface SupplierFinanceInfoModel {
  bankName: string;
  bankCode: string;
  accountHolderName: string;
  accountNumber: string;
  iban: string;
  bankCountry: string;
  currency: string;

  taxRegistrationNumber: string;
  vatGstNumber: string;
  taxCertificateUploadId: string;

  annualTurnover: number;
  yearsInBusiness: number;

  completedAt: string;
  createdAt: string;
  updatedAt: string;
}
