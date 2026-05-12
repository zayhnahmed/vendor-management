import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerRequestsPage } from './buyer-requests.page';

describe('BuyerRequestsPage', () => {
  let component: BuyerRequestsPage;
  let fixture: ComponentFixture<BuyerRequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerRequestsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerRequestsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
