import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierGeneralInfo } from './supplier-general-info';

describe('SupplierGeneralInfo', () => {
  let component: SupplierGeneralInfo;
  let fixture: ComponentFixture<SupplierGeneralInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierGeneralInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierGeneralInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
