import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDashboardPage } from './buyer-dashboard.page';

describe('BuyerDashboardPage', () => {
  let component: BuyerDashboardPage;
  let fixture: ComponentFixture<BuyerDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerDashboardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerDashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
