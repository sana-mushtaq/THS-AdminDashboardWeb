import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessToBusinessAppointmentsComponent } from './business-to-business-appointments.component';

describe('BusinessToBusinessAppointmentsComponent', () => {
  let component: BusinessToBusinessAppointmentsComponent;
  let fixture: ComponentFixture<BusinessToBusinessAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessToBusinessAppointmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessToBusinessAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
