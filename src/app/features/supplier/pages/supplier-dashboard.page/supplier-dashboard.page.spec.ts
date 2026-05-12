import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDashboardPage } from './supplier-dashboard.page';

describe('SupplierDashboardPage', () => {
  let component: SupplierDashboardPage;
  let fixture: ComponentFixture<SupplierDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierDashboardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
