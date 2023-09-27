import { TestBed } from '@angular/core/testing';

import { ServicetagService } from './servicetag.service';

describe('ServicetagService', () => {
  let service: ServicetagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicetagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
