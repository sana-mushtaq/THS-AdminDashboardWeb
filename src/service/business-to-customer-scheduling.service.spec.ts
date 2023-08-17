import { TestBed } from '@angular/core/testing';

import { BusinessToCustomerSchedulingService } from './business-to-customer-scheduling.service';

describe('BusinessToCustomerSchedulingService', () => {
  let service: BusinessToCustomerSchedulingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessToCustomerSchedulingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
