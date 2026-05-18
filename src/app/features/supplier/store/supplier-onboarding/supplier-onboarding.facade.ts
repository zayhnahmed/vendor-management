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
@Injectable({ providedIn: 'root' })
export class SupplierOnboardingFacade {
  private store = inject(Store);

  currentStep$ = this.store.select(selectSupplierCurrentStep);
  loaded$ = this.store.select(selectOnboardingLoaded);
  relationshipId$ = this.store.select(selectRelationshipId);

  initOnboarding() {
    this.store.dispatch(loadSupplierOnboardingStatus());
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
