import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessToBusinessSchedulingComponent } from './business-to-business-scheduling.component';

describe('BusinessToBusinessSchedulingComponent', () => {
  let component: BusinessToBusinessSchedulingComponent;
  let fixture: ComponentFixture<BusinessToBusinessSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessToBusinessSchedulingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessToBusinessSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
