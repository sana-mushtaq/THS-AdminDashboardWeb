import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceNotScheduledComponent } from './insurance-not-scheduled.component';

describe('InsuranceNotScheduledComponent', () => {
  let component: InsuranceNotScheduledComponent;
  let fixture: ComponentFixture<InsuranceNotScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceNotScheduledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceNotScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
