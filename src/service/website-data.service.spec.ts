import { TestBed } from '@angular/core/testing';

import { WebsiteDataService } from './website-data.service';

describe('WebsiteDataService', () => {
  let service: WebsiteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
