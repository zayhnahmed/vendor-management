import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRegRequestPage } from './supplier-reg-request.page';

describe('SupplierRegRequestPage', () => {
  let component: SupplierRegRequestPage;
  let fixture: ComponentFixture<SupplierRegRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRegRequestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRegRequestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
