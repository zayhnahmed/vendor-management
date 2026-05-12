import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogUi } from './confirm-dialog.ui';

describe('ConfirmDialogUi', () => {
  let component: ConfirmDialogUi;
  let fixture: ComponentFixture<ConfirmDialogUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
