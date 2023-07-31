import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNonScheduleComponent } from './request-non-schedule.component';

describe('RequestNonScheduleComponent', () => {
  let component: RequestNonScheduleComponent;
  let fixture: ComponentFixture<RequestNonScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestNonScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNonScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
