import { Component, inject } from '@angular/core';
import { BusinessType, EntityType } from '../../../../core/enums/business.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplierOnboardingFacade } from '../../store/supplier-onboarding/supplier-onboarding.facade';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-general-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplier-general-info.html',
  styleUrl: './supplier-general-info.css',
})
export class SupplierGeneralInfo {
  private fb: FormBuilder = inject(FormBuilder);
  private toastr: ToastrService = inject(ToastrService);
  private facade: SupplierOnboardingFacade = inject(SupplierOnboardingFacade);

  vendorForm!: FormGroup;
  EntityType = EntityType;
  BusinessType = BusinessType;
  selectedBusinessTypes: BusinessType[] = [];

  ngOnInit(): void {
    this.facade.loadInitialGeneralInfoData().subscribe((data) => {
      console.log(data);
      this.vendorForm.patchValue(data);
    });

    this.vendorForm = this.fb.group({
      // Company Details
      companyLegalName: ['', Validators.required],
      companyRegistrationNumber: ['', Validators.required],
      tradeName: ['', Validators.required],
      yearOfEstablishment: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
      countryOfRegistration: ['', Validators.required],
      companyWebsite: ['', [Validators.required, Validators.pattern('https?://.+')]],
      // Entity & Business
      entityType: ['', Validators.required],
      businessType: ['', Validators.required],
      // Addresses
      registeredAddress: ['', Validators.required],
      operationalAddress: [''],
      isOperationalSame: [false],
      // Contacts
      primaryContactName: ['', Validators.required],
      primaryContactEmail: ['', [Validators.required, Validators.email]],
      primaryContactPhone: ['', Validators.required],
      designation: ['', Validators.required],
      alternateContactName: [''],
      alternateContactPhone: [''],
    });

    // When "isOperationalSame" toggled, sync operationalAddress with registeredAddress
    this.vendorForm.get('isOperationalSame')?.valueChanges.subscribe((isSame) => {
      if (isSame) {
        const registered = this.vendorForm.get('registeredAddress')?.value;
        this.vendorForm.get('operationalAddress')?.setValue(registered);
        this.vendorForm.get('operationalAddress')?.disable();
      } else {
        this.vendorForm.get('operationalAddress')?.enable();
      }
    });
  }

  onBusinessTypeChange(value: any, event: any) {
    const currentValue = this.vendorForm.get('businessType')?.value;
    let businessTypeArray = Array.isArray(currentValue) ? [...currentValue] : [];

    if (event.target.checked) {
      if (!businessTypeArray.includes(value)) {
        businessTypeArray.push(value);
      }
    } else {
      businessTypeArray = businessTypeArray.filter((item) => item !== value);
    }

    this.vendorForm.get('businessType')?.setValue(businessTypeArray);
    this.vendorForm.get('businessType')?.markAsTouched();
  }

  onSubmit() {
    if (this.vendorForm.invalid) {
      this.vendorForm.markAllAsTouched();
      this.toastr.error('Fill all the required fields.', 'Error...!');
      return;
    }

    this.facade.submitForm(1, this.vendorForm.value);
  }
}
