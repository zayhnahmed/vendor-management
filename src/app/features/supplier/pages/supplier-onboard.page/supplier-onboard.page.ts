import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component, forwardRef, inject, OnInit, Type } from '@angular/core';
import { StepperUi } from '../../../../shared/ui/stepper.ui/stepper.ui';
import { SupplierGeneralInfo } from '../../forms/supplier-general-info/supplier-general-info';
import { SupplierFinanceInfo } from '../../forms/supplier-finance-info/supplier-finance-info';
import { SupplierQualityInfo } from '../../forms/supplier-quality-info/supplier-quality-info';
import { Store } from '@ngrx/store';
import { selectOnboardingLoaded, selectSupplierCurrentStep } from '../../store/supplier-onboarding/supplier-onboarding.selector';
import { CommonModule } from '@angular/common';
import { SupplierOnboardingFacade } from '../../store/supplier-onboarding/supplier-onboarding.facade';

interface StepConfig {
  label: string;
  component: Type<any>;
  stepNumber: number;
}

@Component({
  selector: 'app-supplier-onboard.page',
  imports: [CdkStepperModule, forwardRef(() => StepperUi), CommonModule],
  templateUrl: './supplier-onboard.page.html',
  styleUrl: './supplier-onboard.page.css',
})
export class SupplierOnboardPage implements OnInit {
  private store = inject(Store);
  private facade = inject(SupplierOnboardingFacade);

  currentStep$ = this.store.select(selectSupplierCurrentStep);
  loaded$ = this.store.select(selectOnboardingLoaded);

  steps: StepConfig[] = [
    { label: 'General Information', component: SupplierGeneralInfo, stepNumber: 1 },
    { label: 'Financial Information', component: SupplierFinanceInfo, stepNumber: 2 },
    { label: 'Quality & Compliance', component: SupplierQualityInfo, stepNumber: 3 },
  ];

  ngOnInit() {
    this.facade.initOnboarding();
  }

  isEditable(step: number, completedStep: number) {
    return step <= completedStep;
  }
}
