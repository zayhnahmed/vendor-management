import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { VendButton } from '../../../../shared/directives/vend-button/vend-button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadService } from '../../../../core/services/file-upload/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { BusinessType, EntityType } from '../../../../core/enums/business.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import { submitSupplierRegistration } from '../../store/supplier-registration/supplier-registration.actions';
import { SupplierRegistrationState } from '../../store/supplier-registration/supplier-registration.state';

@Component({
  selector: 'app-supplier-register.page',
  imports: [VendButton, ReactiveFormsModule, NgSelectModule],
  templateUrl: './supplier-register.page.html',
  styleUrl: './supplier-register.page.css',
})
export class SupplierRegisterPage implements OnInit {
  private readonly fileUpload: FileUploadService = inject(FileUploadService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly store: Store<SupplierRegistrationState> = inject(Store);

  loading$ = this.store.select((state) => console.log('submitting', state.submitting));
  success$ = this.store.select((state) => console.log('submitted', state.submitted));

  uploads: WritableSignal<Record<string, any>> = signal({});
  EntityType = EntityType;
  BusinessType = BusinessType;

  vendorForm: FormGroup;
  // Available scope options
  scopeOptions = [
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'CONSULTING', label: 'Consulting' },
  ];

  constructor() {
    this.vendorForm = this.fb.group({
      entityType: ['', Validators.required],
      businessType: ['', Validators.required],
      scopeOfServices: ['', Validators.required],

      declarationAccepted: [false, Validators.requiredTrue],

      companyInformation: this.fb.group({
        companyFullName: ['', Validators.required],
        countryOfRegistration: ['', Validators.required],
        registrationNumber: ['', Validators.required],
        hqOfficeLocation: ['', Validators.required],
        businessAddress: ['', Validators.required],
        websiteUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        turnoverLastYear: ['', [Validators.required, Validators.min(1)]],
      }),

      pointOfContact: this.fb.group({
        keyContactPerson: ['', Validators.required],
        position: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        mobileNumber: ['', Validators.required],
      }),

      localContent: this.fb.group({
        hasRegionalHQ: [null, Validators.required],
        regionalHQCertificate: [''],
        hasLocalContentCert: [null, Validators.required],
        localContentCert: [''],
      }),

      companyProfileUploadId: [''],
      otherDocumentUploadId: [''],
    });
  }

  ngOnInit() {
    const group = this.vendorForm.get('localContent') as FormGroup;

    this.setConditionalValidator(group, 'hasRegionalHQ', 'regionalHQCertificate');
    this.setConditionalValidator(group, 'hasLocalContentCert', 'localContentCert');
  }

  private setConditionalValidator(group: FormGroup, trigger: string, target: string) {
    const triggerControl = group.get(trigger);
    const targetControl = group.get(target);

    triggerControl?.valueChanges.subscribe((value) => {
      if (value) {
        targetControl?.setValidators([Validators.required]);
      } else {
        targetControl?.clearValidators();
        targetControl?.setValue('');
      }
      targetControl?.updateValueAndValidity();
    });
  }

  // Get selected scopes as array of option objects
  get selectedScopeOfServices() {
    const selectedValues = this.vendorForm.get('scopeOfServices')?.value || [];
    return this.scopeOptions.filter((option) => selectedValues.includes(option.value));
  }

  get selectedScopeCount(): number {
    return this.vendorForm.get('scopeOfServices')?.value?.length || 0;
  }

  isScopeSelected(value: string): boolean {
    const selectedValues = this.vendorForm.get('scopeOfServices')?.value || [];
    return selectedValues.includes(value);
  }

  removeScope(value: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const currentValues = this.vendorForm.get('scopeOfServices')?.value || [];
    const newValues = currentValues.filter((v: string) => v !== value);
    this.vendorForm.get('scopeOfServices')?.setValue(newValues);
  }

  clearAllScopes(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.vendorForm.get('scopeOfServices')?.setValue([]);
  }

  uploadFile(file: File, docType: string) {
    this.fileUpload.uploadDocument(file).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress) {
        const progress = Math.round((100 * event.loaded) / (event.total || 1));
        console.log(progress);

        this.uploads.update((uploads) => ({
          ...uploads,
          [docType]: {
            ...(uploads[docType] || {}),
            progress,
            status: 'uploading',
          },
        }));
      }
      console.log(event.type);
      if (event.type === HttpEventType.Response) {
        const uploadId = event.body?.uploadId;
        this.uploads.update((uploads) => ({
          ...uploads,
          [docType]: {
            ...uploads[docType],
            progress: 100,
            status: 'uploaded',
            uploadId,
          },
        }));
        console.log();
      }
    });
  }

  submitForm() {
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      return;
    }

    const data = {
      ...this.vendorForm.value,
      companyProfileUploadId: this.uploads()['companyProfileUploadId']?.uploadId,
      otherDocumentUploadId: this.uploads()['otherDocumentUploadId']?.uploadId,
    };

    this.store.dispatch(submitSupplierRegistration({ payload: data }));
    this.vendorForm.reset();
    this.vendorForm.markAsUntouched();
  }

  // Add this method to handle file changes
  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      // You can handle the file upload here
      // For now, just set the file name or ID
      this.uploadFile(file, controlName);
    }
  }

  // Optional: Add a method to check if a field is invalid and touched
  isFieldInvalid(fieldPath: string): boolean {
    const field = this.vendorForm.get(fieldPath);
    return field ? field.invalid && (field.touched || field.dirty) : false;
  }
}
