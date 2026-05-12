import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRequestPage } from './supplier-request.page';

describe('SupplierRequestPage', () => {
  let component: SupplierRequestPage;
  let fixture: ComponentFixture<SupplierRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRequestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRequestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
