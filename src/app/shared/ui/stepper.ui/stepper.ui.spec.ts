import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperUi } from './stepper.ui';

describe('StepperUi', () => {
  let component: StepperUi;
  let fixture: ComponentFixture<StepperUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
