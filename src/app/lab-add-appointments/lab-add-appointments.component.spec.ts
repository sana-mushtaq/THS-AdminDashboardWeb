import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAddAppointmentsComponent } from './lab-add-appointments.component';

describe('LabAddAppointmentsComponent', () => {
  let component: LabAddAppointmentsComponent;
  let fixture: ComponentFixture<LabAddAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabAddAppointmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAddAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
