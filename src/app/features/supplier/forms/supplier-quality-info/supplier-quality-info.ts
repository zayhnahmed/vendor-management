import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadService } from '../../../../core/services/file-upload/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SupplierOnboardingFacade } from '../../store/supplier-onboarding/supplier-onboarding.facade';

interface Certificate {
  type: string;
  uploadId: string;
  existingFileUrl?: string;
  file?: File;
  fileName?: string;
}

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

  // Using signals for reactive state
  isUploadingCertificate: WritableSignal<{ [key: number]: boolean }> = signal({});
  uploadProgress: WritableSignal<{ [key: number]: number }> = signal({});
  certificateErrors: WritableSignal<{ [key: number]: string }> = signal({});
  certificateFileNames: WritableSignal<{ [key: number]: string }> = signal({});
  certificateUploadIds: WritableSignal<{ [key: number]: string }> = signal({});
  existingFileUrls: WritableSignal<{ [key: number]: string }> = signal({});

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

    // Add conditional validator for legalIssuesExplanation
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

    this.facade.loadInitialQualityInfoData().subscribe((data) => {
      if (!data) {
        // Add one empty certificate by default
        this.addCertificate();
        return;
      }

      if (data?.certifications) {
        data.certifications.forEach((cert: any, index: number) => {
          const certificateForm = this.fb.group({
            type: [cert.type, Validators.required],
            // If each cert has its own ID, use cert.uploadId.
            // If it's a shared array, ensure you're picking the right index.
            uploadId: [data.certificationUploadIds?.[index] || '', Validators.required],
            existingFileUrl: [cert.fileUrl],
          });

          this.certificates.push(certificateForm);
        });
      }

      this.complianceForm.patchValue(data);
      this.sustainabilityPractices = data?.sustainabilityPractices;
      this.existingFileUrls.set(data?.certifications?.map((data: any) => data.fileUrl));
      this.certificateUploadIds.set(data?.certificationUploadIds);
    });
  }

  get certificates(): FormArray {
    return this.complianceForm.get('certificates') as FormArray;
  }

  addCertificate(): void {
    const certificateForm = this.fb.group({
      type: ['', Validators.required],
      uploadId: ['', Validators.required],
      existingFileUrl: [''],
    });
    this.certificates.push(certificateForm);
  }

  removeCertificate(index: number): void {
    this.certificates.removeAt(index);

    // Clean up upload states using signal update
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

    this.certificateUploadIds.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });

    this.existingFileUrls.update((state) => {
      const newState = { ...state };
      delete newState[index];
      return newState;
    });
  }

  onCertificateSelected(event: any, index: number): void {
    const file = event.target.files[0];

    // Update signals
    this.certificateErrors.update((state) => ({ ...state, [index]: '' }));
    this.uploadProgress.update((state) => ({ ...state, [index]: 0 }));

    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.certificateErrors.update((state) => ({
          ...state,
          [index]: 'File size must be less than 5MB',
        }));
        return;
      }

      // Validate file type
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
            this.certificateUploadIds.update((state) => ({
              ...state,
              [index]: event.body.uploadId,
            }));

            // Update form control with upload ID
            const certificateGroup = this.certificates.at(index) as FormGroup;
            certificateGroup.get('uploadId')?.setValue(event.body.uploadId);

            if (event.body.fileUrl) {
              this.existingFileUrls.update((state) => ({ ...state, [index]: event.body.fileUrl }));
              certificateGroup.get('existingFileUrl')?.setValue(event.body.fileUrl);
            }

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
      error: (error) => {
        this.certificateErrors.update((state) => ({
          ...state,
          [index]: 'Failed to upload certificate. Please try again.',
        }));
        this.isUploadingCertificate.update((state) => ({ ...state, [index]: false }));
        this.uploadProgress.update((state) => ({ ...state, [index]: 0 }));
        console.error('Upload error:', error);
      },
    });
  }

  getCertificateError(index: number): string {
    return this.certificateErrors()[index] || '';
  }

  getCertificateFileName(index: number): string {
    return this.certificateFileNames()[index] || '';
  }

  getExistingFileUrl(index: number): string {
    const certificateGroup = this.certificates.at(index) as FormGroup;
    return certificateGroup.get('existingFileUrl')?.value || '';
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
      if (!cert.get('uploadId')?.value) {
        this.certificateErrors.update((state) => ({
          ...state,
          [i]: 'Please upload certificate file',
        }));
        isValid = false;
      }
    }
    return isValid;
  }

  onSubmit(): void {
    if (this.complianceForm.valid && this.validateCertificates()) {
      const certificates = this.certificates.value.map((cert: any, index: number) => ({
        type: cert.type,
        uploadId: cert.uploadId,
        ...(cert.existingFileUrl && { existingFileUrl: cert.existingFileUrl }),
      }));

      const payload = {
        action: 'save',
        ...this.complianceForm.value,
        certifications: certificates,
        sustainabilityPractices: this.sustainabilityPractices,
      };
      delete payload.certificates;
      console.log('Save draft payload:', payload);
      this.facade.finalSubmitForm(payload);
      // Call your API to save the data
    } else {
      this.markFormGroupTouched(this.complianceForm);
      this.validateCertificates();
    }
  }

  onSave(): void {
    // Similar to onSave but with draft flag
    if (this.complianceForm.valid && this.validateCertificates()) {
      const certificates = this.certificates.value.map((cert: any, index: number) => ({
        type: cert.type,
        uploadId: cert.uploadId,
        ...(cert.existingFileUrl && { existingFileUrl: cert.existingFileUrl }),
      }));

      const payload = {
        action: 'save',
        ...this.complianceForm.value,
        certifications: certificates,
        sustainabilityPractices: this.sustainabilityPractices,
      };
      delete payload.certificates;
      console.log('Save draft payload:', payload);
      this.facade.submitForm(3, payload);
      // Call your API to save the data
    } else {
      this.markFormGroupTouched(this.complianceForm);
      this.validateCertificates();
    }
  }

  onBack(): void {
    // Navigate back
  }
}
