import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierWaitingReviewPage } from './supplier-waiting-review.page';

describe('SupplierWaitingReviewPage', () => {
  let component: SupplierWaitingReviewPage;
  let fixture: ComponentFixture<SupplierWaitingReviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierWaitingReviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierWaitingReviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
