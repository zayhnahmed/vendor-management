import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component, forwardRef, inject, OnInit, Type } from '@angular/core';
import { StepperUi } from '../../../../shared/ui/stepper.ui/stepper.ui';
import { SupplierGeneralInfo } from '../../forms/supplier-general-info/supplier-general-info';
import { SupplierFinanceInfo } from '../../forms/supplier-finance-info/supplier-finance-info';
import { SupplierQualityInfo } from '../../forms/supplier-quality-info/supplier-quality-info';
import { Store } from '@ngrx/store';
import { selectOnboardingLoaded, selectSupplierCurrentStep } from '../../store/supplier-onboarding/supplier-onboarding.selector';
import { loadSupplierOnboardingStatus } from '../../store/supplier-onboarding/supplier-onboarding.actions';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  private readonly toastr = inject(ToastrService);

  currentStep$ = this.store.select(selectSupplierCurrentStep);
  loaded$ = this.store.select(selectOnboardingLoaded);

  // Define your steps configuration
  steps: StepConfig[] = [
    {
      label: 'General Information',
      component: SupplierGeneralInfo,
      stepNumber: 1,
    },
    {
      label: 'Financial Information',
      component: SupplierFinanceInfo,
      stepNumber: 2,
    },
    {
      label: 'Quality & Compliance',
      component: SupplierQualityInfo,
      stepNumber: 3,
    },
  ];

  ngOnInit() {
    this.store.dispatch(loadSupplierOnboardingStatus());
  }

  // onStepChange(step: number) {
  //   this.store.dispatch(loadSupplierStep({ step }));
  // }

  onClickStep(step: number) {
    console.log(step, 'dfhgdhf');
  }

  isEditable(step: number, completedStep: number) {
    const editable = step <= completedStep;

    // if (!editable) {
    //   this.toastr.error('Hello world!', 'Toastr fun!');
    // }

    return editable;
  }
}
