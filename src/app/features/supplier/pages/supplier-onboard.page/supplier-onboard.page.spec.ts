import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOnboardPage } from './supplier-onboard.page';

describe('SupplierOnboardPage', () => {
  let component: SupplierOnboardPage;
  let fixture: ComponentFixture<SupplierOnboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierOnboardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierOnboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
