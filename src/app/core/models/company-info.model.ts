export interface CompanyInformation {
  companyFullName: string;
  countryOfRegistration: string;
  registrationNumber: string;
  hqOfficeLocation: string;
  businessAddress: string;
  websiteUrl: string;
  turnoverLastYear: number;
}

export interface CompanyLocalContent {
  hasRegionalHQ: boolean;
  regionalHQCertificate: string;
  hasLocalContentCert: boolean;
  localContentCert: string;
}