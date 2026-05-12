export interface Certification {
  type: string;
  uploadId: string;
  existingFileUrl?: string;
}

export interface SupplierQualityInfoModel {
  action: 'save' | 'submit';

  certifications: Certification[];
  certificationUploadIds: string[];

  compliesWithLaborLaws: boolean;
  hasHSEPolicy: boolean;
  hasLegalIssues: boolean;
  legalIssuesExplanation?: string;

  hasAntiBriberyPolicy: boolean;

  sustainabilityPractices: string[];

  completedAt: string;
  createdAt: string;
  updatedAt: string;
}
