import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadService } from '../../../../core/services/file-upload/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileUploadResponse } from '../../../../core/models/file-upload-response.model';
import { ToastrService } from 'ngx-toastr';
import { SupplierOnboardingFacade } from '../../store/supplier-onboarding/supplier-onboarding.facade';

@Component({
  selector: 'app-supplier-finance-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-finance-info.html',
  styleUrl: './supplier-finance-info.css',
})
export class SupplierFinanceInfo {
  private fb: FormBuilder = inject(FormBuilder);
  private toastr: ToastrService = inject(ToastrService);
  private uploadService: FileUploadService = inject(FileUploadService); // Your service for API calls
  private facade: SupplierOnboardingFacade = inject(SupplierOnboardingFacade);

  financialForm!: FormGroup;
  taxCertificateError: string = '';
  uploadedFileName: string = '';
  taxCertificateUploadId: string = '';
  isUploading: WritableSignal<boolean> = signal(false);
  uploadProgress: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.financialForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.minLength(2)]],
      bankCode: ['', [Validators.required, Validators.minLength(4)]],
      accountHolderName: ['', [Validators.required, Validators.minLength(2)]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,20}$/)]],
      iban: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)]],
      bankCountry: ['', Validators.required],
      currency: ['', Validators.required],
      taxRegistrationNumber: ['', [Validators.required, Validators.minLength(5)]],
      vatGstNumber: ['', [Validators.required, Validators.minLength(5)]],
      annualTurnover: ['', [Validators.required, Validators.min(0)]],
      yearsInBusiness: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });

    this.facade.loadInitialFinancialInfoData().subscribe((data) => {
      this.financialForm.patchValue(data);
      this.taxCertificateUploadId = data?.taxCertificateUploadId;
    });
  }

  onTaxCertificateSelected(event: any): void {
    const file = event.target.files[0];
    this.taxCertificateError = '';

    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.taxCertificateError = 'File size must be less than 5MB';
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.taxCertificateError = 'Only PDF, JPG, and PNG files are allowed';
        return;
      }

      this.uploadedFileName = file.name;
      this.uploadTaxCertificate(file);
    }
  }

  uploadTaxCertificate(file: File): void {
    this.isUploading.set(true);
    this.taxCertificateError = '';

    this.uploadService.uploadDocument(file).subscribe({
      next: (event: HttpEvent<FileUploadResponse>) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Track upload progress
          this.uploadProgress.update(() => Math.round((100 * event.loaded) / (event?.total ?? 0)));
          console.log(this.uploadProgress());
        } else if (event.type === HttpEventType.Response) {
          // Upload completed successfully
          if (event.body && event.body.uploadId) {
            this.taxCertificateUploadId = event.body.uploadId;
            this.isUploading.set(false);
            this.uploadProgress.update(() => 100);
            console.log('Tax certificate uploaded successfully. ID:', this.taxCertificateUploadId);
          } else {
            this.taxCertificateError = 'Failed to get upload ID from server';
            this.isUploading.set(false);
            this.uploadedFileName = '';
          }
        }
      },
      error: (error) => {
        this.taxCertificateError = 'Failed to upload tax certificate. Please try again.';
        this.isUploading.set(false);
        this.uploadedFileName = '';
        this.uploadProgress.update(() => 0);
        console.error('Upload error:', error);
      },
    });
  }

  onBack(): void {
    // Navigate back to previous step
  }

  // onSaveDraft(): void {
  //   if (this.financialForm.valid && this.taxCertificateUploadId) {
  //     const payload = {
  //       ...this.financialForm.value,
  //       taxCertificateUploadId: this.taxCertificateUploadId,
  //     };
  //     console.log('Save draft payload:', payload);
  //     // Save draft logic
  //   } else {
  //     this.markFormGroupTouched(this.financialForm);
  //     if (!this.taxCertificateUploadId) {
  //       this.taxCertificateError = 'Please upload tax certificate';
  //     }
  //   }
  // }

  onNext(): void {
    if (this.financialForm.valid && this.taxCertificateUploadId) {
      const payload = {
        ...this.financialForm.value,
        taxCertificateUploadId: this.taxCertificateUploadId,
      };
      console.log('Submit payload:', payload);
      this.facade.submitForm(2, this.financialForm.value);
      // Proceed to next step
    } else {
      this.markFormGroupTouched(this.financialForm);
      if (!this.taxCertificateUploadId) {
        this.taxCertificateError = 'Please upload tax certificate';
      }
      this.toastr.error('Fill all the required fields.', 'Error...!');
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
