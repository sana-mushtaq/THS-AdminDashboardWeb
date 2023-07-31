import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabAppointmentComponent } from './add-lab-appointment.component';

describe('AddLabAppointmentComponent', () => {
  let component: AddLabAppointmentComponent;
  let fixture: ComponentFixture<AddLabAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLabAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
