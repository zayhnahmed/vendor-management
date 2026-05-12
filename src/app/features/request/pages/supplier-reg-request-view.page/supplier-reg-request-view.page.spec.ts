import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRegRequestViewPage } from './supplier-reg-request-view.page';

describe('SupplierRegRequestViewPage', () => {
  let component: SupplierRegRequestViewPage;
  let fixture: ComponentFixture<SupplierRegRequestViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRegRequestViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRegRequestViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
