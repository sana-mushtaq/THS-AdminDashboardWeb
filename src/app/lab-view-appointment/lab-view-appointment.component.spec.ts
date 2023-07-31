import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabViewAppointmentComponent } from './lab-view-appointment.component';

describe('LabViewAppointmentComponent', () => {
  let component: LabViewAppointmentComponent;
  let fixture: ComponentFixture<LabViewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabViewAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabViewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
