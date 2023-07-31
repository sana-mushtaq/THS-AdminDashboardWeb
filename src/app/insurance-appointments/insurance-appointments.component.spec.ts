import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceAppointmentsComponent } from './insurance-appointments.component';

describe('InsuranceAppointmentsComponent', () => {
  let component: InsuranceAppointmentsComponent;
  let fixture: ComponentFixture<InsuranceAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceAppointmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
