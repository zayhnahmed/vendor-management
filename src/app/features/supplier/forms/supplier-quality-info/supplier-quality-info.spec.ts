import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQualityInfo } from './supplier-quality-info';

describe('SupplierQualityInfo', () => {
  let component: SupplierQualityInfo;
  let fixture: ComponentFixture<SupplierQualityInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierQualityInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierQualityInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
