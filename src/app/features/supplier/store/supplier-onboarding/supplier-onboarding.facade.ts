import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectOnboardingLoaded,
  selectSupplierCurrentStep,
  selectSupplierPrefillData,
  selectSupplierStep1,
  selectSupplierStep2,
  selectSupplierStep3,
} from './supplier-onboarding.selector';
import {
  finalSubmitSupplierStep,
  loadSupplierOnboardingStatus,
  loadSupplierPrefillData,
  loadSupplierStep,
  submitSupplierStep,
  updateSupplierStep,
} from './supplier-onboarding.actions';
import { filter, firstValueFrom, Observable, switchMap, take, tap } from 'rxjs';
import {  } from './supplier-onboarding.state';
import { SupplierStepData } from '../../../request/models/suplier-detail.model';

@Injectable({ providedIn: 'root' })
export class SupplierOnboardingFacade {
  private store = inject(Store);

  // selectors
  currentStep$ = this.store.select(selectSupplierCurrentStep);
  prefillData$ = this.store.select(selectSupplierPrefillData);
  step1$ = this.store.select(selectSupplierStep1);
  step2$ = this.store.select(selectSupplierStep2);
  step3$ = this.store.select(selectSupplierStep3);

  // actions
  loadPrefillData() {
    this.store.dispatch(loadSupplierPrefillData());
  }

  loadStep(step: number) {
    this.store.dispatch(loadSupplierStep({ step }));
  }

  //   loadStatus() {
  //     this.store.dispatch(loadSupplierOnboardingStatus());
  //   }

  loadInitialGeneralInfoData(): Observable<any> {
    return this.store.select(selectOnboardingLoaded).pipe(
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(loadSupplierOnboardingStatus());
        }
      }),

      filter((loaded) => loaded), // ✅ wait until API finishes
      take(1),

      switchMap(() => this.currentStep$),
      take(1),

      tap((step) => {
        if (step === 1) {
          this.loadPrefillData();
        } else {
          this.loadStep(1);
        }
      }),

      switchMap((step) => (step === 1 ? this.prefillData$ : this.step1$)),

      filter(Boolean),
      take(1),
    );
  }

  loadInitialFinancialInfoData(): Observable<any> {
    return this.store.select(selectOnboardingLoaded).pipe(
      tap(() => {
        this.loadStep(2);
      }),
      switchMap(() => this.step2$),
      filter(Boolean),
      take(1),
    );
  }

  loadInitialQualityInfoData(): Observable<any> {
    console.log('dfjhdjfd quality');
    return this.store.select(selectOnboardingLoaded).pipe(
      tap(() => {
        this.loadStep(3);
      }),
      switchMap(() => this.step3$),
      filter(Boolean),
      take(1),
    );
  }

  async submitForm(step: number, data: SupplierStepData<1 | 2 | 3>) {
    const currentStep = await firstValueFrom(this.currentStep$);
    if (currentStep === step) {
      this.store.dispatch(submitSupplierStep({ step: step, payload: data }));
      return;
    }

    this.store.dispatch(updateSupplierStep({ step: step, payload: data }));
  }

  async finalSubmitForm(data: SupplierStepData<3>) {
    const currentStep = await firstValueFrom(this.currentStep$);
    if (currentStep === 3) {
      this.store.dispatch(finalSubmitSupplierStep({ payload: data }));
      return;
    }
  }
}
