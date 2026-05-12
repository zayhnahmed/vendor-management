import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgApexchartsModule } from 'ng-apexcharts';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api/api-interceptor';
import { SupplierRegistrationEffects } from './features/supplier/store/supplier-registration/supplier-registration.effects';
import { supplierRegistrationReducer } from './features/supplier/store/supplier-registration/supplier-registration.reducer';
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';
import { authReducer } from './features/auth/store/auth/auth.reducer';
import { AuthEffects } from './features/auth/store/auth/auth.effects';
import { supplierOnboardingReducer } from './features/supplier/store/supplier-onboarding/supplier-onboarding.reducer';
import { SupplierOnboardingEffects } from './features/supplier/store/supplier-onboarding/supplier-onboarding.effect';
import { provideToastr } from 'ngx-toastr';
import { fileInfoReducer } from './shared/stores/file-info/file-info.reducer';
import { FileInfoEffects } from './shared/stores/file-info/file-info.effects';
import {
  supplierRegRequestReducer,
  supplierRequestReducer,
} from './features/buyer/stores/supplier-requests/supplier-requests.reducer';
import {
  supplierRegRequestDetailReducer,
  supplierRequestDetailReducer,
} from './features/request/stores/supplier-reqdetail/supplier-reqdetail.reducer';
import { SupplierRequestsEffects } from './features/buyer/stores/supplier-requests/supplier-requests.effects';
import { SupplierReqDetailEffects } from './features/request/stores/supplier-reqdetail/supplier-reqdetail.effects';
import { authUserReducer } from './features/auth/store/user/user.reducer';
import { AuthUserEffects } from './features/auth/store/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
    provideRouter(routes),
    importProvidersFrom(NgApexchartsModule),
    provideToastr({
      toastClass: 'my-custom-toast ngx-toastr',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
    provideStore({
      supplierRegistration: supplierRegistrationReducer,
      supplierOnboarding: supplierOnboardingReducer,
      supplierRequests: supplierRequestReducer,
      supplierRegRequests: supplierRegRequestReducer,
      supplierRequestDetail: supplierRequestDetailReducer,
      supplierRegRequestDetail: supplierRegRequestDetailReducer,
      fileInfo: fileInfoReducer,
      auth: authReducer,
      authUser: authUserReducer,
    }),
    provideEffects([
      SupplierRegistrationEffects,
      SupplierOnboardingEffects,
      SupplierRequestsEffects,
      SupplierReqDetailEffects,
      FileInfoEffects,
      AuthEffects,
      AuthUserEffects,
    ]),
  ],
};
