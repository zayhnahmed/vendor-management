import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectOnboardingLoaded,
  selectRelationshipId,
  selectSupplierCurrentStep,
} from './supplier-onboarding.selector';
import {
  finalSubmitSupplierStep,
  loadSupplierOnboardingStatus,
  setRelationshipId,
  submitSupplierStep,
} from './supplier-onboarding.actions';
import { SupplierOnboardService } from '../../services/supplier-onboard/supplier-onboard.service';

@Injectable({ providedIn: 'root' })
export class SupplierOnboardingFacade {
  private store = inject(Store);
  private service = inject(SupplierOnboardService);

  currentStep$ = this.store.select(selectSupplierCurrentStep);
  loaded$ = this.store.select(selectOnboardingLoaded);
  relationshipId$ = this.store.select(selectRelationshipId);

  initOnboarding() {
    this.service.getPendingTasks().subscribe({
      next: (res: any) => {
        const tasks = res?.data ?? res;
        const first = Array.isArray(tasks) ? tasks[0] : null;
        if (first?.relationshipId) {
          this.store.dispatch(setRelationshipId({ relationshipId: first.relationshipId }));
        }
        this.store.dispatch(loadSupplierOnboardingStatus());
      },
      error: () => this.store.dispatch(loadSupplierOnboardingStatus()),
    });
  }

  setRelationshipId(relationshipId: string) {
    this.store.dispatch(setRelationshipId({ relationshipId }));
  }

  loadStatus() {
    this.store.dispatch(loadSupplierOnboardingStatus());
  }

  submitForm(step: number, data: any) {
    this.store.dispatch(submitSupplierStep({ step, payload: data }));
  }

  finalSubmitForm(data: any) {
    this.store.dispatch(finalSubmitSupplierStep({ payload: data }));
  }
}
