import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentSwapComponent } from './lab-appointment-swap.component';

describe('LabAppointmentSwapComponent', () => {
  let component: LabAppointmentSwapComponent;
  let fixture: ComponentFixture<LabAppointmentSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabAppointmentSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
