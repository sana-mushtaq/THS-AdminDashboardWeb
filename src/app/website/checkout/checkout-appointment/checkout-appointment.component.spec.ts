import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutAppointmentComponent } from './checkout-appointment.component';

describe('CheckoutAppointmentComponent', () => {
  let component: CheckoutAppointmentComponent;
  let fixture: ComponentFixture<CheckoutAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
