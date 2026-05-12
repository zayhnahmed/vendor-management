import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stepper',
  providers: [{ provide: CdkStepper, useExisting: StepperUi }],
  imports: [NgTemplateOutlet, CdkStepperModule, NgClass],
  templateUrl: './stepper.ui.html',
  styleUrl: './stepper.ui.css',
})
export class StepperUi extends CdkStepper {
  private readonly toastr = inject(ToastrService);

  selectStepByIndex(index: number): void {
    const step = this.steps.get(index);
    if (step?.editable) {
      this.selectedIndex = index;
      return;
    }

    this.toastr.error('Complete Previous Steps.', 'Error...!');
  }
}
