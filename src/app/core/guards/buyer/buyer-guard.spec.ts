import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { buyerGuard } from './buyer-guard';

describe('buyerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => buyerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
