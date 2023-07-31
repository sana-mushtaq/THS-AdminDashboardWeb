import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRequestNonScheduleComponent } from './lab-request-non-schedule.component';

describe('LabRequestNonScheduleComponent', () => {
  let component: LabRequestNonScheduleComponent;
  let fixture: ComponentFixture<LabRequestNonScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabRequestNonScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabRequestNonScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
