import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mdatatable } from './mdatatable';

describe('Mdatatable', () => {
  let component: Mdatatable;
  let fixture: ComponentFixture<Mdatatable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mdatatable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mdatatable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
