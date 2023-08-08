import { TestBed } from '@angular/core/testing';

import { ServicecategoryService } from './servicecategory.service';

describe('ServicecategoryService', () => {
  let service: ServicecategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicecategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
