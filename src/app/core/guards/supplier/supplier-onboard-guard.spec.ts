import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { supplierOnboardGuard } from './supplier-onboard-guard';

describe('supplierOnboardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => supplierOnboardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
