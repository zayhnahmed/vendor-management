import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierFinanceInfo } from './supplier-finance-info';

describe('SupplierFinanceInfo', () => {
  let component: SupplierFinanceInfo;
  let fixture: ComponentFixture<SupplierFinanceInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierFinanceInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierFinanceInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
