import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessToCustomerSchedulingComponent } from './business-to-customer-scheduling.component';

describe('BusinessToCustomerSchedulingComponent', () => {
  let component: BusinessToCustomerSchedulingComponent;
  let fixture: ComponentFixture<BusinessToCustomerSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessToCustomerSchedulingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessToCustomerSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
