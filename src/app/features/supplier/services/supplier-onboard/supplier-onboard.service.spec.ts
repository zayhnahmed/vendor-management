import { TestBed } from '@angular/core/testing';

import { SupplierOnboardService } from './supplier-onboard.service';

describe('SupplierOnboardService', () => {
  let service: SupplierOnboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierOnboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
