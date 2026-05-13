import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadService } from '../../../../core/services/file-upload/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SupplierOnboardingFacade } from '../../store/supplier-onboarding/supplier-onboarding.facade';

@Component({
  selector: 'app-supplier-quality-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-quality-info.html',
  styleUrl: './supplier-quality-info.css',
})
export class SupplierQualityInfo {
  private fb: FormBuilder = inject(FormBuilder);
  private uploadService: FileUploadService = inject(FileUploadService);
  private facade: SupplierOnboardingFacade = inject(SupplierOnboardingFacade);

  complianceForm!: FormGroup;
  sustainabilityPractices: string[] = [];

  isUploadingCertificate: WritableSignal<{ [key: number]: boolean }> = signal({});
  uploadProgress: WritableSignal<{ [key: number]: number }> = signal({});
  certificateErrors: WritableSignal<{ [key: number]: string }> = signal({});
  certificateFileNames: WritableSignal<{ [key: number]: string }> = signal({});

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.complianceForm = this.fb.group({
      certificates: this.fb.array([]),
      compliesWithLaborLaws: [null, Validators.required],
      hasHSEPolicy: [null, Validators.required],
      hasAntiBriberyPolicy: [null, Validators.required],
      hasLegalIssues: [null, Validators.required],
      legalIssuesExplanation: [''],
    });

    this.complianceForm.get('hasLegalIssues')?.valueChanges.subscribe((value) => {
      const explanationControl = this.complianceForm.get('legalIssuesExplanation');
      if (value === true) {
        explanationControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        explanationControl?.clearValidators();
        explanationControl?.setValue('');
      }
      explanationControl?.updateValueAndValidity();
    });

    this.addCertificate();
  }

  get certificates(): FormArray {
    return this.complianceForm.get('certificates') as FormArray;
  }

  addCertificate(): void {
    const certificateForm = this.fb.group({
      name: ['', Validators.required],
      issuing_body: [''],
      issue_date: [''],
      expiry_date: [''],
      document_upload_id: [''],
    });
    this.certificates.push(certificateForm);
  }

  removeCertificate(index: number): void {
    this.certificates.removeAt(index);

    this.isUploadingCertificate.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });
    this.uploadProgress.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });
    this.certificateErrors.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });
    this.certificateFileNames.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });
  }

  onCertificateSelected(event: any, index: number): void {
    const file = event.target.files[0];

    this.certificateErrors.update((state) => ({ ...state, [index]: '' }));
    this.uploadProgress.update((state) => ({ ...state, [index]: 0 }));

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.certificateErrors.update((state) => ({
          ...state,
          [index]: 'File size must be less than 5MB',
        }));
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.certificateErrors.update((state) => ({
          ...state,
          [index]: 'Only PDF, JPG, and PNG files are allowed',
        }));
        return;
      }

      this.certificateFileNames.update((state) => ({ ...state, [index]: file.name }));
      this.uploadCertificate(file, index);
    }
  }

  uploadCertificate(file: File, index: number): void {
    this.isUploadingCertificate.update((state) => ({ ...state, [index]: true }));
    this.certificateErrors.update((state) => ({ ...state, [index]: '' }));

    this.uploadService.uploadDocument(file).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / (event.total ?? 0));
          this.uploadProgress.update((state) => ({ ...state, [index]: progress }));
        } else if (event.type === HttpEventType.Response) {
          if (event.body && event.body.uploadId) {
            const certificateGroup = this.certificates.at(index) as FormGroup;
            certificateGroup.get('document_upload_id')?.setValue(event.body.uploadId);
            this.isUploadingCertificate.update((state) => ({ ...state, [index]: false }));
          } else {
            this.certificateErrors.update((state) => ({
              ...state,
              [index]: 'Failed to get upload ID from server',
            }));
            this.isUploadingCertificate.update((state) => ({ ...state, [index]: false }));
          }
        }
      },
      error: () => {
        this.certificateErrors.update((state) => ({
          ...state,
          [index]: 'Failed to upload certificate. Please try again.',
        }));
        this.isUploadingCertificate.update((state) => ({ ...state, [index]: false }));
        this.uploadProgress.update((state) => ({ ...state, [index]: 0 }));
      },
    });
  }

  getCertificateError(index: number): string {
    return this.certificateErrors()[index] || '';
  }

  getCertificateFileName(index: number): string {
    return this.certificateFileNames()[index] || '';
  }

  getIsUploading(index: number): boolean {
    return this.isUploadingCertificate()[index] || false;
  }

  getUploadProgress(index: number): number {
    return this.uploadProgress()[index] || 0;
  }

  onSustainabilityChange(event: any, practice: string): void {
    if (event.target.checked) {
      if (!this.sustainabilityPractices.includes(practice)) {
        this.sustainabilityPractices = [...this.sustainabilityPractices, practice];
      }
    } else {
      this.sustainabilityPractices = this.sustainabilityPractices.filter((p) => p !== practice);
    }
  }

  isSustainabilitySelected(practice: string): boolean {
    return this.sustainabilityPractices.includes(practice);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  validateCertificates(): boolean {
    let isValid = true;
    for (let i = 0; i < this.certificates.length; i++) {
      const cert = this.certificates.at(i) as FormGroup;
      if (cert.invalid) {
        cert.markAllAsTouched();
        isValid = false;
      }
    }
    return isValid;
  }

  private buildPayload(): object {
    const certifications = this.certificates.value.map(
      (cert: {
        name: string;
        issuing_body: string;
        issue_date: string;
        expiry_date: string;
        document_upload_id: string;
      }) => ({
        name: cert.name,
        ...(cert.issuing_body && { issuing_body: cert.issuing_body }),
        ...(cert.issue_date && { issue_date: cert.issue_date }),
        ...(cert.expiry_date && { expiry_date: cert.expiry_date }),
        ...(cert.document_upload_id && { document_upload_id: cert.document_upload_id }),
      }),
    );

    const formValue = { ...this.complianceForm.value };
    delete formValue['certificates'];

    return {
      ...formValue,
      certifications,
      sustainabilityPractices: this.sustainabilityPractices,
    };
  }

  onSubmit(): void {
    if (this.complianceForm.valid && this.validateCertificates()) {
      this.facade.finalSubmitForm(this.buildPayload());
    } else {
      this.markFormGroupTouched(this.complianceForm);
      this.validateCertificates();
    }
  }

  onSave(): void {
    if (this.complianceForm.valid && this.validateCertificates()) {
      this.facade.submitForm(3, this.buildPayload());
    } else {
      this.markFormGroupTouched(this.complianceForm);
      this.validateCertificates();
    }
  }

  onBack(): void {
    // Navigate back
  }
}
