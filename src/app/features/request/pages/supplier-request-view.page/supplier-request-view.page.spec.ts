import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRequestViewPage } from './supplier-request-view.page';

describe('SupplierRequestViewPage', () => {
  let component: SupplierRequestViewPage;
  let fixture: ComponentFixture<SupplierRequestViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRequestViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRequestViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
