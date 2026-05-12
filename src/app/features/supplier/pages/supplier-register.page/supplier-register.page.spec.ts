import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRegisterPage } from './supplier-register.page';

describe('SupplierRegisterPage', () => {
  let component: SupplierRegisterPage;
  let fixture: ComponentFixture<SupplierRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRegisterPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
